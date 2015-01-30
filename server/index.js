var express = require("express");

var routes = require("./routes");
var api = require("./api");

var app = express();

api.connect();

app.set("port", 3000);
app.set("env", process.env.NODE_ENV);
app.set("dev", app.get("env") != "production");
app.set("api", api);

app.use(function (req, res, next) {
  api.route(app);
  routes(app);
  next();
});

app.listen(app.get("port"));
