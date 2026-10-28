# DevShelf - Application Security & Threat Model

## 1. Authentication & Session Security
- **Argon2id Hashing**: High memory and time cost parameters to resist GPU cracking. Plaintext passwords are never logged or stored.
- **HTTP-Only, SameSite Session Cookies**: Mitigates Cross-Site Scripting (XSS) token theft. Tokens are not accessible via `document.cookie` or browser localStorage.
- **CSRF Defense**: SameSite cookie policy, origin and referer header verification on mutating endpoints.
- **No Self-Privilege Escalation**: Roles (`ADMIN`) and seller status (`APPROVED`) cannot be mutated through registration or profile updates. Only authorized administrative endpoints can modify these states.

## 2. Private Digital Asset Protection
- **No Public Asset Exposure**: Paid digital files (source code archives, PDFs) are never located in public web directories or public CDN roots.
- **Storage Keys**: Server-generated randomized UUID/hash keys prevent path traversal and guessing attacks.
- **Entitlement Gate**: Every file download request executes an atomic entitlement lookup against the database for `(buyerId, productId, status='ACTIVE')`.
- **Short-Lived Signed URLs**: Authorized downloads provide signed URLs with a 300-second (5 minute) TTL.

## 3. Financial & Payment Integrity
- **Server-Authoritative Pricing**: The frontend sends product IDs. The server loads genuine product records from MongoDB, sums total paise, applies validated coupons, and creates the gateway order.
- **Cryptographic Signature Verification**: HMAC-SHA256 signature verification of `razorpay_order_id + "|" + razorpay_payment_id` against the server-kept `RAZORPAY_KEY_SECRET`.
- **Idempotency & Deduplication**: Webhooks and payment verifications check for existing processed payment records or entitlement states before applying actions.
