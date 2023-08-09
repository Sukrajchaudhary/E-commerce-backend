const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    min: [1, "Wrong min Price"],
    max: [1000, "Invalid Max Price"],
  },
  discountPercentage: {
    type: Number,
    min: [0, "Wrong min Discount"],
    max: [100, "Invalid Max Discount Price"],
  },
  rating: {
    type: Number,
    min: [0, "Wrong min Rating"],
    max: [100, "Invalid Max Rating"],
    default: 0,
  },
  stock: {
    type: Number,
    min: [1, "Wrong min Stock"],
    require: true,
  },
  brand: {
    type: String,
    min: [1, "Wrong min Stock"],
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  thumbnail: {
    type: String,
    require: true,
  },
  images: { type: [String], required: true },
  deleted: {
    type: Boolean,
    default: false,
  },
});
const virtual = productSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
exports.Product = mongoose.model("Product", productSchema);
