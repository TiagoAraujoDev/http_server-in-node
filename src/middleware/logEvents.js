const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("node:fs");
const fsPromises = require("node:fs/promises");
const path = require("node:path");

const logEvents = async (message, fileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "..", "logs"))) {
      fsPromises.mkdir(path.join(__dirname, "..", "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "..", "logs", fileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.headers.origin}\t${req.url}`,
    "requestLogs.txt"
  );
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };
