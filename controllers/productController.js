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
    if (separatedSearchString.length === 2) {
      const company = searchString.split("|")[0];
      const modelNumber = searchString.split("|")[1];
      searchResult = await Product.find({
        company: company,
        modelNumber: modelNumber,
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
