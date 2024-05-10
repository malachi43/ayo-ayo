// Add Game to User

const UserGame = require('../models/UserGame');

const addGameToUser = async (req, res) => {
  const { userId, gameId, score, otherGameData } = req.body;

  try {
    const newUserGame = new UserGame({
      user_id: userId,
      game_id: gameId,
      score,
      otherGameData,
    });

    await newUserGame.save();
    res.status(201).json({ message: 'Game added to user successfully' });
  } catch (error) {
    console.error('Error adding game to user:', error);
    res.status(500).json({ message: 'Error adding game to user' });
  }
};

module.exports = {
  addGameToUser,
};

// Update User's Game Data
const updateGameData = async (req, res) => {
    const { userGameId, score, otherGameData } = req.body;
  
    try {
      const userGame = await UserGame.findById(userGameId);
      if (!userGame) {
        return res.status(404).json({ message: 'User game not found' });
      }
  
      userGame.score = score;
      userGame.otherGameData = otherGameData;
  
      await userGame.save();
      res.status(200).json({ message: 'User game data updated successfully' });
    } catch (error) {
      console.error('Error updating user game data:', error);
      res.status(500).json({ message: 'Error updating user game data' });
    }
  };
  
  module.exports = {
    updateGameData,
  };

  // Get User's Games

  const getUserGames = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const userGames = await UserGame.find({ user_id: userId }).populate('game_id');
      res.status(200).json({ userGames });
    } catch (error) {
      console.error('Error getting user games:', error);
      res.status(500).json({ message: 'Error getting user games' });
    }
  };
  
  module.exports = {
    getUserGames,
  };
  