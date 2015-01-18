// local modules
var del = require("del");
var gulp = require("gulp");
var gutil = require("gutil");
var path = require("path");
var plugin = require("gulp-load-plugins")();

// project modules
var paths = require("./paths");


var html = [path.join(paths.templates, "*.html"), path.join(paths.src, "*.html")]
var scripts = [path.join(paths.src, "/index.js"), path.join(paths.src, "/**/*.js"), path.join(paths.src, "/*.js")];
var styles = [path.join(paths.styles, "*.css"), path.join(paths.styles, "*.scss"), path.join(paths.styles, "*.sass")]

gulp.task("default", ["daemon", "clean", "html", "scripts", "styles"]);

gulp.task("clean", function () {
  del(path.join(paths.build, "*"), { force : true });
});

gulp.task("scripts", function () {
  return gulp.src(scripts)
    .pipe(plugin.concat("site.js"))
    .pipe(gulp.dest(paths.build))
    .pipe(plugin.rename("site.min.js"))
    .pipe(plugin.uglify())
    .pipe(gulp.dest(paths.build));
});

gulp.task("index", function () {
  return gulp.src(path.join(paths.src, "index.html"))
    .pipe(gulp.dest(paths.index))
    .pipe(plugin.frep([{
      pattern : /.js/g,
      replacement : ".min.js"
    }]))
    .pipe(gulp.dest(path.join(paths.index, "min")));
});

gulp.task("html", ["index"], function () {
  return gulp.src(path.join(paths.templates, "*"))
    .pipe(gulp.dest(path.join(paths.build, "templates")));
});

gulp.task("styles", function () {
  return gulp.src(styles)
    .pipe(plugin.sass())
    .on("error", error)
    .pipe(plugin.autoprefixer())
    .pipe(gulp.dest(paths.build));
});

gulp.task("daemon", ["watch"], function() {
  plugin.nodemon({
    script : "index.js",
    ext : "*",
  })
    .on("start", ["watch"])
    .on("change", ["watch"]);
});

gulp.task("watch", function () {
  gulp.watch(scripts, ["scripts"]);
  gulp.watch(styles, ["styles"]);
  gulp.watch(html, ["html"]);
});

function error (error) {
  // make beep sound
  process.stdout.write('\x07');

  console.log("\n" + error.toString() + "\n");

  // send continue to watch
  this.emit("end");
}
