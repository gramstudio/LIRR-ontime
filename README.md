# 🚉 LIRR OnTime

## Description

This project is a scraper and analyzer for the on-time performance of the Long Island Rail Road (LIRR) trains. It fetches data from the LIRR's backend, processes it, and writes it to JSON and CSV files. It also prepares the data for Google Sheets.

## Features

- Collects data on train schedules and delays from the LIRR's backend
- Processes the data to calculate on-time performance metrics
- Writes the processed data to JSON and CSV files
- Prepares the data for Google Sheets

## Installation

1. Clone the repository: `git clone https://github.com/gramstudio/lirr-ontime.git`
2. Install the required dependencies: `npm install`

## Setup

1. To write to Google Sheets, you will need a service account key with editor permissions. Otherwise, pipe the output to your preferred data storage.
2. Copy the [.env.sample](/.env.sample) file to a new file named `.env`: `cp .env.sample .env`
3. Open the `.env` file and fill in the values for `G_SERVICE_TOKEN` and `G_SHEET_ID`.

## Usage

1. Run the script with `npm start`. This will fetch the data, process it, and write it to JSON and CSV files in the `data` directory. It will also prepare the data for Google Sheets.
2. Check the console for any logs or errors.

## Development

The project is written in TypeScript and uses the Google Sheets API to write data to Google Sheets. It also uses the [d3-dsv](https://github.com/d3/d3-dsv) library to format the data as CSV, and [dayjs](https://github.com/iamkun/dayjs) for date and time manipulation.

The main script is [src/ts/index.ts](src/ts/index.ts), which fetches the data, processes it, and writes it. The data processing is done in [src/ts/prepData.ts](src/ts/prepData.ts), and the writing is done in [src/ts/writeData.ts)](src/ts/writeData.ts).

You can debug the script using the configuration provided in [.vscode/launch.json](/.vscode/launch.json).
