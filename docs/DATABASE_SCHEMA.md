# DevShelf - Database Schema & Data Models

All monetary values are stored in integer minor units (paise for INR).

## Collections & Key Indexes

### 1. `users`
- `_id`: ObjectId
- `name`: String
- `email`: String (lowercase, unique index)
- `passwordHash`: String (Argon2id)
- `role`: "USER" | "ADMIN"
- `sellerStatus`: "NOT_APPLIED" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"
- `status`: "ACTIVE" | "SUSPENDED" | "DELETED"
- `avatarUrl`: String
- `bio`: String
- `createdAt`: Date, `updatedAt`: Date

### 2. `categories`
- `_id`: ObjectId
- `name`: String
- `slug`: String (unique index)
- `description`: String
- `icon`: String

### 3. `products`
- `_id`: ObjectId
- `sellerId`: ObjectId (ref: User, index)
- `categoryId`: ObjectId (ref: Category, index)
- `title`: String
- `slug`: String (unique index)
- `description`: String
- `productType`: "SOURCE_CODE" | "EBOOK" | "COURSE" | "UI_KIT" | "TEMPLATE" | "DEVELOPER_TOOL" | "OTHER"
- `priceInPaise`: Number (integer minor unit)
- `currency`: "INR"
- `thumbnailUrl`: String
- `previewUrls`: [String]
- `status`: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED" (index)
- `averageRating`: Number (default 0)
- `reviewCount`: Number (default 0)
- `tags`: [String]
- `currentVersion`: String (e.g. "1.0.0")

### 4. `product_versions`
- `_id`: ObjectId
- `productId`: ObjectId (ref: Product, compound index with version)
- `version`: String (semver)
- `changelog`: String
- `storageKey`: String (private object path)
- `originalFilename`: String
- `fileSizeBytes`: Number
- `checksum`: String

### 5. `orders`
- `_id`: ObjectId
- `orderNumber`: String (unique index, e.g. "ORD-173000-XYZ")
- `buyerId`: ObjectId (ref: User, index)
- `items`: [{ productId, sellerId, titleSnapshot, unitPriceInPaise, quantity, licenseType }]
- `subtotalInPaise`: Number
- `discountInPaise`: Number
- `totalInPaise`: Number
- `currency`: "INR"
- `status`: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED"

### 6. `payments`
- `_id`: ObjectId
- `orderId`: ObjectId (ref: Order, index)
- `buyerId`: ObjectId (ref: User)
- `provider`: "RAZORPAY"
- `gatewayOrderId`: String (index)
- `gatewayPaymentId`: String
- `amountInPaise`: Number
- `status`: "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED"
- `verifiedAt`: Date

### 7. `entitlements`
- `_id`: ObjectId
- `buyerId`: ObjectId (ref: User, compound index with productId)
- `productId`: ObjectId (ref: Product)
- `orderId`: ObjectId (ref: Order)
- `licenseType`: "STANDARD" | "COMMERCIAL" | "EXTENDED"
- `status`: "ACTIVE" | "REVOKED"
- `purchasedAt`: Date

### 8. `reviews`
- `_id`: ObjectId
- `productId`: ObjectId (ref: Product, compound unique index with buyerId)
- `buyerId`: ObjectId (ref: User)
- `rating`: Number (1 to 5)
- `comment`: String
- `isVerifiedPurchase`: Boolean

### 9. `commissions`
- `_id`: ObjectId
- `orderId`: ObjectId (ref: Order)
- `sellerId`: ObjectId (ref: User, index)
- `grossSaleInPaise`: Number
- `platformFeeInPaise`: Number
- `netSellerAmountInPaise`: Number
- `currency`: "INR"
- `status`: "PENDING" | "AVAILABLE" | "PAID_OUT" | "REFUNDED"

### 10. `audit_logs`
- `_id`: ObjectId
- `userId`: ObjectId
- `userEmail`: String
- `action`: String
- `resource`: String
- `resourceId`: String
- `details`: Object
- `ipAddress`: String
- `createdAt`: Date
