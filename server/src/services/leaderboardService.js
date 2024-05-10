// leaderboardService.js

const Leaderboard = require('../models/leaderboard');

// Update Leaderboard when a user achieves a new score in a game
const updateLeaderboard = async (userId, gameId, score) => {
  try {
    let leaderboardEntry = await Leaderboard.findOne({ user_id: userId, game_id: gameId });

    if (!leaderboardEntry) {
      leaderboardEntry = new Leaderboard({
        user_id: userId,
        game_id: gameId,
        score,
      });
    } else {
      leaderboardEntry.score = Math.max(leaderboardEntry.score, score); // Update score if new score is higher
    }

    await leaderboardEntry.save();
    return { success: true, message: 'Leaderboard updated successfully' };
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return { success: false, message: 'Error updating leaderboard' };
  }
};

// Get Leaderboard - Retrieve top scores for a specific game, possibly with pagination
const getLeaderboard = async (gameId, limit = 10) => {
  try {
    const leaderboard = await Leaderboard.find({ game_id: gameId })
      .sort({ score: -1 })
      .limit(limit)
      .populate('user_id');

    return { success: true, leaderboard };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return { success: false, message: 'Error getting leaderboard' };
  }
};

// Get User's Position on the leaderboard for a specific game
const getUserPosition = async (userId, gameId) => {
  try {
    const userPosition = await Leaderboard.find({ game_id: gameId, user_id: userId })
      .sort({ score: -1 })
      .exec();

    const position = userPosition.findIndex(entry => entry.user_id.toString() === userId);
    return { success: true, position };
  } catch (error) {
    console.error('Error getting user position:', error);
    return { success: false, message: 'Error getting user position' };
  }
};

module.exports = {
  updateLeaderboard,
  getLeaderboard,
  getUserPosition,
};