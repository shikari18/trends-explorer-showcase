import type { CJProduct } from "./cjApi";

export type { CJProduct } from "./cjApi";
export { CATEGORIES, fetchCategoryPage, searchCJProducts } from "./cjApi";

export type Product = CJProduct;

export const PRODUCTS: Product[] = [];

export function getProductsByCategory(category: string): Product[] {
  return [];
}
