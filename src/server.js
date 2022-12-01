const express = require("express");
const cors = require("cors");
const path = require("node:path");

const { logger } = require("../middleware/logEvents");
const { errorHandler } = require("../middleware/errorHandler");

const rootRoute = require("./routes/root.routes");
const subdirRoute = require("./routes/subdir.routes");
const employeesRoutes = require("./routes/api/employees.routes");

const app = express();

const PORT = process.env.PORT || 8080;

const allowedDomains = [
  "https://www.mysite.com",
  "http://127.0.0.1:5500",
  "http://localhost:8080"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedDomains.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Custom middleware
app.use(logger);

// Built-in middleware
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "..", "/public")));
app.use("/subdir", express.static(path.join(__dirname, "..", "/public")));

// Routing
app.use("^/$", rootRoute);
app.use("/subdir", subdirRoute);
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

app.listen(PORT, () => console.log(`Server runnig on port ${8080}`));
