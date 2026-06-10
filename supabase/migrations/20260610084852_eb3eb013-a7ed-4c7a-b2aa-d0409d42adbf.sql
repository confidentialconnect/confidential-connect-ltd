
ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS delivered_file_url TEXT,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivery_note TEXT;
