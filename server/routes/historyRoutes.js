const express = require('express');
const router = express.Router();
const { getHistory, getHistoryById, deleteHistory, getStats, getLeaderboard } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getHistory);
router.get('/stats', protect, getStats);
router.get('/leaderboard/:domain', protect, getLeaderboard);
router.get('/:id', protect, getHistoryById);
router.delete('/:id', protect, deleteHistory);

module.exports = router;
