import { env } from "node:process";
import dotenv from "dotenv";
import { JWT } from "google-auth-library";
import { sheets } from "@googleapis/sheets";

dotenv.config();
/**
 * Creates and returns a Google Sheets API client authenticated with a service account.
 * @returns {sheets_v4.Sheets} The Google Sheets API client.
 */
const googleAuth = () => {
  const key = JSON.parse(env.G_SHEET_TOKEN || ""); // service-account-000@docs-feedbacks.iam.gserviceaccount.com'
  const jwtAuth = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return sheets({ version: "v4", auth: jwtAuth });
};

export default googleAuth;
