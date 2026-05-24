import { Category, Product } from "@/types/catalog";

const INITIAL_STOCK = 5;
const STOCK_KEY = "vibestore.mockdb.stock.v1";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-mujer", name: "Mujer", slug: "mujer", gender: "mujer", type: "ropa" },
  { id: "cat-hombre", name: "Hombre", slug: "hombre", gender: "hombre", type: "ropa" },
];

type Seed = Omit<Product, "stock" | "category" | "images" | "variants" | "product_measurements"> & {
  image: string;
};

const seeds: Seed[] = [
  { id: "p-m-01", name: "Trench camel oversize", slug: "trench-camel-mujer", description: "Trench atemporal en algodón tratado, corte oversize y cinturón a la cintura.", price: 189, compare_at_price: 229, category_id: "cat-mujer", material: "100% algodón", care_instructions: "Lavado en seco", model_info: null, featured: true, active: true, style: "elegante", image: "/product-trench-mujer.jpg" },
  { id: "p-m-02", name: "Vestido midi satinado", slug: "vestido-midi-mujer", description: "Vestido satinado con caída fluida, ideal para ocasión.", price: 145, compare_at_price: null, category_id: "cat-mujer", material: "Satén 95% poliéster", care_instructions: "Lavar a mano", model_info: null, featured: true, active: true, style: "elegante", image: "/product-dress-mujer.jpg" },
  { id: "p-m-03", name: "Knit costilla crema", slug: "knit-crema-mujer", description: "Suéter de punto costilla, tacto suave y silueta ceñida.", price: 79, compare_at_price: null, category_id: "cat-mujer", material: "70% algodón 30% poliamida", care_instructions: "Lavar en frío", model_info: null, featured: true, active: true, style: "casual", image: "/product-knit-mujer.jpg" },
  { id: "p-m-04", name: "Bomber técnica oliva", slug: "bomber-oliva-mujer", description: "Bomber con acabado mate y elásticos contrastados.", price: 129, compare_at_price: 159, category_id: "cat-mujer", material: "Nylon reciclado", care_instructions: "Lavado a 30°", model_info: null, featured: true, active: true, style: "urbana", image: "/product-bomber-mujer.jpg" },
  { id: "p-m-05", name: "Top crop nervaduras", slug: "crop-nervaduras-mujer", description: "Top corto con costuras estructuradas.", price: 49, compare_at_price: null, category_id: "cat-mujer", material: "Punto técnico", care_instructions: "Lavar en frío", model_info: null, featured: false, active: true, style: "casual", image: "/product-crop-mujer.jpg" },
  { id: "p-m-06", name: "Pantalón cargo lino", slug: "cargo-lino-mujer", description: "Pantalón cargo wide-leg en lino lavado.", price: 119, compare_at_price: null, category_id: "cat-mujer", material: "Lino 100%", care_instructions: "Lavar en frío", model_info: null, featured: false, active: true, style: "urbana", image: "/product-cargo-mujer.jpg" },
  { id: "p-m-07", name: "Plataforma blanca chunky", slug: "plataforma-blanca-mujer", description: "Sneaker plataforma con suela inyectada.", price: 159, compare_at_price: null, category_id: "cat-mujer", material: "Piel sintética", care_instructions: "Limpiar con paño húmedo", model_info: null, featured: false, active: true, style: "deportiva", image: "/product-platform-mujer.jpg" },
  { id: "p-m-08", name: "Blazer lima entallado", slug: "blazer-lima-mujer", description: "Blazer de un botón en tono lima vibrante.", price: 179, compare_at_price: null, category_id: "cat-mujer", material: "Mezcla de lana", care_instructions: "Lavado en seco", model_info: null, featured: false, active: true, style: "elegante", image: "/product-blazer-lime-mujer.jpg" },
  { id: "p-m-09", name: "Slip dress coral", slug: "slip-coral-mujer", description: "Slip dress con tirantes finos y corte al bies.", price: 99, compare_at_price: null, category_id: "cat-mujer", material: "Satén", care_instructions: "Lavar a mano", model_info: null, featured: false, active: true, style: "elegante", image: "/product-slip-coral-mujer.jpg" },
  { id: "p-m-10", name: "Blusa blanca clásica", slug: "blusa-blanca-mujer", description: "Blusa de popelín con cuello camisero.", price: 69, compare_at_price: null, category_id: "cat-mujer", material: "Popelín 100% algodón", care_instructions: "Lavado normal", model_info: null, featured: false, active: true, style: "elegante", image: "/product-blusa-blanca-mujer.jpg" },

  { id: "p-h-01", name: "Blazer estructurado grafito", slug: "blazer-grafito-hombre", description: "Blazer de corte recto, hombro natural y solapa de pico.", price: 219, compare_at_price: 259, category_id: "cat-hombre", material: "Lana fría", care_instructions: "Lavado en seco", model_info: null, featured: true, active: true, style: "elegante", image: "/product-blazer-hombre.jpg" },
  { id: "p-h-02", name: "Camisa oxford lavada", slug: "camisa-oxford-hombre", description: "Camisa Oxford de algodón con caída relajada.", price: 79, compare_at_price: null, category_id: "cat-hombre", material: "Algodón 100%", care_instructions: "Lavado normal", model_info: null, featured: true, active: true, style: "casual", image: "/product-shirt-hombre.jpg" },
  { id: "p-h-03", name: "Jeans rectos índigo", slug: "jeans-indigo-hombre", description: "Jeans clásicos en denim rígido índigo.", price: 109, compare_at_price: null, category_id: "cat-hombre", material: "Denim 100% algodón", care_instructions: "Lavar del revés", model_info: null, featured: true, active: true, style: "casual", image: "/product-jeans-hombre.jpg" },
  { id: "p-h-04", name: "Hoodie peso medio", slug: "hoodie-medio-hombre", description: "Sudadera con capucha en algodón cepillado.", price: 89, compare_at_price: null, category_id: "cat-hombre", material: "Algodón cepillado", care_instructions: "Lavar en frío", model_info: null, featured: true, active: true, style: "urbana", image: "/product-hoodie-hombre.jpg" },
  { id: "p-h-05", name: "Pantalón sastre fluido", slug: "pantalon-sastre-hombre", description: "Pantalón de sastrería con pinzas y caída fluida.", price: 129, compare_at_price: null, category_id: "cat-hombre", material: "Lana tropical", care_instructions: "Lavado en seco", model_info: null, featured: false, active: true, style: "elegante", image: "/product-pants-hombre.jpg" },
  { id: "p-h-06", name: "Tee box-fit pesada", slug: "tee-boxfit-hombre", description: "Camiseta de algodón pesado con corte cuadrado.", price: 39, compare_at_price: null, category_id: "cat-hombre", material: "Algodón 240 g", care_instructions: "Lavado normal", model_info: null, featured: false, active: true, style: "casual", image: "/product-tee-hombre.jpg" },
  { id: "p-h-07", name: "Runner técnica gris", slug: "runner-gris-hombre", description: "Tenis runner con malla técnica y mediasuela acolchada.", price: 169, compare_at_price: null, category_id: "cat-hombre", material: "Malla técnica", care_instructions: "Limpiar con paño húmedo", model_info: null, featured: false, active: true, style: "deportiva", image: "/product-runner-hombre.jpg" },
  { id: "p-h-08", name: "Varsity cobalto", slug: "varsity-cobalto-hombre", description: "Chaqueta varsity con cuerpo lana y mangas en piel sintética.", price: 199, compare_at_price: null, category_id: "cat-hombre", material: "Lana / piel sintética", care_instructions: "Lavado en seco", model_info: null, featured: false, active: true, style: "urbana", image: "/product-varsity-cobalt-hombre.jpg" },
  { id: "p-h-09", name: "Knit mantequilla", slug: "knit-mantequilla-hombre", description: "Jersey de punto fino en tono mantequilla.", price: 89, compare_at_price: null, category_id: "cat-hombre", material: "Algodón 100%", care_instructions: "Lavar en frío", model_info: null, featured: false, active: true, style: "casual", image: "/product-knit-butter-hombre.jpg" },
  { id: "p-h-10", name: "Abrigo lana gris", slug: "abrigo-lana-hombre", description: "Abrigo cruzado de lana con corte sastre.", price: 259, compare_at_price: null, category_id: "cat-hombre", material: "Mezcla de lana 70%", care_instructions: "Lavado en seco", model_info: null, featured: false, active: true, style: "elegante", image: "/product-abrigo-gris-hombre.jpg" },
];

