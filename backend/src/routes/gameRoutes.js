const express = require('express');
const router = express.Router();

module.exports = (matchmakingService) => {
  router.post('/join-matchmaking', (req, res) => {
    const user = req.session.user;

    // Check if the user is authenticated
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Add the user to the matchmaking queue
    matchmakingService.addToQueue(user);
    res.json({ message: 'Added to matchmaking queue' });
  });

  return router;
};
