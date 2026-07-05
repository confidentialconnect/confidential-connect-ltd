-- Idempotent catalog data sync: safe to run in both Test and Live.
-- Rows that already exist (same id / unique key) are skipped.

-- 1) Product categories
INSERT INTO public.product_categories (id, name, slug, display_order) VALUES
 ('ae33a0b2-084b-490e-9e70-99533aa988f8','Admission Forms','admission-forms',1),
 ('1bc9cc73-037c-4cf7-9e75-6b21dcadd999','Educational Services','educational-services',2),
 ('b4dd9395-6c5d-4836-8827-63f522d7adf7','Student Support','student-support',3),
 ('10ba5d75-634b-4aff-a4e5-bff737a091c5','Business Promotion','business-promotion',4),
 ('1b625b5c-9dc7-488d-8ffc-730dbaaef5ee','CAC Registration','cac-registration',5),
 ('b3554a88-8bf0-4166-952b-b103b53ecb05','Document Processing','document-processing',6),
 ('85690134-a7b9-4d40-a320-13378e72dfd6','Opportunities','opportunities',7),
 ('77d38690-6455-409e-941f-d1d1b73b0877','Scholarships','scholarships',8),
 ('1e6d06cb-a4f6-497f-b3e2-24820cccf610','Internships','internships',9),
 ('e3ffd21e-9fd6-477a-b176-47fa72ed2c4f','Jobs','jobs',10),
 ('c52b2f8e-24ae-4db1-b3f1-b79ddc50bdd9','Remote Jobs','remote-jobs',11),
 ('52f348a4-f180-42f6-9637-3c624770f499','Digital Products','digital-products',12),
 ('a3e67068-94d9-4ac4-8237-a61fcfb724af','Business Services','business-services',13),
 ('fafdec21-fd34-4975-8b06-b0384d2fe796','Marketing Services','marketing-services',14),
 ('979b00b8-2f09-4c1e-bf99-334fb2514a2d','Consultancy','consultancy',15),
 ('8f29e7a5-d113-4ac6-a61d-cd1dc08026fb','Other Services','other-services',99)
ON CONFLICT DO NOTHING;

-- 2) Promotion plans
INSERT INTO public.promotion_plans (id, slug, name, emoji, description, price, period_label, duration_label, duration_days, features, popular, visible, active, sort_order) VALUES
 ('e1db6ab6-6c2f-4f20-b126-abcf4315e20a','starter','Starter',NULL,'Quick daily visibility — Morning & Evening promotion.',3000.00,'/day','1 Day Promotion',1,'["2 posts daily (Morning & Evening)","Quick and affordable visibility"]'::jsonb,true,true,true,10),
 ('557af3e3-68c3-4041-a01b-64b2834b03c1','weekly','Weekly',NULL,'Consistent weekly visibility for better reach.',10500.00,'','7 Days Promotion',7,'["Consistent daily promotion","Better reach and engagement"]'::jsonb,true,true,true,20),
 ('2f3075ff-730f-42fc-8be9-8135e9520043','growth','Growth','🔥','Best value for business growth.',18200.00,'','14 Days Promotion',14,'["Extended promotion period","Strong audience reach","Higher engagement"]'::jsonb,true,true,true,30),
 ('f5eac405-9ff9-43b2-92ab-901b3dd1a886','premium','Premium','💎','Maximum visibility with priority placement.',36000.00,'','30 Days Promotion',30,'["Maximum visibility","Priority placement","Long-term promotion"]'::jsonb,true,true,true,40),
 ('bf4ebd4d-ee2e-430e-b71a-36d436248a46','promote-with-link','Promote with Link','🔗','Promote your business with a clickable link directing to your site or socials.',5000.00,'/day','1 Day Promotion with Link',1,'["Clickable promotional link","Direct traffic to your site or socials","Daily renewable placement"]'::jsonb,true,true,true,50)
ON CONFLICT DO NOTHING;

-- 3) Digital PIN products (NaijaResultPins catalog)
INSERT INTO public.pin_products (id, slug, name, description, retail_price, cost_price, provider_card_type_id, is_active, sort_order) VALUES
 ('067fb7e5-634d-48ca-a577-6a1385fed322','waec-result-checker','WAEC Result Checker PIN','Check your WAEC result online instantly.',5700.00,5140.00,1,true,1),
 ('4a5df91e-c3f6-4306-8bf9-a1d020b49928','neco-token','NECO Result Token','Check your NECO result online instantly.',2250.00,2000.00,2,true,2),
 ('b9fe317a-4b12-4bc9-b065-9a38d3635b23','nabteb-result-checker','NABTEB Result Checker PIN','Check your NABTEB result online instantly.',950.00,820.00,3,true,3),
 ('ae3b43f3-23bf-4320-80af-a7ebf7e9d386','waec-verification','WAEC Verification PIN','Verify a WAEC certificate online.',5900.00,5350.00,4,true,4),
 ('698effa7-0815-4ec1-8ff0-4e369570374f','nbais-result-checker','NBAIS Result Checker PIN','Check your NBAIS result online instantly.',1400.00,1220.00,5,true,5),
 ('2d0600a9-63f1-4da5-8c21-e176055783c3','neco-everification-student','NECO e-Verification (Student)','NECO electronic result verification for students.',6450.00,5850.00,11,true,6)
ON CONFLICT DO NOTHING;

-- 4) Approved business listing (owner resolved safely; NULL if owner absent in this environment)
INSERT INTO public.businesses (id, owner_id, name, category, short_description, description, state, city, address, email, phone, whatsapp, website, logo_url, verified, status, promotion_tier, sort_boost)
SELECT '9d4185ac-db13-4de6-91b4-c08a7cb2e053',
       (SELECT id FROM auth.users WHERE id = 'f887311b-15f0-439e-bc10-78611f5a4b71'),
       'CAC REGISTRATION FOR BUSINESS','General','','Active ','FCT - Abuja','Gana Street Abuja',
       'Assembly of God Church Nigeria Royal house GRA und St mpape 4 Abuja',
       'princejuniorokpo@gmail.com','07040294858','','','',true,'approved',0,0
WHERE NOT EXISTS (SELECT 1 FROM public.businesses WHERE id = '9d4185ac-db13-4de6-91b4-c08a7cb2e053');

-- 5) Publish any products still stuck in draft so they are publicly visible
UPDATE public.products SET status = 'published' WHERE status = 'draft';