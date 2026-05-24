import { useParams } from "react-router-dom";
import { useProductsByCategory } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";

export default function Category() {
  const { slug = "" } = useParams();
  
  // DEBUG LOGS
  console.log("🔍 Category component mounted");
  console.log("📍 slug from params:", slug);
  
  const query = useProductsByCategory(slug);
  console.log("📊 query state:", { isLoading: query.isLoading, data: query.data, error: query.error });
  
  const { data, isLoading } = query;
  const { category, products } = data ?? { category: null, products: [] };
  
  console.log("✅ category:", category);
  console.log("📦 products count:", products.length);

  return (
    <div className="container py-6 md:py-10">
      <p className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">
        Catálogo
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-8">
        {isLoading ? (
          <span className="inline-block bg-muted animate-pulse rounded w-40 h-10" aria-label="Cargando categoría" />
        ) : category ? (
          category.name
        ) : (
          "Categoría"
        )}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12" aria-label="Cargando productos">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse" aria-hidden="true">
              <div className="aspect-[3/4] bg-muted rounded-md" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : !category ? (
        <p className="text-muted-foreground py-20 text-center" role="alert">
          Esta categoría no existe.
        </p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">
          Sin productos por ahora.
        </p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 list-none p-0">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}