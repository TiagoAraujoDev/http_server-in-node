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

module.exports = corsOptions;
