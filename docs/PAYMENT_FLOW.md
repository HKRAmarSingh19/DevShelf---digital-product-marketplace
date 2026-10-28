# DevShelf - Razorpay Payment & Entitlement Flow

```
Buyer             Frontend                  Backend                     Razorpay
  |                  |                         |                            |
  |--- Click Buy --->|                         |                            |
  |                  |--- POST /checkout ----->|                            |
  |                  |    { productIds: [...] }|                            |
  |                  |                         |-- 1. Validate items        |
  |                  |                         |-- 2. Recalculate total     |
  |                  |                         |-- 3. Create pending Order  |
  |                  |                         |-- 4. Create Gateway Order->|
  |                  |                         |<-- Gateway Order ID -------|
  |                  |<-- Return Order Info ---|                            |
  |                  |    (gatewayOrderId,     |                            |
  |                  |     amount, keyId)      |                            |
  |                  |                         |                            |
  |                  |-- Open Razorpay Modal ->|                            |
  |<-- Enter Card/UPI|                         |                            |
  |--- Submit Pay -->|                         |                            |
  |                  |<-- Payment Result ------|                            |
  |                  |    (paymentId, sig)     |                            |
  |                  |                         |                            |
  |                  |-- POST /payments/verify>|                            |
  |                  |                         |-- 1. HMAC-SHA256 signature |
  |                  |                         |      validation            |
  |                  |                         |-- 2. Mark Order = PAID     |
  |                  |                         |-- 3. Create Entitlements   |
  |                  |                         |-- 4. Record Commission     |
  |                  |<-- 200 OK (Entitled) ---|                            |
  |<-- View Library -|                         |                            |
```

## Webhook Fallback
If the user closes their browser before `/payments/verify` finishes, Razorpay sends a server-to-server webhook `payment.captured` with header `x-razorpay-signature`. The backend validates the signature over the raw request payload and applies the same idempotent payment completion logic.
