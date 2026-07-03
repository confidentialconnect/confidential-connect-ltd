
CREATE TABLE public.pin_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  provider_card_type_id INTEGER NOT NULL,
  cost_price NUMERIC(12,2) NOT NULL,
  retail_price NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pin_products TO anon, authenticated;
GRANT ALL ON public.pin_products TO service_role;
ALTER TABLE public.pin_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active pin products" ON public.pin_products FOR SELECT USING (is_active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage pin products" ON public.pin_products FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_pin_products_updated_at BEFORE UPDATE ON public.pin_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.pin_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  paystack_reference TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  pin TEXT,
  serial TEXT,
  provider_response JSONB,
  error_message TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.pin_orders TO authenticated;
GRANT ALL ON public.pin_orders TO service_role;
ALTER TABLE public.pin_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own pin orders" ON public.pin_orders FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users create own pin orders" ON public.pin_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update pin orders" ON public.pin_orders FOR UPDATE USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_pin_orders_updated_at BEFORE UPDATE ON public.pin_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_pin_orders_user ON public.pin_orders(user_id, created_at DESC);
CREATE INDEX idx_pin_orders_status ON public.pin_orders(status);

INSERT INTO public.pin_products (slug, name, description, provider_card_type_id, cost_price, retail_price, sort_order) VALUES
  ('waec-result-checker','WAEC Result Checker PIN','Check your WAEC result online instantly.',1,5140,5700,1),
  ('neco-token','NECO Result Token','Check your NECO result online instantly.',2,2000,2250,2),
  ('nabteb-result-checker','NABTEB Result Checker PIN','Check your NABTEB result online instantly.',3,820,950,3),
  ('waec-verification','WAEC Verification PIN','Verify a WAEC certificate online.',4,5350,5900,4),
  ('nbais-result-checker','NBAIS Result Checker PIN','Check your NBAIS result online instantly.',5,1220,1400,5),
  ('neco-everification-student','NECO e-Verification (Student)','NECO electronic result verification for students.',11,5850,6450,6);
