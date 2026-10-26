const Crop = require('../models/cropModel');

// Get all crops
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new crop
exports.createCrop = async (req, res) => {
  try {
    const newCrop = new Crop(req.body);
    const savedCrop = await newCrop.save();
    res.status(201).json({ message: 'Crop listed successfully!', crop: savedCrop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};