const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { checkUser, signupUser } = require("../database/database");
//===================================================================================

//create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (username, role) => {
  return jwt.sign({ id: username, role: role }, "farzad dehghan", {
    expiresIn: maxAge, // it's in s
  });
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.login_post = (req, res) => {
  const { username, password } = req.body;

  // check authentication
  checkUser(username, password, (err, user) => {
    if (err) {
      return console.error(err.message);
    }

    if (user) {
      console.log("User exists and password matched!");
      const token = createToken(username, user.role);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: username });
    } else {
      // send status 400 for when it's not authenticated
      console.log("Invalid username or password.");
      res.status(400).json({ errors: "Failed to log in" });
    }
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.signup_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    await signupUser(username, password);
    res.status(200).json({ user: username });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errors: "Failed to register user" });
  }
};

module.exports.logout_get = (req, res) => {
  //replace it with empty value and set a short maxAge to delete it
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
