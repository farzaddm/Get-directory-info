const fs = require("fs");
const path = require("path");
const db = require("../database/database");
const { error } = require("console");
//===================================================================================

const baseUserDir = "/home";

module.exports.processPathRequest = async(req, res) => {
  const currentPath = path.join("/", req.path);
  const username = res.locals.username;

  // delete expired rows
  try {
    await db.cleanExpiredAccess();
  } catch (error) {
    console.error("Error cleaning expired access: ", error);
  }

  // check if user have any axtra access
  res.locals.hasDownloadAccess = false;
  res.locals.hasUploadAccess = false;
  try {
    const downloadResult = await db.getUserAccess(username, 'download');
    if (downloadResult && downloadResult.access_type) {
      res.locals.hasDownloadAccess = true;
    }

    const uploadResult = await db.getUserAccess(username, 'upload');
    if (uploadResult && uploadResult.access_type) {
      res.locals.hasUploadAccess = true;
    }
  } catch (error) {
    console.error("Error fetching user access: ", error);
    return res.status(500).send("Internal Server Error");
  }
  
  // check the role and only show user the home directory
  if (res.locals.role !== "admin" && !currentPath.startsWith(baseUserDir)) {
    return res.redirect(baseUserDir);
  }

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
        const directories = files.filter((file) => file.isDirectory() && !file.name.startsWith(".")).map((file) => file.name);
        const fileNames = files.filter((file) => !file.isDirectory() && !file.name.startsWith(".")).map((file) => file.name);

        res.render("home", {currentPath: req.path, directories, fileNames, path,});
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

