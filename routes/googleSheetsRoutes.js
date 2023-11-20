const express = require("express");
const { syncGS } = require("../googleSheetsModule/googleSheetsSync");
const router = express.Router();
const googleSheetsController = require("../controllers/googleSheetsController");

router.post("/syncGoogleSheet", syncGS);
router.post("/addNewSheet", googleSheetsController.addNewSheet);
router.get("/getAllSheets", googleSheetsController.getAllSheets);
router.post("/deleteSheet", googleSheetsController.deleteSheet);

module.exports = router;
