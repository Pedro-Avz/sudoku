const express = require('express');
const router = express.Router();
const { saveGame } = require('../controllers/gameController');
const { getAllGames } = require('../controllers/gameController');
const { protect } = require('../middlewares/authMiddleware');
const cors = require('cors');

router.use(cors())

router.post('/save', protect, saveGame); 

router.get('/rank', protect, getAllGames);


module.exports = router;
