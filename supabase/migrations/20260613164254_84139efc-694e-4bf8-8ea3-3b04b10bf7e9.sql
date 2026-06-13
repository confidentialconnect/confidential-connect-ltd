
-- 1. promotion_plans table
CREATE TABLE public.promotion_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  period_label TEXT DEFAULT '',
  duration_label TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 1 CHECK (duration_days > 0),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  popular BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.promotion_plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotion_plans TO authenticated;
GRANT ALL ON public.promotion_plans TO service_role;

ALTER TABLE public.promotion_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active visible plans"
  ON public.promotion_plans FOR SELECT
  USING (active = true AND visible = true);

CREATE POLICY "Admins can view all plans"
  ON public.promotion_plans FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert plans"
  ON public.promotion_plans FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update plans"
  ON public.promotion_plans FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete plans"
  ON public.promotion_plans FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_promotion_plans_updated_at
  BEFORE UPDATE ON public.promotion_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. price history audit
CREATE TABLE public.promotion_plan_price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.promotion_plans(id) ON DELETE CASCADE,
  plan_slug TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  old_price NUMERIC(12,2),
  new_price NUMERIC(12,2) NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_by_email TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.promotion_plan_price_history TO authenticated;
GRANT ALL ON public.promotion_plan_price_history TO service_role;

ALTER TABLE public.promotion_plan_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view price history"
  ON public.promotion_plan_price_history FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_price_history_plan ON public.promotion_plan_price_history(plan_id, changed_at DESC);

-- 3. auto-log price changes
CREATE OR REPLACE FUNCTION public.log_promotion_plan_price_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor_email TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT email INTO actor_email FROM auth.users WHERE id = auth.uid();
    INSERT INTO public.promotion_plan_price_history
      (plan_id, plan_slug, plan_name, old_price, new_price, changed_by, changed_by_email)
    VALUES (NEW.id, NEW.slug, NEW.name, NULL, NEW.price, auth.uid(), actor_email);
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.price IS DISTINCT FROM OLD.price THEN
    SELECT email INTO actor_email FROM auth.users WHERE id = auth.uid();
    INSERT INTO public.promotion_plan_price_history
      (plan_id, plan_slug, plan_name, old_price, new_price, changed_by, changed_by_email)
    VALUES (NEW.id, NEW.slug, NEW.name, OLD.price, NEW.price, auth.uid(), actor_email);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_log_promotion_plan_price_change
  AFTER INSERT OR UPDATE ON public.promotion_plans
  FOR EACH ROW EXECUTE FUNCTION public.log_promotion_plan_price_change();

-- 4. seed
INSERT INTO public.promotion_plans
  (slug, name, emoji, description, price, period_label, duration_label, duration_days, features, popular, sort_order)
VALUES
  ('starter', 'Starter', NULL, 'Quick daily visibility — Morning & Evening promotion.', 2000, '/day', '1 Day Promotion', 1,
    '["2 posts daily (Morning & Evening)", "Quick and affordable visibility"]'::jsonb, false, 10),
  ('weekly', 'Weekly', NULL, 'Consistent weekly visibility for better reach.', 10500, '', '7 Days Promotion', 7,
    '["Consistent daily promotion", "Better reach and engagement"]'::jsonb, false, 20),
  ('growth', 'Growth', '🔥', 'Best value for business growth.', 18200, '', '14 Days Promotion', 14,
    '["Extended promotion period", "Strong audience reach", "Higher engagement"]'::jsonb, true, 30),
  ('premium', 'Premium', '💎', 'Maximum visibility with priority placement.', 36000, '', '30 Days Promotion', 30,
    '["Maximum visibility", "Priority placement", "Long-term promotion"]'::jsonb, false, 40),
  ('promote-with-link', 'Promote with Link', '🔗', 'Promote your business with a clickable link directing to your site or socials.', 5000, '/day', '1 Day Promotion with Link', 1,
    '["Clickable promotional link", "Direct traffic to your site or socials", "Daily renewable placement"]'::jsonb, false, 50);

-- 5. realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.promotion_plans;
