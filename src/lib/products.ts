// Re-export everything from the live CJ API client
// The app now streams products directly from CJ with no product cap

export type { CJProduct as Product } from "./cjApi";
export { CATEGORIES, fetchCategoryPage, searchCJProducts } from "./cjApi";

// Keep a small local snapshot from the last cache run for components
// that need a synchronous product list (cart recommendations, etc.)
import cjCache from "./cjCache.json";

export interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  rawPrice?: number;
  img: string;
  rating?: number;
  reviews?: string;
  categoryId?: string;
  cjId?: string;
}

// Flat snapshot of cached products (used for cart recommendations etc.)
export const PRODUCTS: Product[] = Object.values(
  cjCache.products as Record<string, Product[]>
).flat();

export function getProductsByCategory(category: string): Product[] {
  return ((cjCache.products as Record<string, Product[]>)[category] || []);
}
