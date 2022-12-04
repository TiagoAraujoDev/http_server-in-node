const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

const usersDB = {
  users: require("../../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  }
};

const handleAuthUser = async (req, res) => {
  const { email, password } = req.body;

  const user = usersDB.users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ message: "Email or password incorrect!" });
  }

  const pwdMatch = await bcrypt.compare(password, user.password);

  if (!pwdMatch) {
    return res.status(401).json({ message: "Email or password incorrect!" });
  }

  try {
    const roles = Object.values(user.roles);

    const accessToken = jwt.sign(
      { roles: roles },
      process.env.ACCESS_TOKEN_SECRET,
      {
        subject: user.id,
        expiresIn: "30s"
      }
    );

    const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
      subject: user.id,
      expiresIn: "15d"
    });

    const usersUpdateDB = usersDB.users.map((usr) => {
      if (usr.id === user.id) {
        return { ...usr, refresh_token: refreshToken };
      } else {
        return usr;
      }
    });

    usersDB.setUsers([...usersUpdateDB]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
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
