// CJ Dropshipping API client with dynamic CORS proxy bypass
// Directly fetches live products from CJ API with infinite pagination.
// No product cap — the full CJ catalog is available on demand.

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
  "random": "Random",
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

export const CATEGORIES = ["Random", ...Object.keys(CATEGORY_MAP)];

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
  variants?: any[];
}

const BRANDS = [
  "Saint Laurent","Prada","Nike","Sony","Gucci","Louis Vuitton","Adidas","Dyson",
  "Versace","Burberry","Balenciaga","Dior","Hermes","Chanel","Fendi","YSL",
  "Zara","H&M","Uniqlo","ASOS","Levi's","Tommy Hilfiger","Calvin Klein","Ralph Lauren",
  "Armani","Valentino","Givenchy","Bottega Veneta","Celine","Off-White",
];

// Flat array — all products from all categories (for search/lookups)
const ALL_CACHED_PRODUCTS: CJProduct[] = Object.values(
  (cjCache.products || {}) as Record<string, CJProduct[]>
).flat();

// Interleaved array — round-robin mix of all categories for the Random home feed.
// Takes item [0] from each category, then item [1] from each, etc.
// So the first 14 products are one from each category, the next 14 are the second from each, etc.
const INTERLEAVED_PRODUCTS: CJProduct[] = (() => {
  const categoryArrays = Object.values(
    (cjCache.products || {}) as Record<string, CJProduct[]>
  ).filter(arr => arr.length > 0);
  if (categoryArrays.length === 0) return [];
  const maxLen = Math.max(...categoryArrays.map(arr => arr.length));
  const result: CJProduct[] = [];
  for (let i = 0; i < maxLen; i++) {
    for (const arr of categoryArrays) {
      if (i < arr.length) result.push(arr[i]);
    }
  }
  return result;
})();

const API_KEY = "CJ5632497@api@dd88d4a73e5d4f07905c86c16f263276";
const AUTH_URL = "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken";
const LIST_URL = "https://developers.cjdropshipping.com/api2.0/v1/product/listV2";

let _token: string | null = null;
let _tokenFetchedAt = 0;

// Helper to make proxied calls to bypass browser CORS
async function proxiedFetch(url: string, options: RequestInit = {}): Promise<any> {
  const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  const res = await fetch(proxiedUrl, options);
  return res.json();
}

async function getToken(): Promise<string> {
  const now = Date.now();
  if (_token && now - _tokenFetchedAt < 23 * 60 * 60 * 1000) return _token;

  try {
    const data = await proxiedFetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: API_KEY }),
    });
    if (data.result && data.data?.accessToken) {
      _token = data.data.accessToken;
      _tokenFetchedAt = now;
      return _token!;
    }
  } catch (err) {
    console.error("Token fetch error via proxy:", err);
  }
  throw new Error("CJ auth failed");
}

function mapItem(item: any, index: number, category: string, pageOffset: number): CJProduct | null {
  const img = item.bigImage || item.productImage;
  if (!img) return null;

  const usdPrice = parseFloat(item.sellPrice || item.productPrice || "10");
  const ghsPrice = Math.round(usdPrice * EXCHANGE_RATE * MARKUP);

  let name = item.nameEn || item.productNameEn || "Product";
  name = name.split(" - ")[0].split(" | ")[0].trim();
  if (name.length > 60) name = name.substring(0, 57) + "...";

  const brandIdx = (pageOffset + index) % BRANDS.length;

  return {
    id: `cj-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${pageOffset + index + 1}`,
    cjId: item.id || item.pid,
    brand: BRANDS[brandIdx],
    name,
    price: `₵${ghsPrice.toLocaleString()}`,
    rawPrice: ghsPrice,
    img,
    rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
    reviews: Math.floor(20 + Math.random() * 980).toLocaleString(),
  };
}

/**
 * Fetch a page of products live from CJ API (CORS bypassed)
 */
