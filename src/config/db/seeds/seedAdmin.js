const bcrypt = require("bcrypt");

const User = require("../../../models/User");

const createAdmin = async () => {
  const email = "admin@admin.com";

  const userAlreadyExists = await User.findOne({ email: email }).exec();
  if (userAlreadyExists) {
    return;
  }

  const hashPwd = await bcrypt.hash("1234", 8);

  try {
    const adminUser = new User({
      name: "admin",
      email: email,
      password: hashPwd,
      roles: {
        User: 2001,
        Editor: 1984,
        Admin: 5150
      }
    });

    const result = await adminUser.save();

    console.log(result);
  } catch (error) {
    console.log({ "CustomLog => Error": error.message });
  }
};

module.exports = createAdmin;
