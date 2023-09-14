const Product = require("../models/ProductModel");

const deepCompare = (obj1, obj2) => {
  // Check if both inputs are objects
  if (typeof obj1 === "object" && typeof obj2 === "object") {
    // Get the keys of the objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if the number of keys are the same
    if (keys1.length !== keys2.length) {
      return false;
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

  for (const row of jsonData) {
    const productId = row._id;

    try {
      const product = await Product.findById(productId);

      if (!product) {
        log.push(`Product with ID ${productId} not found.`);
        continue; // Skip this row
      }

      // Perform deep comparison
      if (!deepCompare(row, product.toObject())) {
        // If there is a difference, update the product
        console.log(product.toObject());
        console.count("Found Difference");
        product.set(row);
        await product.save();
      } else {
        console.count("Same");
      }
    } catch (error) {
      console.error(`Error processing product with ID ${productId}:`, error);
      log.push(`Error processing product with ID ${productId}`);
    }
  }

  return log;
};
