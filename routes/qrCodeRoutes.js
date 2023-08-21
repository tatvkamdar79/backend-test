const express = require("express");
const router = express.Router();
const qrCodeController = require("../controllers/qrCodeController");

router.post("/scan", qrCodeController.scan);

module.exports = router;
