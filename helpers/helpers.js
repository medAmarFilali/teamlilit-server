const JWT = require("jsonwebtoken");

const signToken = (userID) => {
  const signedToken = JWT.sign(
    {
      iss: "outerheaven",
      sub: userID,
    },
    "outerheaven",
    { expiresIn: "24h" }
  );
  return signedToken;
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
