-- Migration: Add Headless Commerce fields to profiles table
-- Description: Supports Dual Mode Commerce Platform (Standard vs Headless Mode)

ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "store_mode" text DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS "api_key_hash" text,
ADD COLUMN IF NOT EXISTS "api_key_prefix" text,
ADD COLUMN IF NOT EXISTS "connected_domain" text,
ADD COLUMN IF NOT EXISTS "headless_updated_at" timestamp with time zone;

-- Index for quick lookup on API key authentication
CREATE INDEX IF NOT EXISTS "idx_profiles_api_key_hash" ON "public"."profiles" ("api_key_hash") WHERE "api_key_hash" IS NOT NULL;
