-- ====================================================================
-- ResellerPro: Additive Product Variants & Options Schema Migration
-- Safe for Production (Zero Breaking Changes for Existing Single Products)
-- ====================================================================

-- 1. Create product_options table (defines option categories like "Size", "Color", "Weight", "Volume")
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- e.g. "Size", "Color", "Weight", "Volume"
  position INT DEFAULT 0,
  values TEXT[] NOT NULL DEFAULT '{}', -- e.g. ["S", "M", "L", "XL"]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create product_variants table (defines specific purchasable items/SKUs)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL, -- e.g. "Red / M", "500g", "128GB"
  sku VARCHAR(100),
  barcode VARCHAR(100),
  cost_price DECIMAL(10,2) DEFAULT 0,
  selling_price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  stock_quantity INT DEFAULT 0 NOT NULL,
  image_url TEXT,
  option_values JSONB NOT NULL DEFAULT '{}', -- e.g. {"Size": "M", "Color": "Red"}
  is_active BOOLEAN DEFAULT TRUE,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add non-breaking flag to products table (Defaults to FALSE)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS has_variants BOOLEAN DEFAULT FALSE NOT NULL;

-- 4. Extend order_items table to store variant snapshot information safely
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS variant_options JSONB DEFAULT '{}';

-- 5. Row Level Security (RLS) Policies
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Allow public read access to product options and variants (Storefront)
CREATE POLICY "Public read product options" ON product_options
  FOR SELECT USING (true);

CREATE POLICY "Public read product variants" ON product_variants
  FOR SELECT USING (true);

-- Allow authenticated owners to insert/update/delete their product options
CREATE POLICY "Owners manage product options" ON product_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_options.product_id 
      AND products.user_id = auth.uid()
    )
  );

-- Allow authenticated owners to insert/update/delete their product variants
CREATE POLICY "Owners manage product variants" ON product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_variants.product_id 
      AND products.user_id = auth.uid()
    )
  );

-- Indexes for maximum query performance
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON product_options(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
