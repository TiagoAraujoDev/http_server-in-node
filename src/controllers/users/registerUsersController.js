const bcrypt = require("bcrypt");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

const usersDB = {
  users: require("../../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  }
};

const handleNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required!" });
  }

  const userAlredyExist = usersDB.users.some((user) => user.email === email);

  if (userAlredyExist) {
    return res.sendStatus(409);
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 8);

    const newUser = {
      name,
      email,
      password: hashedPwd
    };

    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );

    return res.status(201).json({ newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
