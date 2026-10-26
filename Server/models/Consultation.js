const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  expertResponse: { type: String, default: 'Pending expert review...' },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', consultationSchema);