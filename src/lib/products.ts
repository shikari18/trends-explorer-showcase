// Re-export everything from the live CJ API client
// The app now streams products directly from CJ with no product cap

import cjCache from "./cjCache.json";
import type { CJProduct } from "./cjApi";

export type { CJProduct } from "./cjApi";
export { CATEGORIES, fetchCategoryPage, searchCJProducts } from "./cjApi";

// Synchronous Product type alias matching CJProduct
export type Product = CJProduct;

// Flat snapshot of cached products (used for cart recommendations etc.)
export const PRODUCTS: Product[] = Object.values(
  (cjCache.products || {}) as Record<string, Product[]>
).flat();

export function getProductsByCategory(category: string): Product[] {
  return ((cjCache.products || {}) as Record<string, Product[]>)[category] || [];
}
