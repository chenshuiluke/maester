var express = require("express");
var config = require("./../../config");
var api = express.Router();


api.get("/", function (req, res) {
  res.send("API functional");
});

module.exports = api;
