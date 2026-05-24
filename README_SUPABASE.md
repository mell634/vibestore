# Guía de conexión con Supabase — VibeStore

## Prerrequisitos
- Cuenta en [supabase.com](https://supabase.com)
- Node.js 18+ o Bun instalado
- Este repositorio clonado

---

## Paso 1 — Crear el proyecto en Supabase

1. Entra a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Haz clic en **New project**
3. Anota:
   - **Project URL**: `https://<tu-id>.supabase.co`
   - **Anon public key**: la clave `anon` de la sección API

---

## Paso 2 — Configurar variables de entorno

Edita el archivo `.env` en la raíz del proyecto:

```
VITE_SUPABASE_URL=https://<tu-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<tu-anon-key>
VITE_SUPABASE_PROJECT_ID=<tu-id>
```

---

## Paso 3 — Ejecutar las migraciones en orden

En el **SQL Editor** de tu proyecto Supabase, ejecuta los archivos en este orden:

1. `supabase/migrations/20260417130106_...sql` — Tablas base (categories, products, variants, images, size_charts, user_roles)
2. `supabase/migrations/20260417130443_...sql` — Tablas de pedidos (orders, order_items)
3. `supabase/migrations/20260420235833_...sql` — Pagos y perfiles
4. `supabase/migrations/20260421002954_...sql` — Políticas adicionales
5. `supabase/migrations/20260513155207_...sql` — Actualizaciones
6. Los demás archivos de migración en orden cronológico
7. **`supabase/migrations/20260524000000_seed_products.sql`** — Datos iniciales de productos ← **NUEVO**

---

## Paso 4 — Subir imágenes de productos (recomendado para producción)

Las imágenes están bundleadas en `src/assets/`. Para producción real:

1. En Supabase Dashboard → **Storage** → Crear bucket `products` (público)
2. Subir todos los archivos de `src/assets/product-*.jpg`
3. En el SQL Editor ejecutar:

```sql
-- Registrar imagen de ejemplo (repetir para cada producto)
INSERT INTO public.product_images (product_id, url, alt, display_order)
VALUES (
  '<uuid-del-producto>',
  'https://<tu-id>.supabase.co/storage/v1/object/public/products/product-trench-mujer.jpg',
  'Trench camel oversize',
  0
);
```

> **Para desarrollo local**: las imágenes se sirven directo desde `src/assets/` sin necesidad de Storage.

---

## Paso 5 — Crear usuario administrador

1. En Supabase → **Authentication** → Crear un usuario con tu email
2. Copiar el UUID del usuario
3. En el SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<tu-uuid>', 'admin');
```

---

## Paso 6 — Instalar dependencias y correr el proyecto

```bash
# Con npm
npm install
npm run dev

# Con bun
bun install
bun dev
```

La app estará en `http://localhost:5173`

---

## Estructura de la base de datos

| Tabla | Descripción |
|-------|-------------|
| `categories` | Categorías (Mujer, Hombre) |
| `products` | Catálogo de productos |
| `product_images` | Imágenes por producto |
| `product_variants` | Tallas y stock por producto |
| `orders` | Pedidos de clientes |
| `order_items` | Líneas de cada pedido |
| `profiles` | Perfil del usuario |
| `user_roles` | Roles (admin / customer) |

---

## Autenticación

El proyecto usa **Supabase Auth** con email/contraseña.  
Los usuarios nuevos se registran desde `/auth?tab=signup`.  
Las políticas RLS aseguran que cada usuario solo vea sus propios pedidos.

