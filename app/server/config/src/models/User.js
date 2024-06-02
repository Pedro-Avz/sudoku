const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

User.createUser = async function(username, password) {
    try {
      const user = await User.create({ username, password });
      return user.id;
    } catch (error) {
      console.error(error);
      throw new Error('Error creating user');
    }
  };
  
User.findUserByUsername = async function(username) {
    try {
      const user = await User.findOne({ where: { username: username } });
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Error finding user by username');
    }
  };

  User.findUserById = async function(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Error finding user by id');
    }
  };

module.exports = User;
