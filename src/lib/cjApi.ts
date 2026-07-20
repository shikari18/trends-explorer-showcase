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

export interface CJProductDetail extends CJProduct {
  images: string[];      // all product images
  videoUrl: string | null;
  description: string;
  category: string;
}

// Lookup a cached product by its local ID
export function getProductById(id: string): CJProduct | null {
  return ALL_PRODUCTS.find((p) => p.id === id) || null;
}

const API_KEY = "CJ5632497@api@dd88d4a73e5d4f07905c86c16f263276";
const AUTH_URL = "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken";

let _token: string | null = null;
let _tokenFetchedAt = 0;

async function getToken(): Promise<string> {
  const now = Date.now();
  if (_token && now - _tokenFetchedAt < 23 * 60 * 60 * 1000) return _token;
  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: API_KEY }),
    });
    const data = await res.json();
    if (data.result && data.data?.accessToken) {
      _token = data.data.accessToken;
      _tokenFetchedAt = now;
      return _token!;
    }
  } catch {}
  throw new Error("CJ auth failed");
}

/**
 * Fetch full product detail from CJ API by cjId (pid).
 * Returns images array, video URL, description, etc.
 */
export async function fetchProductDetail(
  localId: string
): Promise<CJProductDetail | null> {
  const cached = getProductById(localId);
  if (!cached) return null;

  try {
    const token = await getToken();
    const res = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/queryByPid?pid=${cached.cjId}`,
      { headers: { "CJ-Access-Token": token } }
    );
    const data = await res.json();
    const d = data.data;

    if (!d) {
      // Return cached data with single image if API fails
      return {
        ...cached,
        images: [cached.img],
        videoUrl: null,
        description: cached.name,
        category: "",
      };
    }

    // Build image array — main + extras
    const imageSet: string[] = [];
    if (d.productImage) imageSet.push(d.productImage);
    if (Array.isArray(d.productImageSet)) {
      d.productImageSet.forEach((img: string) => {
        if (img && !imageSet.includes(img)) imageSet.push(img);
      });
    }
    if (imageSet.length === 0) imageSet.push(cached.img);

    const usdPrice = parseFloat(d.sellPrice || d.productPrice || "10");
    const ghsPrice = Math.round(usdPrice * EXCHANGE_RATE * MARKUP);

    return {
      ...cached,
      name: d.productNameEn || cached.name,
      price: `₵${ghsPrice.toLocaleString()}`,
      rawPrice: ghsPrice,
      img: imageSet[0],
      images: imageSet,
      videoUrl: d.productVideo || null,
      description: d.description || d.productNameEn || cached.name,
      category: d.categoryName || "",
    };
  } catch {
    // Fallback to cached
    return {
      ...cached,
      images: [cached.img],
      videoUrl: null,
      description: cached.name,
      category: "",
    };
  }
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
