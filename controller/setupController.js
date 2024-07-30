const db = require("../database/index");
const { hashPassword } = require("../utils/getHashedPassword");
const { setSetupComplete } = require("../utils/setupStatus");
const fs = require("fs");
// =======================================================================

module.exports.setup_get = (req, res) => {
  res.render("setup");
};

module.exports.setup_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    db.signupAdmin(username, password, "admin", (err) => {
      if (err) {
        return res.status(500).send("Error adding admin: " + err.message);
      }
      // Mark setup as completed
      fs.writeFileSync("setup_complete", "true");

      setSetupComplete(true);
      res.redirect("/admin");
    });
  } catch (err) {
    res.status(500).send("Error during setup: " + err.message);
  }
};
