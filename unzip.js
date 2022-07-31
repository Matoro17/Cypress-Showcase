const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");

async function unzip() {
  await extract(
    path.resolve("./backup_pages.zip"),
    { dir: path.resolve("temp") },
    function (err) {
      // handle err
    }
  );

  const current = walk("temp/", (err, results) => {
    for (const folder of results) {
      fs.rename(folder, path.resolve("history"), (err) => {
        console.error(err);
      });
    }
  });
}

var walk = function (dir, done) {
  const results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      results.push(file);
      next();
    })();
  });
  return done(null, results);
};

unzip();