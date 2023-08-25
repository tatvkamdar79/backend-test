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

exports.updateCompanyName = async (req, res) => {
  const _id = req.body._id;
  const updatedCompanyName = req.body.companyName;
  if (!_id || !updatedCompanyName) {
    return sendError(res, "Invalid Request");
  }
  try {
    const company = await Company.findOne({ _id });
    if (!company) {
      sendError(res, `No Company Found!`);
    }
    company.companyName =
      updatedCompanyName.charAt(0).toUpperCase() + updatedCompanyName.slice(1);
    company.save();
    return sendSuccess(res, "Company Name Updated Successfully", company);
  } catch (err) {
    return sendError(res, "Database Error", err);
  }
};

exports.deleteCompany = async (req, res) => {
  const _id = req.body._id;
  if (!_id) {
    return sendError(res, "Invalid Request");
  }
  console.log(req.body);
  try {
    const company = await Company.findOne({ _id });
    if (!company) {
      sendError(res, `No Company Found!`);
    }
    await company.deleteOne();
    return sendSuccess(res, "Company Deleted Successfully", {});
  } catch (err) {
    return sendError(res, "Database Error", err);
  }
};
