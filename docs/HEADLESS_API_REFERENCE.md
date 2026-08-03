# ResellerPro Headless Platform - Complete API Reference & Developer Guide

> **Official Headless API Reference Specification for Custom Next.js Web Application Integration.**  
> *Use this documentation to build any custom, uniquely designed Next.js storefront powered by ResellerPro.*

---

## 🔐 Base URL & Authentication

### Base URL
```
https://app.resellerpro.in/api/v1/headless
```
*(For local development: `http://localhost:3000/api/v1/headless`)*

### Authentication Header
Every HTTP request **MUST** include the `Authorization` header with your store's secret API key:
```http
Authorization: Bearer rp_live_xxxxxxxxxxxxxxxxxxxxxxxxx
```

> [!IMPORTANT]
> **API Key Rules:**
> - Never expose `RESELLERPRO_API_KEY` on the browser client side.
> - Call these APIs strictly from your custom Next.js **Server Components**, **Server Actions**, or **API Routes** (`src/app/api/...`).

---

## 🖼️ Media & Image Storage Guidelines (Cloudinary / Custom Buckets)

ResellerPro uses a **Decoupled URL Architecture** for all media assets (product images, banners, logos, category icons).

- **Host Anywhere**: Custom websites can host images on their **own Cloudinary account**, AWS S3 bucket, Vercel Blob, or any custom CDN.
- **Pass Full URLs**: ResellerPro only stores and transmits the full public HTTPS image URL string (e.g. `https://res.cloudinary.com/your-brand/image/upload/v12345/product.jpg`).
- **Benefits**:
  1. **Zero Storage Charges**: Bandwidth is offloaded to your Cloudinary CDN.
  2. **Auto Optimization**: Take advantage of Cloudinary's dynamic image resizing and WebP/AVIF formatting directly in your custom Next.js storefront!

---

## 📊 Summary of API Endpoints

| HTTP Method | Endpoint Path | Description |
| :--- | :--- | :--- |
| `GET` | `/store` | Store profile, logo, business details & connected domain |
| `GET` | `/products` | Catalog products (supports filtering, search & pagination) |
| `GET` | `/products/[id]` | Single product details view |
| `GET` | `/categories` | List of active store product categories |
| `GET` | `/search` | Fast product search by keyword |
| `GET` | `/homepage` | Hero banner slides & homepage theme layout JSON |
| `POST` | `/cart/validate` | Validate cart items, stock quantities & calculate subtotal |
| `GET` | `/shipping-rates` | Active store shipping options & threshold rules |
| `POST` | `/orders` | Submit new customer order & auto-link customer record |
| `GET` | `/orders/[id]` | Order details and fulfillment tracking by ID or Order Number |
| `GET` | `/customers` | Fetch store customer profiles & lookup by phone number |
| `POST` | `/customers` | Create or update customer contact details & shipping address |
| `GET` | `/analytics` | Merchant store GMV and sales statistics summary |

---

## 🚀 Detailed API Endpoints & cURL Examples

---

### 1. Get Store Profile
Fetch store branding, logo, business name, and connected domain.

- **Method**: `GET`
- **Endpoint**: `/api/v1/headless/store`
- **Headers**: `Authorization: Bearer rp_live_...`

#### cURL Example:
```bash
curl -X GET "https://app.resellerpro.in/api/v1/headless/store" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678"
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "store": {
    "id": "4934d9be-8cdb-4b62-b0ab-a40dcbfaa943",
    "shop_slug": "rashidstore",
    "business_name": "Griva Fashion",
    "shop_description": "Premium Quality Clothing & Apparel",
    "shop_logo_url": "https://supabase.co/storage/v1/object/public/store-assets/logo.png",
    "store_mode": "headless",
    "connected_domain": "https://grivafashion.com"
  }
}
```

---

### 2. Get Products Catalog
Fetch published products with optional category filter, search query, limit, and offset.

- **Method**: `GET`
- **Endpoint**: `/api/v1/headless/products`
- **Query Parameters**:
  - `category` *(optional)*: Filter by category name (e.g. `Shirts`)
  - `search` *(optional)*: Search term matching product name
  - `limit` *(optional, default 50)*: Number of items to return
  - `offset` *(optional, default 0)*: Pagination offset

