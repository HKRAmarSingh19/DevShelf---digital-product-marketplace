# DevShelf - Production Deployment Guide

## 1. Prerequisites
- Node.js 20+ LTS
- MongoDB Atlas cluster (M0 or higher) with replica set support
- Cloud storage bucket: AWS S3 or Cloudflare R2
- Razorpay account (API Key & Secret, Webhook Secret)
- Domain with TLS (HTTPS) certificate

## 2. Environment Setup
Configure server environment variables matching `.env.example`:
- `NODE_ENV=production`
- `PORT=5000`
- `WEB_ORIGIN=https://devshelf.yourdomain.com`
- `API_BASE_URL=https://api.devshelf.yourdomain.com`
- `SESSION_SECRET=high_entropy_random_64_character_hex_string`
- `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/devshelf?retryWrites=true&w=majority`
- `STORAGE_PROVIDER=s3`
- `S3_REGION=ap-south-1`
- `S3_BUCKET=devshelf-production-assets`
- `S3_ACCESS_KEY_ID=...`
- `S3_SECRET_ACCESS_KEY=...`
- `RAZORPAY_KEY_ID=rzp_live_...`
- `RAZORPAY_KEY_SECRET=...`
- `RAZORPAY_WEBHOOK_SECRET=...`

## 3. Build & Run
```bash
npm install
npm run build
npm run start --workspace=@devshelf/api
```
Deploy the frontend bundle (`apps/web/dist`) to a static CDN host (Vercel, Cloudflare Pages, or Nginx).
