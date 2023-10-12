const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "secrets/credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const getFileName = (metaData) => {
  return metaData.data.properties.title;
};
const getAllSheetProperties = (metaData) => {
  return metaData.data.sheets;
};
const getAllSheetNames = (metaData) => {
  return metaData.data.sheets.map((sheetObj) => sheetObj.properties.title);
};
const getFileUrl = (metaData) => {
  return metaData.data.spreadsheetUrl;
};
const getRowsOfSheet = async (googleSheets, spreadsheetId, range) => {
  return await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
    range: "Sheet1",
  });
};

const main = async (spreadsheetId) => {
  const client = await auth.getClient();
  // console.log("client", client);
  const googleSheets = await google.sheets({ version: "v4", auth: client });
  //   console.log("googleSheets", googleSheets.spreadsheets);
  const metaData = await googleSheets.spreadsheets.get({
    auth: auth,
    spreadsheetId: spreadsheetId,
  });

  const fileName = getFileName(metaData);
  const allSheetProps = getAllSheetProperties(metaData);
  const allSheetNames = getAllSheetNames(metaData);
  const fileUrl = getFileUrl(metaData);
  //   console.log("File Name       :", fileName);
  //   console.log("All Sheet Props :", allSheetProps);
  //   console.log("All Sheet Names :", allSheetNames);
  //   console.log("File URL        :", fileUrl);

  const rowsData = await getRowsOfSheet(googleSheets, spreadsheetId, "Sheet1");
  const range = rowsData.data.range;
  const rows = rowsData.data.values;
  return {
    googleSheets,
    auth,
    fileName,
    allSheetProps,
    allSheetNames,
    fileUrl,
    range,
    rows,
  };
};

module.exports = main;
