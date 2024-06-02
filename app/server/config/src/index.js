const sequelize = require('../config/db');
const Models = require('./models');

(async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database synchronization failed:', error.message);
  }
})();
