import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or local
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_BASE_URL: z.string().default('http://localhost:5000'),
  WEB_ORIGIN: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/devshelf'),
  SESSION_SECRET: z.string().default('devshelf_default_development_secret_min_32_chars_ok!'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_placeholder_key'),
  RAZORPAY_KEY_SECRET: z.string().default('placeholder_secret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('placeholder_webhook_secret'),
  STORAGE_PROVIDER: z.enum(['local', 's3', 'r2']).default('local'),
  STORAGE_LOCAL_DIR: z.string().default('./storage/local'),
  S3_REGION: z.string().default('auto'),
  S3_BUCKET: z.string().default('devshelf-storage'),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  EMAIL_PROVIDER: z.enum(['console', 'smtp']).default('console'),
  EMAIL_FROM: z.string().default('noreply@devshelf.io'),
  LOG_LEVEL: z.string().default('info'),
});

export const env = envSchema.parse(process.env);
