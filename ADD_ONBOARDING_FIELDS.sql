-- ============================================================
-- ResellerPro: Onboarding Fields Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/<your-project>/editor/sql
-- ============================================================

-- Add onboarding metadata columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS business_type        text,
  ADD COLUMN IF NOT EXISTS business_categories  text[],
  ADD COLUMN IF NOT EXISTS store_slug           text,
  ADD COLUMN IF NOT EXISTS product_count_range  text;

-- Make store_slug unique (allow nulls)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'profiles' AND indexname = 'profiles_store_slug_unique'
  ) THEN
    CREATE UNIQUE INDEX profiles_store_slug_unique
      ON public.profiles (store_slug)
      WHERE store_slug IS NOT NULL;
  END IF;
END $$;

-- Note: shop_slug is the EXISTING public store link field (used in storefront routing)
-- store_slug is the new field collected during onboarding; after onboarding is completed
-- the onboarding action copies store_slug → shop_slug so the storefront continues to work.
