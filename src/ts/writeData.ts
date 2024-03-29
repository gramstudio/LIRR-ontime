import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, join, dirname } from "node:path";
import { csvFormat } from "d3-dsv";
import googleAuth from "./googleAuth";
import type { Row } from "./types";

/**
 * Writes the updated data to JSON and CSV files, and prepares the data for Google Sheets.
 * @param updatedData {Row[]} - The updated data to be written.
 */
const writeData = async (updatedData: Row[]) => {
  // Get the current timestamp
  const timestamp = new Date().toISOString();

  // Name the files after the timestamp
  const filenameJson = `${timestamp}.json`;
  const filenameCsv = `${timestamp}.csv`;

  // Define the paths
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const baseDir = resolve(__dirname, "..", "..");
  const jsonPath = join(baseDir, "data", "json", filenameJson);
  const csvPath = join(baseDir, "data", "csv", filenameCsv);

  // Write the JSON & CSV files
  fs.writeFileSync(jsonPath, JSON.stringify(updatedData));
  console.log("Wrote JSON file:", filenameJson);
  const csv = csvFormat(updatedData);
  console.log("Wrote CSV file:", filenameCsv);
  fs.writeFileSync(csvPath, csv);

  const gsheetData: string[][] = [];

  // Add column headers to gsheetData
  const headers = Object.keys(updatedData[0]);
  gsheetData.push(headers);

  // Add values to gsheetData
  updatedData.forEach((row) => {
    const values = Object.values(row).map(String);
    gsheetData.push(values);
  });

  // console.log(gsheetData);
};

export default writeData;
