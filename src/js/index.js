import fs from "fs";
import { fileURLToPath } from "url";
import { resolve, join, dirname } from "path";

import fetch from "node-fetch";
import { csvFormat } from "d3-dsv";

function writeData(data) {
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
  fs.writeFileSync(jsonPath, JSON.stringify(data));
  const csv = csvFormat(data);
  fs.writeFileSync(csvPath, csv);
}

async function scrapeData() {
  // Grab the data from the API
  const response = await fetch(
    "https://backend-unified.mylirr.org/locations?geometry=NONE&railroad=LIRR",
    {
      headers: { "Accept-Version": "3.0" },
    }
  );

  // filter and transform the data
  const data = await response.json();
  writeData(data);
  console.log(data);
}

scrapeData().catch(console.error);
