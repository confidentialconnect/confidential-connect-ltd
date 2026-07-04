
-- Public read tables (RLS already scopes what rows are visible)
GRANT SELECT ON public.businesses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;

GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

GRANT SELECT ON public.pin_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pin_products TO authenticated;
GRANT ALL ON public.pin_products TO service_role;

GRANT SELECT ON public.product_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;

GRANT SELECT ON public.promotion_plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.promotion_plans TO authenticated;
GRANT ALL ON public.promotion_plans TO service_role;

-- Auth-only tables (no anon)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pin_orders TO authenticated;
GRANT ALL ON public.pin_orders TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.kyc_submissions TO authenticated;
GRANT ALL ON public.kyc_submissions TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.promotion_payments TO authenticated;
GRANT ALL ON public.promotion_payments TO service_role;

GRANT SELECT ON public.promotion_plan_price_history TO authenticated;
GRANT ALL ON public.promotion_plan_price_history TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
