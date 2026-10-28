import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

async function bootstrap() {
  try {
    // 1. Connect to MongoDB
    await connectDatabase();

    // 2. Create Express app
    const app = createApp();

    // 3. Listen on configured port
    const server = app.listen(env.PORT, () => {
      logger.info(`DevShelf API server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`Health check available at: ${env.API_BASE_URL}/api/v1/health`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server closed. Process terminating.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error({ err: error }, 'Failed to start DevShelf server');
    process.exit(1);
  }
}

bootstrap();
