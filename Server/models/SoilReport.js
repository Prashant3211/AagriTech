const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
  farmer: { type: String, required: true },
  location: { type: String, required: true },
  phLevel: { type: Number, required: true },
  nitrogen: { type: String, required: true }, // e.g., 'Low', 'Medium', 'High'
  phosphorus: { type: String, required: true },
  potassium: { type: String, required: true },
  recommendation: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SoilReport', soilReportSchema);