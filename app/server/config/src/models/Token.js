const { DataTypes } = require('sequelize');
const sequelize = require('../../db');


const Token = sequelize.define('Token', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Token;