#### cURL Example:
```bash
curl -X GET "https://app.resellerpro.in/api/v1/headless/products?category=Shirts&limit=10" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678"
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "e8a9b2c3-1234-5678-90ab-cdef12345678",
      "user_id": "4934d9be-8cdb-4b62-b0ab-a40dcbfaa943",
      "name": "Cotton Casual Shirt",
      "description": "100% pure cotton breathable casual shirt",
      "category": "Shirts",
      "selling_price": 799,
      "cost_price": 400,
      "stock_quantity": 45,
      "stock_status": "in_stock",
      "image_url": "https://supabase.co/storage/v1/object/public/product-images/shirt.jpg",
      "is_active": true,
      "created_at": "2026-08-01T10:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

---

### 3. Get Single Product Details
Fetch complete details for a specific product by product ID.

- **Method**: `GET`
- **Endpoint**: `/api/v1/headless/products/[id]`

#### cURL Example:
```bash
curl -X GET "https://app.resellerpro.in/api/v1/headless/products/e8a9b2c3-1234-5678-90ab-cdef12345678" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678"
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "e8a9b2c3-1234-5678-90ab-cdef12345678",
    "name": "Cotton Casual Shirt",
    "description": "100% pure cotton breathable casual shirt",
    "category": "Shirts",
    "selling_price": 799,
    "stock_quantity": 45,
    "image_url": "https://supabase.co/storage/v1/object/public/product-images/shirt.jpg"
  }
}
```

#### Error Response (`404 Not Found`):
```json
{
  "error": "Product not found"
}
```

---

### 4. Get Product Categories
Fetch list of distinct active categories configured in store.

- **Method**: `GET`
- **Endpoint**: `/api/v1/headless/categories`

#### cURL Example:
```bash
curl -X GET "https://app.resellerpro.in/api/v1/headless/categories" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678"
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "categories": ["Shirts", "Pants", "Footwear", "Accessories"]
}
```

---

### 5. Search Products
Perform keyword search across product catalog.

- **Method**: `GET`
- **Endpoint**: `/api/v1/headless/search?q=cotton`

#### cURL Example:
```bash
curl -X GET "https://app.resellerpro.in/api/v1/headless/search?q=cotton" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678"
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "query": "cotton",
  "data": [ ... ],
  "total": 3
}
```

---

### 6. Validate Cart & Calculate Subtotal
Server-side validation of customer shopping cart items, verifying stock availability and calculating accurate subtotal using real database prices.

- **Method**: `POST`
- **Endpoint**: `/api/v1/headless/cart/validate`
- **Headers**: `Content-Type: application/json`

#### Request Body:
```json
{
  "items": [
    { "product_id": "e8a9b2c3-1234-5678-90ab-cdef12345678", "quantity": 2 }
  ]
}
```

#### cURL Example:
```bash
curl -X POST "https://app.resellerpro.in/api/v1/headless/cart/validate" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"product_id": "e8a9b2c3-1234-5678-90ab-cdef12345678", "quantity": 2}]}'
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "valid": true,
    "subtotal": 1598,
    "items": [
      {
        "product_id": "e8a9b2c3-1234-5678-90ab-cdef12345678",
        "name": "Cotton Casual Shirt",
        "unit_price": 799,
        "quantity": 2,
        "total_price": 1598,
        "image_url": "https://supabase.co/storage/v1/object/public/product-images/shirt.jpg"
      }
    ],
    "out_of_stock": []
  }
}
```

---

### 7. Submit Customer Order
Place a customer order directly into ResellerPro's order management and CRM.

- **Method**: `POST`
- **Endpoint**: `/api/v1/headless/orders`
- **Headers**: `Content-Type: application/json`

#### Request Body:
```json
{
  "customer_name": "Rahul Kumar",
  "customer_phone": "9876543210",
  "customer_email": "rahul@example.com",
  "shipping_address": "123 MG Road, Indiranagar",
  "shipping_city": "Bengaluru",
  "shipping_state": "Karnataka",
  "shipping_pincode": "560038",
  "payment_method": "cod",
  "notes": "Please deliver after 5 PM",
  "items": [
    { "product_id": "e8a9b2c3-1234-5678-90ab-cdef12345678", "quantity": 1 }
  ]
}
```

#### cURL Example:
```bash
curl -X POST "https://app.resellerpro.in/api/v1/headless/orders" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Rahul Kumar",
    "customer_phone": "9876543210",
    "shipping_address": "123 MG Road",
    "payment_method": "cod",
    "items": [{"product_id": "e8a9b2c3-1234-5678-90ab-cdef12345678", "quantity": 1}]
  }'
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "order": {
    "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    "order_number": "ORD-1722534567890",
    "user_id": "4934d9be-8cdb-4b62-b0ab-a40dcbfaa943",
    "customer_id": "a9b8c7d6-5432-10fe-dcba-9876543210fe",
    "status": "pending",
    "payment_status": "cod",
    "payment_method": "cod",
    "subtotal": 799,
    "total_amount": 799,
    "created_at": "2026-08-02T00:00:00Z"
  }
}
```

---

### 8. Track Order Status
Fetch order details and line items by Order ID or Order Number.

- **Method**: `GET`
- **Endpoint**: `/api/v1/headless/orders/[id]`

#### cURL Example:
```bash
curl -X GET "https://app.resellerpro.in/api/v1/headless/orders/ORD-1722534567890" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678"
```

---

### 9. Get Customers List & Lookup
Fetch customer list or lookup a customer by phone number.

- **Method**: `GET`
- **Endpoint**: `/api/v1/headless/customers`
- **Query Parameters**:
  - `phone` *(optional)*: Filter by customer phone number (e.g., `9876543210`)

#### cURL Example:
```bash
curl -X GET "https://app.resellerpro.in/api/v1/headless/customers?phone=9876543210" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678"
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "a9b8c7d6-5432-10fe-dcba-9876543210fe",
      "user_id": "4934d9be-8cdb-4b62-b0ab-a40dcbfaa943",
      "name": "Rahul Kumar",
      "phone": "9876543210",
      "email": "rahul@example.com",
      "address_line1": "123 MG Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560038",
      "total_orders": 3,
      "total_spent": 2499
    }
  ]
}
```

---

### 10. Create or Update Customer Profile
Create a new customer or update an existing customer's contact and shipping address details.

- **Method**: `POST`
- **Endpoint**: `/api/v1/headless/customers`
- **Headers**: `Content-Type: application/json`

#### Request Body:
```json
{
  "name": "Rahul Kumar",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "whatsapp": "9876543210",
  "address_line1": "123 MG Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560038"
}
```

#### cURL Example:
```bash
curl -X POST "https://app.resellerpro.in/api/v1/headless/customers" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Kumar",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "address_line1": "123 MG Road",
    "city": "Bengaluru",
    "pincode": "560038"
  }'
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "a9b8c7d6-5432-10fe-dcba-9876543210fe",
    "name": "Rahul Kumar",
    "phone": "9876543210",
    "email": "rahul@example.com",
    "address_line1": "123 MG Road",
    "city": "Bengaluru",
    "pincode": "560038"
  }
}
```

---

### 11. Get Store Analytics Summary
Fetch total GMV sales, order count, active products count, and total customers.

- **Method**: `GET`
- **Endpoint**: `/api/v1/headless/analytics`

#### cURL Example:
```bash
curl -X GET "https://app.resellerpro.in/api/v1/headless/analytics" \
  -H "Authorization: Bearer rp_live_a1b2c3d4e5f678901234567890abcdef12345678"
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "total_sales": 154800,
    "total_orders": 142,
    "total_products": 28,
    "total_customers": 98
  }
}
```

---

## ⚡ Error Codes & HTTP Status Matrix

| Status Code | Reason | Cause |
| :--- | :--- | :--- |
| `401 Unauthorized` | Missing / Invalid API Key | Authorization header missing or key hash not found |
| `403 Forbidden` | Headless Mode Disabled | Store mode is currently set to `standard` |
| `404 Not Found` | Resource Not Found | Product ID or Order Identifier does not exist |
| `400 Bad Request` | Validation Error | Missing required fields or out of stock items |
| `500 Server Error` | Internal Server Error | Database failure or unhandled exception |

---

## 💡 How AI Coding Assistants (e.g., Antigravity) Can Use This File to Build a Custom Website

If you provide this `HEADLESS_API_REFERENCE.md` file to an AI coding assistant (like Antigravity or Cursor), ask it:

> *"Build a custom Next.js storefront for my e-commerce website using the ResellerPro Headless API documentation in `docs/HEADLESS_API_REFERENCE.md`. Configure environment variable `RESELLERPRO_API_KEY` and create server components to render product listings, product details, cart drawer, and order checkout."*

The AI assistant will instantly generate a 100% custom-designed Next.js frontend integrated with your ResellerPro backend!
