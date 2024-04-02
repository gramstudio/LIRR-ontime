import googleAuth from "./googleAuth";
import type { Row } from "./types";

/**
 * Creates a data object from a header row and a data row.
 * @param headerRow - The header row containing the column names.
 * @param row - The data row containing the values.
 * @returns The data object created from the header row and data row.
 */
const createDataObject = (headerRow: string[], row: string[]) => {
  return row.reduce((obj, value, index) => {
    obj[headerRow[index]] = value;
    return obj;
  }, {} as Row);
};

const getValues = async (id: string) => {
  try {
    const client = googleAuth();
    const response = await client.spreadsheets.values.get({
      spreadsheetId: id,
      range: "Sheet1",
    });
    return response.data.values || [];
  } catch (e) {
    console.error(`Error when fetching sheet with spreadsheetId ${id}`);
    throw new Error(`Failed to fetch the sheet\n\n${e}`);
  }
};

/**
 * Fetches data from a Google Sheets spreadsheet.
 * @param id - The ID of the spreadsheet.
 * @returns A promise that resolves to an array of data objects representing the rows in the sheet.
 * @throws If there is an error when fetching the sheet.
 */
const fetchSheet = async (id: string): Promise<Row[]> => {
  const [headerRow, ...dataRows] = await getValues(id);
  let dataObjects = dataRows.map((row) => createDataObject(headerRow, row));

  if (headerRow.length === 0) {
    throw new Error(`No headers found in sheet with spreadsheetId ${id}`);
  }

  // convert the array of arrays to an empty data object if no data rows are found
  if (dataObjects.length === 0) {
    const emptyDataObject = headerRow.reduce((obj, key) => {
      obj[key] = "";
      return obj;
    }, {});
    dataObjects.push(emptyDataObject);
  }

  console.info(`Fetched sheet with spreadsheetId ${id}`);
  return dataObjects as Row[];
};

export default fetchSheet;
