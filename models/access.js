const { DataTypes } = require('sequelize');
// =============================================================

module.exports = (sequelize) => {
  const Access = sequelize.define('Access', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    access_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiration_duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Access.associate = (models) => {
    Access.belongsTo(models.User, { foreignKey: 'username', targetKey: 'username' });
  };

  return Access;
};