const BASE_PRODUCTS: Product[] = seeds.map((s) => {
  const category = MOCK_CATEGORIES.find((c) => c.id === s.category_id)!;
  const { image, ...rest } = s;
  return {
    ...rest,
    stock: INITIAL_STOCK,
    category,
    product_measurements: [],
    images: [{ id: `${s.id}-img`, url: image, alt: s.name, display_order: 0 }],
    variants: [],
  };
});

type StockMap = Record<string, number>;

function loadStock(): StockMap {
  try {
    const raw = localStorage.getItem(STOCK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StockMap;
      const merged: StockMap = {};
      for (const p of BASE_PRODUCTS) {
        merged[p.id] = typeof parsed[p.id] === "number" ? parsed[p.id] : INITIAL_STOCK;
      }
      return merged;
    }
  } catch {}
  const fresh: StockMap = {};
  for (const p of BASE_PRODUCTS) fresh[p.id] = INITIAL_STOCK;
  return fresh;
}

let stockMap: StockMap = typeof window !== "undefined" ? loadStock() : {};
const listeners = new Set<() => void>();

function persistAndNotify() {
  try {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stockMap));
  } catch {}
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STOCK_KEY) {
      stockMap = loadStock();
      listeners.forEach((l) => l());
    }
  });
}

export const mockDb = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  getStock(productId: string): number {
    return stockMap[productId] ?? 0;
  },
  getCategories(): Category[] {
    return MOCK_CATEGORIES;
  },
  getCategoryBySlug(slug: string): Category | null {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  },
  getProducts(): Product[] {
    return BASE_PRODUCTS.map((p) => ({ ...p, stock: stockMap[p.id] ?? 0 }));
  },
  getProductBySlug(slug: string): Product | null {
    const p = BASE_PRODUCTS.find((x) => x.slug === slug);
    if (!p) return null;
    return { ...p, stock: stockMap[p.id] ?? 0 };
  },
  getProductsByCategorySlug(slug: string): Product[] {
    const cat = MOCK_CATEGORIES.find((c) => c.slug === slug);
    if (!cat) return [];
    return BASE_PRODUCTS.filter((p) => p.category_id === cat.id).map((p) => ({
      ...p,
      stock: stockMap[p.id] ?? 0,
    }));
  },
  searchProducts(q: string): Product[] {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return BASE_PRODUCTS.filter((p) => p.name.toLowerCase().includes(needle)).map((p) => ({
      ...p,
      stock: stockMap[p.id] ?? 0,
    }));
  },
  checkStock(items: { productId: string; quantity: number }[]): string | null {
    for (const it of items) {
      const available = stockMap[it.productId] ?? 0;
      if (available < it.quantity) {
        const p = BASE_PRODUCTS.find((x) => x.id === it.productId);
        return p?.name ?? "producto";
      }
    }
    return null;
  },
  decrementStock(items: { productId: string; quantity: number }[]) {
    for (const it of items) {
      const current = stockMap[it.productId] ?? 0;
      stockMap[it.productId] = Math.max(0, current - it.quantity);
    }
    persistAndNotify();
  },
  resetStock() {
    for (const p of BASE_PRODUCTS) stockMap[p.id] = INITIAL_STOCK;
    persistAndNotify();
  },
};