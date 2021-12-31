const JWT = require("jsonwebtoken");

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "outerheaven",
      sub: userID,
    },
    "outerheaven",
    { expiresIn: "24h" }
  );
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

module.exports = {
  signToken,
  cookieExtractor,
};
