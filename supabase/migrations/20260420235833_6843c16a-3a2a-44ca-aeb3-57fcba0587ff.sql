
DO $$
DECLARE
  cat_mujer_ropa uuid;
  cat_hombre_ropa uuid;
  cat_mujer_calzado uuid;
  cat_hombre_calzado uuid;
  p_id uuid;
BEGIN
  SELECT id INTO cat_mujer_ropa FROM public.categories WHERE slug = 'mujer-ropa' LIMIT 1;
  SELECT id INTO cat_hombre_ropa FROM public.categories WHERE slug = 'hombre-ropa' LIMIT 1;
  SELECT id INTO cat_mujer_calzado FROM public.categories WHERE slug = 'mujer-calzado' LIMIT 1;
  SELECT id INTO cat_hombre_calzado FROM public.categories WHERE slug = 'hombre-calzado' LIMIT 1;

  -- 1. Blazer Lima Mujer
  INSERT INTO public.products (category_id, name, slug, description, price, material, care_instructions, featured, active)
  VALUES (cat_mujer_ropa, 'Blazer Lima Power', 'blazer-lima-power',
    'Blazer oversized en color lima eléctrico. Hombros estructurados, doble botonadura. Para destacar sin pedir permiso.',
    189, 'Mezcla de lana 70% / viscosa 30%', 'Limpieza en seco', true, true)
  RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, alt, display_order) VALUES
    (p_id, '/src/assets/product-blazer-lime-mujer.jpg', 'Blazer lima oversized', 0);
  INSERT INTO public.product_variants (product_id, size, stock, display_order) VALUES
    (p_id, 'XS', 4, 0), (p_id, 'S', 8, 1), (p_id, 'M', 10, 2), (p_id, 'L', 6, 3), (p_id, 'XL', 3, 4);

  -- 2. Slip Dress Coral Mujer
  INSERT INTO public.products (category_id, name, slug, description, price, material, care_instructions, featured, active)
  VALUES (cat_mujer_ropa, 'Slip Dress Coral Satin', 'slip-dress-coral-satin',
    'Vestido midi de satén en coral incandescente. Tirantes finos ajustables, caída fluida.',
    129, '100% poliéster satinado', 'Lavar a mano en frío', true, true)
  RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, alt, display_order) VALUES
    (p_id, '/src/assets/product-slip-coral-mujer.jpg', 'Vestido coral satinado', 0);
  INSERT INTO public.product_variants (product_id, size, stock, display_order) VALUES
    (p_id, 'XS', 5, 0), (p_id, 'S', 9, 1), (p_id, 'M', 7, 2), (p_id, 'L', 4, 3);

  -- 3. Varsity Cobalto Hombre
  INSERT INTO public.products (category_id, name, slug, description, price, material, care_instructions, featured, active)
  VALUES (cat_hombre_ropa, 'Varsity Cobalto 90s', 'varsity-cobalto-90s',
    'Chaqueta varsity en cobalto profundo con ribetes blancos. Corte oversized, energía retro deportiva.',
    199, 'Exterior poliéster, forro algodón', 'Lavar en frío del revés', true, true)
  RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, alt, display_order) VALUES
    (p_id, '/src/assets/product-varsity-cobalt-hombre.jpg', 'Chaqueta varsity cobalto', 0);
  INSERT INTO public.product_variants (product_id, size, stock, display_order) VALUES
    (p_id, 'S', 6, 0), (p_id, 'M', 12, 1), (p_id, 'L', 10, 2), (p_id, 'XL', 5, 3);

  -- 4. Knit Butter Hombre
  INSERT INTO public.products (category_id, name, slug, description, price, material, care_instructions, featured, active)
  VALUES (cat_hombre_ropa, 'Knit Butter Mock', 'knit-butter-mock',
    'Jersey grueso de canalé en amarillo mantequilla. Cuello mock, tacto suave y cálido.',
    109, '60% lana, 40% acrílico', 'Lavar a mano, secar en plano', true, true)
  RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, alt, display_order) VALUES
    (p_id, '/src/assets/product-knit-butter-hombre.jpg', 'Jersey amarillo mantequilla', 0);
  INSERT INTO public.product_variants (product_id, size, stock, display_order) VALUES
    (p_id, 'S', 7, 0), (p_id, 'M', 11, 1), (p_id, 'L', 9, 2), (p_id, 'XL', 4, 3);

  -- 5. Chelsea Plum Mujer
  INSERT INTO public.products (category_id, name, slug, description, price, material, care_instructions, active)
  VALUES (cat_mujer_calzado, 'Chelsea Plum Suede', 'chelsea-plum-suede',
    'Botín chelsea de ante color ciruela. Tacón cuadrado de 6 cm, elásticos laterales.',
    175, 'Ante natural, suela TPU', 'Cepillar y proteger con spray', true)
  RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, alt, display_order) VALUES
    (p_id, '/src/assets/product-chelsea-plum-mujer.jpg', 'Botín chelsea ciruela', 0);
  INSERT INTO public.product_variants (product_id, size, stock, display_order) VALUES
    (p_id, '36', 3, 0), (p_id, '37', 5, 1), (p_id, '38', 6, 2), (p_id, '39', 5, 3), (p_id, '40', 3, 4), (p_id, '41', 2, 5);

  -- 6. Low Lime Hombre
  INSERT INTO public.products (category_id, name, slug, description, price, material, care_instructions, active)
  VALUES (cat_hombre_calzado, 'Low Lime Court', 'low-lime-court',
    'Sneaker low court en cuero lima eléctrico con suela blanca. Silueta limpia, vibra atómica.',
    149, 'Cuero, suela goma', 'Limpiar con paño húmedo', true)
  RETURNING id INTO p_id;
  INSERT INTO public.product_images (product_id, url, alt, display_order) VALUES
    (p_id, '/src/assets/product-low-lime-hombre.jpg', 'Sneaker lima', 0);
  INSERT INTO public.product_variants (product_id, size, stock, display_order) VALUES
    (p_id, '40', 4, 0), (p_id, '41', 6, 1), (p_id, '42', 8, 2), (p_id, '43', 7, 3), (p_id, '44', 5, 4), (p_id, '45', 3, 5);
END $$;
