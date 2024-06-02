const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');
const router = express.Router();
const cors = require('cors');


router.use(cors())
router.post('/register', registerUser);
router.post('/login', authUser);

module.exports = router;
