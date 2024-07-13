const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
//===============================================================================

// open database
const db = new sqlite3.Database("./database/database.db");

async function checkUser(username, password, callback) {
  try {
    const row = await new Promise((resolve, reject) => {
      db.get("SELECT password FROM user WHERE username = ?", [username], (err, row) => {
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
    return callback(null, match);
  } catch (err) {
    return callback(err);
  }
}
module.exports = { checkUser };
