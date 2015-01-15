var path = require("path");

var Paths = function () {
  this.root = path.join(__dirname, "..");
    this.server = path.join(this.root, "server");
    this.client = path.join(this.root, "client");
      this.build = path.join(this.client, "build");
        this.index = path.join(this.build, "index");
      this.src = path.join(this.client, "src");
        this.styles = path.join(this.src, "styles");
        this.templates = path.join(this.src, "templates");
}

module.exports = new Paths();
