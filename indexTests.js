var fs = require("fs");
var path = require("path");
var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          const extension = path.extname(file);
          if (extension == ".html") {
            const result = file.split("public");
            results.push("public" + result[1].replaceAll("\\", "/"));
          }
          next();
        }
      });
    })();
  });
};

function generateLinks(fileList) {
  const builder = [];
  for (const filename of fileList) {
    const filepath = filename.replace("public/", "");
    const element = `<a href='${filepath}'>${filepath}</a>`;
    builder.push(element);
  }
  return builder.join("\n</br>\n");
}

let links = "";

walk("./public", function (err, results) {
  links = generateLinks(results);
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    ${links}
    </body>
  </html>
  `;
  fs.writeFile("index.html", template, function () {
    console.log("Created index page");
  });
});
