const jwt = require('jsonwebtoken');
const User = require('../config/src/models/User');
const Token = require('../config/src/models/Token');

const JWT_SECRET = 'pedro_sudoku_token';

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }

    const tokenFromDB = await Token.findOne({ where: { token } });
    if (!tokenFromDB) {
      return res.status(401).json({ message: 'Not authorized, token not found in database' });
    }

    const user = await User.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, invalid user' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Not authorized, authentication failed' });
  }
};

module.exports = { protect };
