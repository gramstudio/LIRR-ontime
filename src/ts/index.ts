import { env } from "node:process";
import dotenv from "dotenv";
import writeData from "./writeData";
import fetchSheet from "./fetchSheet";
import prepData from "./prepData";

dotenv.config();
const main = async () => {
  // Grab the data from the API
  const response = fetch(
    "https://backend-unified.mylirr.org/locations?geometry=NONE&railroad=LIRR",
    {
      headers: { "Accept-Version": "3.0" },
    }
  );

  // fetch the data from the Google Sheet and the LIRR API
  try {
    const [sheetData, lirrResp] = await Promise.all([
      fetchSheet({ id: env.G_SHEET_ID || "", sheetId: 0 }),
      response,
    ]);
    const updatedData = prepData({
      sheetData,
      lirrData: await lirrResp.json(),
    });
    await writeData(updatedData);
  } catch (e) {
    console.error(e);
    throw new Error();
  }
};

main().catch(console.error);
