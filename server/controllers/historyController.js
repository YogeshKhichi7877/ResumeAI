const History = require('../models/History');
const Analysis = require('../models/Analysis');

// @desc    Get user's analysis history
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('analysisId');

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single history entry
// @route   GET /api/history/:id
// @access  Private
const getHistoryById = async (req, res) => {
  try {
    const history = await History.findById(req.params.id).populate('analysisId');

    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }

    // Check if user owns this history
    if (history.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this history' });
    }

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete history entry
// @route   DELETE /api/history/:id
// @access  Private
const deleteHistory = async (req, res) => {
  try {
    const history = await History.findById(req.params.id);

    if (!history) {
      return res.status(404).json({ message: 'History not found' });
    }

    // Check if user owns this history
    if (history.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this history' });
    }

    // Delete associated analysis
    await Analysis.findByIdAndDelete(history.analysisId);
    
    // Delete history entry
    await history.deleteOne();

    res.json({ message: 'History deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's stats
// @route   GET /api/history/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id });
    
    const totalAnalyses = history.length;
    const scores = history.filter(h => h.score !== undefined).map(h => h.score);
    
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    
    const bestScore = scores.length > 0 
      ? Math.max(...scores)
      : 0;

    // Get domain counts
    const domainCounts = {};
    history.forEach(h => {
      domainCounts[h.targetDomain] = (domainCounts[h.targetDomain] || 0) + 1;
    });

    const favoriteDomain = Object.keys(domainCounts).length > 0
      ? Object.keys(domainCounts).reduce((a, b) => domainCounts[a] > domainCounts[b] ? a : b)
      : null;

    res.json({
      totalAnalyses,
      averageScore,
      bestScore,
      favoriteDomain
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard/benchmark for a domain
// @route   GET /api/history/leaderboard/:domain
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const { domain } = req.params;
    const { score } = req.query;

    // Get all analyses for the specified domain
    const allAnalyses = await Analysis.find({ targetDomain: domain }).select('score userId');
    
    if (allAnalyses.length === 0) {
      return res.json({
        totalUsers: 0,
        percentile: 0,
        betterThan: 0,
        message: 'No data available for this domain yet'
      });
    }

    // Calculate percentile
    const scores = allAnalyses.map(a => a.score).filter(s => s !== undefined);
    const sortedScores = [...scores].sort((a, b) => a - b);
    
    let percentile = 0;
    if (score !== undefined) {
      const userScore = parseInt(score);
      const countBelow = sortedScores.filter(s => s < userScore).length;
      percentile = Math.round((countBelow / sortedScores.length) * 100);
    }

    const totalUsers = allAnalyses.length;
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    res.json({
      totalUsers,
      percentile,
      betterThan: percentile,
      averageScore,
      highestScore,
      lowestScore,
      domain,
      message: score !== undefined 
        ? `Your resume is better than ${percentile}% of ${domain.replace('-', ' ')} resumes`
        : 'Leaderboard data retrieved'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHistory,
  getHistoryById,
  deleteHistory,
  getStats,
  getLeaderboard
};
