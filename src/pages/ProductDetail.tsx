import { useParams, Link } from "react-router-dom";
import { useProductBySlug } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useProductBySlug(slug);
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12" aria-label="Cargando producto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
          <div className="aspect-[3/4] bg-muted rounded-md" aria-hidden="true" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" aria-hidden="true" />
            <div className="h-10 bg-muted rounded w-3/4" aria-hidden="true" />
            <div className="h-6 bg-muted rounded w-1/4" aria-hidden="true" />
            <div className="h-20 bg-muted rounded w-full" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-32 text-center" role="alert">
        <p className="font-display text-3xl mb-4">Producto no encontrado</p>
        <Link to="/" className="text-xs tracking-editorial uppercase border-b border-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const agotado = product.stock <= 0;

  const handleAdd = () => {
    if (agotado) {
      toast.error("Producto agotado");
      return;
    }
    addItem({
      productId: product.id,
      variantId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0]?.url ?? "/placeholder.svg",
      size: "Única",
      price: product.price,
      quantity: 1,
      maxStock: product.stock,
    });
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb WCAG 2.4.8 */}
      <nav aria-label="Ruta de navegación" className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-8 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">Inicio</Link>
        <ChevronRight className="size-3" aria-hidden="true" />
        {product.category && (
          <>
            <Link to={`/categoria/${product.category.slug}`} className="hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
              {product.category.name}
            </Link>
            <ChevronRight className="size-3" aria-hidden="true" />
          </>
        )}
        <span className="text-foreground" aria-current="page">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Imagen */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-white overflow-hidden rounded-md">
            <img
              src={product.images?.[0]?.url ?? "/placeholder.svg"}
              alt={product.images?.[0]?.alt ?? `Fotografía de ${product.name}`}
              width={896}
              height={1216}
              className={agotado ? "w-full h-full object-cover grayscale opacity-80" : "w-full h-full object-cover"}
            />
            {agotado && (
              <div
                className="absolute top-4 left-4 bg-foreground text-background text-xs tracking-editorial uppercase px-3 py-1.5 rounded-sm"
                aria-label="Producto agotado"
              >
                Agotado
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="md:sticky md:top-28 md:self-start space-y-8">
          <div>
            {product.category && (
              <p className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-3">
                {product.category.name}
              </p>
            )}
            <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-xl tabular-nums" aria-label={`Precio: ${formatPrice(product.price)}`}>
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-sm tabular-nums text-muted-foreground line-through" aria-label={`Precio anterior: ${formatPrice(product.compare_at_price)}`}>
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          </div>

          {product.description && (
            <p className="text-base leading-relaxed text-foreground/85">{product.description}</p>
          )}

          {/* Disponibilidad */}
          <div className="space-y-2">
            <p className="text-xs tracking-editorial uppercase text-muted-foreground">Disponibilidad</p>
            {agotado ? (
              <p className="text-sm text-destructive font-medium" role="alert">Sin existencias</p>
            ) : (
              <p className="text-sm">
                <span className="font-medium">{product.stock}</span>{" "}
                {product.stock === 1 ? "unidad disponible" : "unidades disponibles"}
              </p>
            )}
          </div>

          <Button
            onClick={handleAdd}
            disabled={agotado}
            aria-disabled={agotado}
            className="w-full h-14 text-xs tracking-editorial uppercase focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {agotado ? "Agotado" : "Añadir a la bolsa"}
          </Button>

          {(product.material || product.care_instructions) && (
            <div className="border-t border-border pt-6 space-y-4 text-sm">
              {product.material && (
                <div>
                  <p className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-1">Composición</p>
                  <p>{product.material}</p>
                </div>
              )}
              {product.care_instructions && (
                <div>
                  <p className="text-[10px] tracking-editorial uppercase text-muted-foreground mb-1">Cuidados</p>
                  <p>{product.care_instructions}</p>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-border pt-6 text-xs text-muted-foreground space-y-1" aria-label="Información de envío">
            <p>· Envío en 48–72 h</p>
            <p>· Cambios y devoluciones en 30 días</p>
          </div>
        </div>
      </div>
    </div>
  );
}
