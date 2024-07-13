const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { checkUser } = require("../database/database");
//===================================================================================

//create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
  return jwt.sign({ id: username }, "farzad dehghan", {
    expiresIn: maxAge, // it's in s
  });
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  // check authentication
  checkUser(username, password, (err, exists) => {
    if (err) {
      return console.error(err.message);
    }

    if (exists) {
      console.log("User exists and password matched!");
      const token = createToken(username);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: username });
    } else {
      // send status 400 for when it's not authenticated
      console.log("Invalid username or password.");
      res.status(400);
    }
  });
};

module.exports.logout_get = (req, res) => {
  //replace it with empty value and set a short maxAge to delete it
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
