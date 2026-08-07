-- ==============================================================================
-- MIGRATION: Add UPI Account Name and Payment Instructions to Profiles
-- DATE: 2026-08-07
-- DESCRIPTION: Adds upi_name and upi_instructions columns to profiles table
--              so resellers can specify their GPay / UPI account details.
-- ==============================================================================

ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "upi_name" VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS "upi_instructions" TEXT DEFAULT NULL;

COMMENT ON COLUMN "public"."profiles"."upi_name" IS 'GPay / UPI Account Holder Name (e.g. Royal Fashion Store)';
COMMENT ON COLUMN "public"."profiles"."upi_instructions" IS 'Custom payment note for UPI / GPay transfers';
