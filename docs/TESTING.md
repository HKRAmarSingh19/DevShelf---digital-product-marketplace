# DevShelf - Automated Testing Strategy

## Test Suite Architecture
- **Framework**: Vitest
- **HTTP Assertions**: Supertest
- **In-Memory Database**: `mongodb-memory-server` for isolated, hermetic backend testing without external dependencies.
- **Mocking**: Razorpay client mock, object storage mock adapter, email console adapter.

## Test Matrix
1. **Authentication Tests**: Registration, duplicate email rejection, Argon2id validation, session cookies, logout.
2. **Product & Catalog Tests**: Creating products, seller ownership enforcement, price validation, public search.
3. **Cart & Checkout Tests**: Server-authoritative price summing, invalid item rejection, order creation.
4. **Payment & Signature Tests**: Valid HMAC-SHA256 signature verification, tampering detection, entitlement creation.
5. **Private Storage & Downloads**: Entitlement check before signed URL generation, denial of non-purchased downloads.
6. **Admin Moderation**: Seller approval, product publishing, non-admin access rejection.

## Running Tests
```bash
npm run test
```
