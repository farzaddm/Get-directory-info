const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./controller/authController");
const controller = require("./controller/directoryController");
const adminController = require("./controller/adminController");
const setupController = require("./controller/setupController");
const { requireAuth, checkRole, setAuthStatus, } = require("./middleware/authMiddleware");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { checkSetupComplete } = require("./utils/setupStatus");
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

// Serve favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// check setup
if (!checkSetupComplete()) {
  app.get('/setup', setupController.setup_get);
  app.post('/setup', setupController.setup_post);
} 

app.use((req, res, next) => {
  if (!checkSetupComplete() && !req.path.startsWith('/setup')) {
    return res.redirect("/setup");
  }
  next();
})

// ------------------------------------------------------------------------------------------------
// routes
app.get("/login", authController.login_get);
app.post("/login", authController.login_post);
app.get("/add-user", authController.addUser_get);
app.post("/add-user", authController.addUser_post);
app.get("/logout", authController.logout_get);

// admin
app.get("/admin", requireAuth, checkRole("admin"), authController.admin_get);
app.get("/admin/login-history", requireAuth, checkRole("admin"), adminController.getUsers);
app.get("/admin/manage-users", requireAuth, checkRole("admin"), adminController.manageUsers_get);
app.post("/admin/delete-user", requireAuth, checkRole("admin"), adminController.deleteUser_post);
app.post("/admin/grant-access", requireAuth, checkRole("admin"), adminController.grantAccess_post);


// main functions
app.get("*", requireAuth, controller.processPathRequest);
app.post("/upload", requireAuth, checkRole("admin"), upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.redirect("/?message=File uploaded successfully.");
  }
);

// ---------------------------------------------------------------------------
// setup server
app.listen(3026, () => {
  console.log(`Server is running on port 3026`);
});
