const { Router } = require("express");
const path = require("node:path");

const rootRoute = Router();

rootRoute.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views", "index.html"));
});

rootRoute.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "views", "new-page.html"));
});

rootRoute.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

module.exports = rootRoute;
