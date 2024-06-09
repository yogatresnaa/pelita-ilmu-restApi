const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./src/config/db.config");
const { errorMiddleware } = require("./src/middleware/errorMiddleware");
const routeNavigator = require("./src/routes");
//ADD
const app = express();
require("dotenv").config();

const server = app.listen(process.env.PORT, process.env.HOST_LOCAL, () => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    `server running at http://${process.env.HOST_LOCAL}: ${
      server.address().port
    }`
  );
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use("/public", express.static(`${__dirname}/public`));
app.use(morgan("dev"));
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: "true",
    optionSuccessStatus: 200,
  })
);

app.use("/", routeNavigator);
app.use(errorMiddleware);
