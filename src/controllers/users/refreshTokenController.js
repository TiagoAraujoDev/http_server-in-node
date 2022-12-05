const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "No Token available!" });
  }

  const refreshToken = cookies.jwt;
  const { sub: userEmail } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findOne({ email: userEmail }).exec();

  if (!user) {
    res.sendStatus(403);
  }

  const roles = Object.values(user.roles);

  try {
    const accessToken = jwt.sign(
      { roles: roles },
      process.env.REFRESH_TOKEN_SECRET,
      {
        subject: userEmail,
        expiresIn: "10m"
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
