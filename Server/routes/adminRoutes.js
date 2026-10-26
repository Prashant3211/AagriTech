
const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');
const User = require('../models/userModel');
const Crop = require('../models/cropModel');

// Test protected admin access
router.get(
  '/dashboard',
  verifyToken,
  requireAdmin,
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalCrops = await Crop.countDocuments();

      res.json({
        message: 'Welcome to Admin Dashboard',
        stats: {
          totalUsers,
          totalCrops
        }
      });
    } catch (error) {
      res.status(500).json({
        message: 'Could not load admin dashboard'
      });
    }
  }
);

module.exports = router;
