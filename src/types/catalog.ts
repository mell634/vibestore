export type Gender = "hombre" | "mujer" | "unisex";
export type ProductType = "ropa" | "calzado" | "accesorio";
export type ProductStyle = "elegante" | "urbana" | "casual" | "deportiva";

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender: Gender;
  type: ProductType;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  stock: number;
  display_order: number;
}

export interface ProductMeasurement {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string;
  material: string | null;
  care_instructions: string | null;
  product_measurements: ProductMeasurement[];
  model_info: string | null;
  featured: boolean;
  active: boolean;
  style?: ProductStyle | null;
  stock: number;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface SizeChartData {
  unit: string;
  columns: string[];
  rows: string[][];
}

export interface SizeChart {
  id: string;
  name: string;
  gender: Gender;
  type: ProductType;
  chart: SizeChartData;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  maxStock: number;
}
