const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello from MERN Time Capsule Backend!');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/entries', require('./routes/entryRoutes'));

// MongoDB Connection
const connectDB = require('./config/db');

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('MongoDB connected successfully.');
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1); // Exit process with failure
});

module.exports = app; // For potential testing or programmatic use
