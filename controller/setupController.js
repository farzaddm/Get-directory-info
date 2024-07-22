const db = require("../database/database");
const { hashPassword } = require("../utils/getHashedPassword");
const fs = require("fs");
// =======================================================================

module.exports.setup_get = (req, res) => {
  res.render("setup");
};

module.exports.setup_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    let userHashedPassword;

    await hashPassword(password)
      .then((hashedPassword) => {
        userHashedPassword = hashedPassword;
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    db.signupAdmin(username, userHashedPassword, "admin", (err) => {
      if (err) {
        return res.status(500).send("Error adding admin: " + err.message);
      }
      // Mark setup as completed
      fs.writeFileSync("setup_complete", "true");
      res.redirect("/admin");
    });
  } catch (err) {
    res.status(500).send("Error during setup: " + err.message);
  }
};
