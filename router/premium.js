
const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controller/premiumcontroller');
const authenticate = require('../middleware/auth');

router.get('/api/leaderboard', authenticate.authenticateToken, (req, res, next) => {
    console.log('Received a request to /api/leaderboard');
    next(); 
}, getLeaderboard);

module.exports = router;

