CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

DROP POLICY IF EXISTS "Public can view approved businesses" ON public.businesses;
CREATE POLICY "Public can view approved businesses"
ON public.businesses
FOR SELECT
TO anon
USING (status = 'approved');

ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA private;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Signed-in users view public own or administered businesses"
ON public.businesses
FOR SELECT
TO authenticated
USING (
  status = 'approved'
  OR owner_id = auth.uid()
  OR private.has_role(auth.uid(), 'admin'::public.app_role)
);

REVOKE ALL ON FUNCTION public.increment_business_metric(uuid, text)
FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_business_metric(uuid, text)
TO service_role;