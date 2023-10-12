const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
// Define the schema for the Example model
const ProductSchema = new Schema({
  company: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    trim: true,
  },
  group: {
    type: String,
    required: true,
  },
  modelNumber: {
    type: String,
    required: true,
  },
  variant: {
    size: { type: String },
    color: { type: String },
    material: { type: String },
    style: { type: String },
  },
  mrp: {
    type: Number,
    required: true,
  },
  costPrice: {
    type: Number,
  },
  hsn: {
    type: String,
  },
  additionalIdentifier: {
    type: String,
    default: null,
  },
  additionalIdentifier2: {
    type: String,
    default: null,
  },
  billingDescription: {
    type: String,
    required: true,
  },
  UOM: {
    type: String,
    default: null,
  },
});

// Create the Example model using the schema
const Product = model("Product", ProductSchema);

// Export the Example model
module.exports = Product;
