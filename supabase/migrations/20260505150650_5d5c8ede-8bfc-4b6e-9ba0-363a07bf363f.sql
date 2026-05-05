
-- Fix 1: Tighten storage receipts policies to authenticated-only
DROP POLICY IF EXISTS "Users can view their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload receipts" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all receipts" ON storage.objects;

-- "Users can read their own receipts" and "Users can upload their own receipts" already exist
-- and target authenticated. Recreate the admin viewer for authenticated only.
CREATE POLICY "Admins can view all receipts (authenticated)"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'receipts' AND has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Add an explicit restrictive policy on user_roles to prevent any
-- non-admin write attempt, regardless of future permissive policies.
CREATE POLICY "Restrict role writes to admins only"
ON public.user_roles AS RESTRICTIVE
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
