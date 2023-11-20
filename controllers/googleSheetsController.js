const GoogleSheet = require("../models/GoogleSheetModel");
const { sendSuccess, sendError } = require("../utils/response");

exports.getAllSheets = async (req, res) => {
  try {
    const sheets = await GoogleSheet.find({});
    return sendSuccess(res, "Loaded Sheets Successfully", sheets);
  } catch (error) {
    return sendError(res, "DB ERROR", error);
  }
};

exports.addNewSheet = async (req, res) => {
  const { sheetName, sheetId } = req.body;
  if (
    !sheetName ||
    !sheetId ||
    sheetName.length === 0 ||
    sheetId.length === 0
  ) {
    return sendError(res, "Sheet Name (or) Sheet URL cannot be empty");
  }

  try {
    const existing = await GoogleSheet.find({
      $or: [{ sheetName }, { sheetId }],
    });
    if (existing.length) {
      console.log(existing);
      return sendError(res, "Existing sheet");
    }

    const newGoogleSheet = new GoogleSheet({
      sheetName,
      sheetId,
    });
    await newGoogleSheet.save();
    return sendSuccess(res, "Sheet Added Successfully");
  } catch (error) {
    return sendError(res, "Some Error Occured", error);
  }
};

exports.deleteSheet = async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return sendError(res, "Invalid Request");
  }

  try {
    const sheet = await GoogleSheet.findById(_id);
    await sheet.deleteOne();
    return sendSuccess(res, "Deleted Successfully");
  } catch (error) {
    return sendError(res, "Some Error Occured", error);
  }
};
