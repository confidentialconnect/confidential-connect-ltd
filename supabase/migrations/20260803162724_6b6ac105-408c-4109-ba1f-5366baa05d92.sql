-- 1) Businesses: owners cannot self-approve / self-promote
DROP POLICY IF EXISTS "Owners can update their own businesses" ON public.businesses;
CREATE POLICY "Owners can update their own businesses"
ON public.businesses
FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id OR private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (
  private.has_role(auth.uid(), 'admin'::public.app_role)
  OR (
    auth.uid() = owner_id
    AND status = (SELECT b.status FROM public.businesses b WHERE b.id = businesses.id)
    AND verified = (SELECT b.verified FROM public.businesses b WHERE b.id = businesses.id)
    AND promotion_tier = (SELECT b.promotion_tier FROM public.businesses b WHERE b.id = businesses.id)
    AND sort_boost = (SELECT b.sort_boost FROM public.businesses b WHERE b.id = businesses.id)
    AND promotion_expires_at IS NOT DISTINCT FROM (SELECT b.promotion_expires_at FROM public.businesses b WHERE b.id = businesses.id)
  )
);

-- 2) Profiles: users cannot self-grant the verified badge
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (
  private.has_role(auth.uid(), 'admin'::public.app_role)
  OR (
    auth.uid() = id
    AND is_admin IS NOT DISTINCT FROM (SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid())
    AND verified = (SELECT p.verified FROM public.profiles p WHERE p.id = auth.uid())
  )
);

-- 3) Orders: client inserts must be unpaid/pending
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND COALESCE(payment_status, 'pending') = 'pending'
);

-- 4) Promotion payments: new requests must start pending
DROP POLICY IF EXISTS "Users can create their own promotion payments" ON public.promotion_payments;
CREATE POLICY "Users can create their own promotion payments"
ON public.promotion_payments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');