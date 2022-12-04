const mongoose = require("mongoose");

const createMongodbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = createMongodbConnection;
