-- ==============================================================================
-- MIGRATION: Security Hardening, RLS Lockdown & Data Protection (SELF-HEALING)
-- DATE: 2026-11-04
-- PURPOSE: 
--   1. Self-healing: Ensures all required columns exist across any Supabase project (main or local)
--   2. Protects sensitive seller compliance data (PAN, GSTIN, Wallet Balance) from public queries
--   3. Hides wholesale cost_price & profit margins on products from public/competitor inspection
--   4. Removes unchecked public direct inserts on orders (enforces Server Action placeOrder)
--   5. Ensures store_analytics and shipping tables exist with proper RLS
-- ==============================================================================

-- 0. SELF-HEALING: Ensure profiles columns exist before setting permissions
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS shop_name TEXT,
ADD COLUMN IF NOT EXISTS shop_slug TEXT,
ADD COLUMN IF NOT EXISTS shop_logo_url TEXT,
ADD COLUMN IF NOT EXISTS shop_banner_url TEXT,
ADD COLUMN IF NOT EXISTS shop_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS shop_theme JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS shop_announcement TEXT,
ADD COLUMN IF NOT EXISTS shop_description TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS upi_id TEXT,
ADD COLUMN IF NOT EXISTS upi_name TEXT,
ADD COLUMN IF NOT EXISTS upi_instructions TEXT,
ADD COLUMN IF NOT EXISTS custom_domain TEXT,
ADD COLUMN IF NOT EXISTS custom_domain_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS custom_domain_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS store_mode TEXT DEFAULT 'standard';

-- 1. SECURE PROFILES: Column-Level Permissions for Anonymous Public Storefront
-- Anonymous shoppers only need store display data, not seller compliance or wallet data.
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT (
  id,
  full_name,
  business_name,
  business_address,
  avatar_url,
  shop_name,
  shop_slug,
  shop_logo_url,
  shop_banner_url,
  shop_status,
  shop_theme,
  shop_announcement,
  shop_description,
  whatsapp_number,
  upi_id,
  upi_name,
  upi_instructions,
  custom_domain,
  custom_domain_status,
  custom_domain_verified_at,
  store_mode,
  created_at,
  updated_at
) ON public.profiles TO anon;

-- Ensure users can still select and update their own full profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 2. SELF-HEALING: Ensure products columns exist before granting permissions
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC,
ADD COLUMN IF NOT EXISTS badge TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS total_sold INTEGER DEFAULT 0;

-- SECURE PRODUCTS: Hide Wholesale cost_price & profit margins from Public Anonymous Role
REVOKE ALL ON public.products FROM anon;
GRANT SELECT (
  id,
  user_id,
  name,
  description,
  image_url,
  category,
  selling_price,
  compare_at_price,
  badge,
  stock_status,
  stock_quantity,
  low_stock_threshold,
  total_sold,
  sku,
  images,
  created_at,
  updated_at
) ON public.products TO anon;

-- 3. SECURE ORDERS: Eliminate Unchecked Public Direct Inserts
-- Legitimate storefront orders are placed via Server Action placeOrder() using service_role.
DROP POLICY IF EXISTS "Allow public inserts on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public inserts on order_items" ON public.order_items;

-- 4. ENSURE STORE_ANALYTICS: Prevents PostgREST 404 errors during storefront tracking
CREATE TABLE IF NOT EXISTS public.store_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  referrer TEXT,
  device_type VARCHAR(20),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts on store_analytics" ON public.store_analytics;
CREATE POLICY "Allow public inserts on store_analytics" 
ON public.store_analytics 
FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Sellers can view own store analytics" ON public.store_analytics;
CREATE POLICY "Sellers can view own store analytics" 
ON public.store_analytics 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- 5. ENSURE SELLER SHIPPING CONFIGS TABLE (Shiprocket Courier Automation)
CREATE TABLE IF NOT EXISTS public.seller_shipping_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL DEFAULT 'shiprocket',
  email TEXT NOT NULL,
  password_encrypted TEXT,
  token TEXT,
  token_expires_at TIMESTAMPTZ,
  pickup_location TEXT,
  available_pickup_locations JSONB DEFAULT '[]'::jsonb,
  is_connected BOOLEAN DEFAULT false,
  is_test_mode BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_seller_shipping_provider UNIQUE (user_id, provider)
);

ALTER TABLE public.seller_shipping_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sellers can manage own shipping config" ON public.seller_shipping_configs;
CREATE POLICY "Sellers can manage own shipping config"
ON public.seller_shipping_configs
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure orders table has shipping columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS courier_partner VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_label_url TEXT,
ADD COLUMN IF NOT EXISTS shipment_id VARCHAR(100);
