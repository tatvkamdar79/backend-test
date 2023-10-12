const { google } = require("googleapis");
const Papa = require("papaparse");
const fs = require("fs");
const drive_credentials = require("./secrets/drive_credentials.json");
const path = require("path");
const GOOGLE_DOWNLOADED_FILES = "GOOGLE_DOWNLOADED_FILES";

async function downloadSheet(spreadsheetId, fileName) {
  const jwtClient = new google.auth.JWT(
    drive_credentials.client_email,
    null,
    drive_credentials.private_key,
    ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  );

  try {
    await jwtClient.authorize();
    const sheets = google.sheets({ version: "v4", auth: jwtClient });
    const range = "Sheet1";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const sheetRows = response.data.values;
    if (sheetRows.length) {
      const csvData = Papa.unparse(sheetRows);
      const filePath = path.join(GOOGLE_DOWNLOADED_FILES, `${fileName}.csv`);
      fs.writeFileSync(filePath, csvData);
      console.log(`CSV file saved to ${filePath}`);
    } else {
      console.log("No data found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// DEV TESTING (Kliq SHEET)
// downloadSheet("18Yd2ZlHHRp9pUgK7KGiwDmsBBzRiPrWYLlao974Zkjg", "Kliq");

module.exports = downloadSheet;
