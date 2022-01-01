const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../models/user");
const { cookieExtractor } = require("../helpers/helpers");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: "outeheaven",
    },
    (payload, done) => {
      User.dingById({ _id: payload.sub }, (err, user) => {
        if (err) {
          console.log(err);
          return done(err, false);
        } else if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, "Please check your email");
      }
      user.checkPassword(password, done);
    });
  })
);
