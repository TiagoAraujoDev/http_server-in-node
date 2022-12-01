const { Router } = require("express");
const path = require("node:path");

const rootRoutes = Router();

rootRoutes.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views", "index.html"));
});

module.exports = rootRoutes;
