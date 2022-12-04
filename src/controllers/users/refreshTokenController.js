const jwt = require("jsonwebtoken");
require("dotenv").config();

const userDB = {
  users: require("../../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  }
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "No Token available!" });
  }

  const refreshToken = cookies.jwt;
  const { sub: userId } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = userDB.users.find((user) => user.id === userId);

  if (!user) {
    res.sendStatus(403);
  }

  try {
    const roles = Object.values(user.roles);

    const accessToken = jwt.sign(
      { roles: roles },
      process.env.REFRESH_TOKEN_SECRET,
      {
        subject: userId,
        expiresIn: "30s"
      }
    );

    return res.json({ token: accessToken });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { handleRefreshToken };
