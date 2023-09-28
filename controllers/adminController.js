const path = require("path");
const fs = require("fs");
const json2csv = require("json2csv").parse;
const csv = require("csv-parser");

const Product = require("../models/ProductModel");
const { processJsonData } = require("../helpers/adminCsvFileHelper");
const { default: mongoose } = require("mongoose");
const { sendSuccess, sendError } = require("../utils/response");

exports.getSampleCSV = async (req, res) => {
  console.log(__dirname);
  const entryPath = path.dirname(require.main.filename);
  const filePath = path.join(entryPath, "SFC1.csv");

  res.sendFile(filePath);
};

exports.getFullProductsDatabaseCSV = async (req, res) => {
  const allProducts = await Product.find();
  const flattenedProducts = allProducts.map((product) => {
    const finalProduct = {
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
      additionalIdentifier2: product.additionalIdentifier2,
    };
    const tagsLength = product.tags.length;
    // console.log(tagsLength);
    for (let i = 0; i < tagsLength; i++) {
      finalProduct[`tags[${i}]`] = product.tags[i];
    }
    return finalProduct;
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
    "additionalIdentifier2",
    "tags[0]",
    "tags[1]",
    "tags[2]",
    "tags[3]",
    "tags[4]",
  ];

  const csv = json2csv(flattenedProducts, { fields });

  const entryPath = path.dirname(require.main.filename);
  const filePath = path.join(entryPath, "products.csv");

  fs.writeFileSync(filePath, csv);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=full_database.csv`
  );
  res.setHeader("Content-Type", "text/csv");

  // Stream the file to the response
  fs.createReadStream(filePath).pipe(res);
};

exports.updateProductsDatabaseCSV = async (req, res) => {
  if (!req.body) {
    sendSuccess(res, "No file sent");
  }
  const jsonData = {};
  const _ids = [];
  const errorLogs = [];
  const rows = req.body;
  for (let [index, row] of rows.entries()) {
    const product = {
      _id: row._id ? new mongoose.Types.ObjectId(row._id) : undefined,
      company: row.company ? row.company.trim() : undefined,
      productCode: row.productCode ? row.productCode.trim() : undefined,
      productTitle: row.productTitle ? row.productTitle.trim() : undefined,
      productType: row.productType ? row.productType.trim() : undefined,
      modelNumber: row.modelNumber ? row.modelNumber.trim() : undefined,
      productCategory: row.productCategory
        ? row.productCategory.trim()
        : undefined,
      hsn: row.hsn ? row.hsn.trim() : undefined,
      cost: row.cost,
      mrp: row.mrp ? row.mrp : undefined,
      additionalIdentifier: row.additionalIdentifier
        ? row.additionalIdentifier.trim()
        : undefined,
      additionalIdentifier2: row.additionalIdentifier2
        ? row.additionalIdentifier2.trim()
        : undefined,
      variant: {},
    };

    const mandatoryFields = [
      "_id",
      "company",
      "productTitle",
      "modelNumber",
      "hsn",
      "mrp",
    ];

    let missingFields = [];
    for (const mandatoryField of mandatoryFields) {
      if (product[mandatoryField] === undefined) {
        missingFields.push(mandatoryField);
      }
    }
    if (missingFields.length > 0) {
      errorLogs.push(`${missingFields.join()} missing in row ${index + 1}`);
      continue;
    } else {
      errorLogs.push("Success for row " + (index + 1));
    }

    const tags = [];
    for (let i = 0; i < 5; i++) {
      if (row[`tags[${i}]`]) {
        tags.push(row[`tags[${i}]`].trim());
      }
    }
    // console.log(tags);
    product.tags = tags;

    const mrp = parseFloat(product.mrp);
    if (isNaN(mrp)) {
      errorLogs.push(`Invalid mrp in row ${index + 1}`);
    } else {
      product.mrp = mrp;
    }
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
    if (
      !row["variant.color"] &&
      !row["variant.size"] &&
      !row["variant.style"] &&
      !row["variant.material"]
    ) {
      delete product.variant;
    }
    _ids.push(product._id);
    // console.log(product, index);
    // jsonData[]
  }
  // console.log(_ids);

  const result = await Product.aggregate([
    {
      $match: {
        _id: {
          $in: _ids,
        },
      },
    },
    {
      $group: {
        _id: { $toString: "$_id" },
        document: { $first: "$$ROOT" },
      },
    },
  ]);

  // console.log("result", result);
  const dictionary = {};

  result.forEach((group) => {
    dictionary[group._id] = group.document;
  });
  console.log(dictionary);
  res.json({ errorLogs });

  // const filePath = req.file.path;

  // const jsonData = [];

  // fs.createReadStream(filePath)
  //   .pipe(csv())
  //   .on("data", (row) => {
  //     const product = {
  //       _id: new mongoose.Types.ObjectId(row._id),
  //       variant: {},
  //       company: row.company.trim(),
  //       productCode: row.productCode.trim(),
  //       productTitle: row.productTitle.trim(),
  //       productType: row.productType.trim(),
  //       modelNumber: row.modelNumber.trim(),
  //       productCategory: row.productCategory.trim(),
  //       hsn: row.hsn.trim(),
  //       cost: row.cost,
  //       mrp: row.mrp,
  //       additionalIdentifier: row.additionalIdentifier.trim(),
  //       additionalIdentifier2: row.additionalIdentifier2.trim(),
  //     };

  //     const tags = [];
  //     for (let i = 0; i < 5; i++) {
  //       if (row[`tags[${i}]`]) {
  //         tags.push(row[`tags[${i}]`].trim());
  //       }
  //     }
  //     // console.log(tags);
  //     product.tags = tags;

  //     if (!product._id || !product.company || !product.modelNumber) {
  //       return;
  //     }

  //     const mrp = parseFloat(product.mrp);
  //     if (isNaN(mrp)) {
  //       // LOG ERROR
  //       return;
  //     } else {
  //       product.mrp = mrp;
  //     }
  //     if (row["variant.color"] && String(row["variant.color"]).trim() != "") {
  //       product.variant["color"] = String(row["variant.color"]).trim();
  //     }
  //     if (row["variant.size"] && String(row["variant.size"]).trim() != "") {
  //       product.variant["size"] = String(row["variant.size"]).trim();
  //     }
  //     if (row["variant.style"] && String(row["variant.style"]).trim() != "") {
  //       product.variant["style"] = String(row["variant.style"]).trim();
  //     }
  //     if (
  //       row["variant.material"] &&
  //       String(row["variant.material"]).trim() != ""
  //     ) {
  //       product.variant["material"] = String(row["variant.material"]).trim();
  //     }
  //     if (
  //       !row["variant.color"] &&
  //       !row["variant.size"] &&
  //       !row["variant.style"] &&
  //       !row["variant.material"]
  //     ) {
  //       delete product.variant;
  //     }
  //     jsonData.push(product);
  //   })
  //   .on("end", async () => {
  //     console.log("CSV file successfully processed");
  //     // console.log(jsonData);
  //     console.log("Starting CSV file to Database updation");
  //     const logs = await processJsonData(jsonData);
  //     console.log(logs);

  //     // Send the JSON data as response
  //     res.json({ data: logs });

  //     fs.unlinkSync(filePath);
  //   });
};
