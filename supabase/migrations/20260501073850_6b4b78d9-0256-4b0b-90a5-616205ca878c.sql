
CREATE TABLE public.promotion_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan text NOT NULL,
  amount numeric NOT NULL,
  full_name text NOT NULL,
  business_name text NOT NULL,
  phone text NOT NULL,
  email text,
  promote_what text NOT NULL,
  target_audience text,
  duration text,
  receipt_url text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.promotion_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own promotion payments"
  ON public.promotion_payments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own promotion payments"
  ON public.promotion_payments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update promotion payments"
  ON public.promotion_payments FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_promotion_payments_updated_at
  BEFORE UPDATE ON public.promotion_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for receipts bucket (per-user folder)
CREATE POLICY "Users can upload their own receipts"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'receipts'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read their own receipts"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'receipts'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR has_role(auth.uid(), 'admin'::app_role))
  );
