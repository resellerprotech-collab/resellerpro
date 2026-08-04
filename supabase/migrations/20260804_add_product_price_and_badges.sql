-- ==============================================================================
-- MIGRATION: Add Original Price (compare_at_price) and Product Badges
-- DATE: 2026-08-04
-- DESCRIPTION: Adds compare_at_price (MRP / Strike Price) and badge columns
--              to products table for storefront badges and original price display.
-- ==============================================================================

ALTER TABLE "public"."products"
ADD COLUMN IF NOT EXISTS "compare_at_price" NUMERIC(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS "badge" VARCHAR(50) DEFAULT NULL;

COMMENT ON COLUMN "public"."products"."compare_at_price" IS 'Original price / MRP / Compare-at price for strikethrough display';
COMMENT ON COLUMN "public"."products"."badge" IS 'Product badge: best_seller, new_arrival, trending, hot_deal, out_of_stock, etc.';
