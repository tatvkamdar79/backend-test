const fs = require("fs");
const Product = require("../models/ProductModel");
const { sendSuccess, sendError } = require("../utils/response");

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProductBySearch = async (req, res) => {
  console.log(req.query);
  if (Object.keys(req.query).length === 0) {
    return res.json([]);
  }
  const searchString = req.query.searchQuery;
  let searchResult;
  let startTime = process.hrtime();
  if (searchString.includes("|")) {
    const separatedSearchString = searchString.split("|");
    if (separatedSearchString.length === 3) {
      const company = searchString.split("|")[0];
      const modelNumber = searchString.split("|")[1];
      const group = searchString.split("|")[2];
      searchResult = await Product.find({
        company: company,
        modelNumber: modelNumber,
        group: group,
      });
    }
  } else {
    searchResult = await Product.find({
      $or: [
        // { tags: { $regex: searchString, $options: "i" } },
        { company: { $regex: searchString, $options: "i" } },
        { modelNumber: { $regex: searchString, $options: "i" } },
        { group: { $regex: searchString, $options: "i" } },
        { category: { $regex: searchString, $options: "i" } },
      ],
    });
  }

  let endTime = process.hrtime(startTime);
  function parseHrtimeToSeconds(hrtime) {
    var seconds = (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
    return seconds;
  }
  console.log(parseHrtimeToSeconds(endTime));
  return sendSuccess(res, "Fetched Documents", {
    searchResult,
    time: parseHrtimeToSeconds(endTime),
  });
};

exports.addProduct = async (req, res) => {
  if (!req.body) {
    return sendError(res, "Request Body Empty");
  }
  for (let item of req.body) {
    console.log(item);
    let product = new Product(item);
    console.log(product);
    try {
      let saved = await product.save();
      console.log("saved", saved);
    } catch (error) {
      console.log(error);
      return sendError(res, "Failed to Save Product");
    }
  }
  sendSuccess(res, "Products Added Successfully");
};

exports.addImageToProduct = async (req, res) => {
  const { imageData, product_id } = req.body;
  console.log(product_id);

  const jsonString = JSON.stringify(req.body);
  const sizeInBytes = Buffer.from(jsonString).length;
  const sizeInMegabytes = sizeInBytes / (1024 * 1024);
  console.log(sizeInMegabytes);

  // Path to the images folder

  try {
    const product = await Product.findById(product_id);
    const filename = `image_${product.company}_${product.modelNumber}_${
      product.group
    }_${Date.now()}.png`;
    const imagePath = `./images/${filename}`;
    try {
      fs.writeFile(imagePath, imageData, { encoding: "base64" }, (err) => {
        if (err) {
          console.error("Error saving image:", err);
          res.status(500).json({ error: "Error saving image" });
        } else {
          console.log("Image saved successfully");
          res.json({ success: true });
        }
      });
      if (product.images) {
        const images = [...product.images];
        images.push(filename);
        product.images = images;
        await product.save();
      }
    } catch (error) {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      return sendError(res, "Failed to save image", error);
    }
  } catch (error) {
    return sendError(res, "Database Error", error);
  }
};

exports.deleteImageFromProduct = async (req, res) => {
  const { product_id, imagePath } = req.body;
  console.log(product_id, imagePath);
  const filePath = `./images/${imagePath}`;
  try {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        return sendError(res, "Failed to delete", error);
      }
      const product = await Product.findById(product_id);
      const images = [...product.images];
      images.splice(images.indexOf(imagePath), 1);
      product.images = images;
      await product.save();
      return sendSuccess(res, "Product Deleted Successfully");
    } else {
      return sendSuccess(res, "Product Does Not Exist");
    }
  } catch (error) {
    return sendError(res, "Database Error", error);
  }
};
