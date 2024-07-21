const db = require("../database/database");
// ==============================================================


module.exports.getUsers = (req, res) => {
  db.getLoginHistory((err, rows) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    res.render("admin/loginHistory", { logins: rows });
  });
};