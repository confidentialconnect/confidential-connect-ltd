-- Idempotent public catalog seed (runs on Test now, Live on publish)

INSERT INTO public.product_categories (name, slug, display_order) VALUES
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
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.pin_products (slug, name, description, provider_card_type_id, cost_price, retail_price, is_active, sort_order) VALUES
  ('waec-result-checker','WAEC Result Checker PIN','Check your WAEC result online instantly.',1,5140,5700,true,1),
  ('neco-token','NECO Result Token','Check your NECO result online instantly.',2,2000,2250,true,2),
  ('nabteb-result-checker','NABTEB Result Checker PIN','Check your NABTEB result online instantly.',3,820,950,true,3),
  ('waec-verification','WAEC Verification PIN','Verify a WAEC certificate online.',4,5350,5900,true,4),
  ('nbais-result-checker','NBAIS Result Checker PIN','Check your NBAIS result online instantly.',5,1220,1400,true,5),
  ('neco-everification-student','NECO e-Verification (Student)','NECO electronic result verification for students.',11,5850,6450,true,6)
ON CONFLICT (slug) DO UPDATE SET is_active = true;

INSERT INTO public.promotion_plans (slug, name, emoji, description, price, period_label, duration_label, duration_days, features, popular, visible, active, sort_order) VALUES
  ('starter','Starter',NULL,'Quick daily visibility — Morning & Evening promotion.',2000,'/day','1 Day Promotion',1,'["2 posts daily (Morning & Evening)","Quick and affordable visibility"]'::jsonb,false,true,true,10),
  ('weekly','Weekly',NULL,'Consistent weekly visibility for better reach.',10500,'','7 Days Promotion',7,'["Consistent daily promotion","Better reach and engagement"]'::jsonb,false,true,true,20),
  ('growth','Growth','🔥','Best value for business growth.',18200,'','14 Days Promotion',14,'["Extended promotion period","Strong audience reach","Higher engagement"]'::jsonb,true,true,true,30),
  ('premium','Premium','💎','Maximum visibility with priority placement.',36000,'','30 Days Promotion',30,'["Maximum visibility","Priority placement","Long-term promotion"]'::jsonb,false,true,true,40),
  ('promote-with-link','Promote with Link','🔗','Promote your business with a clickable link directing to your site or socials.',5000,'/day','1 Day Promotion with Link',1,'["Clickable promotional link","Direct traffic to your site or socials","Daily renewable placement"]'::jsonb,false,true,true,50)
ON CONFLICT (slug) DO UPDATE SET visible = true, active = true;

UPDATE public.products SET status = 'published' WHERE status <> 'published';
