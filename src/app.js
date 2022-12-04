const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("node:path");

const corsOptions = require("./config/cors/corsOptions");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");

const router = require("./routes");

const app = express();

app.use(credentials);
app.use(cors(corsOptions));

// Custom middleware
app.use(logger);

// Built-in middleware
app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "..", "/public")));

// Routing
app.use(router);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    return res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    return res.json({ error: "404 | Not found!" });
  } else {
    return res.send("404 | Not found!");
  }
});

app.use(errorHandler);

module.exports = app;
