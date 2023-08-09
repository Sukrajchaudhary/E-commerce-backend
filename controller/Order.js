const { Order } = require("../model/Order");

exports.addOrder = async (req, res) => {
  try {
    const order = await new Order(req.body);
    const doc = await order.save();
    res.status(200).json(doc);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.fetchOrdersByUser = async (req, res) => {
  const { id} = req.query;
  try {
    const order = await Order.find({ user: id }).exec();
    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.createOrders = async (req, res) => {
  try {
    const order = new Order(req.body);
    const response = await order.save();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.deleteFromOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    let query = Order.find({ deleted: { $ne: true } });
    let totalOrdersQuery = Order.find({ deleted: { $ne: true } });
    const totalDocs = await totalOrdersQuery.count().exec();
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