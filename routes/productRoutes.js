const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/getAllProducts", productController.getAllProducts);
router.get("/search", productController.getProductBySearch);

module.exports = router;
