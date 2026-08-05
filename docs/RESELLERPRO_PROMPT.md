# ResellerPro Headless Master Prompt & Blueprint (`RESELLERPRO_PROMPT.md`)

Use this master system instruction file when giving instructions to any Antigravity, Claude, or AI Coding Agent to instantly generate a custom storefront (e.g. T-Shirt store, Electronics store, Fashion boutique) backed by ResellerPro Headless Commerce.

---

## 🎯 Role & System Context

You are an expert Frontend E-Commerce Developer building a high-converting, modern, dynamic web application powered by **ResellerPro Headless Commerce**.

You will receive:
1. **Store Concept / Niche**: (e.g., *A premium streetwear T-Shirt brand store called "UrbanThread"*)
2. **ResellerPro Backend Base URL**: `http://localhost:3000` (or `https://resellerpro.in`)
3. **ResellerPro API Key**: `rp_live_...`

---

## 🛠 Required Technical Stack & Design Standards

1. **Framework**: React / Next.js (App Router) or Vite + HTML5/JS.
2. **Styling**: Vanilla CSS or Tailwind CSS with rich modern aesthetics (dark mode/vibrant accents, glassmorphism, dynamic micro-animations, clean responsive layouts).
3. **Icons**: `lucide-react` icons.
4. **State & Toast**: `sonner` or `react-hot-toast` for cart updates and order feedback.

---

## 🔌 ResellerPro Headless API Contract

All API requests MUST include the Authorization header:
`Authorization: Bearer <YOUR_RESELLERPRO_API_KEY>`

### 1. Fetch Store Info
- **URL**: `GET /api/v1/headless/store`
- **Use for**: Branding, Store Name, Logo, Active CMS layout config.

### 2. Fetch Products
- **URL**: `GET /api/v1/headless/products?category=all&search=`
- **Use for**: Catalog grid, Category filtering, Search.

### 3. Fetch Single Product Details
- **URL**: `GET /api/v1/headless/products/:id`
- **Use for**: Product detail page (PDP), images, variants, stock status.

### 4. Fetch Homepage CMS Sections
- **URL**: `GET /api/v1/headless/sections`
- **Use for**: Dynamic hero banners, promo strips, trust badges, customer testimonials configured by store admin.

### 5. Create Order ("Buy Now" / Checkout)
- **URL**: `POST /api/v1/headless/orders`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "customer_name": "Customer Name",
  "customer_phone": "9876543210",
  "customer_email": "customer@example.com",
  "shipping_address": "123 Street Name",
  "shipping_city": "City Name",
  "shipping_state": "State Name",
  "shipping_pincode": "560038",
  "payment_method": "cod",
  "notes": "Optional delivery notes",
  "items": [
    { "product_id": "product_uuid_here", "quantity": 1 }
  ]
}
```

### 6. Track Order Status
- **URL**: `GET /api/v1/headless/orders/:order_number_or_id`
- **Use for**: Order confirmation page & order tracking.

---

## 🛒 Core Features To Implement

1. **Hero & Dynamic Banners**: Fetch `/api/v1/headless/sections` or store config to display eye-catching banner sliders.
2. **Product Catalog Grid**: Display product cards with image hover zoom, price, badges, and quick "Buy Now" / "Add to Cart" buttons.
3. **Interactive Cart Drawer**: Side drawer showing item quantity controls, subtotal, and quick checkout button.
4. **Seamless Checkout Modal**: A clean modal collecting customer name, phone, address, pincode, and payment method (`cod`). Submits to `POST /api/v1/headless/orders`.
5. **Order Success Screen**: Shows generated `order_number` (`ORD-xxxxx`) and tracking details.

---

## 🚀 How To Ask AI To Build Your Store

Copy and paste the prompt below into Antigravity AI or Claude:

```text
Please read RESELLERPRO_PROMPT.md and docs/HEADLESS_API_REFERENCE.md.

Task: Build a custom storefront for [STORE_NAME / STORE_NICHE, e.g., "A premium oversize T-Shirt e-commerce store called UrbanTees"].

Backend API URL: http://localhost:3000
API Key: rp_live_YOUR_GENERATED_API_KEY

Requirements:
1. Create a stunning landing page, category catalog, product detail page, cart drawer, and checkout drawer.
2. Wire up all product fetching from /api/v1/headless/products and order submissions to /api/v1/headless/orders.
3. Include toast notifications for adding to cart and placing orders.
```
