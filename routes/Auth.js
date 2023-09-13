const express = require("express");
const { createUser, loginUser, checkUser ,resetPasswordRequest,resetPassword} = require("../controller/Auth");
const router = express.Router();
const passport = require("passport");
router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check",passport.authenticate('jwt'), checkUser)
  .post("/reset-password-request",resetPasswordRequest)
  .post("/reset-password",resetPassword);

exports.router = router;
