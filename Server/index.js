const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication & Admin routes
app.use('/api/users', require('./routes/user'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch((err) => console.log('DB Connection Error:', err));

// --- CROP SCHEMA & API ---
const cropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: String, required: true },
  farmer: { type: String, required: true },
}, { timestamps: true });

const Crop = mongoose.models.Crop || mongoose.model('Crop', cropSchema);

app.get('/api/crops', async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/crops', async (req, res) => {
  try {
    const newCrop = new Crop(req.body);
    const savedCrop = await newCrop.save();
    res.status(201).json({ message: 'Crop listed successfully!', crop: savedCrop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// --- SOIL REPORTS SCHEMA & API ---
const SoilReport = require('./models/SoilReport');

app.get('/api/soil-reports', async (req, res) => {
  try {
    const reports = await SoilReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching soil reports', error: err.message });
  }
});

app.post('/api/soil-reports', async (req, res) => {
  try {
    const { farmer, location, phLevel, nitrogen, phosphorus, potassium, recommendation } = req.body;
    const newReport = new SoilReport({
      farmer, location, phLevel, nitrogen, phosphorus, potassium, recommendation
    });
    const savedReport = await newReport.save();
    res.status(201).json({ message: 'Soil report saved successfully', report: savedReport });
  } catch (err) {
    res.status(400).json({ message: 'Failed to save soil report', error: err.message });
  }
});


// --- PEST ALERTS SCHEMA & API ---
const PestAlert = require('./models/PestAlert');

app.get('/api/pest-alerts', async (req, res) => {
  try {
    const alerts = await PestAlert.find().sort({ dateIssued: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pest alerts', error: err.message });
  }
});

app.post('/api/pest-alerts', async (req, res) => {
  try {
    const { cropName, pestName, severity, description, solution } = req.body;
    const newAlert = new PestAlert({
      cropName, pestName, severity, description, solution
    });
    const savedAlert = await newAlert.save();
    res.status(201).json({ message: 'Pest alert created', alert: savedAlert });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create pest alert', error: err.message });
  }
});

// --- RESOURCE ORDERS SCHEMA & API ---
const Order = require('./models/Order');

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});


app.post('/api/orders', async (req, res) => {
  try {
    const { farmerName, resourceName, quantity, totalPrice } = req.body;
    const newOrder = new Order({
      farmerName, resourceName, quantity, totalPrice
    });
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (err) {
    res.status(400).json({ message: 'Failed to place order', error: err.message });
  }
});

// Admin endpoint to update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json({ message: 'Order status updated', order: updatedOrder });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update order status', error: err.message });
  }
});
// --- EXPERT CONSULTATION API ---
const Consultation = require('./models/Consultation');

app.get('/api/consultations', async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching consultations', error: err.message });
  }
});

app.post('/api/consultations', async (req, res) => {
  try {
    const { farmerName, topic, question } = req.body;
    const newConsultation = new Consultation({ farmerName, topic, question });
    const saved = await newConsultation.save();
    res.status(201).json({ message: 'Question submitted to experts!', consultation: saved });
  } catch (err) {
    res.status(400).json({ message: 'Failed to submit question', error: err.message });
  }
});


// --- COMMUNITY FORUM API ---
const ForumPost = require('./models/ForumPost');

app.get('/api/forum', async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forum posts', error: err.message });
  }
});

app.post('/api/forum', async (req, res) => {
  try {
    const { author, title, content } = req.body;
    const newPost = new ForumPost({ author, title, content });
    const saved = await newPost.save();
    res.status(201).json({ message: 'Forum post created', post: saved });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create post', error: err.message });
  }
});

app.post('/api/forum/:id/reply', async (req, res) => {
  try {
    const { replierName, replyText } = req.body;
    const post = await ForumPost.findById(req.params.id);
    post.replies.push({ replierName, replyText });
    await post.save();
    res.json({ message: 'Reply added successfully', post });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add reply', error: err.message });
  }
});


app.get('/', (req, res) => {
  res.send('AgriTech Server is running on port 8000!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});