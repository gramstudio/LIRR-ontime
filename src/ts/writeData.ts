import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, join, dirname } from "node:path";
import { csvFormat } from "d3-dsv";
import googleAuth from "./googleAuth";
import type { Row } from "./types";

/**
 * Writes the updated data to JSON and CSV files, and prepares the data for Google Sheets.
 *
 * @param updatedData - The updated data to be written.
 * @param spreadsheetId - The ID of the Google Sheet to write the data to.
 */
const writeToFile = (updatedData: Row[]) => {
  // Get the current timestamp
  const timestamp = new Date().toISOString();

  // Name the files after the timestamp
  const filenameCsv = `${timestamp}.csv`;

  // Define the path
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const baseDir = resolve(__dirname, "..", "..");
  const csvPath = join(baseDir, "data", "csv", filenameCsv);

  // Write the local CSV files
  const csv = csvFormat(updatedData);
  console.info("Wrote CSV file:", filenameCsv);
  fs.writeFileSync(csvPath, csv);
};

/**
 * Writes the updated data to JSON and CSV files, and prepares the data for Google Sheets.
 * @param updatedData {Row[]} - The updated data to be written.
 * @param spreadsheetId {number} - The ID of the Google Sheet to write the data to.
 */
const writeData = async (updatedData: Row[], spreadsheetId: string) => {
  process.env.NODE_ENV !== "production" && writeToFile(updatedData);

  // Add column headers to gsheetData
  const gsheetData: string[][] = [];
  const headers = Object.keys(updatedData[0]);
  gsheetData.push(headers);

  // Add values to gsheetData
  updatedData.forEach((row) => {
    const values = Object.values(row).map(String);
    gsheetData.push(values);
  });

  const client = googleAuth();

  try {
    await client.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: gsheetData,
      },
    });
  } catch (e) {
    console.error(
      `Error when writing data to sheet with spreadsheetId ${spreadsheetId}`
    );
    throw new Error(`Failed to write the data\n\n${e}`);
  }
};

export default writeData;
