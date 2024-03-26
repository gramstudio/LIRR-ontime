import fs from "node:fs";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { resolve, join, dirname } from "node:path";

import { csvFormat } from "d3-dsv";
import { JWT } from "google-auth-library";
import { sheets } from "@googleapis/sheets";

import type Train from "./lirr.ts";

const googleAuth = () => {
  const email = ""; // service-account-000@docs-feedbacks.iam.gserviceaccount.com'
  const googleAuth = new JWT({
    email: email,
    key: env.G_SHEET_TOKEN?.replace(/\\n/g, "\n") ?? "",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return sheets({ version: "v4", auth: googleAuth });
};

const fetchSheet = async ({
  id,
  sheetId,
}: {
  id: string;
  sheetId?: number;
  output: string;
  extension: string;
}) => {
  // Write to Google Sheets
  const sheet = googleAuth();
  let sheetQ;
  try {
    const response = await sheet.spreadsheets.getByDataFilter({
      spreadsheetId: id,
      fields: "sheets(properties(title))",
      requestBody:
        sheetId === undefined
          ? undefined
          : { dataFilters: [{ gridRange: { sheetId: sheetId } }] },
    });
    sheetQ = response.data;
  } catch (e) {
    if (e instanceof Error) {
      console.error(`
        Error when fetching sheet with spreadsheetId ${id}${
        sheetId === undefined ? "" : ` and sheetId ${sheetId}`
      }. Check the file identifier or your file access permissions.
        ${e.stack}
      `);
    } else {
      console.error(e);
    }
    throw new Error("Failed to fetch the sheet");
  }

  if (sheetQ) {
    const ranges = sheetQ.sheets?.map(
      (sheet) => `'${sheet.properties?.title ?? ""}'`
    );

    if (sheetId === undefined) {
      const nameQ = await sheet.spreadsheets.values.batchGet({
        spreadsheetId: id,
        ranges,
      });

      nameQ.data.valueRanges?.forEach(({ range, values }) => {
        // const [r] = range?.split("!") || "";
        // const title = r.replaceAll("'", "");
        // const filePath = join(output, `${title}${extension ?? ".csv"}`);
        // const file = parse({ data: { values } }, extension ?? ".csv");
        // write_file(filePath, file);
        // console.log(`Wrote output to ${filePath}`);
      });
    } else {
      // const nameQ = await sheet.spreadsheets.values.get({
      //   spreadsheetId: id,
      //   range: ranges[0],
      // });
      // const file = parse(nameQ, extname(output));
      // write_file(output, file);
      // console.log(`Wrote output to ${output}`);
    }
  }
};

const writeData = async (data: Train[]) => {
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
};

const scrapeData = async () => {
  // Grab the data from the API
  const response = await fetch(
    "https://backend-unified.mylirr.org/locations?geometry=NONE&railroad=LIRR",
    {
      headers: { "Accept-Version": "3.0" },
    }
  );

  // filter and transform the data
  const data = await response.json();
  await writeData(data);
  console.log(data);
};

scrapeData().catch(console.error);
