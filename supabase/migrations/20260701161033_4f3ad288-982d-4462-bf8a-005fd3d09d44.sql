
-- BUSINESSES TABLE
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT,
  short_description TEXT,
  state TEXT,
  city TEXT,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  cover_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  promotion_tier INTEGER NOT NULL DEFAULT 0, -- 3=promote-with-link, 2=featured, 1=standard, 0=regular
  promotion_expires_at TIMESTAMPTZ,
  sort_boost INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected|suspended
  views INTEGER NOT NULL DEFAULT 0,
  whatsapp_clicks INTEGER NOT NULL DEFAULT 0,
  link_clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_promotion ON public.businesses(promotion_tier DESC, sort_boost DESC, created_at DESC);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_state ON public.businesses(state);

GRANT SELECT ON public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Public can view approved businesses
CREATE POLICY "Public can view approved businesses"
ON public.businesses FOR SELECT
USING (status = 'approved' OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Users can create businesses they own
CREATE POLICY "Users can create their own businesses"
ON public.businesses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own (but not approve themselves — status changes limited via trigger or admin)
CREATE POLICY "Owners can update their own businesses"
ON public.businesses FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Admins full control
CREATE POLICY "Admins can manage all businesses"
ON public.businesses FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Owners can delete their own businesses"
ON public.businesses FOR DELETE
TO authenticated
USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;

-- RPC for public analytics counters (bypasses RLS on updating counters only)
CREATE OR REPLACE FUNCTION public.increment_business_metric(_business_id UUID, _metric TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _metric NOT IN ('views','whatsapp_clicks','link_clicks') THEN
    RAISE EXCEPTION 'Invalid metric';
  END IF;
  IF _metric = 'views' THEN
    UPDATE public.businesses SET views = views + 1 WHERE id = _business_id AND status = 'approved';
  ELSIF _metric = 'whatsapp_clicks' THEN
    UPDATE public.businesses SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = _business_id AND status = 'approved';
  ELSIF _metric = 'link_clicks' THEN
    UPDATE public.businesses SET link_clicks = link_clicks + 1 WHERE id = _business_id AND status = 'approved';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_business_metric(UUID, TEXT) TO anon, authenticated;
