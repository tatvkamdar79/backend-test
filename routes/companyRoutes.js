const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

router.get("/getAllCompanies", companyController.getAllCompanies);
router.post("/addCompany", companyController.addCompany);
router.post("/updateCompanyName", companyController.updateCompanyName);
router.post("/deleteCompany", companyController.deleteCompany);

module.exports = router;
