const jwt = require("jsonwebtoken");

require("dotenv").config();

/* const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  }
}; */

const ensureAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // 401 => unauthorized request
    return res.status(401).json({ message: "Missing token!" });
  }

  const [, token] = authHeader.split(" "); // Bearer s0d8f69s0d9f7f0d9d0897f

  try {
    const { sub: userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      id: userId
    };

    next();
  } catch {
    // 403 => forbiden
    return res.status(403).json({ message: "Invalid token!" });
  }
};

module.exports = ensureAuthenticate;
