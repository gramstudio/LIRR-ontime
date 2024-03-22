const fs = require("fs");
const path = require("path");

async function scrapeData() {
  const fetch = (await import("node-fetch")).default;
  // Get the current timestamp
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 8);

  // Name the files after the timestamp
  const filenameJson = `${timestamp}.json`;
  const filenameCsv = `${timestamp}.csv`;

  // Define the paths
  const baseDir = path.resolve(__dirname, "..", "..");
  const jsonPath = path.join(baseDir, "data", "json", filenameJson);
  const csvPath = path.join(baseDir, "data", "csv", filenameCsv);

  // Grab the data from the API
  const response = await fetch(
    "https://backend-unified.mylirr.org/locations?geometry=NONE&railroad=LIRR",
    {
      headers: { "Accept-Version": "3.0" },
    }
  );

  // filter and transform the data
  const data = await response.json();

  // Save the data in the data/json folder
  fs.writeFileSync(jsonPath, JSON.stringify(data));

  // Save the data in the data/csv folder
  const { AsyncParser } = await import("@json2csv/node");
  const opts = {};
  const transformOpts = {};
  const asyncOpts = {};
  const parser = new AsyncParser(opts, asyncOpts, transformOpts);

  const csv = await parser.parse(data).promise();
  fs.writeFileSync(csvPath, csv);

  console.log(data);
}

scrapeData().catch(console.error);
