const { Router } = require("express");
const path = require("node:path");

const subdirRoute = Router();

subdirRoute.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "views", "subdir", "index.html")
  );
});

subdirRoute.get("/test", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "views", "subdir", "test.html")
  );
});

module.exports = subdirRoute;
