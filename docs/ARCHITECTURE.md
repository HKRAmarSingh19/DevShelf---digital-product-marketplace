# DevShelf - System Architecture Document

## 1. Modular Monolith Architecture
DevShelf is designed as an enterprise-grade modular monolith within an npm workspaces monorepo:

```
                      DEVSHELF
             Digital Product Marketplace
                          |
           +--------------+--------------+
           |                             |
     React Frontend                External Services
    Vite + TypeScript              - Razorpay Gateway
    Tailwind CSS                   - Private S3 / Local Storage
           |                       - Email Provider (Console/SMTP)
           |
       REST API (/api/v1)
           |
    Node.js + Express + TypeScript
           |
    +------+-----------------------------+
    |              |                    |
Middleware     Controllers          Central Error Handler
    |              |
- Auth (Session) Services
- Authorize        |
- Validation   Repositories
- Rate Limit       |
- Request ID    Mongoose
                   |
                MongoDB
```

## 2. Monorepo Organization
- `apps/web`: Single Page Application (SPA) built with React 19 / 18, Vite, TypeScript, React Router, Tailwind CSS, Lucide icons, and TanStack Query.
- `apps/api`: REST API backend in Node.js, Express, TypeScript, Mongoose, Argon2id, and Pino logging.
- `packages/shared`: Shared Zod validation schemas, TypeScript contracts, and marketplace constants.
- `docs/`: Comprehensive technical, security, and deployment documentation.

## 3. Layered Design Pattern
1. **Routes (`*.routes.ts`)**: HTTP method bindings, path params, route guards, and validation middleware.
2. **Controllers (`*.controller.ts`)**: HTTP request parameter extraction, calling service methods, mapping to standard API JSON response envelope `{ success, data, message, error }`.
3. **Services (`*.service.ts`)**: Core business rules (e.g. price recalculation, entitlement verification, seller ownership checks, commission breakdown).
4. **Repositories / Models (`*.model.ts`)**: Mongoose schema definition, indexes, queries.
