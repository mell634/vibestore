import { useParams } from "react-router-dom";
import { useProductBySlug } from "@/hooks/useProducts";

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading, error } = useProductBySlug(slug || "");

  console.log("Slug buscado:", slug);
  console.log("Producto obtenido:", product);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar producto.</div>;
  if (!product) return <div>No encontramos el producto con slug: {slug}</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <img src={product.images?.[0]?.url} alt={product.name} className="w-64" />
      {/* Resto de tu código... */}
    </div>
  );
}