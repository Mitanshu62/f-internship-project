const mongoose = require('mongoose');

// Cache the connection in the module-level scope (persists across hot lambdas)
let cachedConnection = null;

const connectDB = async () => {
  // If there's an active connection, reuse it
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // If there's a connection in progress, wait for it
  if (cachedConnection) {
    return cachedConnection;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  // Set up mongoose event listeners only once
  if (!mongoose.connection.listeners('error').length) {
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
    });
  }

  if (!mongoose.connection.listeners('disconnected').length) {
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
  }

  try {
    // Initiate connection and cache the promise
    cachedConnection = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    const conn = await cachedConnection;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`MongoDB connection attempt failed: ${error.message}`);
    cachedConnection = null; // Reset cache so retry is possible
    throw error;
  }
};

module.exports = connectDB;
