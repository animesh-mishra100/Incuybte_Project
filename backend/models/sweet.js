// backend/models/Sweet.js
const mongoose = require('mongoose');

const SweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
    default: 0,
  },
  // We can add a user field to track who added it,
  // but for simplicity, we'll skip it for now.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Sweet', SweetSchema);