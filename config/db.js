const mongoose = require('mongoose');

// Cache the connection in the module-level scope (persists across hot lambdas)
let cachedConnection = null;

// Utility to mask the password in the MongoDB URI for safe logging
const maskUri = (uri) => {
  if (!uri) return 'undefined';
  try {
    const url = new URL(uri);
    if (url.password) {
      url.password = '****';
    }
    return url.toString();
  } catch (err) {
    // If it's not a valid URL format, just return a generic string to be safe
    return 'mongodb://[masked_credentials]@...';
  }
};

const connectDB = async () => {
  // If there's an active connection, reuse it
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // If there's a connection in progress, wait for it
  if (cachedConnection) {
    return cachedConnection;
  }

  let mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  // Set up mongoose event listeners only once
  if (!mongoose.connection.listeners('error').length) {
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err.message}`);
    });
  }

  if (!mongoose.connection.listeners('disconnected').length) {
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
  }

  const connectionOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    retryReads: true,
  };

  const attemptConnection = async (uri, isFallback = false) => {
    console.log(`Connecting to MongoDB${isFallback ? ' (using fallback)' : ''}...`);
    try {
      const conn = await mongoose.connect(uri, connectionOptions);
      console.log(`Connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`Connection failed for URI ${maskUri(uri)}`);
      console.error(`Reason for failure: ${error.message}`);
      throw error;
    }
  };

  try {
    // Initiate connection and cache the promise
    cachedConnection = attemptConnection(mongoUri);
    const conn = await cachedConnection;
    return conn.connection;
  } catch (error) {
    // If the initial connection fails and it's an SRV record, attempt fallback
    if (mongoUri.startsWith('mongodb+srv://') && (error.message.includes('ENOTFOUND') || error.message.includes('timeout') || error.message.includes('querySrv'))) {
      console.warn('Atlas SRV resolution failed. Attempting automatic fallback to mongodb:// protocol...');
      const fallbackUri = mongoUri.replace('mongodb+srv://', 'mongodb://');
      try {
        cachedConnection = attemptConnection(fallbackUri, true);
        const conn = await cachedConnection;
        return conn.connection;
      } catch (fallbackError) {
         console.error('Fallback connection also failed.');
         cachedConnection = null;
         throw fallbackError;
      }
    } else {
       cachedConnection = null; // Reset cache so retry is possible
       throw error;
    }
  }
};

module.exports = connectDB;
