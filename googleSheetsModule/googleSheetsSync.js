var lock = false;
const fs = require("fs");
const main = require("./googleSheets");
const downloadGoogleSheet = require("./downloadGoogleSheet");
const { validateSheetRowData } = require("./utils/sheetValidation");
const {
  rows2json,
  realLocalCsvFileData,
  findDifferences,
} = require("./utils/rows2json");
const { doesLocalGoogleSheetCopyExist } = require("./utils/localCompare");
const {
  addRowToMongo,
  updateRowToMongo,
} = require("./utils/accomodateDifferences");
const Product = require("../models/ProductModel");
const { sendError, sendSuccess } = require("../utils/response");
const path = require("path");
// const Product = require("./models/ProductModel");
// const db = require("./config/db");

const googleSheetsSync = async (spreadsheetId) => {
  const companySheetData = await main(spreadsheetId);
  console.log("GOT SHEET DATA");
  const { auth, googleSheets, fileName, rows } = companySheetData;

  let firstDownload = false;
  if (!doesLocalGoogleSheetCopyExist(fileName)) {
    firstDownload = true;
  }

  // Validating Sheet Rows
  const errors = validateSheetRowData(rows);

  if (errors.length > 0) return errors;

  // Converting Rows From CSV(Array of Arrays) to JSON
  const sheetRowsJson = rows2json(rows);

  const localDataArray = await realLocalCsvFileData(spreadsheetId, fileName);
  const localRowsJson = rows2json(localDataArray);

  if (firstDownload) {
    for (const row of localRowsJson) {
      if (!row._id || row._id == "") {
        console.count("ADDING PRODUCT");
        await addRowToMongo(googleSheets, auth, spreadsheetId, row);
        await new Promise((resolve) => setTimeout(resolve, 750)); // Wait for 1000ms
        continue;
      } else {
        const product = await Product.findById(row._id);
        // console.log(row, product);
        if (!product) {
          console.log(`PRODUCT NOT FOUND. _id MODIFIED FOR ${row.rowIndex}`);
          continue;
        } else {
          await updateRowToMongo({
            before: product,
            after: row,
          });
        }
      }
    }
    console.log("PROCESS FININSHED");
    return;
  }

  const { addedRows, modifiedRows, removedRows } = findDifferences(
    sheetRowsJson,
    localRowsJson
  );

  // CHECK REMOVED ROWS
  if (removedRows.length > 0) {
    console.log("FOUND REMOVED ROWS");
    console.log("FOUND INCONSISTENT DATA. ROW(s) DELETED");
  }

  let updated = false;

  // CHECK ADDED ROWS
  if (addedRows.length > 0) {
    updated = true;
    console.log("FOUND ADDED ROWS");
    for (const addedRow of addedRows) {
      await addRowToMongo(googleSheets, auth, spreadsheetId, addedRow);
      console.count("ADDED");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1000ms
    }
  }

  // CHECK MODIFIED ROWS
  if (modifiedRows.length > 0) {
    console.log("FOUND MODIFIED ROWS");
    updated = true;
    for (const modifiedRow of modifiedRows) {
      await updateRowToMongo(modifiedRow);
    }
    console.log("FOUND MODIFIED ROWS");
    console.log(modifiedRows);
  }

  // CHECK IF ANY CHANGE
  if (!updated) {
    console.log("NO CHANGE");
  } else await downloadGoogleSheet(spreadsheetId, fileName);

  console.log("PROCESS FININSHED");
  return;
};

exports.syncGS = async (req, res) => {
  if (lock === true) {
    console.log("Blocked Request");
    sendSuccess(res, "Let Earlier Request Complete");
    return;
  } else {
    lock = true;
    try {
      console.log(req.body);
      if (!req.body || !req.body?.spreadsheetIds) {
        sendError(res, "No spreadsheet Id's found");
      } else {
        const spreadSheetIds = req.body.spreadsheetIds;
        for (const spreadsheetId of spreadSheetIds) {
          await googleSheetsSync(spreadsheetId);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 5000ms
        sendSuccess(res, "released");
      }
    } catch (error) {
      sendError(res, error.message, error);
    } finally {
      lock = false;
    }
  }

  // sendSuccess(res, "Task Scheduled Successfully");
};

// let spreadsheetId = "18Yd2ZlHHRp9pUgK7KGiwDmsBBzRiPrWYLlao974Zkjg";
// getCompanyData(spreadsheetId);
