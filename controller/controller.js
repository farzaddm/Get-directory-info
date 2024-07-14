const fs = require("fs");
const path = require("path");
//===================================================================================


module.exports.processPathRequest = (req, res) => {
  const currentPath = path.join("/", req.path);

  // checking the path is for directory or file
  fs.stat(currentPath, (err, stats) => {
    if (err) {
      return res.status(500).send("Unable to access path");
    }

    // path is directory
    if (stats.isDirectory()) {
      fs.readdir(currentPath, { withFileTypes: true }, (err, files) => {
        if (err) {
          return res.status(500).send("Unable to scan directory");
        }

        // not showing hidden files
        const directories = files
          .filter((file) => file.isDirectory() && !file.name.startsWith("."))
          .map((file) => file.name);
        const fileNames = files
          .filter((file) => !file.isDirectory() && !file.name.startsWith("."))
          .map((file) => file.name);

        res.render("home", {
          currentPath: req.path,
          directories,
          fileNames,
          path,
        });
      });
    }
    // path is file
    else if (stats.isFile()) {
      // Check if the request is to download the file
      if (req.query.download) {
        res.download(currentPath, path.basename(currentPath), (err) => {
          if (err) {
            return res.status(500).send("Unable to download file");
          }
        });
      } else {
        fs.readFile(currentPath, "utf8", (err, data) => {
          if (err) {
            return res.status(500).send("Unable to read file");
          }

          res.render("file", { currentPath: req.path, content: data, path });
        });
      }
    } else {
      res.status(400).send("Invalid path");
    }
  });
};
