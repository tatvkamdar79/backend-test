const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const CompanySchema = new Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  companyId: {
    type: Number,
  },
});

CompanySchema.pre("save", async function (next) {
  const count = await mongoose.models.Company.countDocuments();
  this.companyId = count + 1;
  next();
});

const Company = model("Company", CompanySchema);

module.exports = Company;
