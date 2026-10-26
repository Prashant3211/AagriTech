const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  replies: [{
    replierName: String,
    replyText: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumPost', forumPostSchema);