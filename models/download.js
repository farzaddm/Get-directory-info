const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Download = sequelize.define('Download', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  });

  Download.associate = (models) => {
    Download.belongsTo(models.User, { foreignKey: 'username', targetKey: 'username' });
  };

  return Download;
};