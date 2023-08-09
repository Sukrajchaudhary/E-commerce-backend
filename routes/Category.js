const express = require("express");
const { fetchCategory, createCategories } = require("../controller/Category");
const router = express.Router();
router.get("/", fetchCategory).post("/", createCategories);
exports.router = router;
