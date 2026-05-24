import { useParams } from "react-router-dom";
import { useProductBySlug } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useProductBySlug(slug || "");
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");

  if (isLoading) return <div className="p-10 text-center">Cargando producto...</div>;
  
  if (error || !product) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <p className="mt-2">No pudimos cargar la información de este producto.</p>
        <Button onClick={() => window.location.href = "/"} className="mt-4">
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 grid md:grid-cols-2 gap-10">
      {/* IMAGEN CON FALLBACK */}
      <div className="bg-gray-100 rounded-lg overflow-hidden h-[500px]">
        <img 
          src={product.images?.[0]?.url || "https://placehold.co/600x400?text=Sin+Imagen"} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Sin+Imagen" }}
        />
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">${product.price}</p>
        
        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        {/* TALLAS */}
        {product.variants && product.variants.length > 0 && (
          <div>
            <p className="text-sm font-bold mb-3">SELECCIONA TALLA:</p>
            <div className="flex gap-2">
              {product.variants.map((v) => (
                <button 
                  key={v.id} 
                  onClick={() => setSelectedSize(v.size)} 
                  className={`border py-2 px-4 transition-all ${selectedSize === v.size ? 'bg-black text-white border-black' : 'hover:border-black'}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={() => selectedSize ? addItem({...product, size: selectedSize}) : alert("Por favor selecciona una talla")} 
          className="w-full py-6 text-lg"
        >
          AÑADIR A LA BOLSA
        </Button>

        {/* INFO ADICIONAL */}
        <div className="text-sm space-y-2 pt-6 border-t">
          <p><strong>Composición:</strong> {product.material || "N/A"}</p>
          <p><strong>Cuidados:</strong> {product.care_instructions || "Lavar con prendas similares"}</p>
        </div>
      </div>
    </div>
  );
}