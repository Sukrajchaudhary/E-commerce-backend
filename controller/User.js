const { User } = require("../model/User");
exports.fetchUserById = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).exec();
    res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role});
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
