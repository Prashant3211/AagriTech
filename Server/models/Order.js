const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  resourceName: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending Approval', 'Processing', 'Dispatched', 'Delivered'], 
    default: 'Pending Approval' 
  },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);