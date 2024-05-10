// userGameService.js

const UserGame = require('../models/UserGame');

// Add Game to User - Record when a user starts playing a game
const addGameToUser = async (userId, gameId, score, otherGameData) => {
  try {
    const newUserGame = new UserGame({
      user_id: userId,
      game_id: gameId,
      score,
      otherGameData,
    });

    await newUserGame.save();
    return { success: true, message: 'Game added to user successfully' };
  } catch (error) {
    console.error('Error adding game to user:', error);
    return { success: false, message: 'Error adding game to user' };
  }
};

// Update User's Game Data - Update user's game progress, scores, or other game-specific attributes
const updateGameData = async (userGameId, score, otherGameData) => {
  try {
    const userGame = await UserGame.findById(userGameId);
    if (!userGame) {
      return { success: false, message: 'User game not found' };
    }

    userGame.score = score;
    userGame.otherGameData = otherGameData;

    await userGame.save();
    return { success: true, message: 'User game data updated successfully' };
  } catch (error) {
    console.error('Error updating user game data:', error);
    return { success: false, message: 'Error updating user game data' };
  }
};

// Get User's Games - Retrieve a list of games a specific user is playing or has played
const getUserGames = async (userId) => {
  try {
    const userGames = await UserGame.find({ user_id: userId }).populate('game_id');
    return { success: true, userGames };
  } catch (error) {
    console.error('Error getting user games:', error);
    return { success: false, message: 'Error getting user games' };
  }
};

module.exports = {
  addGameToUser,
  updateGameData,
  getUserGames,
};