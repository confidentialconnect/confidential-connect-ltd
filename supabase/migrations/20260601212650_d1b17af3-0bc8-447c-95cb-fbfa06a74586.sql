
-- Extend products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS discount_price numeric,
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS external_link text,
  ADD COLUMN IF NOT EXISTS stock integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sku text;

-- Admin write policies for products
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;

-- Product categories
CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by everyone" ON public.product_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins manage categories" ON public.product_categories
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed default categories
INSERT INTO public.product_categories (name, slug, display_order) VALUES
  ('Admission Forms', 'admission-forms', 1),
  ('Educational Services', 'educational-services', 2),
  ('Student Support', 'student-support', 3),
  ('Business Promotion', 'business-promotion', 4),
  ('CAC Registration', 'cac-registration', 5),
  ('Document Processing', 'document-processing', 6),
  ('Opportunities', 'opportunities', 7),
  ('Scholarships', 'scholarships', 8),
  ('Internships', 'internships', 9),
  ('Jobs', 'jobs', 10),
  ('Remote Jobs', 'remote-jobs', 11),
  ('Digital Products', 'digital-products', 12),
  ('Business Services', 'business-services', 13),
  ('Marketing Services', 'marketing-services', 14),
  ('Consultancy', 'consultancy', 15),
  ('Other Services', 'other-services', 99)
ON CONFLICT (slug) DO NOTHING;

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Product images public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));
