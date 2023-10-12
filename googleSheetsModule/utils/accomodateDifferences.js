const Product = require("../../models/ProductModel");
const db = require("../../config/db");

async function addRowToMongo(googleSheets, auth, spreadsheetId, row) {
  try {
    const { rowIndex, _id, ...productData } = row;

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    console.log("Product saved successfully:", savedProduct);

    try {
      addIdToSheets(googleSheets, auth, spreadsheetId, rowIndex, newProduct);
    } catch (error) {
      console.log("Failed while updating _id to sheets");
      console.log("Deleting Product from Mongo");
      const response = await savedProduct.deleteOne();
    }
  } catch (error) {
    console.error("Error while adding row to MongoDB:", error);
    throw error;
  }
}

async function addIdToSheets(
  googleSheets,
  auth,
  spreadsheetId,
  rowIndex,
  product
) {
  await new Promise((resolve) => {
    googleSheets.spreadsheets.values.update(
      {
        auth,
        spreadsheetId,
        range: `Sheet1!A${rowIndex}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[product._id]],
        },
      },
      (err, res) => {
        if (err) console.log("ERROR", err);
        console.log(`Updated Index for _id for A${rowIndex} - ${product._id}`);
        setTimeout(resolve, 300); // Resolve the promise after 300 ms
      }
    );
  });
}

async function updateRowToMongo(row) {
  console.log("UPDATING");
  try {
    const { before, after } = row;

    console.log(before, after);

    if (String(before._id) !== String(after._id)) {
      throw new Error("Invalid _id");
    }

    const { rowIndex, _id, ...updatedProductData } = after;

    const updatedProduct = await Product.findByIdAndUpdate(
      after._id,
      updatedProductData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run validators (e.g., required fields)
      }
    );
    try {
    } catch (error) {
      console.log(`Error in updating product at row ${rowIndex}`);
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { addRowToMongo, addIdToSheets, updateRowToMongo };
