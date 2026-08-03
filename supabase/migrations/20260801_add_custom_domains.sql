-- ==============================================================================
-- MIGRATION: Custom Domains Support for Subscriptions
-- DATE: 2026-08-01
-- DESCRIPTION: Adds custom_domain, custom_domain_status, and custom_domain_verified_at
--              to the profiles table for ₹999 subscribers.
-- ==============================================================================

-- 1. Add columns to profiles table if they do not exist
ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "custom_domain" VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS "custom_domain_status" VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "custom_domain_verified_at" TIMESTAMPTZ;

-- 2. Create index on custom_domain for lightning-fast Edge Middleware resolution
CREATE INDEX IF NOT EXISTS "idx_profiles_custom_domain" ON "public"."profiles" ("custom_domain");

-- 3. Create index on shop_slug for Subdomain resolution
CREATE INDEX IF NOT EXISTS "idx_profiles_shop_slug" ON "public"."profiles" ("shop_slug");

-- 4. Add comment documentation for schema
COMMENT ON COLUMN "public"."profiles"."custom_domain" IS 'White-label custom domain for ₹999 subscribers (e.g., www.fashionhubstore.com)';
COMMENT ON COLUMN "public"."profiles"."custom_domain_status" IS 'Status of custom domain verification: pending | active | error';
