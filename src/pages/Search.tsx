import { useSearchParams } from "react-router-dom";
import { useSearchProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const { data = [], isLoading } = useSearchProducts(q);

  return (
    <div className="container py-12 md:py-20">
      <p className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-3">
        Buscar
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-10">
        {q ? <>Resultados para <span lang="es">"{q}"</span></> : "Escribe algo en el buscador"}
      </h1>

      {/* Status para lectores de pantalla */}
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading
          ? "Buscando productos..."
          : q
          ? `${data.length} ${data.length === 1 ? "resultado" : "resultados"} para ${q}`
          : ""}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse" aria-hidden="true">
              <div className="aspect-[3/4] bg-muted rounded-md" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">
          {q ? "No encontramos piezas con ese nombre." : ""}
        </p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 list-none p-0">
          {data.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
