const express = require('express');
const router = express.Router();
const Crop = require('../models/cropModel');

// GET: Fetch all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a new crop
router.post('/', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const newCrop = new Crop(req.body);
    const savedCrop = await newCrop.save();
    res.status(201).json({ message: 'Crop listed successfully!', crop: savedCrop });
  } catch (error) {
    console.error('DETAILED MONGOOSE ERROR:', error.message); // <-- This will show the exact reason in your terminal
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;