var express = require("express");

var routes = require("./routes");

var app = express();

app.set("port", 3000);
app.set("env", process.env.NODE_ENV);

app.use(function (req, res, next) {
  routes(app);
  next();
});

if (app.get("env") != "production") {
  app.listen(app.get("port"));
} else {
  module.exports = app;
}
