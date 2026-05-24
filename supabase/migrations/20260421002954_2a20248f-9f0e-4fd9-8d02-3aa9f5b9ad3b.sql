-- Bajar precios a un rango más realista en USD para todos los productos
UPDATE public.products SET price = 89, compare_at_price = CASE WHEN compare_at_price IS NOT NULL THEN 119 ELSE NULL END WHERE slug = 'trench-arena';
UPDATE public.products SET price = 59, compare_at_price = NULL WHERE slug = 'vestido-noir';
UPDATE public.products SET price = 49, compare_at_price = NULL WHERE slug = 'knit-marfil';
UPDATE public.products SET price = 79, compare_at_price = NULL WHERE slug = 'blazer-grafito';
UPDATE public.products SET price = 39, compare_at_price = NULL WHERE slug = 'camisa-lino-blanca';
UPDATE public.products SET price = 55, compare_at_price = CASE WHEN compare_at_price IS NOT NULL THEN 79 ELSE NULL END WHERE slug = 'jean-indigo-recto';
UPDATE public.products SET price = 69, compare_at_price = NULL WHERE slug = 'bota-onyx';
UPDATE public.products SET price = 59, compare_at_price = NULL WHERE slug = 'sneaker-bianca';

-- Productos vibrantes
UPDATE public.products SET price = 75, compare_at_price = 99 WHERE slug = 'bomber-cobalto';
UPDATE public.products SET price = 29 WHERE slug = 'crop-lima-ribbed';
UPDATE public.products SET price = 45 WHERE slug = 'cargo-butter-wide';
UPDATE public.products SET price = 49, compare_at_price = 69 WHERE slug = 'hoodie-coral-block';
UPDATE public.products SET price = 42 WHERE slug = 'pantalon-plum-relax';
UPDATE public.products SET price = 25 WHERE slug = 'tee-rayas-vibe';
UPDATE public.products SET price = 65 WHERE slug = 'platform-coral';
UPDATE public.products SET price = 79, compare_at_price = 99 WHERE slug = 'runner-cobalto-90';

UPDATE public.products SET price = 89, compare_at_price = 119 WHERE slug = 'blazer-lima-oversize';
UPDATE public.products SET price = 55 WHERE slug = 'slip-coral';
UPDATE public.products SET price = 95 WHERE slug = 'varsity-cobalto';
UPDATE public.products SET price = 65 WHERE slug = 'knit-butter';
UPDATE public.products SET price = 89 WHERE slug = 'chelsea-plum';
UPDATE public.products SET price = 55 WHERE slug = 'sneaker-low-lima';

UPDATE public.products SET price = 49 WHERE slug = 'mule-ivory';
UPDATE public.products SET price = 59 WHERE slug = 'sandalia-cobalt';
UPDATE public.products SET price = 65 WHERE slug = 'sneaker-pearl';
UPDATE public.products SET price = 75 WHERE slug = 'loafer-onyx';
UPDATE public.products SET price = 69 WHERE slug = 'high-top-graphite';