const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: String, required: true },
  farmer: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);