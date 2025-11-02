// backend/routes/auth.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth');
const { protect } = require('../middleware/auth'); // Import the middleware

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Add this new protected route
router.get('/protected', protect, (req, res) => {
  // If 'protect' middleware passes, this will run
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;