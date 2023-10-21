const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const { doesLocalGoogleSheetCopyExist } = require("./localCompare");
const downloadSheet = require("../downloadGoogleSheet");

const SKIPPABLE = ["markUp", "images"];
const VARIANT_FILEDS = ["size", "color", "style", "material"];
const NUMBER_FIELDS = ["mrp", "costPrice"];
const GOOGLE_DOWNLOADED_FILES = "GOOGLE_DOWNLOADED_FILES";

module.exports.rows2json = (sheetRows) => {
  const rowsJson = [];

  const sheetHeaders = sheetRows[0];

  for (let i = 1; i < sheetRows.length; i++) {
    const rowIndex = i + 1;
    const currentRow = { rowIndex };
    const variant = {};

    for (let j = 0; j < sheetHeaders.length; j++) {
      const header = sheetHeaders[j];
      if (SKIPPABLE.includes(header)) continue;
      if (VARIANT_FILEDS.includes(header)) {
        variant[header] = sheetRows[i][j];
      } else if (NUMBER_FIELDS.includes(header)) {
        currentRow[header] = parseFloat(sheetRows[i][j]);
      } else {
        currentRow[header] = sheetRows[i][j];
      }
    }
    if (Object.keys(variant).length > 0) currentRow["variant"] = variant;
    rowsJson.push(currentRow);
  }

  return rowsJson;
};

module.exports.realLocalCsvFileData = async (spreadsheetId, fileName) => {
  const filePath = path.join(GOOGLE_DOWNLOADED_FILES, `${fileName}.csv`);

  if (!doesLocalGoogleSheetCopyExist(fileName)) {
    await downloadSheet(spreadsheetId, fileName);
  }

  const csvData = fs.readFileSync(filePath, "utf8");

  const parsedData = Papa.parse(csvData, {
    header: false, // Do not assume the first row is header
  });

  const dataArray = parsedData.data;

  return dataArray;
};

module.exports.findDifferences = (sheetRowsJson, localRowsJson) => {
  const sheetMap = new Map(sheetRowsJson.map((obj) => [obj._id, obj]));
  const localMap = new Map(localRowsJson.map((obj) => [obj._id, obj]));

  const addedRows = [];
  const modifiedRows = [];
  const removedRows = [];

  // Find modified and added rows
  sheetRowsJson.forEach((sheetObj) => {
    const localObj = localMap.get(sheetObj._id);

    if (localObj) {
      if (!isEqual(sheetObj, localObj)) {
        modifiedRows.push({ before: localObj, after: sheetObj });
      }
    } else {
      addedRows.push(sheetObj);
    }
  });

  // Find removed rows
  localRowsJson.forEach((localObj) => {
    if (!sheetMap.has(localObj._id)) {
      removedRows.push(localObj);
    }
  });

  // console.log(
  //   "addedRows",
  //   JSON.stringify(addedRows, null, 2),
  //   "\n\n",
  //   "modifiedRows",
  //   JSON.stringify(modifiedRows, null, 2),
  //   "\n\n",
  //   "removedRows",
  //   JSON.stringify(removedRows, null, 2)
  // );

  return { addedRows, modifiedRows, removedRows };
};

function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
