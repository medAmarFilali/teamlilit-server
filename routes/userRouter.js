const express = require("express");
const passport = require("passport");
const passportConfig = require("../auth/passport");
const { registerUser } = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.post("/register", registerUser);

module.exports = userRouter;
