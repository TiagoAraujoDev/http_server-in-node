const express = require("express");
const cors = require("cors");
const path = require("node:path");

const corsOptions = require("./config/corsOptions");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const rootRoutes = require("./routes/root.routes");
const employeesRoutes = require("./routes/api/employees.routes");

const app = express();

app.use(cors(corsOptions));

// Custom middleware
app.use(logger);

// Built-in middleware
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "..", "/public")));

// Routing
app.use("^/$", rootRoutes);
app.use("/api/employees", employeesRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 | Not found!" });
  } else {
    res.send("404 | Not found!");
  }
});

app.use(errorHandler);

module.exports = app;
