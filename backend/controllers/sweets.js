// backend/controllers/sweets.js
const Sweet = require('../models/sweet');

// @desc    Create a new sweet
// @route   POST /api/sweets
exports.createSweet = async (req, res, next) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json({ success: true, data: sweet });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.getAllSweets = async (req, res, next) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json({ success: true, count: sweets.length, data: sweets });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.deleteSweet = async (req, res, next) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ success: false, error: 'Sweet not found' });
    }

    await sweet.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.purchaseSweet = async (req, res, next) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ success: false, error: 'Sweet not found' });
    }

    if (sweet.quantity === 0) {
      return res.status(400).json({ success: false, error: 'Sweet is out of stock' });
    }

    // Use $inc to atomically decrease quantity
    const updatedSweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: -1 } },
      { new: true, runValidators: true } // 'new: true' returns the updated doc
    );

    res.status(200).json({ success: true, data: updatedSweet });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.restockSweet = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Please provide a valid amount' });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ success: false, error: 'Sweet not found' });
    }

    // Use $inc to atomically increase quantity
    const updatedSweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: amount } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedSweet });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.updateSweet = async (req, res, next) => {
  try {
    let sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ success: false, error: 'Sweet not found' });
    }

    // Update the sweet
    sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run mongoose validators on update
    });

    res.status(200).json({ success: true, data: sweet });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.searchSweets = async (req, res, next) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    
    // Build query object
    const query = {};

    if (name) {
      // 'i' for case-insensitive
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Handle price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice); // $gte = greater than or equal
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice); // $lte = less than or equal
      }
    }

    const sweets = await Sweet.find(query);

    res.status(200).json({ success: true, count: sweets.length, data: sweets });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};