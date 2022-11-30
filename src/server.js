const http = require("node:http");
const fs = require("node:fs");
const fsPromises = require("node:fs/promises");
const path = require("node:path");
const logEvents = require("./logEvents");
const { EventEmitter } = require("node:events");

class AppEmitter extends EventEmitter {}

const appEmitter = new AppEmitter();

appEmitter.on("logs", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 8080;

const serveFile = async (filePath, contentType, response) => {
  try {
    const data = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf8" : ""
    );
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(data);
  } catch (error) {
    console.log(error);
    appEmitter.emit(
      "logs",
      `${error.name}: ${error.message}`,
      "errorLogs.txt"
    );
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((request, response) => {
  console.log(request.method, request.url);
  appEmitter.emit(
    "logs",
    `${request.url}\t${request.method}`,
    "requestLogs.txt"
  );

  const extension = path.extname(request.url);
  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "text/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
      break;
  }

  let filePath =
    contentType === "text/html" && request.url === "/"
      ? path.join(__dirname, "..", "views", "index.html")
      : contentType === "text/html" && request.url.slice(-1) === "/"
      ? path.join(__dirname, "..", "views", request.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "..", "views", request.url)
      : path.join(__dirname, "..", request.url);

  // makes .html extension not required in the browser
  if (!extension && request.url.slice(-1) !== "/") filePath += ".html";

  const fileExist = fs.existsSync(filePath);

  if (fileExist) {
    // serve page
    serveFile(filePath, contentType, response);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        response.writeHead(301, { Location: "/new-page.html" });
        response.end();
        break;
      case "www-page.html":
        response.writeHead(301, { Location: "/" });
        response.end();
        break;
      default:
        // serve a 404 page
        serveFile(
          path.join(__dirname, "..", "views", "404.html"),
          "text/html",
          response
        );
    }
  }
});

server.listen(PORT, console.log(`Server runnig on port ${8080}`));
