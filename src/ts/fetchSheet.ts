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

/**
 * Fetches data from a Google Sheets spreadsheet.
 * @param id - The ID of the spreadsheet.
 * @param sheetId - The ID of the sheet within the spreadsheet (optional).
 * @returns A promise that resolves to an array of data objects representing the rows in the sheet.
 * @throws If there is an error when fetching the sheet.
 */
const fetchSheet = async ({
  id,
  sheetId,
}: {
  id: string;
  sheetId?: number;
}): Promise<Row[]> => {
  const client = googleAuth();
  let sheetQ;
  try {
    const response = await client.spreadsheets.getByDataFilter({
      spreadsheetId: id,
      fields: "sheets(properties(title))",
      requestBody:
        sheetId === undefined
          ? undefined
          : { dataFilters: [{ gridRange: { sheetId: sheetId } }] },
    });
    sheetQ = response.data;
  } catch (e) {
    console.error(`Error when fetching sheet with spreadsheetId ${id}`);
    throw new Error(`Failed to fetch the sheet\n\n${e}`);
  }

  if (sheetQ && sheetQ.sheets) {
    const ranges = sheetQ.sheets.map(
      (sheet) => `'${sheet.properties?.title ?? ""}'`
    );

    const nameQ = await client.spreadsheets.values.get({
      spreadsheetId: id,
      range: ranges?.[0],
    });

    const [headerRow, ...dataRows] = nameQ.data.values ?? [];
    let dataObjects = dataRows.map((row) => createDataObject(headerRow, row));

    if (dataObjects.length === 0) {
      const emptyDataObject = headerRow.reduce((obj, key) => {
        obj[key] = "";
        return obj;
      }, {});
      dataObjects.push(emptyDataObject);
    }

    return dataObjects as Row[];
  } else {
    return [
      {
        train_id: "",
        train_num: "",
        direction: "",
        departure_station: "",
        final_station: "",
        departure_sched: "",
        departure_time: "",
        departure_2min_delay: false,
        final_sched: "",
        final_time: "",
        final_3min_delay: false,
      },
    ];
  }
};

export default fetchSheet;
