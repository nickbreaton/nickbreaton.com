var express = require("express");

var routes = require("./routes");

var app = express();

app.set("port", 3000);
app.set("env", process.env.NODE_ENV);
app.set("dev", app.get("env") != "production");

app.use(function (req, res, next) {
  routes(app);
  next();
});

app.listen(app.get("port"));
