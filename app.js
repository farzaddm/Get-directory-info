const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./controller/authController");
const controller = require("./controller/controller");
const { requireAuth } = require("./middleware/authMiddleware");
const bodyParser = require("body-parser");
const multer = require("multer");
//=====================================================================================

const app = express();
const upload = multer({ dest: "uploads/" });

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
app.get("*", requireAuth, controller.processPathRequest);
app.post("/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.redirect('/?message=File uploaded successfully.');
});

// setup server
app.listen(3026, () => {
  console.log(`Server is running on port 3026`);
});