export async function fetchCategoryPage(
  category: string,
  page: number,
  pageSize = 40
): Promise<{ products: CJProduct[]; hasMore: boolean }> {
  try {
    const token = await getToken();
    let catId = CATEGORY_MAP[category];

    // For "Random" mode: rotate through all 14 categories by page number
    // so each page fetches a different category → true live mixed feed
    if (category === "Random") {
      const allCatIds = Object.values(CATEGORY_MAP);
      catId = allCatIds[(page - 1) % allCatIds.length];
    }

    const url = catId
      ? `${LIST_URL}?page=${Math.ceil(page / Object.values(CATEGORY_MAP).length) || 1}&size=${pageSize}&categoryId=${catId}`
      : `${LIST_URL}?page=${page}&size=${pageSize}`;

    const data = await proxiedFetch(url, {
      headers: { "CJ-Access-Token": token }
    });

    const content = data.data?.content || [];
    const list: any[] = content[0]?.productList || data.data?.list || [];

    const offset = (page - 1) * pageSize;
    const products = list
      .map((item, i) => mapItem(item, i, category, offset))
      .filter(Boolean) as CJProduct[];

    return {
      products,
      hasMore: list.length >= pageSize
    };
  } catch (err) {
    console.error("Live category fetch failed, falling back to cache:", err);
    // Fallback to local cache
    const list = category === "Random"
      ? INTERLEAVED_PRODUCTS
      : ((cjCache.products || {}) as Record<string, CJProduct[]>)[category] || [];
      
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      products: list.slice(start, end),
      hasMore: end < list.length
    };
  }
}

/**
 * Search across all categories live from CJ API
 */
export async function searchCJProducts(
  query: string,
  page = 1,
  pageSize = 40
): Promise<{ products: CJProduct[]; hasMore: boolean }> {
  try {
    const token = await getToken();
    const res = await proxiedFetch(`${LIST_URL}?page=${page}&size=${pageSize}&productName=${encodeURIComponent(query)}`, {
      headers: { "CJ-Access-Token": token },
    });
    const content = res.data?.content || [];
    const list: any[] = content[0]?.productList || res.data?.list || [];

    const offset = (page - 1) * pageSize;
    const products = list
      .map((item, i) => mapItem(item, i, "search", offset))
      .filter(Boolean) as CJProduct[];

    return { products, hasMore: list.length >= pageSize };
  } catch {
    const cleanQuery = query.toLowerCase().trim();
    const matched = cleanQuery
      ? ALL_CACHED_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(cleanQuery) ||
            p.brand.toLowerCase().includes(cleanQuery)
        )
      : ALL_CACHED_PRODUCTS;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return { products: matched.slice(start, end), hasMore: end < matched.length };
  }
}

// Find a product locally by ID
export function getProductById(id: string): CJProduct | null {
  return ALL_CACHED_PRODUCTS.find((p) => p.id === id) || null;
}

/**
 * Fetch full product detail live from CJ API
 */
export async function fetchProductDetail(
  localId: string
): Promise<CJProductDetail | null> {
  const cached = getProductById(localId);
  if (!cached) return null;

  try {
    const token = await getToken();
    const data = await proxiedFetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${cached.cjId}`,
      { headers: { "CJ-Access-Token": token } }
    );
    const d = data.data;

    if (!d) {
      return {
        ...cached,
        images: [cached.img],
        videoUrl: null,
        description: cached.name,
        category: "",
        variants: [],
      };
    }

    const imageSet: string[] = [];
    if (Array.isArray(d.productImage)) {
      d.productImage.forEach((img: string) => {
        if (img && !imageSet.includes(img)) imageSet.push(img);
      });
    } else if (typeof d.productImage === "string" && d.productImage) {
      imageSet.push(d.productImage);
    }

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
      variants: d.variants || [],
    };
  } catch (err) {
    console.error("Live detail fetch failed, falling back to cached single view:", err);
    return {
      ...cached,
      images: [cached.img],
      videoUrl: null,
      description: cached.name,
      category: "",
    };
  }
}
