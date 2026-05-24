import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: products = [], isLoading } = useFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden" aria-label="Colección destacada">
        <img
          src="/hero-editorial.jpg"
          alt="Modelo vistiendo la colección editorial de temporada de VibeStore"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover object-top"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink/40" aria-hidden="true" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container pb-8 md:pb-14">
            <p className="text-[10px] tracking-editorial uppercase text-paper/80 mb-4">
              Nueva selección · piezas con actitud
            </p>
            <h1 className="font-display text-paper text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl text-balance">
              Lo nuevo no avisa.<br />Te encuentra.
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/categoria/mujer"
                className="bg-[hsl(var(--lime))] text-ink px-8 py-3 text-xs tracking-editorial uppercase rounded-full font-bold shadow-pop hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Mujer →
              </Link>
              <Link
                to="/categoria/hombre"
                className="bg-[hsl(var(--cobalt))] text-paper px-8 py-3 text-xs tracking-editorial uppercase rounded-full font-bold shadow-pop hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Hombre →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="container pt-10 pb-12" aria-labelledby="featured-heading">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">
              Editor's Selection
            </p>
            <h2 id="featured-heading" className="font-display text-4xl md:text-5xl">
              Lo que estamos vistiendo ahora
            </h2>
          </div>
          <Link
            to="/categoria/mujer"
            className="hidden md:inline text-xs tracking-editorial uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
          >
            Ver todo
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12" aria-label="Cargando productos">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse" aria-hidden="true">
                <div className="aspect-[3/4] bg-muted rounded-md" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground py-20 text-center">
            No hay productos destacados por ahora. Vuelve pronto.
          </p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 list-none p-0">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Colecciones */}
      <section className="container pb-12" aria-labelledby="collections-heading">
        <p className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-2">
          Explora la tienda
        </p>
        <h2 id="collections-heading" className="font-display text-4xl md:text-5xl mb-6">
          Dos colecciones, infinitas combinaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Mujer", to: "/categoria/mujer", bg: "bg-[hsl(var(--lime))]", fg: "text-[hsl(var(--ink))]" },
            { label: "Hombre", to: "/categoria/hombre", bg: "bg-[hsl(var(--cobalt))]", fg: "text-[hsl(var(--paper))]" },
          ].map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className={cn(
                "aspect-[16/9] md:aspect-[3/2] rounded-2xl flex items-end p-6 font-display text-3xl md:text-4xl transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                s.bg,
                s.fg
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}