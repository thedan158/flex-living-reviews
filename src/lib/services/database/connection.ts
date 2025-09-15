import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://thedan671:toisinh2001@cluster0.j67bp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const USE_FALLBACK = process.env.USE_FALLBACK_DB === 'true' || !MONGODB_URI;

if (!MONGODB_URI && !USE_FALLBACK) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If fallback mode is enabled, skip MongoDB connection
  if (USE_FALLBACK) {
    console.log('Using fallback mode - MongoDB connection skipped');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
