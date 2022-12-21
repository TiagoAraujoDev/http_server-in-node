const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 8080;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB!");

  app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );
});
