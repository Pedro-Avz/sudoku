const Game = require('../config/src/models/Game');
const User = require('../config/src/models/User');
const Token = require('../config/src/models/Token');

const saveGame = async (req, res) => {
  try {
    const {id_jogador, time } = req.body;

    if (!id_jogador || !time) {
      return res.status(400).json({ message: 'Game data is incomplete' });
    }

    const savedGame = await Game.create({id_jogador, time });

    res.status(200).json({ message: 'Game saved successfully', game: savedGame });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [{ model: User, as: 'player', attributes: ['username'] }],
    });
    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { saveGame, getAllGames };
