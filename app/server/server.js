const sequelize = require('../server/config/db'); 
const express = require('express');
const app = express();

const PORT = 5000;

app.use(express.json());

const userRoutes = require('../server/routes/authRoutes'); 
app.use('/user', userRoutes);

const gameRoutes = require('../server/routes/gameRoutes'); 
app.use('/game', gameRoutes);

app.get('/', (req, res) => {
  res.send('hello world');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error syncing models:', err);
});
