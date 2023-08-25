const Company = require("../models/CompanyModel");
const Product = require("../models/ProductModel");
const { sendSuccess, sendError } = require("../utils/response");

exports.getAllCompanies = async (req, res) => {
  let companyList = null;
  try {
    companyList = await Company.find();
    console.log("Fetched All Companies");
    return sendSuccess(res, "Fetched Companies Successfully", companyList);
  } catch (err) {
    return sendSuccess(res, "Some error occured", err);
  }
};

exports.addCompany = async (req, res) => {
  console.log("Adding Company");
  const { companyName } = req.body;
  console.log(req.body);
  if (!companyName) return sendError(res, "Invalid Submission");

  const isExistingCompany = await Company.findOne({ companyName });
  if (isExistingCompany) {
    return sendError(res, "Company Name Already Exists");
  }
  try {
    const newCompany = new Company({ companyName: companyName });
    const response = await newCompany.save();
    return sendSuccess(res, "Company Created Successfully", response);
  } catch (error) {
    return sendError(res, error.message, error);
  }
};
