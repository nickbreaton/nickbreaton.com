module.exports = function (app, db) {
  // sample return
  app.get("/api/say-my-name/", function (req, res, next) {
    db.collection("testcoll", function (err, collection) {
      collection.find().toArray(function (err, docs) {
        res.end(docs[0].name);
      });
    });
  });

  // email me with contact info
  app.post("/api/contact/", function (req, res, next) {
    if (req.body && req.body.name && req.body.email && req.body.subject) {
      var fs = require("fs");
      var path = require("path");
      var https = require('https');
      var querystring = require('querystring');

      var data = querystring.stringify({
        'from' : req.body.name + "<" + req.body.email + ">",
        'to' : 'nick@breaton.com',
        'subject' : req.body.subject,
        'text' : "** Sent from contact page".toUpperCase() + "\n\n" + req.body.body
      });

      var authentication = fs.readFileSync(path.join(__dirname, "credentials", "email", "auth")).toString().replace('\n','');

      // sent POST to mailgun in order to send email for me
      var options = {
        host : 'api.mailgun.net',
        port : 443,
        auth : authentication,
        path : '/v2/sandbox44f89dd09756459994b99131f6fc859a.mailgun.org/messages',
        method : 'POST',
        headers : {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      };

      var request = https.request(options)
      request.write(data);
      request.end();
    }

    res.end();
  });
}
