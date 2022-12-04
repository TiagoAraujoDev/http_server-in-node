const bcrypt = require("bcrypt");
const User = require("../../models/User");

const handleNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required!" });
  }

  const userAlredyExist = await User.findOne({ email: email }).exec();

  if (userAlredyExist) {
    return res.sendStatus(409);
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 8);

    const newUser = new User({
      name,
      email,
      password: hashedPwd
    });

    console.log(newUser);

    const result = await newUser.save();

    return res.status(201).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
