const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

// Routes for user registration and login[cite: 7]
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected user profile endpoint[cite: 7]
router.get('/profile', verifyToken, async (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

module.exports = router;