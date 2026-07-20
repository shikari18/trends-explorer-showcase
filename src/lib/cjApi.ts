// CJ Dropshipping API client with local cache proxy
// To avoid CORS browser blocks and ensure 100% reliability for App Store submission,
// this module queries the cached CJ catalog (fetched via Node) and replicates
// the asynchronous paginated API behavior.

import cjCache from "./cjCache.json";

export const EXCHANGE_RATE = 15.0;
export const MARKUP = 1.1;

export const CATEGORY_MAP: Record<string, string> = {
  "Women's Clothing": "2FE8A083-5E7B-4179-896D-561EA116F730",
  "Pet Supplies": "2409110611570657700",
  "Home, Garden & Furniture": "52FC6CA5-669B-4D0B-B1AC-415675931399",
  "Health, Beauty & Hair": "2C7D4A0B-1AB2-41EC-8F9E-13DC31B1C902",
  "Jewelry & Watches": "2837816E-2FEA-4455-845C-6F40C6D70D1E",
  "Men's Clothing": "B8302697-CF47-4211-9BD0-DFE8995AEB30",
  "Bags & Shoes": "2415A90C-5D7B-4CC7-BA8C-C0949F9FF5D8",
  "Toys, Kids & Babies": "A50A92FA-BCB3-4716-9BD9-BEC629BEE735",
  "Sports & Outdoors": "4B397425-26C1-4D0E-B6D2-96B0B03689DB",
  "Consumer Electronics": "D9E66BF8-4E81-4CAB-A425-AEDEC5FBFBF2",
  "Home Improvement": "6A5D2EB4-13BD-462E-A627-78CFED11B2A2",
  "Automobiles & Motorcycles": "A2F799BE-FB59-428E-A953-296AA2673FCF",
  "Phones & Accessories": "E9FDC79A-8365-4CA6-AC23-64D971F08B8B",
  "Computer & Office": "1126E280-CB7D-418A-90AB-7118E2D97CCC"
};

export const SLUG_TO_CATEGORY: Record<string, string> = {
  "womens-clothing": "Women's Clothing",
  "pet-supplies": "Pet Supplies",
  "home-garden-furniture": "Home, Garden & Furniture",
  "health-beauty-hair": "Health, Beauty & Hair",
  "jewelry-watches": "Jewelry & Watches",
  "mens-clothing": "Men's Clothing",
  "bags-shoes": "Bags & Shoes",
  "toys-kids-babies": "Toys, Kids & Babies",
  "sports-outdoors": "Sports & Outdoors",
  "consumer-electronics": "Consumer Electronics",
  "home-improvement": "Home Improvement",
  "automobiles-motorcycles": "Automobiles & Motorcycles",
  "phones-accessories": "Phones & Accessories",
  "computer-office": "Computer & Office"
};

export const CATEGORIES = Object.keys(CATEGORY_MAP);

export interface CJProduct {
  id: string;
  cjId: string;
  brand: string;
  name: string;
  price: string;
  rawPrice: number;
  img: string;
  rating: number;
  reviews: string;
}

// Flat array of all products across all categories
const ALL_PRODUCTS: CJProduct[] = Object.values(
  (cjCache.products || {}) as Record<string, CJProduct[]>
).flat();

/**
 * Fetch a page of products for a given category.
 * Mimics an asynchronous api call with pagination.
 */
export async function fetchCategoryPage(
  category: string,
  page: number,
  pageSize = 20
): Promise<{ products: CJProduct[]; hasMore: boolean }> {
  // Add a small artificial delay to show standard loading states/skeletons beautifully
  await new Promise((resolve) => setTimeout(resolve, 600));

  const list = ((cjCache.products || {}) as Record<string, CJProduct[]>)[category] || [];
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = list.slice(start, end);

  return {
    products: pageItems,
    hasMore: end < list.length
  };
}

/**
 * Search across all categories.
 */
export async function searchCJProducts(
  query: string,
  page = 1,
  pageSize = 20
): Promise<{ products: CJProduct[]; hasMore: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const cleanQuery = query.toLowerCase().trim();
  const matched = cleanQuery
    ? ALL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.brand.toLowerCase().includes(cleanQuery)
      )
    : ALL_PRODUCTS;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = matched.slice(start, end);

  return {
    products: pageItems,
    hasMore: end < matched.length
  };
}
