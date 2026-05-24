import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mockDb } from "@/lib/mockDb";
import { Category, Product } from "@/types/catalog";

function mapProduct(raw: any): Product {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    price: Number(raw.price),
    compare_at_price: raw.compare_at_price ? Number(raw.compare_at_price) : null,
    category_id: raw.category_id,
    category: raw.categories
      ? { id: raw.categories.id, name: raw.categories.name, slug: raw.categories.slug, gender: raw.categories.gender, type: raw.categories.type }
      : undefined,
    material: raw.material ?? null,
    care_instructions: raw.care_instructions ?? null,
    model_info: raw.model_info ?? null,
    featured: raw.featured ?? false,
    active: raw.active ?? true,
    style: raw.style ?? null,
    stock: (raw.product_variants ?? []).reduce((s: number, v: any) => s + (v.stock ?? 0), 0),
    images: (raw.product_images ?? [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => ({ id: img.id, url: img.url, alt: img.alt ?? raw.name })),
    variants: (raw.product_variants ?? [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((v: any) => ({ id: v.id, size: v.size, stock: v.stock })),
    product_measurements: raw.product_measurements ?? [],
  };
}

const PRODUCT_SELECT = `
  id, name, slug, description, price, compare_at_price,
  category_id, material, care_instructions, model_info,
  featured, active, style, product_measurements,
  categories ( id, name, slug, gender, type ),
  product_images ( id, url, alt, display_order ),
  product_variants ( id, size, stock, display_order )
`;

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("active", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []).map(mapProduct) as Product[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsByCategory(slug: string) {
  return useQuery({
    queryKey: ["products", "category", slug],
    queryFn: async () => {
      const { data: cat } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
      if (cat) {
        const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("category_id", cat.id).eq("active", true);
        return { category: cat as Category, products: (data ?? []).map(mapProduct) as Product[] };
      }
      return { category: mockDb.getCategoryBySlug(slug), products: mockDb.getProductsByCategorySlug(slug) };
    },
    enabled: !!slug,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["products", "slug", slug],
    queryFn: async () => {
      const cleanSlug = slug.trim();
      console.log("Intentando buscar en Supabase slug:", cleanSlug);
      
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", cleanSlug)
        .maybeSingle();
        
      if (error) {
        console.error("Error crítico de Supabase:", error);
        throw error;
      }
      
      console.log("Resultado de Supabase:", data);
      return data ? mapProduct(data) : null;
    },
    enabled: !!slug,
    retry: false,
  });
}

export function useSearchProducts(q: string) {
  return useQuery({
    queryKey: ["products", "search", q],
    queryFn: async () => {
      if (!q.trim()) return [] as Product[];
      const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("active", true).ilike("name", `%${q}%`).limit(40);
      return (data ?? []).map(mapProduct) as Product[];
    },
    enabled: q.trim().length > 0,
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("display_order");
      return (data ?? []) as Category[];
    },
  });
}

export function useSizeChart(_gender?: string, _type?: string) {
  return { data: null, isLoading: false };
}