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

    if (password !== cpassword) {
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
      isAuthenticated: true,
      user: {
        username: user.username,
        verifiedEmail: user.verifiedEmail,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: { msgBody: err.message, msgError: true } });
  }
};

const loginUser = async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      const { _id, username, email, password, verifiedEmail, role } = user;

      try {
        if (err) {
          return res
            .status(500)
            .json({ message: { msgBody: err, msgError: true } });
        }
        if (info !== undefined) {
          return res
            .status(500)
            .json({ message: { msgBody: info, msgError: true } });
        }

        const token = signToken(_id);

        res.cookie("access_token", token, {
          expires: new Date(Date.now() + 9999999),
          httpOnly: false,
          sameSite: false,
          secure: true,
        });

        res.status(200).json({
          isAuthenticated: true,
          user: { username, role, verifiedEmail, email },
        });
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: { msgBody: err.message, msgError: true } });
      }
    }
  )(req, res, next);
};

const logoutUser = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    try {
      res.clearCookie("access_token");
      return res.status(200).json({
        isAuthenticated: false,
        user: { username: "", email: "", role: "" },
      });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: { msgBody: err.message, msgError: true } });
    }
  })(req, res, next);
};

const authenticateUser = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    let username;
    let role;
    let email;
    let verifiedEmail;

    try {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: { msgBody: msg, msgError: trues } });
      }

      if (info !== undefined) {
        console.log(info.message);
        return res
          .status(500)
          .json({ message: { msgBody: info.message, msgError: true } });
      }

      if (!user) {
        return res.status(200).json({
          isAuthenticated: false,
          user: {
            username: "",
            role: "",
            email: "",
            verifiedEmail: "",
          },
        });
      }

      username = user.username;
      email = user.email;
      role = user.role;
      verifiedEmail = user.verifiedEmail;

      return res.status(200).json({
        isAuthenticated: true,
        user: { username, email, role, verifiedEmail },
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: { msgBody: err.message, msgError: true } });
    }
  })(req, res, next);
};

const getAllUsers = async (req, res) => {
  // Testing heroku
  try {
    const users = await User.find();
    console.log("Users: ", users);
    return res.status(200).json({ users });
  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authenticateUser,
  getAllUsers,
};
