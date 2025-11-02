// backend/routes/sweets.js
const express = require('express');
const router = express.Router();
const { createSweet, getAllSweets, deleteSweet, purchaseSweet, restockSweet, updateSweet, searchSweets } = require('../controllers/sweets');
const { protect, isAdmin } = require('../middleware/auth'); // Import our middleware


// Add the route, protected by our 'protect' middleware
router.route('/').post(protect, createSweet).get(protect, getAllSweets);
router.route('/:id').put(protect, isAdmin, updateSweet).delete(protect, isAdmin, deleteSweet);
router.route('/search').get(protect, searchSweets);
router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, isAdmin, restockSweet);
module.exports = router;