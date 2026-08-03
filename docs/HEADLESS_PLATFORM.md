# ResellerPro Headless Platform - Internal Developer Documentation

> **Official Guide & Standard Operating Manual for Ekodrix Developers, Architects, and Engineers.**

---

## ⚡ Quick Start Guide (5 Minutes)

Follow these 7 steps to create a custom website for a client:

1. **Step 1: Create Merchant Account** -> Register merchant account in ResellerPro and complete standard onboarding.
2. **Step 2: Submit & Approve Request** -> Merchant clicks **Request Custom Website** in `/my-store` OR Ekodrix Admin approves the request under `/ekodrix-panel/website-requests`.
3. **Step 3: Generate API Key** -> Ekodrix Admin generates an API Key (`rp_live_...`). Copy the secret key.
4. **Step 4: Clone Starter Project** -> Clone the official Ekodrix Next.js starter repository.
5. **Step 5: Configure `.env.local`** -> Set `RESELLERPRO_API_KEY=rp_live_...` and `RESELLERPRO_API_URL=https://app.resellerpro.in`.
6. **Step 6: Run & Develop** -> Execute `npm run dev` and connect components to `/api/v1/headless/*`.
7. **Step 7: Deploy & Connect Domain** -> Push to client's GitHub, deploy on Vercel, and enter custom domain in Ekodrix Admin settings.

---

## 1. Platform Overview

### What is ResellerPro?
ResellerPro is a multi-tenant e-commerce SaaS platform designed for resellers, wholesalers, and retail store owners. It provides centralized merchant capabilities: product catalogs, tier-based pricing (retail/wholesale/reseller), inventory management, customer CRM, Razorpay & manual payment processing, shipping rates, and order fulfillment.

### Standard Stores vs. Headless Stores

| Aspect | Standard Store (Mode 1) | Headless Store (Mode 2) |
| :--- | :--- | :--- |
| **Presentation** | Built-in ResellerPro storefront (`/store/[shopSlug]`) | External Next.js custom website (built by Ekodrix) |
| **Store Builders** | Visual Hero Builder, Homepage Builder, Theme Settings active | Visual builders hidden; Headless Settings active |
| **Data Engine** | ResellerPro Supabase PostgreSQL DB | ResellerPro Supabase PostgreSQL DB (via Internal APIs) |
| **CRM & Orders** | ResellerPro Admin Dashboard | ResellerPro Admin Dashboard |

### Business Model
Standard merchants receive zero-code storefronts directly out of the box. Premium clients request bespoke custom websites. The Ekodrix engineering team builds custom Next.js websites consuming ResellerPro's Internal APIs, allowing merchants to manage inventory and fulfillment 100% inside ResellerPro without changing their operational workflow.

---

## 2. Merchant Journey

```mermaid
flowchart LR
    A[Registration] --> B[Onboarding]
    B --> C[Standard Merchant Dashboard]
    C --> D[Add Products & Categories]
    D --> E[Click 'Request Custom Website']
    E --> F[Ekodrix Admin Approval]
    F --> G[Headless Mode & API Key Active]
    G --> H[Orders & Inventory Managed in ResellerPro]
```

1. **Registration & Onboarding**: Merchant signs up, inputs business details, logo, and phone number.
2. **Catalog Setup**: Adds products, stock quantities, tier pricing, and categories.
3. **Custom Website Request**: Clicks **Request Custom Website** in the merchant dashboard.
4. **Admin Approval**: Ekodrix team approves request, activating Headless Mode and API Keys.
5. **Operation**: Merchant processes incoming orders and inventory strictly inside ResellerPro.

---

## 3. Custom Website Request Workflow

```
Merchant Dashboard                         Ekodrix Admin Panel
┌────────────────────────┐                ┌────────────────────────┐
│ Request Custom Website │ ───────►───────│ Pending Review List    │
└────────────────────────┘                └───────────┬────────────┘
                                                      │
                                                      ▼ Approve
                                          ┌────────────────────────┐
                                          │ Store Mode = HEADLESS  │
                                          │ Generate API Key       │
                                          └───────────┬────────────┘
                                                      │
                                                      ▼
Ekodrix Developer                                     │
┌────────────────────────┐                            │
│ Clone Starter & Dev    │ ◄──────────────────────────┘
│ Deploy to Vercel       │
└────────────────────────┘
```

---

## 4. Admin Workflow & Controls

Ekodrix Admins manage requests and API Keys under **`/ekodrix-panel/website-requests`**:

- **Approve Request**: Switches `store_mode` to `headless` and generates the store's initial API Key.
- **Manage API Keys**:
  - **View Prefix**: Inspect key prefix (e.g. `rp_live_12345678`).
  - **Generate / Regenerate**: Instantly revokes existing key and produces a new secret key.
  - **Revoke**: Disables API access for the store.
