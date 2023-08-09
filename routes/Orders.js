const express = require("express");
const {
  addOrder,
  fetchOrdersByUser,
  deleteFromOrders,
  updateOrder,
  getAllOrders,
} = require("../controller/Order");
const router = express.Router();
router
  .post("/", addOrder)
  .get("/user/:userid", fetchOrdersByUser)
  .delete("/:id", deleteFromOrders)
  .patch("/:id", updateOrder)
  .get("/", getAllOrders);

exports.router = router;
