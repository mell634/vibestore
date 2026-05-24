import { useParams, Link } from "react-router-dom";
import { useProductBySlug } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useProductBySlug(slug);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (isLoading) return <div className="container py-32 text-center">Cargando producto...</div>;
  
  if (!product) {
    return (
      <div className="container py-32 text-center">
        <p className="text-2xl mb-4">Producto no encontrado</p>
        <Link to="/" className="underline text-muted-foreground">Volver al inicio</Link>
      </div>
    );
  }

  const agotado = (product.stock ?? 0) <= 0;
  
  // USAMOS LA URL COMPLETA DIRECTAMENTE DESDE SUPABASE
  const imageUrl = product.images?.[0]?.url || "/placeholder.svg";

  const handleAdd = () => {
    if (agotado) return toast.error("Producto agotado");
    if (!selectedSize) return toast.error("Por favor selecciona una talla");
    
    addItem({
      productId: product.id,
      variantId: product.id,
      name: product.name,
      slug: product.slug,
      image: imageUrl,
      size: selectedSize,
      price: product.price,
      quantity: 1,
      maxStock: product.stock,
    });
    toast.success("Añadido a la bolsa");
  };

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagen: Ahora apunta a la URL real de Supabase */}
        <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")} 
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-display text-4xl">{product.name}</h1>
            <p className="text-xl mt-2">{formatPrice(product.price)}</p>
          </div>
          
          <p className="text-foreground/80 leading-relaxed">{product.description}</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs uppercase text-muted-foreground">Selecciona talla</p>
              <button className="text-xs underline text-muted-foreground">Ver tabla de medidas</button>
            </div>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-4 py-2 border rounded-sm text-sm transition-all",
                    selectedSize === size ? "bg-foreground text-background border-foreground" : "hover:border-foreground"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleAdd} disabled={agotado} className="w-full h-14 uppercase tracking-widest">
            {agotado ? "Agotado" : "Añadir a la bolsa"}
          </Button>

          <div className="border-t pt-6 space-y-4 text-sm">
            <div>
              <p className="text-[10px] uppercase text-muted-foreground">Composición</p>
              <p>{product.material || "No especificada"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground">Cuidados</p>
              <p>{product.care_instructions || "Lavar con prendas similares"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}