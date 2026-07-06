-- 1) Hide internal wholesale cost from client roles on pin_products.
--    Clients keep read access to all customer-facing columns; cost_price
--    remains readable only by service_role (edge functions/admin backend).
REVOKE SELECT ON public.pin_products FROM anon, authenticated;
GRANT SELECT (id, slug, name, description, retail_price, is_active, sort_order, created_at, updated_at)
  ON public.pin_products TO anon, authenticated;
GRANT ALL ON public.pin_products TO service_role;

-- 2) Trigger functions never need to be callable by clients.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_promotion_plan_price_change() FROM PUBLIC, anon, authenticated;