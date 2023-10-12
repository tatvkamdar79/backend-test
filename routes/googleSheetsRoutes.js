const express = require("express");
const { syncGS } = require("../googleSheetsModule/googleSheetsSync");
const router = express.Router();

router.post("/syncGoogleSheet", syncGS);

module.exports = router;
