var express = require("express");
var path = require("path");

var paths = require("./paths");

module.exports = function (app) {
  
  var angularApp = app.get("dev") ? express.static(paths.index) : express.static(path.join(paths.index, "min"));

  // static
  app.use("/static/", express.static(paths.build));
  app.use("/static/vendor/", express.static(path.join(paths.client, "vendor")));
  app.use("/static/", express.static(path.join(paths.client, "resources")));

  // send 404 for statics not found
  app.use("/static/*", function (req, res) {
    res.writeHead(404);
    res.end("Resource not found.")
  });

  // everthing else respond with index (angular will handle 404)
  app.use("*", angularApp);
}
