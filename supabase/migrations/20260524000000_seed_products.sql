-- ============================================================
-- SEED: Categorías y productos de VibeStore
-- Ejecutar después de las migraciones base
-- ============================================================

-- CATEGORÍAS
INSERT INTO public.categories (id, name, slug, gender, type, display_order)
VALUES
  ('11111111-0000-0000-0000-000000000001', 'Mujer', 'mujer', 'mujer', 'ropa', 1),
  ('11111111-0000-0000-0000-000000000002', 'Hombre', 'hombre', 'hombre', 'ropa', 2)
ON CONFLICT (slug) DO NOTHING;

-- PRODUCTOS MUJER
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, category_id, material, care_instructions, featured, active, style)
VALUES
  ('aaaaaaaa-0001-0000-0000-000000000001','Trench camel oversize','trench-camel-mujer','Trench atemporal en algodón tratado, corte oversize y cinturón a la cintura.',189,229,'11111111-0000-0000-0000-000000000001','100% algodón','Lavado en seco',true,true,'elegante'),
  ('aaaaaaaa-0002-0000-0000-000000000001','Vestido midi satinado','vestido-midi-mujer','Vestido satinado con caída fluida, ideal para ocasión.',145,null,'11111111-0000-0000-0000-000000000001','Satén 95% poliéster','Lavar a mano',true,true,'elegante'),
  ('aaaaaaaa-0003-0000-0000-000000000001','Knit costilla crema','knit-crema-mujer','Suéter de punto costilla, tacto suave y silueta ceñida.',79,null,'11111111-0000-0000-0000-000000000001','70% algodón 30% poliamida','Lavar en frío',true,true,'casual'),
  ('aaaaaaaa-0004-0000-0000-000000000001','Bomber técnica oliva','bomber-oliva-mujer','Bomber con acabado mate y elásticos contrastados.',129,159,'11111111-0000-0000-0000-000000000001','Nylon reciclado','Lavado a 30°',true,true,'urbana'),
  ('aaaaaaaa-0005-0000-0000-000000000001','Top crop nervaduras','crop-nervaduras-mujer','Top corto con costuras estructuradas.',49,null,'11111111-0000-0000-0000-000000000001','Punto técnico','Lavar en frío',false,true,'casual'),
  ('aaaaaaaa-0006-0000-0000-000000000001','Pantalón cargo lino','cargo-lino-mujer','Pantalón cargo wide-leg en lino lavado.',119,null,'11111111-0000-0000-0000-000000000001','Lino 100%','Lavar en frío',false,true,'urbana'),
  ('aaaaaaaa-0007-0000-0000-000000000001','Plataforma blanca chunky','plataforma-blanca-mujer','Sneaker plataforma con suela inyectada.',159,null,'11111111-0000-0000-0000-000000000001','Piel sintética','Limpiar con paño húmedo',false,true,'deportiva'),
  ('aaaaaaaa-0008-0000-0000-000000000001','Blazer lima entallado','blazer-lima-mujer','Blazer de un botón en tono lima vibrante.',179,null,'11111111-0000-0000-0000-000000000001','Mezcla de lana','Lavado en seco',false,true,'elegante'),
  ('aaaaaaaa-0009-0000-0000-000000000001','Slip dress coral','slip-coral-mujer','Slip dress con tirantes finos y corte al bies.',99,null,'11111111-0000-0000-0000-000000000001','Satén','Lavar a mano',false,true,'elegante'),
  ('aaaaaaaa-0010-0000-0000-000000000001','Blusa blanca clásica','blusa-blanca-mujer','Blusa de popelín con cuello camisero.',69,null,'11111111-0000-0000-0000-000000000001','Popelín 100% algodón','Lavado normal',false,true,'elegante')
ON CONFLICT (slug) DO NOTHING;

