import { env } from "node:process";
import dotenv from "dotenv";
import writeData from "./writeData";
import fetchSheet from "./fetchSheet";
import prepData from "./prepData";

dotenv.config();

const fetchLirrData = async () => {
  const response = await fetch(
    "https://backend-unified.mylirr.org/locations?geometry=NONE&railroad=LIRR",
    {
      headers: { "Accept-Version": "3.0" },
    }
  );
  return await response.json();
};

const updateSheet = async (spreadsheetId: string) => {
  const [sheetData, lirrData] = await Promise.all([
    fetchSheet(spreadsheetId),
    fetchLirrData(),
  ]);

  const updatedData = prepData({ sheetData, lirrData });

  await writeData(updatedData, spreadsheetId);
  console.info("Spreadsheet updated successfully");
};

const main = async () => {
  try {
    await updateSheet(env.G_SHEET_ID as string);
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to update spreadsheet\n\n${e}`);
  }
};

main().catch(console.error);
