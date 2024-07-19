const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const { reject } = require("lodash");
const { hashPassword } = require("../utils/getHashedPassword");
//===============================================================================

// open database
const db = new sqlite3.Database("./database/database.db");

async function checkUser(username, password, callback) {
  try {
    const row = await new Promise((resolve, reject) => {
      db.get(
        "SELECT password, role FROM user WHERE username = ?",
        [username],
        (err, row) => {
          // operation failed
          if (err) reject(err);
          // operation was succesful
          else resolve(row);
        }
      );
    });

    if (!row) {
      return callback(null, false);
    }

    const match = await bcrypt.compare(password, row.password);
    return callback(null, match ? { username, role: row.role } : false);
  } catch (err) {
    return callback(err);
  }
  // colse database
  db.close();
}

async function signupUser(username, password) {
  let userHashedPassword;

  await hashPassword(password)
    .then((hashedPassword) => {
      userHashedPassword = hashedPassword;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO user(username, password, role) VALUES(?, ?, ?)",
      [username, userHashedPassword, "user"],
      (err) => {
        if (err) {
          return reject(err);
        }
        console.log("user added successfully")
        resolve({ username, role: "user" });
      }
    );
  });
}

module.exports = { checkUser, signupUser };
