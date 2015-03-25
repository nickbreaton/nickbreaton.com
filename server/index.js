var express = require("express");

var api = require("./api");
var routes = require("./routes");
var app = express();

app.set("port", 3000);
app.set("env", process.env.NODE_ENV);
app.set("dev", app.get("env") != "production");

app.use(function (req, res, next) {
  api(app)
  routes(app);
  next();
});

app.listen(app.get("port"));
