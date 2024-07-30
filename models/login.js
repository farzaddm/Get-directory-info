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
    }
  });

  Login.associate = (models) => {
    Login.belongsTo(models.User, { foreignKey: 'username', targetKey: 'username' });
  };

  return Login;
};