-- ==============================================================================
-- MIGRATION: Backfill shop_slug for existing profiles
-- DATE: 2026-08-01
-- DESCRIPTION: Automatically generates a clean, unique shop_slug for existing
--              users whose shop_slug is NULL or empty.
-- ==============================================================================

UPDATE "public"."profiles"
SET "shop_slug" = LOWER(REGEXP_REPLACE(
  COALESCE(
    NULLIF(TRIM("business_name"), ''), 
    SPLIT_PART("email", '@', 1), 
    'shop'
  ), 
  '[^a-zA-Z0-9]', 
  '', 
  'g'
)) || '-' || SUBSTRING(id::text, 1, 4)
WHERE "shop_slug" IS NULL OR TRIM("shop_slug") = '';
