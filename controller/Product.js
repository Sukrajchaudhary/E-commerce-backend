const model = require("../model/Product");
const Product = model.Product;

exports.createProducts = async (req, res) => {
  try {
    const product = new Product(req.body);
    const response = await product.save();
    return res
      .status(200)
      .json({ message: "Product Created Successfully", response: response });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    let condition = {};
    if (req.query.admin) {
      condition.deleted = { $ne: true };
    }
    let query = Product.find(condition);
    let totalProductQuery = Product.find(condition);
    if (req.query.category) {
      query = query.find({ category: req.query.category });
      totalProductQuery = totalProductQuery.find({
        category: req.query.category,
      });
    }
    if (req.query.brand) {
      query = query.find({ brand: req.query.brand });
      totalProductQuery = totalProductQuery.find({ brand: req.query.brand });
    }
    const totalDocs = await totalProductQuery.count().exec();
    if (req.query._sort && req.query._order) {
      query = query.sort({ [req.query._sort]: req.query._order });
    }
    // TODO:How to get sort on discount Price not on Actual Price
    if (req.query._page && req.query._limit) {
      const pageSize = parseInt(req.query._limit, 10);
      const page = parseInt(req.query._page, 10);
      query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
    const docs = await query.exec();
    res.set("X-TOTAL-Count", totalDocs);
    return res.status(200).json(docs);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.fetchProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
