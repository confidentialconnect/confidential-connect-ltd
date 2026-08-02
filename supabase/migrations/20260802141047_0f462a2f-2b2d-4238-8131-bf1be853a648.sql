-- Categories
INSERT INTO public.product_categories (name, slug, display_order)
SELECT v.name, v.slug, v.display_order FROM (VALUES
  ('Admission Forms','admission-forms',1),
  ('Educational Services','educational-services',2),
  ('Student Support','student-support',3),
  ('Business Promotion','business-promotion',4),
  ('CAC Registration','cac-registration',5),
  ('Document Processing','document-processing',6),
  ('Opportunities','opportunities',7),
  ('Scholarships','scholarships',8),
  ('Internships','internships',9),
  ('Jobs','jobs',10),
  ('Remote Jobs','remote-jobs',11),
  ('Digital Products','digital-products',12),
  ('Business Services','business-services',13),
  ('Marketing Services','marketing-services',14),
  ('Consultancy','consultancy',15),
  ('Other Services','other-services',99)
) AS v(name, slug, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.product_categories c WHERE c.slug = v.slug);

-- Promotion plans
INSERT INTO public.promotion_plans
  (slug, name, emoji, description, price, period_label, duration_label, duration_days, features, popular, visible, active, sort_order)
SELECT v.slug, v.name, v.emoji, v.description, v.price, v.period_label, v.duration_label, v.duration_days, v.features::jsonb, v.popular, true, true, v.sort_order
FROM (VALUES
  ('starter','Starter',NULL,'Quick daily visibility — Morning & Evening promotion.',2000::numeric,'/day','1 Day Promotion',1,'["2 posts daily (Morning & Evening)","Quick and affordable visibility"]',false,10),
  ('weekly','Weekly',NULL,'Consistent weekly visibility for better reach.',10500::numeric,'','7 Days Promotion',7,'["Consistent daily promotion","Better reach and engagement"]',false,20),
  ('growth','Growth','🔥','Best value for business growth.',18200::numeric,'','14 Days Promotion',14,'["Extended promotion period","Strong audience reach","Higher engagement"]',true,30),
  ('premium','Premium','💎','Maximum visibility with priority placement.',36000::numeric,'','30 Days Promotion',30,'["Maximum visibility","Priority placement","Long-term promotion"]',false,40),
  ('promote-with-link','Promote with Link','🔗','Promote your business with a clickable link directing to your site or socials.',5000::numeric,'/day','1 Day Promotion with Link',1,'["Clickable promotional link","Direct traffic to your site or socials","Daily renewable placement"]',false,50)
) AS v(slug,name,emoji,description,price,period_label,duration_label,duration_days,features,popular,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.promotion_plans p WHERE p.slug = v.slug);

-- PIN products
INSERT INTO public.pin_products
  (slug, name, description, provider_card_type_id, cost_price, retail_price, is_active, sort_order)
SELECT v.slug, v.name, v.description, v.provider_card_type_id, v.cost_price, v.retail_price, true, v.sort_order
FROM (VALUES
  ('waec-result-checker','WAEC Result Checker PIN','Check your WAEC result online instantly.',1,5140::numeric,5700::numeric,1),
  ('neco-token','NECO Result Token','Check your NECO result online instantly.',2,2000::numeric,2250::numeric,2),
  ('nabteb-result-checker','NABTEB Result Checker PIN','Check your NABTEB result online instantly.',3,820::numeric,950::numeric,3),
  ('waec-verification','WAEC Verification PIN','Verify a WAEC certificate online.',4,5350::numeric,5900::numeric,4),
  ('nbais-result-checker','NBAIS Result Checker PIN','Check your NBAIS result online instantly.',5,1220::numeric,1400::numeric,5),
  ('neco-everification-student','NECO e-Verification (Student)','NECO electronic result verification for students.',11,5850::numeric,6450::numeric,6)
) AS v(slug,name,description,provider_card_type_id,cost_price,retail_price,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.pin_products p WHERE p.slug = v.slug);

-- Publish every draft product so visitors can browse them
UPDATE public.products SET status = 'published', updated_at = now() WHERE status <> 'published';

-- Business listing
INSERT INTO public.businesses
  (name, category, description, state, city, address, phone, email, verified, promotion_tier, status)
SELECT 'CAC REGISTRATION FOR BUSINESS','General','Active','FCT - Abuja','Gana Street Abuja',
  'Assembly of God Church Nigeria Royal house GRA und St mpape 4 Abuja','07040294858',
  'princejuniorokpo@gmail.com', true, 0, 'approved'
WHERE NOT EXISTS (SELECT 1 FROM public.businesses b WHERE b.name = 'CAC REGISTRATION FOR BUSINESS');

-- Any business already saved as pending stays admin-managed; nothing else changes.
