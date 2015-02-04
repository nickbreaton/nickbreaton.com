module.exports = function (app, db) {
  // sample return
  app.get("/api/say-my-name/", function (req, res, next) {
    db.collection("testcoll", function (err, collection) {
      collection.find().toArray(function (err, docs) {
        res.end(docs[0].name);
      });
    });
  });
}
