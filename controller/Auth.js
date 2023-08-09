const { User } = require("../model/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sanitizer } = require("../services/common");
const SECRETKEY = "SECRETKEY";
exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        //this also called serializer and make logi session
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const response = await user.save();
        req.login(sanitizer(response), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizer(user), SECRETKEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() +3600000),
                httpOnly: true,
              })
              .status(201)
              .json(token);
          }
        });
      }
    );
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
exports.loginUser = async (req, res) => {
  res
  .cookie("jwt", req.user.token,{
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
  })
  .status(201)
  .json(req.user.token);
};

exports.checkUser = async (req, res) => {
  return res.status(200).json({ status: "success", user: req.user });
};
