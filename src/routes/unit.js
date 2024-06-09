const express = require("express");
const { authentication } = require("../middleware/authMiddleware");

const Route = express.Router();
const unitController = require("../controllers/unit");

Route.get("/", authentication, unitController.getAllUnitByUser);

module.exports = Route;
