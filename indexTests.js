var fs = require("fs");
var path = require("path");
var walk = async function (dir, done) {
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
    const element = `
    <li class="list-group-item d-flex justify-content-between align-content-center">
      <a href='${filepath}'>
        <div class="d-flex flex-row">
          <img
            src="https://img.icons8.com/color/100/000000/folder-invoices.png"
            width="40" height="40"
          />
          <div class="ml-2">
            <h6 class="mb-0">Teste Run</h6>
            <div class="about">
              <span>${filepath}</span>
            </div>
          </div>
        </div>
      </a>
    </li>`;
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <title>Document</title>
  </head>
    <style>
      body{ background: #4527A0; } .list-group{ width: 400px !important; }
      .list-group-item{ margin-top:10px; border-radius: none; background: #5E35B1;
      cursor: pointer; transition: all 0.3s ease-in-out; } .list-group-item:hover{
      transform: scaleX(1.1); } .check{ opacity: 0; transition: all 0.6s ease-in-out;
      } .list-group-item:hover .check { opacity: 1; } .about span{ font-size: 12px;
      margin-right: 10px; } input[type=checkbox] { position: relative; cursor:
      pointer; } input[type=checkbox]:before { content: ""; display: block; position:
      absolute; width: 20px; height: 20px; top: 0px; left: 0; border: 1px solid
      #10a3f9; border-radius: 3px; background-color: white; }
      input[type=checkbox]:checked:after { content: ""; display: block; width: 7px;
      height: 12px; border: solid #007bff; border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); transform:
      rotate(45deg); position: absolute; top: 2px; left: 6px; }
      input[type="checkbox"]:checked + .check { opacity: 1; }
    </style>
    <body>
      <div class="container d-flex justify-content-center">
        <ul class="list-group mt-5 text-white">
          ${links}
        </ul>
      </div>
    </body>
  </html>
  `;
  fs.writeFile("index.html", template, function () {
    console.log("Created index page");
  });
});
