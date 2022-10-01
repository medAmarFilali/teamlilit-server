const express = require("express");
const passport = require("passport");
const passportConfig = require("../auth/passport");
const {
  registerUser,
  loginUser,
  logoutUser,
  authenticateUser,
  getAllUsers,
} = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/authenticate", authenticateUser);
userRouter.get("/list", getAllUsers);

module.exports = userRouter;
