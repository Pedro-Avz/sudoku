const { DataTypes } = require('sequelize');
const User = require('./User');
const sequelize = require('../../db');


const Game = sequelize.define('Game', {
  id_game: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_jogador: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  time: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
});

Game.belongsTo(User, { foreignKey: 'id_jogador', as: 'player' });

module.exports = Game;
