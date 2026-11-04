-- ==============================================================================
-- MIGRATION: Shiprocket Courier Integration & Seller Shipping Automation
-- DATE: 2026-11-04
-- PURPOSE:
--   1. Stores per-seller Shiprocket credentials and registered pickup warehouses
--   2. Enables 1-Click Doorstep Pickup & Automatic AWB tracking label generation
--   3. Enforces strict Row Level Security (RLS) so sellers only see their own configs
-- ==============================================================================

-- 1. Create seller_shipping_configs table
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
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_seller_shipping_provider UNIQUE (user_id, provider)
);

-- 2. Enable RLS
ALTER TABLE public.seller_shipping_configs ENABLE ROW LEVEL SECURITY;

-- 3. Strict Seller Isolation Policy
DROP POLICY IF EXISTS "Sellers can manage own shipping config" ON public.seller_shipping_configs;
CREATE POLICY "Sellers can manage own shipping config"
ON public.seller_shipping_configs
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Extend orders table with shipment details
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS courier_partner VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_label_url TEXT,
ADD COLUMN IF NOT EXISTS shipment_id VARCHAR(100);

