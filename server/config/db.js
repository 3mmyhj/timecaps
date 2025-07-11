const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// The caching mechanism can be simplified or adapted if needed for Express.
// For now, we'll keep a similar structure.
let cachedConnection = null;
let connectionPromise = null;

async function connectDB() {
  if (cachedConnection) {
    // console.log('Using cached database connection');
    return cachedConnection;
  }

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env or your environment configuration.'
    );
  }

  if (!connectionPromise) {
    const opts = {
      bufferCommands: false, // Consider if this is still needed or optimal for your Express setup
      useNewUrlParser: true, // Recommended by Mongoose
      useUnifiedTopology: true, // Recommended by Mongoose
    };

    // console.log('Attempting new MongoDB connection...');
    connectionPromise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      // console.log('MongoDB connected successfully via new promise.');
      return mongooseInstance;
    });
  }

  try {
    cachedConnection = await connectionPromise;
  } catch (e) {
    connectionPromise = null; // Reset promise on error
    // console.error('MongoDB connection error:', e);
    throw e;
  }

  return cachedConnection;
}

module.exports = connectDB;
