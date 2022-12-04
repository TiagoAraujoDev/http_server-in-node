const jwt = require("jsonwebtoken");
require("dotenv").config();

const fsPromises = require("node:fs/promises");
const path = require("node:path");

const usersDB = {
  users: require("../../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  }
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const { sub: userId } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = usersDB.users.find((user) => user.id === userId);

  if (!user) {
    res.clearCookie(jwt, { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  const newUsersDBData = usersDB.users.map((user) => {
    if (user.id === userId) {
      return { ...user, refresh_token: "" };
    } else {
      return user;
    }
  });

  usersDB.setUsers([...newUsersDBData]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "..", "models", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie(jwt, { httpOnly: true, sameSite: "None", secure: true });
  return res.sendStatus(204);
};

module.exports = { handleLogout };
