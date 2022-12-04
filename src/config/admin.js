const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  }
};

const createAdmin = async () => {
  const email = "admin@admin.com";

  const userAlreadyExists = usersDB.users.some((user) => user.email === email);
  if (userAlreadyExists) {
    return;
  }

  const hashPwd = await bcrypt.hash("1234", 8);

  const adminUser = {
    id: uuid(),
    name: "admin",
    email: email,
    password: hashPwd,
    roles: {
      user: 2001,
      editor: 1984,
      admin: 5150
    }
  };

  usersDB.setUsers([adminUser, ...usersDB.users]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(usersDB.users)
  );
};

module.exports = createAdmin;