- **Domain Mapping**: Binds external domain (e.g. `https://brandstore.com`).

---

## 5. Developer Workflow (Step-by-Step)

1. **Clone Starter**:
   ```bash
   git clone https://github.com/ekodrix/resellerpro-nextjs-starter.git client-store
   cd client-store
   npm install
   ```
2. **Set Environment Variables (`.env.local`)**:
   ```env
   RESELLERPRO_API_URL=https://app.resellerpro.in
   RESELLERPRO_API_KEY=rp_live_xxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. **Connect API Endpoints**:
   ```typescript
   const res = await fetch(`${process.env.RESELLERPRO_API_URL}/api/v1/headless/products`, {
     headers: { Authorization: `Bearer ${process.env.RESELLERPRO_API_KEY}` }
   })
   const { data } = await res.json()
   ```
4. **Deploy**: Push repository to client's GitHub and connect to Vercel.

---

## 6. Headless Authentication (`RESELLERPRO_API_KEY`)

- **Format**: `rp_live_` followed by 24 random crypto hex bytes (e.g., `rp_live_a1b2c3d4e5f678901234567890abcdef12345678`).
- **Storage**: Only the **SHA-256 hash** (`api_key_hash`) is stored in the database (`profiles`). Raw keys are displayed **once** upon generation.
- **Header**:
  ```http
  Authorization: Bearer rp_live_xxxxxxxxxxxxxxxxxxxxxxxxx
  ```
- **Validation**: Server computes SHA-256 hash of Bearer token, looks up `profiles.api_key_hash`, confirms `store_mode === 'headless'`, and scopes database queries to `user_id`.

---

## 7. Internal API Reference (`/api/v1/headless/*`)

### 1. Store Details
- **Endpoint**: `GET /api/v1/headless/store`
- **Auth**: Required (`Bearer rp_live_...`)
- **Response**:
  ```json
  {
    "success": true,
    "store": {
      "id": "uuid",
      "shop_slug": "brandstore",
      "business_name": "Brand Store",
      "store_mode": "headless",
      "connected_domain": "https://brandstore.com"
    }
  }
  ```

### 2. Product Catalog
- **Endpoint**: `GET /api/v1/headless/products`
- **Query Params**: `category`, `search`, `limit`, `offset`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      { "id": "uuid", "name": "Product A", "selling_price": 499, "stock_quantity": 50 }
    ],
    "meta": { "total": 1, "limit": 50, "offset": 0 }
  }
  ```

### 3. Cart Validation & Calculation
- **Endpoint**: `POST /api/v1/headless/cart/validate`
- **Body**:
  ```json
  { "items": [{ "product_id": "uuid", "quantity": 2 }] }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": { "valid": true, "subtotal": 998, "items": [...] }
  }
  ```

### 4. Create Order
- **Endpoint**: `POST /api/v1/headless/orders`
- **Body**:
  ```json
  {
    "customer_name": "John Doe",
    "customer_phone": "9876543210",
    "shipping_address": "123 Main St",
    "payment_method": "cod",
    "items": [{ "product_id": "uuid", "quantity": 1 }]
  }
  ```

---

## 8. Project Structure

```
resellerpro/
├── docs/HEADLESS_PLATFORM.md      # Headless Technical Guide
├── supabase/migrations/           # SQL Migrations
├── src/
│   ├── app/
│   │   ├── (dashboard)/           # Merchant Dashboard
│   │   ├── ekodrix-panel/         # Admin Panel & Website Requests
│   │   └── api/v1/headless/       # Internal REST API Layer
│   ├── lib/
│   │   ├── auth/headless-auth.ts  # Bearer Token Guard
│   │   ├── security/api-keys.ts   # Key Generator & SHA-256 Hashing
│   │   └── services/commerce/     # Unified Business Logic Layer
```

---

## 9. Security & Tenant Isolation

1. **Database Row Isolation**: All queries inside `src/lib/services/commerce/` filter explicitly by `user_id` equal to the validated store owner ID.
2. **SHA-256 Hashing**: API keys are hashed before lookup; database leaks will never expose valid API tokens.
3. **No Direct Supabase Access**: External websites interact only with ResellerPro API routes—never Supabase directly.

---

## 10. Future Public Developer Platform Roadmap

Because all business logic is encapsulated inside standard TypeScript service functions in `src/lib/services/commerce/`, publishing public developer APIs in the future requires **zero database or backend changes**:
- Add rate-limiting middleware (`upstash/ratelimit`).
- Expose public developer API key generation in merchant settings.
- Point public routes directly to the existing unified service layer!
