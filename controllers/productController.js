const Product = require("../models/ProductModel");

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
  const searchResult = await Product.find({
    // $or: [
    // {
    tags: { $regex: searchString, $options: "i" },
    // },
    // { company: { $regex: searchString, $options: "i" } },
    // ],
  });
  res.json(searchResult);
};
