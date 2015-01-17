var express = require("express");

var routes = require("./routes");

var app = express();

app.set("port", 3000);
app.set("development", true);

app.use(function (req, res, next) {
  routes(app);
  next();
});

if (app.get("development")) {
  app.listen(app.get("port"));
} else {
  module.exports = app;
}
