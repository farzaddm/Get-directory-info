const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Login = sequelize.define('Login', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loginTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    device: {
      type: DataTypes.STRING, // اطلاعات user-agent مانند دستگاه
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING, // آدرس IP کاربر
      allowNull: false
    },
    browser: {
      type: DataTypes.STRING, // نوع مرورگر کاربر
      allowNull: false
    }
  });

  Login.associate = (models) => {
    Login.belongsTo(models.User, { foreignKey: 'username', targetKey: 'username' });
  };

  return Login;
};
