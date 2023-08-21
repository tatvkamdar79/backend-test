const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

// Define the schema for the Example model
const ProductSchema = new Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  productCode: {
    type: String,
    required: true,
    trim: true,
  },
  productTitle: {
    type: String,
    required: true,
    trim: true,
  },
  productType: {
    type: String,
    required: true,
    trim: true,
  },
  modelNumber: {
    type: String,
    required: true,
    trim: true,
  },
  productCategory: {
    type: String,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  variant: {
    // size: { type: String, trim: true },
    color: { type: String, trim: true },
    material: { type: String, trim: true },
    style: { type: String, trim: true },
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
    trim: true,
    default: null,
  },
  additionalIdentifier2: {
    type: String,
    trim: true,
    default: null,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the Example model using the schema
const Product = model("Product", ProductSchema);

// Export the Example model
module.exports = Product;
