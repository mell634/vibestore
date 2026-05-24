import { Link } from "react-router-dom";
import { Product } from "@/types/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0]?.url ?? "/placeholder.svg";
  const agotado = (product.stock ?? 0) <= 0;
  return (
    <Link to={`/producto/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-white overflow-hidden mb-3 rounded-md">
        <img
          src={image}
          alt={product.images?.[0]?.alt ?? product.name}
          loading="lazy"
          width={896}
          height={1216}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            agotado ? "grayscale opacity-70" : "group-hover:scale-105"
          )}
        />
        {agotado && (
          <div className="absolute top-3 left-3 bg-foreground text-background text-[10px] tracking-editorial uppercase px-2 py-1 rounded-sm">
            Agotado
          </div>
        )}
        {!agotado && product.stock <= 2 && (
          <div className="absolute top-3 left-3 bg-[hsl(var(--coral))] text-ink text-[10px] tracking-editorial uppercase px-2 py-1 rounded-sm">
            Quedan {product.stock}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl leading-tight">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm tabular-nums">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-xs tabular-nums text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
