ALTER TABLE public.products ADD COLUMN IF NOT EXISTS style text;

UPDATE public.products SET style = 'elegante' WHERE slug IN (
  'abrigo-gris-largo','trench-atelier','blazer-crema-sastre','blusa-blanca-lino',
  'botin-cafe-tacon-bajo','chelsea-plum-suede','bota-chelsea-onyx','camisa-lino-bianco',
  'falda-negra-acampanada','falda-sage-plisada','loafer-onyx-city','sandalia-cobalt-night',
  'sandalia-nude-tacon','slip-dress-coral-satin','vestido-slip-noir','oxford-cafe-hombre'
);

UPDATE public.products SET style = 'urbana' WHERE slug IN (
  'blazer-lima-power','hoodie-coral-block','bomber-cobalto','chaqueta-jean-clasica',
  'varsity-cobalto-90s','wide-leg-indigo','cargo-butter-wide','platform-coral',
  'crop-lima-ribbed'
);

UPDATE public.products SET style = 'casual' WHERE slug IN (
  'balerinas-rosa','bolso-tan-crossbody','chukka-tan-hombre','tee-rayas-vibe',
  'mule-ivory-daily','pantalon-plum-relax','sandalias-cafe-cuero','knit-butter-mock',
  'knit-cocoon','sneaker-bianca','canvas-blanco-mujer','tenis-negros-cuero',
  'slipon-negro-hombre'
);

UPDATE public.products SET style = 'deportiva' WHERE slug IN (
  'high-top-graphite','low-lime-court','sneaker-pearl-move','runner-cobalto-90s',
  'runner-blanco-hombre'
);

UPDATE public.products SET style = 'casual' WHERE style IS NULL;

CREATE INDEX IF NOT EXISTS idx_products_style ON public.products(style);