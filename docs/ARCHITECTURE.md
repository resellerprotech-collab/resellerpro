# ResellerPro System Architecture & Complete Flow Manual

> **Master Architecture Document & Operational Blueprint for ResellerPro E-Commerce OS, Subdomain Engine, and Headless Platform.**

---

## 📌 Executive Summary

**ResellerPro** has evolved from a simple manual WhatsApp CRM into a **complete E-Commerce Operating System (OS) and Multi-Tenant SaaS Platform**. It empowers merchants, resellers, and wholesalers to launch zero-code storefronts, process orders, manage inventory, send automated WhatsApp dispatch alerts, and optionally run custom bespoke headless web apps powered by ResellerPro's Headless APIs.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     RESELLERPRO PLATFORM ARCHITECTURE                           │
├───────────────────────────────┬──────────────────────────────────┬───────────────────────────────┤
│    STOREFRONT & ENGINE 1      │       CRM & OPERATING OS 2       │    HEADLESS PLATFORM 3        │
│   (Subdomain & Custom Domain) │    (Products, Orders, Customers)  │ (REST APIs & Ekodrix Admin)   │
├───────────────────────────────┼──────────────────────────────────┼───────────────────────────────┤
│ • *.resellerpro.in Subdomains │ • Product Catalog & Margin Calc  │ • Bearer Auth (rp_live_...)   │
│ • Custom Domains (Vercel/CF)  │ • Original Price (MRP Strikethrough)│ • /api/v1/headless/* REST API  │
│ • Cart & Self-Checkout        │ • Luxury Text Badges (No Emojis) │ • Website Request Workflow    │
│ • WhatsApp Order Dispatch     │ • 1-Click WhatsApp CRM Alerts    │ • Ekodrix Control Panel       │
└───────────────────────────────┴──────────────────────────────────┴───────────────────────────────┘
```

---

## 🏗️ 1. Core Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | React Server Components, Server Actions, Route Handlers, Custom Middleware. |
| **Language** | TypeScript (Strict) | End-to-end type safety across database models, API schemas, and UI components. |
| **Database & Auth** | Supabase PostgreSQL | Multi-tenant database with Row Level Security (RLS), real-time query engine, Auth. |
| **Routing & Subdomains** | Next.js Middleware | Dynamic rewrite engine (`*.resellerpro.in` ➔ `/store/[shopSlug]`). |
| **Styling & UI** | Vanilla CSS Tokens & Tailwind | Curated HSL color palette, Lucide React vector icons, Framer Motion animations. |
| **State Management** | Zustand & React Query | `useCartStore`, `useWishlistStore`, and optimistic React Query caching. |

---

## 🔄 2. Complete Product Flow & Evolution

### Evolution Journey
1. **Phase 1 (Legacy CRM)**: Simple manual product listings and WhatsApp text message sharing.
2. **Phase 2 (Integrated Zero-Code Storefront)**: Instant subdomains (`brand.resellerpro.in`), customer self-checkout cart, MRP strikethrough (`compare_at_price`), luxury badges, and automated WhatsApp order updates.
3. **Phase 3 (Headless Platform & CMS OS)**: Headless REST APIs (`/api/v1/headless/*`), API Key authentication (`rp_live_...`), Custom Website Request pipeline, and No-Code Store CMS Section Editor.

```mermaid
flowchart TD
    A[Merchant Registration] --> B[Set Business Name & Shop Slug]
    B --> C[Instant Live Storefront: shop.resellerpro.in]
    C --> D[Add Products with MRP & Luxury Badges]
    
    subgraph Mode 1: Standard Storefront
        D --> E1[Customer Self-Checkout on shop.resellerpro.in]
        E1 --> F1[Real-time CRM Order Notification]
    end

    subgraph Mode 2: Headless API Platform
        D --> E2[Merchant Requests Custom Website]
        E2 --> F2[Ekodrix Admin Approves & Generates API Key]
        F2 --> G2[External Custom Next.js App consumes /api/v1/headless/*]
    end

    F1 --> H[1-Click Dispatch & Automated WhatsApp Updates]
    G2 --> H
```

---

## 🌐 3. Subdomain Engine & Domain Architecture

### Routing Architecture (`src/middleware.ts`)
- **Main Platform**: `resellerpro.in` / `app.resellerpro.in`
  - Serves Landing Page, Authentication (`/login`, `/signup`), Merchant Dashboard (`/my-store`, `/products`, `/orders`, `/settings`).
- **Merchant Subdomains**: `[shopSlug].resellerpro.in`
  - Middleware intercepts `[shopSlug].resellerpro.in` and rewrites to `/store/[shopSlug]`.
- **Custom White-Label Domains**: `www.brand.com`
  - Managed via Vercel Domains API (`src/lib/domains/vercel.ts`) and Cloudflare Universal SSL.

---

## 🛍️ 4. Storefront & Catalog Features

### Product Pricing & Badges
- **Selling Price (`selling_price`)**: What the customer pays (e.g. ₹600).
- **Original Price / MRP (`compare_at_price`)**: Displayed with strikethrough (`~~₹900~~ ₹600`).
- **Automated Discount Percentage**: Storefront automatically calculates discount badges (`-33% OFF`).
- **Luxury Text Badges (No Raw Emojis)**:
  - `BEST SELLER`: Premium Rich Gold (`bg-amber-500 text-slate-950 font-black`)
  - `NEW ARRIVAL`: Deep Royal Blue (`bg-blue-600 text-white font-black`)
  - `TRENDING`: Crimson Red (`bg-red-600 text-white font-black`)
  - `HOT DEAL`: Deep Rose Red (`bg-rose-600 text-white font-black`)
  - `SPECIAL OFFER`: Onyx Black (`bg-slate-900 text-white font-black`)
- **Inventory & Stock**: Prominent **OUT OF STOCK** overlay & disabled cart button when stock quantity is 0 or status is `out_of_stock`.

---

## ⚡ 5. Headless Commerce API Engine

Merchants requiring custom bespoke websites can switch to **Headless Mode**. Custom frontends authenticate using Bearer API Keys generated in Ekodrix Admin Panel.

### Authentication & Headers
```http
Authorization: Bearer rp_live_12345678abcdef...
Content-Type: application/json
```

### Core Headless Endpoints (`/api/v1/headless/*`)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/headless/store` | `GET` | Fetch store profile, logo, currency, policies |
| `/api/v1/headless/products` | `GET` | Fetch paginated product catalog with category & badge filters |
| `/api/v1/headless/products/[id]` | `GET` | Fetch single product details and image gallery |
| `/api/v1/headless/categories` | `GET` | Fetch all active store product categories |
| `/api/v1/headless/cart/validate` | `POST` | Validate cart items, pricing, and live inventory levels |
| `/api/v1/headless/orders` | `POST` | Submit customer checkout order |
| `/api/v1/headless/orders/[id]` | `GET` | Track live order status & shipping info |
| `/api/v1/headless/homepage` | `GET` | Fetch CMS homepage layout sections & banners |
| `/api/v1/headless/analytics` | `GET` | Fetch store sales performance analytics |

---

## 🎛️ 6. No-Code CMS & Admin Control Panel

### Store CMS Section Editor (`/my-store/cms`)
- Merchants can add, edit, reorder, or toggle homepage promotional banners, hero sliders, feature callouts, and customer testimonials without writing code.

### Ekodrix Admin Panel (`/ekodrix-panel`)
- **Website Requests (`/ekodrix-panel/website-requests`)**: Admins review requests for custom sites, approve requests, switch store mode to `HEADLESS`, and issue/revoke API Keys.

---

## 🔒 7. Security & Database Migrations

### Database Schema Updates (`supabase/migrations/`)
- `20260801_backfill_shop_slugs.sql`: Generates unique shop slugs for existing profiles.
- `20260802_add_headless_commerce_fields.sql`: Adds `store_mode` and API Key fields.
- `20260803_create_cms_sections.sql`: Creates `cms_sections` table.
- `20260803_create_custom_website_requests.sql`: Creates `custom_website_requests` table.
- `20260804_add_product_price_and_badges.sql`: Adds `compare_at_price` (MRP) and `badge` columns to `products` table.
