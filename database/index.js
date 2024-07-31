const { Sequelize, Op } = require('sequelize');
const path = require('path');
const bcrypt = require('bcrypt');
// =============================================================

// connect to database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.db')
});

// models
const User = require('../models/user')(sequelize);
const Access = require('../models/access')(sequelize);
const Login = require('../models/login')(sequelize);
const Download = require("../models/download")(sequelize);

// relationships
User.associate({ Access, Login });
Access.associate({ User });
Login.associate({ User });
Download.associate({ User });

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = {
  sequelize,
  models: {
    User,
    Access,
    Login
  },

  checkUser: async (username, password, callback) => {
    try {
        const user = await User.findOne({ where: { username } });
      if (!user) {
        return callback(null, false);
      }
        const match = await bcrypt.compare(password, user.password);
      return callback(null, match ? { username: user.username, role: user.role } : false);
    } catch (err) {
      return callback(err);
    }
  },

  signupUser: async (username, password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashedPassword, role: "user" });
      return { username: user.username, role: user.role };
    } catch (err) {
      throw new Error(err);
    }
  },

  signupAdmin: async (username, password, role, callback) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, password: hashedPassword, role });
      callback(null);
    } catch (err) {
      callback(err);
    }
  },

  insertLogin: (username, loginTime, device, ip, browser, callback) => {
    Login.create({ username, loginTime, device, ip, browser })
      .then(() => callback(null))
      .catch(callback);
  },
  
  getLoginHistory: (callback) => {
    Login.findAll({
      include: [{ model: User, attributes: ['username', 'role'] }],
      order: [['loginTime', 'DESC']]
    })
    .then(rows => callback(null, rows))
    .catch(callback);
  },

  deleteUser: async (username, callback) => {
    try {
      await sequelize.transaction(async (t) => {
        await Access.destroy({ where: { username }, transaction: t });
        await Login.destroy({ where: { username }, transaction: t });
        await User.destroy({ where: { username }, transaction: t });
      });
      callback(null);
    } catch (err) {
      callback(err);
    }
  },

  grantAccess: async (username, accessType, duration) => {
    try {
      await sequelize.transaction(async (t) => {
        await Access.destroy({ where: { username, access_type: accessType }, transaction: t });
        await Access.create({ username, access_type: accessType, expiration_duration: duration }, { transaction: t });
      });
      return;
    } catch (err) {
      throw new Error(err);
    }
  },

  getUserAccess: async (username, accessType) => {
    try {
      const access = await Access.findOne({ where: { username, access_type: accessType } });
      if (access) {
        const expirationTime = new Date(access.created_at).getTime() + access.expiration_duration * 60 * 60 * 1000;
        if (Date.now() < expirationTime) {
          return access;
        }
      }
      return null;
    } catch (err) {
      throw new Error(err);
    }
  },

  getUsers: (callback) => {
    User.findAll()
      .then(users => callback(null, users))
      .catch(callback);
  },

  cleanExpiredAccess: async () => {
    try {
      const currentTime = Math.floor(Date.now() / 1000);
  
      await Access.destroy({
        where: sequelize.literal(strftime('%s', 'now') - strftime('%s', created_at) > expiration_duration * 3600)
      });
    } catch (err) {
      throw new Error('Error cleaning expired access: ' + err.message);
    }
  },

  logDownload: async(username, directory) => {
    const existingLog = await Download.findOne({ where: { username, directory } });
  
    if (existingLog) {
      await existingLog.increment('downloadCount');
    } else {
      await Download.create({ username, directory });
    }
  },

  getFavoriteDirectory: async(username) => {
    const favorite = await Download.findOne({
      where: { username },
      order: [['downloadCount', 'DESC']],
    });
  
    return favorite ? favorite.directory : null;
  }
};
