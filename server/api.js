var db, ready;

module.exports.connect = function () {
  var fs = require("fs");
  var mongoose = require("mongoose");
  var path = require("path");
  var paths = require("./paths");

  var username = getCredential("username");
  var password = getCredential("password");
  var hostname = getCredential("hostname");

  ready = false;

  function getCredential (credential) {
    return (fs.readFileSync(path.join(paths.server, "credentials", credential), "utf8")).replace(/\n$/, '');
  }

  var uri = "mongodb://" + username + ":" + password + "@" + hostname + "/" + "testdb";
  mongoose.connect(uri, { auth: { authdb:"admin" } });

  mongoose.connection.once('connected', function() {
    db = mongoose.connection.db;
    ready = true;
  });

  mongoose.connection.on("error", function(err) {
    console.log("\n" + " > " + "Mongoose Connection " + err + "\n");
  });
}

module.exports.route = function (app) {
  // ensure API service is ready
  app.use("/api/*", function (req, res, next) {
    ready ? next() : res.writeHead(202);
  });

  // sample return
  app.get("/api/my-name/", function (req, res, next) {
    db.collection("testcoll", function (err, collection) {
      collection.find().toArray(function (err, docs) {
        res.end(JSON.stringify(docs[0].name));
      });
    });
  });

  // catch all api
  app.get("/api/*", function(req, res, next) {
    res.writeHead(404);
    res.end("API not found.");
  });
}
