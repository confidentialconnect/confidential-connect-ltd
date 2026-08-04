INSERT INTO public.pin_products
  (id, slug, name, description, provider_card_type_id, cost_price, retail_price, is_active, sort_order)
VALUES
  ('067fb7e5-634d-48ca-a577-6a1385fed322', 'waec-result-checker', 'WAEC Result Checker PIN', 'Check your WAEC result online instantly.', 1, 5140.00, 5700.00, true, 1),
  ('4a5df91e-c3f6-4306-8bf9-a1d020b49928', 'neco-token', 'NECO Result Token', 'Check your NECO result online instantly.', 2, 2025.00, 2250.00, true, 2),
  ('b9fe317a-4b12-4bc9-b065-9a38d3635b23', 'nabteb-result-checker', 'NABTEB Result Checker PIN', 'Check your NABTEB result online instantly.', 3, 855.00, 950.00, true, 3),
  ('ae3b43f3-23bf-4320-80af-a7ebf7e9d386', 'waec-verification', 'WAEC Verification PIN', 'Verify a WAEC certificate online.', 4, 5310.00, 5900.00, true, 4),
  ('698effa7-0815-4ec1-8ff0-4e369570374f', 'nbais-result-checker', 'NBAIS Result Checker PIN', 'Check your NBAIS result online instantly.', 5, 1260.00, 1400.00, true, 5),
  ('2d0600a9-63f1-4da5-8c21-e176055783c3', 'neco-everification-student', 'NECO e-Verification (Student)', 'NECO electronic result verification for students.', 6, 5805.00, 6450.00, true, 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  provider_card_type_id = EXCLUDED.provider_card_type_id,
  cost_price = EXCLUDED.cost_price,
  retail_price = EXCLUDED.retail_price,
  is_active = true,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();