-- PRODUCTOS HOMBRE
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, category_id, material, care_instructions, featured, active, style)
VALUES
  ('bbbbbbbb-0001-0000-0000-000000000002','Blazer estructurado grafito','blazer-grafito-hombre','Blazer de corte recto, hombro natural y solapa de pico.',219,259,'11111111-0000-0000-0000-000000000002','Lana fría','Lavado en seco',true,true,'elegante'),
  ('bbbbbbbb-0002-0000-0000-000000000002','Camisa oxford lavada','camisa-oxford-hombre','Camisa Oxford de algodón con caída relajada.',79,null,'11111111-0000-0000-0000-000000000002','Algodón 100%','Lavado normal',true,true,'casual'),
  ('bbbbbbbb-0003-0000-0000-000000000002','Jeans rectos índigo','jeans-indigo-hombre','Jeans clásicos en denim rígido índigo.',109,null,'11111111-0000-0000-0000-000000000002','Denim 100% algodón','Lavar del revés',true,true,'casual'),
  ('bbbbbbbb-0004-0000-0000-000000000002','Hoodie peso medio','hoodie-medio-hombre','Sudadera con capucha en algodón cepillado.',89,null,'11111111-0000-0000-0000-000000000002','Algodón cepillado','Lavar en frío',true,true,'urbana'),
  ('bbbbbbbb-0005-0000-0000-000000000002','Pantalón sastre fluido','pantalon-sastre-hombre','Pantalón de sastrería con pinzas y caída fluida.',129,null,'11111111-0000-0000-0000-000000000002','Lana tropical','Lavado en seco',false,true,'elegante'),
  ('bbbbbbbb-0006-0000-0000-000000000002','Tee box-fit pesada','tee-boxfit-hombre','Camiseta de algodón pesado con corte cuadrado.',39,null,'11111111-0000-0000-0000-000000000002','Algodón 240 g','Lavado normal',false,true,'casual'),
  ('bbbbbbbb-0007-0000-0000-000000000002','Runner técnica gris','runner-gris-hombre','Tenis runner con malla técnica y mediasuela acolchada.',169,null,'11111111-0000-0000-0000-000000000002','Malla técnica','Limpiar con paño húmedo',false,true,'deportiva'),
  ('bbbbbbbb-0008-0000-0000-000000000002','Varsity cobalto','varsity-cobalto-hombre','Chaqueta varsity con cuerpo lana y mangas en piel sintética.',199,null,'11111111-0000-0000-0000-000000000002','Lana / piel sintética','Lavado en seco',false,true,'urbana'),
  ('bbbbbbbb-0009-0000-0000-000000000002','Knit mantequilla','knit-mantequilla-hombre','Jersey de punto fino en tono mantequilla.',89,null,'11111111-0000-0000-0000-000000000002','Algodón 100%','Lavar en frío',false,true,'casual'),
  ('bbbbbbbb-0010-0000-0000-000000000002','Abrigo lana gris','abrigo-lana-hombre','Abrigo cruzado de lana con corte sastre.',259,null,'11111111-0000-0000-0000-000000000002','Mezcla de lana 70%','Lavado en seco',false,true,'elegante')
ON CONFLICT (slug) DO NOTHING;

-- VARIANTES (tallas) — 5 unidades por talla por producto
-- Mujer
INSERT INTO public.product_variants (product_id, size, stock, display_order)
SELECT p.id, v.size, 5, v.ord
FROM public.products p
CROSS JOIN (VALUES ('XS',1),('S',2),('M',3),('L',4),('XL',5)) AS v(size,ord)
WHERE p.category_id = '11111111-0000-0000-0000-000000000001'
ON CONFLICT (product_id, size) DO NOTHING;

-- Hombre
INSERT INTO public.product_variants (product_id, size, stock, display_order)
SELECT p.id, v.size, 5, v.ord
FROM public.products p
CROSS JOIN (VALUES ('S',1),('M',2),('L',3),('XL',4),('XXL',5)) AS v(size,ord)
WHERE p.category_id = '11111111-0000-0000-0000-000000000002'
ON CONFLICT (product_id, size) DO NOTHING;

-- NOTA: Las imágenes se sirven desde los assets del proyecto (bundled con Vite).
-- Para producción real, súbelas a Supabase Storage y registra las URLs aquí.
-- Ejemplo:
-- INSERT INTO public.product_images (product_id, url, alt, display_order)
-- VALUES ('aaaaaaaa-0001-0000-0000-000000000001', 'https://<project>.supabase.co/storage/v1/object/public/products/trench-camel.jpg', 'Trench camel oversize', 0);
