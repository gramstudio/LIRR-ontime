const fs = require("fs");
const path = require("path");

async function scrapeData() {
  const fetch = (await import("node-fetch")).default;
  // Get the current timestamp
  const timestamp = Date.now();

  // Name the files after the timestamp
  const filenameJson = `${timestamp}.json`;
  const filenameCsv = `${timestamp}.csv`;

  // Define the paths
  //   const jsonPath = path.join(
  //     __dirname,
  //     "..",
  //     "data_hold",
  //     "json",
  //     filenameJson
  //   );
  //   const csvPath = path.join(__dirname, "..", "data_hold", "csv", filenameCsv);

  // Grab the data from the API
  const response = await fetch(
    "https://backend-unified.mylirr.org/locations?geometry=NONE&railroad=BOTH",
    {
      headers: { "Accept-Version": "3.0" },
    }
  );

  const data = await response.json();

  // Save the data in the data hold folder
  // fs.writeFileSync(jsonPath, JSON.stringify(data));

  // Convert the file into a csv
  // You'll need a library or custom function to convert JSON to CSV
  // For example, using the 'json2csv' library:
  // const { parse } = require('json2csv');
  // const csv = parse(data);
  // fs.writeFileSync(csvPath, csv);

  console.log(data);
}

scrapeData().catch(console.error);
