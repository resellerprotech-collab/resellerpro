-- Migration: Create cms_sections table for Modular CMS Architecture
-- Description: Stores ordered, typed, reusable content sections per store tenant

CREATE TABLE IF NOT EXISTS "public"."cms_sections" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
  "section_type" text NOT NULL, -- e.g. 'hero', 'categories', 'featured_products', 'promotional_banner', 'testimonials', 'why_choose_us', 'offer_strip', 'cta_section', 'newsletter'
  "label" text, -- Human-readable display name for editor UI
  "is_enabled" boolean NOT NULL DEFAULT true,
  "sort_order" integer NOT NULL DEFAULT 0,
  "content" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
  "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY ("id"),
  CONSTRAINT "uni_cms_sections_user_type" UNIQUE ("user_id", "section_type")
);

-- Indexes for performant lookup & ordering
CREATE INDEX IF NOT EXISTS "idx_cms_sections_user_id" ON "public"."cms_sections" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_cms_sections_user_sort" ON "public"."cms_sections" ("user_id", "sort_order" ASC);

-- Enable Row Level Security
ALTER TABLE "public"."cms_sections" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow sellers full access to their cms_sections" ON "public"."cms_sections";
CREATE POLICY "Allow sellers full access to their cms_sections"
  ON "public"."cms_sections" FOR ALL TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow public read access to cms_sections" ON "public"."cms_sections";
CREATE POLICY "Allow public read access to cms_sections"
  ON "public"."cms_sections" FOR SELECT TO public
  USING (true);
