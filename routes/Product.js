const express = require("express");
const {
  createProducts,
  getAllProducts,
  fetchProductById,
  updateProduct,
} = require("../controller/Product");
const server = express();
const router = express.Router();
// product is already added in base path
router
  .post("/", createProducts)
  .get("/", getAllProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);
exports.router = router;
