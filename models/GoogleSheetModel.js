const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const GoogleSheetSchema = new Schema({
  sheetName: {
    type: String,
    required: true,
    trim: true,
  },
  sheetId: {
    type: String,
    required: true,
    trim: true,
  },
});

const GoogleSheet = model("GoogleSheet", GoogleSheetSchema);

module.exports = GoogleSheet;
