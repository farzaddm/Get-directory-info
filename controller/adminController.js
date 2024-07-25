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

module.exports.manageUsers_get = async (req, res) => {
  try {
    db.getUsers((err, users) => {
      if (err) {
        return res.status(500).send("Unable to fetch users");
      }
      res.render("admin/manageUsers", { users });
    });
  } catch (err) {
    res.status(500).send("Unable to fetch users");
  }
};

module.exports.deleteUser_post = (req, res) => {
  const { username } = req.body;
  db.deleteUser(username, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete user' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};

module.exports.grantAccess_post = async (req, res) => {
  const { username, accessType, duration } = req.body;

  try {
    await db.grantAccess(username, accessType, duration);
    res.status(200).json({ message: 'Access granted successfully' });
  } catch (error) {
    console.error("Error granting access: ", error);
    res.status(500).send("Internal Server Error");
  }
};