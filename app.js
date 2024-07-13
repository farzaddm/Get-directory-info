const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./controller/authController");
const { requireAuth } = require("./middleware/authMiddleware");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
//=====================================================================================

const app = express();

// middleware
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser());

// view engine
app.set("view engine", "ejs");

// routes
app.get("/login", (req, res) => res.render("login"));
app.post("/login", authController.login_post);
app.get("/logout", authController.logout_get);
app.get("*", requireAuth, (req, res) => {
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
        const directories = files.filter((file) => file.isDirectory() && !file.name.startsWith(".")).map((file) => file.name);
        const fileNames = files.filter((file) => !file.isDirectory() && !file.name.startsWith(".")).map((file) => file.name);
        
        res.render("home", {currentPath: req.path,directories,fileNames,path,});
      });
    }
    // path is file
    else if (stats.isFile()) {
      fs.readFile(currentPath, "utf8", (err, data) => {
        if (err) {
          return res.status(500).send("Unable to read file");
        }

        res.render("file", { currentPath: req.path, content: data, path });
      });
    } else {
      res.status(400).send("Invalid path");
    }
  });
});

// setup server
app.listen(3026, () => {
  console.log(`Server is running on port 3026`);
});
