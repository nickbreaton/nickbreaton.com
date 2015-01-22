var express = require("express");

var routes = require("./routes");

var app = express();

app.set("port", 3000);
app.set("env", process.env.NODE_ENV);
app.set("domain", "127.0.0.1");

app.use(function (req, res, next) {
  routes(app);
  next();
});

console.log(app.get("production"));

app.get("production") || true ? module.exports = app : app.listen(app.get("port"));
