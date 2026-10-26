const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }
});

module.exports = mongoose.model('Admin', AdminSchema);