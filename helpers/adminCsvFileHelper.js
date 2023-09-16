const Product = require("../models/ProductModel");

const deepCompare = (obj1, obj2) => {
  // Check if both inputs are objects
  if (typeof obj1 === "object" && typeof obj2 === "object") {
    // Get the keys of the objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    for (let key of keys2) {
      if (key === "__v") continue;
      if (!keys1.includes(key)) {
        console.log("KEYS DIFF", key);
        return false;
      }
    }

    // Iterate through the keys
    for (let key of keys1) {
      // Recursively compare nested objects
      if (!deepCompare(obj1[key], obj2[key])) {
        console.log(key, "->", obj1[key]);
        console.log(key, "->", obj2[key]);
        return false;
      }
    }

    return true;
  } else {
    // Compare non-object values directly
    if (
      (obj1 === null && String(obj2).trim() === "") ||
      (obj1 === undefined && String(obj2).trim() === "") ||
      (String(obj1).trim() === "" && obj2 === null) ||
      (String(obj1).trim() === "" && obj2 === undefined) ||
      (obj1 === null && obj2 === null) ||
      (obj1 === undefined && obj2 === undefined)
    ) {
      return true;
    }
    return obj1 === obj2;
  }
};

exports.processJsonData = async (jsonData) => {
  const log = []; // To keep track of any skipped rows

  for (const [index, row] of jsonData.entries()) {
    const productId = row._id;

    try {
      const product = await Product.findById(productId);

      if (!product) {
        log.push(
          `Product in row ${index + 1} with model number ${
            product.modelNumber
          } not found.`
        );
        continue; // Skip this row
      }

      // Perform deep comparison
      if (!deepCompare(row, product.toObject())) {
        // If there is a difference, update the product
        // console.log(product.toObject());
        console.log(
          `Found Difference for row ${index + 1} - ${product.modelNumber}`
        );
        log.push(
          `Found Difference for row ${index + 1} - ${product.modelNumber}`
        );
        product.set(row);
        await product.save();
      }
    } catch (error) {
      console.error(
        `Error processing product in row ${index + 1} with modelNumber ${
          row.modelNumber
        }:`,
        error
      );
      log.push(
        `Error processing product with row ${index + 1} and modelNumber ${
          row.modelNumber
        }`
      );
    }
  }

  return log;
};
