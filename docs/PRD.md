# DevShelf - Product Requirements Document (PRD)

## 1. Executive Summary
**Project Name:** DevShelf  
**Tagline:** Create. Sell. Share. Grow.  
**Project Type:** Multi-vendor digital product marketplace.  
**Core Stack:** MERN (MongoDB, Express, React, Node.js) + TypeScript, Tailwind CSS, Razorpay.

DevShelf blends the streamlined creator selling experience of Gumroad with the marketplace discovery and multi-vendor catalogue mechanics of modern digital storefronts.

## 2. User Roles & Capabilities
1. **Guest**:
   - Browse, search, filter, and sort products by category, rating, and price.
   - View public product detail pages, seller profiles, and verified reviews.
   - Sign up and log in securely.
2. **Buyer**:
   - Add digital products to cart.
   - Initiate checkout with server-authoritative pricing.
   - Complete payments using Razorpay (test/live mode).
   - Access personal **Buyer Library** with instant lifetime access to purchased items.
   - Request signed short-lived download links for private files.
   - Access updated versions and changelogs.
   - Leave verified-purchase reviews (1-5 stars + detailed review).
3. **Seller**:
   - Single-account model: Any authenticated buyer can apply to become a seller.
   - Manage digital products: drafts, submit for admin moderation, publish, edit.
   - Upload private product assets (source code zips, ebooks, course assets) and public preview images.
   - Publish versioned releases (v1.0.0, v1.1.0) with changelogs.
   - Access Seller Analytics: sales volume, gross revenue, platform commission ledger, net earnings.
   - Manage public seller storefront.
4. **Admin**:
   - Access protected administration dashboard.
   - Moderate seller applications (approve/reject).
   - Moderate product submissions (publish/reject/archive).
   - User account status management (active/suspended).
   - Audit logs for security-sensitive administrative operations.

## 3. Product Categories & Types
- **Source Code & Templates**: React, Next.js, MERN full-stack boilerplates, backend APIs.
- **E-books & Guides**: Architecture guides, developer career roadmaps, PDF cheat-sheets.
- **UI Kits & Design Assets**: Figma systems, icon packs, dashboard design assets.
- **Courses & Tutorials**: Structured developer education and video packs.
- **Developer Tools**: CLI utilities, docker compose stacks, automation scripts.

## 4. Monetization & Commission Model
- Platform fee: Default 10% marketplace commission on every sale.
- Integer minor units: All prices and financial records stored as paise (INR) to eliminate floating-point calculation errors.
- Financial ledger: Immutable recording of gross sales, commission deductions, and net seller balances.
