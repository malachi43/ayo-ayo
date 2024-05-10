// Update Leaderboard

const Leaderboard = require('../models/leaderboard');

const updateLeaderboard = async (req, res) => {
  const { userId, gameId, score } = req.body;

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
    res.status(200).json({ message: 'Leaderboard updated successfully' });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ message: 'Error updating leaderboard' });
  }
};

module.exports = {
  updateLeaderboard,
};


// Get Leaderboard

const getLeaderboard = async (req, res) => {
    const gameId = req.params.gameId;
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10, can be changed as needed
  
    try {
      const leaderboard = await Leaderboard.find({ game_id: gameId })
        .sort({ score: -1 })
        .limit(limit)
        .populate('user_id');
  
      res.status(200).json({ leaderboard });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      res.status(500).json({ message: 'Error getting leaderboard' });
    }
  };
  
  module.exports = {
    getLeaderboard,
  };

  // Get User's Position

  const getUserPosition = async (req, res) => {
    const userId = req.params.userId;
    const gameId = req.params.gameId;
  
    try {
      const userPosition = await Leaderboard.find({ game_id: gameId, user_id: userId })
        .sort({ score: -1 })
        .exec();
  
      const position = userPosition.findIndex(entry => entry.user_id.toString() === userId);
      res.status(200).json({ position });
    } catch (error) {
      console.error('Error getting user position:', error);
      res.status(500).json({ message: 'Error getting user position' });
    }
  };
  
  module.exports = {
    getUserPosition,
  };
  