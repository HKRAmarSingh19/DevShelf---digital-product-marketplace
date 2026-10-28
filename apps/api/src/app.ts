import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import { authRoutes } from './modules/auth/auth.routes.js';
import { categoryRoutes } from './modules/categories/category.routes.js';
import { productRoutes } from './modules/products/product.routes.js';
import { uploadRoutes } from './modules/uploads/upload.routes.js';
import { checkoutRoutes } from './modules/checkout/checkout.routes.js';
import { libraryRoutes } from './modules/library/library.routes.js';
import { reviewRoutes } from './modules/reviews/review.routes.js';
import { sellerRoutes } from './modules/seller/seller.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';

export function createApp() {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allows flexible SPA integration
    })
  );

  // 2. CORS configuration
  app.use(
    cors({
      origin: [env.WEB_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
    })
  );

  // 3. Request Logging
  app.use(
    (pinoHttp as any)({
      logger,
      autoLogging: env.NODE_ENV !== 'test',
    })
  );

  // 4. Raw body preservation for webhook signature verification
  app.use(
    express.json({
      verify: (req: Request, _res: Response, buf: Buffer) => {
        if (req.originalUrl.includes('/webhook')) {
          (req as any).rawBody = buf.toString();
        }
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // 5. Session Management (HTTP-only secure cookies)
  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // 6. Health check
  app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
      success: true,
      service: 'devshelf-api',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  });

  // 7. Mount Module Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/categories', categoryRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/products/:productId/reviews', reviewRoutes);
  app.use('/api/v1/uploads', uploadRoutes);
  app.use('/api/v1/checkout', checkoutRoutes);
  app.use('/api/v1/library', libraryRoutes);
  app.use('/api/v1/seller', sellerRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // 8. 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  // 9. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
