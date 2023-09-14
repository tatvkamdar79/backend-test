const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/getSampleCSV", adminController.getSampleCSV);
router.get(
  "/getFullProductsDatabaseCSV",
  adminController.getFullProductsDatabaseCSV
);
router.post(
  "/updateProductsDatabaseCSV",
  upload.single("csvFile"),
  adminController.updateProductsDatabaseCSV
);
module.exports = router;
