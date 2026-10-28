# DevShelf - REST API Documentation

Base URL: `/api/v1`

All responses follow the unified envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message",
  "error": null
}
```

## Endpoints Summary

### Auth (`/api/v1/auth`)
- `POST /register`: Create a new user account.
- `POST /login`: Log in with email and password, establishing an HTTP-only session cookie.
- `POST /logout`: Invalidate session and clear cookie.
- `GET /me`: Return the currently authenticated user with roles and profile.
- `POST /forgot-password`: Request a password reset email token.
- `POST /reset-password`: Reset password using the reset token.

### Products & Categories (`/api/v1/products`, `/api/v1/categories`)
- `GET /categories`: List all categories with product counts.
- `GET /products`: List products with pagination, search, category filter, productType filter, price range, and sorting.
- `GET /products/:slug`: Get published product details with seller info and aggregated reviews.
- `POST /products`: (Seller only) Create a draft product.
- `PATCH /products/:id`: (Product Owner / Admin) Update product details.
- `POST /products/:id/submit-for-review`: Submit product for admin moderation.
- `POST /products/:id/versions`: (Product Owner) Publish a new semver version with changelog and storage key.
- `GET /products/:id/versions`: Get version history.

### Private Storage & Uploads (`/api/v1/uploads`)
- `POST /uploads/authorize`: Get an authorized upload token / signed URL for product file or preview upload.
- `POST /uploads/complete`: Validate uploaded file metadata and return verified storageKey.

### Cart & Checkout (`/api/v1/checkout`)
- `POST /checkout`: Calculate authoritative server price, create pending order and Razorpay order.
- `POST /payments/verify`: Verify Razorpay signature, mark order as paid, issue entitlements, and credit commission.
- `POST /payments/webhook`: Idempotent webhook receiver for Razorpay payment captures and refunds.

### Buyer Library & Downloads (`/api/v1/library`)
- `GET /library`: List all active entitlements with product metadata.
- `GET /library/:productId`: Get purchased product details, license info, and version list.
- `GET /library/:productId/download`: Authenticate buyer entitlement, record download event, and issue a short-lived signed download URL (expires in 5 minutes).

### Reviews (`/api/v1/products/:productId/reviews`)
- `GET /products/:productId/reviews`: Public list of reviews.
- `POST /products/:productId/reviews`: Create a verified-purchase review (requires active entitlement).

### Seller Dashboard (`/api/v1/seller`)
- `POST /seller/apply`: Submit seller application with bio and portfolio.
- `GET /seller/dashboard`: Overview metrics (sales count, gross earnings, net earnings).
- `GET /seller/products`: Manage products owned by this seller.
- `GET /seller/analytics`: Detailed sales and commission logs.

### Administration (`/api/v1/admin`)
- `GET /admin/overview`: Global marketplace metrics (total users, sellers, products, GMV).
- `GET /admin/users`: Manage user statuses (active/suspended).
- `GET /admin/sellers`: Review pending seller applications (approve/reject).
- `PATCH /admin/sellers/:id/decision`: Approve or reject seller.
- `GET /admin/products/pending`: Pending moderation queue.
- `PATCH /admin/products/:id/moderation`: Publish or reject submitted product.
- `GET /admin/audit-logs`: Review security and administrative audit trail.
