const express = require("express");
const passport = require("passport");
const passportConfig = require("../auth/passport");
const User = require("../models/user");
const { signToken } = require("../helpers/helpers");
const crypt = require("crypto");

const registerUser = async (req, res, next) => {
  const { username, email, password, cpassword } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: { msgBody: "This user already exists", msgError: true },
      });
    }
    if (existingEmail) {
      return res.status(409).json({
        message: { msgBody: "This email already exisstss", msgError: true },
      });
    }

    if (password.length < 5) {
      return res.status(409).json({
        message: {
          msgBody: "Password should be longer than 5 characters",
          msgError: true,
        },
      });
    }

    if (password !== cpasssword) {
      return res.status(409).json({
        message: {
          msgBody: "Passwords doesn't match",
          msgError: true,
        },
      });
    }

    const user = new User({ email, password, username });

    await user.save();

    return res.status(200).json({
      message: {
        msgBody: `User ${user.username} successfully added`,
        msgError: false,
      },
    });
  } catch (err) {
    res.status(500).json({ message: { msgBody: err, msgError: true } });
  }
};

module.exports = { registerUser };
