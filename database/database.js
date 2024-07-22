const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const { reject } = require("lodash");
const { hashPassword } = require("../utils/getHashedPassword");
//===============================================================================

// open database
const db = new sqlite3.Database("./database/database.db");

module.exports.checkUser = async (username, password, callback) => {
  try {
    const row = await new Promise((resolve, reject) => {
      db.get("SELECT password, role FROM user WHERE username = ?", [username], (err, row) => {
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
}

module.exports.signupUser = async(username, password) => {
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

module.exports.signupAdmin = (username, password, role, callback) => {
  db.run(
    "INSERT INTO user (username, password, role) VALUES (?, ?, ?)",
    [username, password, role],
    (err) => {
      callback(err);
    }
  );
};

// save the user's login
module.exports.insertLogin = (username, loginTime, callback) => {
  db.run("INSERT INTO logins (username, loginTime) VALUES (?, ?)", [username, loginTime], callback);
};

module.exports.getLoginHistory = (callback) => {
  db.all(
    `SELECT logins.id, user.username, user.role, logins.loginTime 
    FROM logins 
    JOIN user ON logins.username = user.username
    ORDER BY logins.loginTime DESC`
  , [], callback);
};

module.exports.deleteUser = (username, callback) => {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run("DELETE FROM access WHERE username = ?", [username], (err) => {
      if (err) {
        return db.run("ROLLBACK", () => {
          callback(err);
        });
      }
    });

    db.run("DELETE FROM logins WHERE username = ?", [username], (err) => {
      if (err) {
        return db.run("ROLLBACK", () => {
          callback(err);
        });
      }
    });

    db.run("DELETE FROM user WHERE username = ?", [username], (err) => {
      if (err) {
        return db.run("ROLLBACK", () => {
          callback(err);
        });
      } else {
        db.run("COMMIT", (err) => {
          callback(err);
        });
      }
    });
  });
};
// تابع برای اعطای دسترسی
module.exports.grantAccess = (username, accessType, duration) => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `
      DELETE FROM access 
      WHERE username = ? AND access_type = ?
    `;
    
    db.run(deleteQuery, [username, accessType], (err) => {
      if (err) {
        return reject(err);
      }

      const insertQuery = `
        INSERT INTO access (username, access_type, expiration_duration) 
        VALUES (?, ?, ?)
      `;
      
      db.run(insertQuery, [username, accessType, duration], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  });
};

module.exports.getUserAccess = (username, accessType) => {
  return new Promise((resolve, reject) => {
    const currentTime = Date.now();
    const query = `
      SELECT * FROM access 
      WHERE username = ? AND access_type = ? 
    `;

    db.get(query, [username, accessType], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (row) {
          const expirationTime = new Date(row.created_at).getTime() + row.expiration_duration * 60 * 60 * 1000;
          if (currentTime < expirationTime) {
            resolve(row);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }
    });
  });
};

// تابع برای گرفتن اطلاعات یوزرها
module.exports.getUsers = (callback) => {
  db.all("SELECT * FROM user", (err, rows) => {
    callback(err, rows);
  });
};

// تابع برای حذف دسترسی‌های منقضی شده
module.exports.cleanExpiredAccess = () => {
  return new Promise((resolve, reject) => {
    const currentTime = Date.now();
    const query = 
      `DELETE FROM access 
      WHERE (strftime('%s', ?) - strftime('%s', created_at)) > expiration_duration * 3600
    ;`
    
    db.run(query, [currentTime,], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes); // تعداد ردیف‌های حذف شده
      }
    });
  });
};