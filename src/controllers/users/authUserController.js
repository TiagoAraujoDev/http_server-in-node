const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../../models/User");

const handleAuthUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    return res.status(401).json({ message: "Email or password incorrect!" });
  }

  const pwdMatch = await bcrypt.compare(password, user.password);

  if (!pwdMatch) {
    return res.status(401).json({ message: "Email or password incorrect!" });
  }

  const roles = Object.values(user.roles);

  try {
    const accessToken = jwt.sign(
      { roles: roles },
      process.env.ACCESS_TOKEN_SECRET,
      {
        subject: user.email,
        expiresIn: "10m"
      }
    );

    const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
      subject: user.email,
      expiresIn: "15d"
    });

    await User.updateOne(
      { email: user.email },
      { $set: { refresh_token: refreshToken } }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24
    });
    return res.status(200).json({ token: accessToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { handleAuthUser };
