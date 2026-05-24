-- Insertar categorías que el archivo 3 (20260420235833) necesita

INSERT INTO public.categories (name, slug, gender, type, display_order)
VALUES
  ('Mujer - Ropa', 'mujer-ropa', 'mujer', 'ropa', 0),
  ('Hombre - Ropa', 'hombre-ropa', 'hombre', 'ropa', 1),
  ('Mujer - Calzado', 'mujer-calzado', 'mujer', 'calzado', 2),
  ('Hombre - Calzado', 'hombre-calzado', 'hombre', 'calzado', 3)
ON CONFLICT (slug) DO NOTHING;
