const path = require("path");
const fs = require("fs");
const json2csv = require("json2csv").parse;
const csv = require("csv-parser");

const Product = require("../models/ProductModel");
const { processJsonData } = require("../helpers/adminCsvFileHelper");

exports.getSampleCSV = async (req, res) => {
  console.log(__dirname);
  const entryPath = path.dirname(require.main.filename);
  const filePath = path.join(entryPath, "SFC1.csv");

  res.sendFile(filePath);
};

exports.getFullProductsDatabaseCSV = async (req, res) => {
  const allProducts = await Product.find();
  const flattenedProducts = allProducts.map((product) => {
    return {
      _id: product._id,
      company: product.company,
      productCode: product.productCode,
      productTitle: product.productTitle,
      productType: product.productType,
      modelNumber: product.modelNumber,
      productCategory: product.productCategory,
      "variant.color": product.variant.color,
      "variant.size": product.variant.size,
      "variant.style": product.variant.style,
      "variant.material": product.variant.material,
      hsn: product.hsn,
      cost: product.cost,
      mrp: product.mrp,
      additionalIdentifier: product.additionalIdentifier,
    };
  });
  const fields = [
    "_id",
    "company",
    "productCode",
    "productTitle",
    "productType",
    "modelNumber",
    "productCategory",
    "variant.color",
    "variant.size",
    "variant.style",
    "variant.material",
    "hsn",
    "cost",
    "mrp",
    "additionalIdentifier",
  ];

  const csv = json2csv(flattenedProducts, { fields });

  const entryPath = path.dirname(require.main.filename);
  const filePath = path.join(entryPath, "products.csv");

  fs.writeFileSync(filePath, csv);

  res.sendFile(filePath, async () => {
    await setTimeout(() => {}, 5000);
    fs.unlinkSync(filePath);
  });
};

exports.updateProductsDatabaseCSV = async (req, res) => {
  if (!req.file) {
    return res.json({});
  }

  const filePath = req.file.path;

  const jsonData = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const product = {
        _id: row._id,
        variant: {},
        company: row.company,
        productCode: row.productCode,
        productTitle: row.productTitle,
        productType: row.productType,
        modelNumber: row.modelNumber,
        productCategory: row.productCategory,
        hsn: row.hsn,
        cost: row.cost,
        mrp: row.mrp,
        additionalIdentifier: row.additionalIdentifier,
      };
      if (row["variant.color"] && String(row["variant.color"]).trim() != "") {
        product.variant["color"] = String(row["variant.color"]).trim();
      }
      if (row["variant.size"] && String(row["variant.size"]).trim() != "") {
        product.variant["size"] = String(row["variant.size"]).trim();
      }
      if (row["variant.style"] && String(row["variant.style"]).trim() != "") {
        product.variant["style"] = String(row["variant.style"]).trim();
      }
      if (
        row["variant.material"] &&
        String(row["variant.material"]).trim() != ""
      ) {
        product.variant["material"] = String(row["variant.material"]).trim();
      }
      jsonData.push(product);
    })
    .on("end", async () => {
      console.log("CSV file successfully processed");
      const logs = await processJsonData(jsonData);

      // Delete the CSV file
      fs.unlinkSync(filePath);

      // Send the JSON data as response
      res.json({ data: logs });
    });
};
