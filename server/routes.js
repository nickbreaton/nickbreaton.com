var express = require("express");
var path = require("path");

var paths = require("./paths");

module.exports = function (app) {
  var angularApp = express.static(paths.index);

  // static
  app.use("/static/", express.static(paths.build));

  // everthing else respond with index (angular will handle 404)
  app.use("*", angularApp);
}
