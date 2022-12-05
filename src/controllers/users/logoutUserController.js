const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const { sub: userEmail } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findOne({ email: userEmail }).exec();

  if (!user) {
    res.clearCookie(jwt, { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  await User.updateOne({ email: userEmail }, { $unset: { refresh_token: "" } });

  res.clearCookie(jwt, { httpOnly: true, sameSite: "None", secure: true });
  return res.sendStatus(204);
};

module.exports = { handleLogout };
