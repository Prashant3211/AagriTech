const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  pestName: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], default: 'Moderate' },
  description: { type: String, required: true },
  solution: { type: String, required: true },
  dateIssued: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PestAlert', pestAlertSchema);