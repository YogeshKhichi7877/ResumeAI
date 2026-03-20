const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', (req, res, next) => {
  console.log('[ROUTE] POST /api/auth/register hit');
  console.log('[ROUTE] Body:', req.body);
  register(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('[ROUTE] POST /api/auth/login hit');
  login(req, res, next);
});
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
