DROP POLICY IF EXISTS "Anyone can view active pin products" ON public.pin_products;
DROP POLICY IF EXISTS "Admins manage pin products" ON public.pin_products;

CREATE POLICY "Visitors view active pin products"
ON public.pin_products
FOR SELECT
TO anon
USING (is_active = true);

CREATE POLICY "Signed-in users view active or administered pin products"
ON public.pin_products
FOR SELECT
TO authenticated
USING (
  is_active = true
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins manage pin products"
ON public.pin_products
FOR ALL
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins update pin orders" ON public.pin_orders;
DROP POLICY IF EXISTS "Users view own pin orders" ON public.pin_orders;

CREATE POLICY "Admins update pin orders"
ON public.pin_orders
FOR UPDATE
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users view own pin orders"
ON public.pin_orders
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);

GRANT SELECT ON public.pin_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pin_products TO authenticated;
GRANT ALL ON public.pin_products TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.pin_orders TO authenticated;
GRANT ALL ON public.pin_orders TO service_role;