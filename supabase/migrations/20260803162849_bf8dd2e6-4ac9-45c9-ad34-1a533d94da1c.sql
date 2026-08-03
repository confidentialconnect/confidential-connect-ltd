CREATE OR REPLACE FUNCTION public.validate_order_item_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expected_price numeric;
BEGIN
  -- Service role / internal writers bypass the check (they compute prices server-side).
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(p.discount_price, p.price) INTO expected_price
  FROM public.products p
  WHERE p.id = NEW.product_id;

  IF expected_price IS NULL THEN
    RAISE EXCEPTION 'Unknown product for order item';
  END IF;

  IF NEW.price IS DISTINCT FROM expected_price THEN
    RAISE EXCEPTION 'Order item price does not match product price';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.validate_order_item_price() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS validate_order_item_price_trg ON public.order_items;
CREATE TRIGGER validate_order_item_price_trg
BEFORE INSERT OR UPDATE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.validate_order_item_price();