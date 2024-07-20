const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./controller/authController");
const controller = require("./controller/controller");
const { requireAuth, checkRole, setAuthStatus } = require("./middleware/authMiddleware");
const bodyParser = require("body-parser");
const multer = require("multer");
//=====================================================================================

const app = express();
const upload = multer({ dest: "uploads/" });

// middleware
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser());

// set authentications status for all routes
app.use(setAuthStatus);

// view engine
app.set("view engine", "ejs");

// routes
app.get("/login", authController.login_get);
app.post("/login", authController.login_post);
app.get("/signup", authController.signup_get);
app.post("/signup", authController.signup_post);
app.get("/logout", authController.logout_get);
app.get('/admin', requireAuth, checkRole('admin'), authController.admin_get)
app.get("*", requireAuth, controller.processPathRequest);
app.post("/upload", requireAuth, checkRole('admin'), upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.redirect('/?message=File uploaded successfully.');
});

// setup server
app.listen(3026, () => {
  console.log(`Server is running on port 3026`);
});
