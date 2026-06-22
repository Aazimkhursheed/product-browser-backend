const express = require("express");
console.log("products.js loaded");
const router = express.Router();

const {
  getProducts,
} = require("../controllers/productController");

router.get("/", getProducts);

module.exports = router;