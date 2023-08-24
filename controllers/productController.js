const Product = require("../models/ProductModel");
const { sendSuccess } = require("../utils/response");

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
  let startTime = process.hrtime();
  const searchResult = await Product.find({
    $or: [
      { tags: { $regex: searchString, $options: "i" } },
      { productTitle: { $regex: searchString, $options: "i" } },
    ],
  });

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
