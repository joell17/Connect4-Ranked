const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth authentication route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Store entire user_data in session
    req.session.user = req.user;

    // Use the origin from the request headers for the redirect
    const origin = req.headers.origin || 'http://localhost:3001';
    res.redirect(`${origin}/`); // Redirect to the origin of the request
  }
);

// Route to get the current user's data
router.get('/user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user); // Send user data from session
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout(() => {
      req.session.destroy(); // Destroy session after logging out
      res.json({ message: 'Logged out successfully' }); // Send a JSON response
    });
  });
  
  
  

module.exports = router;
