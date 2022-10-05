const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "You need to enter an email"],
  },
  password: {
    type: String,
    required: [true, "You need to enter a password"],
  },
  username: String,
  familyName: String,
  givenName: String,
  verifiedEmail: {
    type: Boolean,
    required: true,
    default: false,
  },
  verifyEmailToken: {
    type: String,
  },
  verifyEmailExpires: {
    type: Date,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.methods = {
  checkPassword: function (inputPassword, done) {
    return bcrypt.compare(inputPassword, this.password, (err, isMatch) => {
      if (err) {
        done(err);
      } else {
        if (!isMatch) {
          return done(null, isMatch, "Wrong password");
        }
        return done(null, this);
      }
    });
  },
  hashPassword: function (plainTextPassword) {
    return bcrypt.hashSync(plainTextPassword, 10);
  },
};

userSchema.pre("save", function (next) {
  if (!this.password) {
    console.log("Password not found [model.pre]");
    next();
  } else {
    this.password = this.hashPassword(this.password);
    next();
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
