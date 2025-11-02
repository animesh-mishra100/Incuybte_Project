// backend/index.js
require('dotenv').config(); // Load .env variables
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

// Connect to Database
connectDB();

const app = express();

// Init Middleware
// This allows us to accept JSON data in the body of requests
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('Sweet Shop API Running!');
});

// Define Routes (we will create these soon)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sweets', require('./routes/sweets'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

// Export the 'app' and 'server' for our test file
module.exports = { app, server };