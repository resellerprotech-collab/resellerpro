-- Migration: Create custom_website_requests table
-- Description: Manages merchant requests for custom Ekodrix Next.js websites

CREATE TABLE IF NOT EXISTS "public"."custom_website_requests" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
  "status" text NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'development', 'testing', 'completed', 'rejected'
  "contact_phone" text,
  "contact_email" text,
  "business_name" text,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY ("id")
);

-- Index for user lookup and status filtering
CREATE INDEX IF NOT EXISTS "idx_custom_website_requests_user_id" ON "public"."custom_website_requests" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_custom_website_requests_status" ON "public"."custom_website_requests" ("status");

-- Enable Row Level Security
ALTER TABLE "public"."custom_website_requests" ENABLE ROW LEVEL SECURITY;
