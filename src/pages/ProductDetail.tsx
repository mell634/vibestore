import { useParams } from "react-router-dom";
import { useProductBySlug } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import { useState } from "react";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useProductBySlug(slug);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (isLoading) return <div className="p-10">Cargando...</div>;
  if (!product) return <div className="p-10">Producto no encontrado.</div>;

  return (
    <div className="container py-10 grid md:grid-cols-2 gap-10">
      {/* IMAGEN */}
      <div className="bg-gray-100 rounded-lg overflow-hidden h-[500px]">
        <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* INFO */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl">{formatPrice(product.price)}</p>
        
        {/* Tallas */}
        <div>
          <p className="text-sm font-bold mb-2">Selecciona talla:</p>
          <div className="flex gap-2">
            {["S", "M", "L", "XL"].map(size => (
              <button key={size} onClick={() => setSelectedSize(size)} className={`border p-2 ${selectedSize === size ? 'bg-black text-white' : ''}`}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={() => addItem({...product, size: selectedSize})} className="w-full">Añadir a la bolsa</Button>
      </div>
    </div>
  );
}