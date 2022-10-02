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
  if (req.cookies && req.body.token === undefined) {
    token = req.cookies["access_token"];
  } else if (req.body) {
    token = req.body.token;
  }
  return token;
};

module.exports = {
  signToken,
  cookieExtractor,
};
