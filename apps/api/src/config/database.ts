import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase(uri?: string): Promise<typeof mongoose> {
  const dbUri = uri || env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to MongoDB');
    // If not in test environment, we don't throw to avoid crashing before demo/mock fallbacks if needed
    if (env.NODE_ENV === 'test') {
      throw error;
    }
    return mongoose;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
