const User = require('../config/src/models/User');
const Token = require('../config/src/models/Token'); // Importe o modelo Token
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const userExists = await User.findUserByUsername(username);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = await User.createUser(username, password);

    if (userId) {
      // Gerar o token JWT
      const token = generateToken(userId);

      // Salvar o token no banco de dados
      await Token.create({ token });

      res.status(201).json({
        _id: userId,
        username: username,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const authUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { username, password } });

    if (user) {
      
      const token = generateToken(user.id);

     
      await Token.create({ token });

      res.json({
        _id: user.id,
        username: user.username,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, authUser };
