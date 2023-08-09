const { Cart } = require("../model/Cart");

exports.fetchCartByUser = async (req, res) => {
  const { id} = req.user;
  try {
    const cart = await Cart.find({ user: id })
      .populate("user")
      .exec();
    res.status(200).json(cart);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
exports.addToCart = async (req, res) => {
  const {id}=req.user;
  try {
    const cart = await new Cart({...req.body,user:id});
    const doc = await cart.save();
    const result=await doc.populate('product');
    res.status(200).json(result);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
exports.deleteFromCart = async (req, res) => {
  try {
    const {id}=req.params;
    const cart=  await Cart.findByIdAndDelete(id);
    res.status(200).json(cart);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};


exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate('product');

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};