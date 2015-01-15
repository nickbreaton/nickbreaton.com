var express = require("express");

var routes = require("./routes");

var app = express();

app.set("port", 3000);

app.use(function (req, res, next) {
  routes(app);
  next();
});

app.listen(app.get("port"));
