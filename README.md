# DevShelf — Multi-Vendor Digital Product Marketplace

> **Tagline:** Create. Sell. Share. Grow.  
> **Tech Stack:** MERN (MongoDB, Express, React, Node.js) • TypeScript • Tailwind CSS • Razorpay

---

## 1. Project Overview
**DevShelf** combines the streamlined digital-product selling experience of Gumroad with the rich discovery and multi-vendor catalogue mechanics of a modern digital marketplace.

### User Roles:
- **Guest**: Browse, search, filter products by price, rating, and category. Inspect previews and verified reviews.
- **Buyer**: Instant cart & checkout, server-authoritative pricing, Razorpay payment processing, and lifetime access to private digital downloads via **My Library**.
- **Seller**: Creators publish boilerplates, ebooks, UI kits, and developer tools. Upload private product assets, publish versioned releases with changelogs, and track net earnings on a dedicated ledger.
- **Admin**: Review seller applications, moderate submitted products, inspect marketplace GMV, manage user accounts, and review immutable audit logs.

---

## 2. Architecture & Design Principles

```
                         DEVSHELF
                Digital Product Marketplace
                             |
              +--------------+--------------+
              |                             |
        React Frontend                External Services
    Vite + TypeScript + Tailwind       - Razorpay Gateway
              |                        - Private Storage (Local / S3)
              |                        - Email Provider (Console / SMTP)
              |
          HTTPS REST API (/api/v1)
              |
       Node.js + Express + TypeScript
              |
       +------+-----------------------------+
       |              |                    |
   Middleware      API Routes          Error Handler
       |              |
 Authentication    Controllers
 Authorization         |
 Validation         Services
 Rate Limiting         |
 Logging             Repositories
                         |
                      Mongoose
                         |
                      MongoDB
```

### Key Engineering Decisions:
1. **Zero-Trust Private Storage**: Paid product files are stored in private object storage, never in public web roots. Authorized buyers receive HMAC-signed download URLs that expire in 300 seconds (5 minutes).
2. **Server-Authoritative Pricing**: The frontend never dictates purchase prices. The backend calculates total paise from MongoDB records and creates gateway orders with cryptographic verification.
3. **Idempotent Webhooks & Ledger Deduplication**: Razorpay webhooks verify raw HMAC signatures and record unique event IDs to prevent duplicate credits or entitlement grants.
4. **Verified Reviews Only**: Buyers must own an active purchase entitlement before submitting ratings or reviews.
5. **IDOR & Ownership Enforcement**: Sellers can only modify products and versions belonging to their own account.
6. **Unified Monorepo**: Managed with `npm workspaces` separating `@devshelf/web`, `@devshelf/api`, and `@devshelf/shared`.

---

## 3. Directory Structure

```
DEVSHELF/
├── apps/
│   ├── web/                     # React 18 + Vite + TypeScript + Tailwind CSS
│   │   ├── src/
│   │   │   ├── app/             # Router and App entry
│   │   │   ├── components/      # Navbar, Footer, UI primitives
│   │   │   ├── pages/           # Home, Catalog, ProductDetail, Checkout, Dashboards
│   │   │   ├── services/        # Typed Axios API client
│   │   │   ├── stores/          # Zustand Auth and Cart stores
│   │   │   └── styles/          # Tailwind and glassmorphism styling
│   │   └── package.json
│   │
│   └── api/                     # Express + TypeScript + Mongoose backend
│       ├── src/
│       │   ├── app.ts           # Express app setup with Helmet, CORS, Sessions
│       │   ├── server.ts        # Server bootstrap and graceful shutdown
│       │   ├── config/          # Zod environment validation, MongoDB connection
│       │   ├── common/          # Central AppError, password utils, response helpers
│       │   ├── middleware/      # Session auth, role guards, Zod validators
│       │   ├── modules/         # Auth, Products, Checkout, Library, Reviews, Seller, Admin
│       │   ├── integrations/    # Razorpay and Private Storage adapters
│       │   └── scripts/         # Database seed and admin provisioning
│       ├── tests/               # Vitest hermetic in-memory test suite
│       └── package.json
│
├── packages/
│   └── shared/                  # Shared Zod schemas, TypeScript types, and constants
│
├── docs/                        # Complete technical documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── SECURITY.md
│   ├── PAYMENT_FLOW.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
│
├── .env.example
├── .editorconfig
└── package.json
```

---

## 4. Getting Started

### Prerequisites:
- **Node.js**: v20 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string
- **Browser**: Modern web browser (Chrome, Edge, Firefox, Safari)

### 1. Installation
```bash
# Clone the repository and install all workspace dependencies
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Default settings are pre-configured for instant zero-dependency local development with local storage emulation and Razorpay test mode).*

### 3. Seed Database & Admin Account
```bash
# Seed initial categories, creator seller account, and sample products
npm run seed

# Provision default administrator (email: admin@devshelf.io / password: DevshelfAdminSecure2026!)
npm run create-admin
```

### 4. Run Development Servers
```bash
# Run both Backend API (port 5000) and Frontend SPA (port 5173)
npm run dev

# Or run individually:
npm run dev:api
npm run dev:web
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/v1/health`

---

## 5. Automated Testing

All backend tests execute hermetically using `mongodb-memory-server` without requiring an external database:
```bash
npm run test
```

### Tested Scenarios:
- User registration, Argon2/Bcrypt password hashing, duplicate email prevention.
- Session cookie issuance, validation, and `/api/v1/auth/me` persistence.
- Product creation, seller ownership enforcement, and IDOR protection.
- Server-authoritative checkout calculation, test payment verification, and automated entitlement delivery to Buyer Library.
- Private signed download access verification and rejection of unauthorized non-purchasers.

---

## 6. License
Licensed under the MIT License.
DevShelf — Built with engineering discipline.
