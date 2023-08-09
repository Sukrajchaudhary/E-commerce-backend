const { Category } = require("../model/Category");
exports.fetchCategory = async (req, res) => {
  try {
    const category = await Category.find({}).exec();
    res.status(200).json(category);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.createCategories = async (req, res) => {
  try {
    const category = await Category(req.body);
    const response = await category.save();
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
