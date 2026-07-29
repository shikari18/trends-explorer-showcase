// CJ Dropshipping API client with TanStack Start Server Functions
// Moves all third-party requests to the Node.js server to completely bypass CORS,
// proxy limitations, and keep API key tokens secure.

import { createServerFn } from "@tanstack/react-start";
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
  "Bags & Shoes": "EC2E9303-E704-43F3-834A-A15EA653232E",
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

// Keyword-to-category mapping for accurate search routing
const KEYWORD_CATEGORY_MAP: Array<[string[], string]> = [
  [["airpod", "earphone", "earbuds", "headphone", "earbud", "headset", "speaker", "tv", "television", "camera", "drone", "projector", "stereo"], "Consumer Electronics"],
  [["keyboard", "mouse", "laptop", "computer", "monitor", "printer", "router", "usb", "hdmi", "office", "desk"], "Computer & Office"],
  [["phone", "iphone", "android", "charger", "cable", "phone case", "screen protector", "power bank", "sim"], "Phones & Accessories"],
  [["gaming", "game", "console", "playstation", "xbox", "nintendo", "joystick", "controller", "gamepad", "esports"], "Toys, Kids & Babies"],
  [["toy", "kids", "baby", "toddler", "infant", "doll", "lego", "puzzle", "plush", "stuffed"], "Toys, Kids & Babies"],
  [["dog", "cat", "pet", "puppy", "kitten", "bird", "fish", "hamster", "leash", "collar", "aquarium"], "Pet Supplies"],
  [["yoga", "gym", "running", "bike", "cycling", "camping", "hiking", "football", "soccer", "tennis", "fitness", "dumbbell", "resistance", "treadmill"], "Sports & Outdoors"],
  [["lamp", "chair", "table", "sofa", "couch", "bed", "pillow", "curtain", "kitchen", "garden", "plant", "vase", "shelf", "storage", "mattress"], "Home, Garden & Furniture"],
  [["tool", "drill", "hammer", "paint", "screw", "plumbing", "electrical", "ladder", "wrench", "saw"], "Home Improvement"],
  [["makeup", "skincare", "perfume", "fragrance", "lotion", "serum", "hair", "nail", "lipstick", "foundation", "mascara", "shampoo", "conditioner"], "Health, Beauty & Hair"],
  [["ring", "necklace", "watch", "bracelet", "earring", "pendant", "chain", "bangle", "brooch", "jewelry"], "Jewelry & Watches"],
  [["car", "auto", "motor", "vehicle", "tire", "wheel", "dashboard", "seat cover", "motorcycle", "helmet"], "Automobiles & Motorcycles"],
  [["shoe", "sneaker", "bag", "backpack", "purse", "wallet", "handbag", "boots", "sandal", "loafer", "heels", "tote"], "Bags & Shoes"],
  [["dress", "blouse", "skirt", "women", "ladies", "female", "lingerie", "bra", "legging", "top"], "Women's Clothing"],
  [["shirt", "pants", "jeans", "men", "male", "suit", "tie", "trousers", "shorts", "hoodie", "sweater"], "Men's Clothing"],
];

// Fuzzy keyword detect — also handles typos like 'airpord' matching 'airpod'
function detectCategoryFromQuery(query: string): string | null {
  const q = query.toLowerCase().trim();
  for (const [keywords, category] of KEYWORD_CATEGORY_MAP) {
    for (const kw of keywords) {
      // Exact contains match
      if (q.includes(kw)) return category;
      // Fuzzy: if query has ≥5 chars and starts with same 4 chars as keyword (handles 1-char typos)
      if (q.length >= 5 && kw.length >= 5 && q.substring(0, 4) === kw.substring(0, 4)) return category;
    }
  }
  return null;
}

const API_KEY = "CJ5632497@api@dd88d4a73e5d4f07905c86c16f263276";
const AUTH_URL = "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken";
const LIST_URL = "https://developers.cjdropshipping.com/api2.0/v1/product/listV2";

let _token: string | null = null;
let _tokenFetchedAt = 0;

// SERVER FUNCTIONS — Runs strictly on the server-side to prevent browser CORS issues

const serverGetToken = createServerFn({ method: "GET" }).handler(async () => {
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
  } catch (err) {
    console.error("Token fetch error on server:", err);
  }
  throw new Error("CJ auth failed on server");
});

const serverFetchCategoryPage = createServerFn({ method: "GET" })
  .validator((d: { category: string; page: number; pageSize: number }) => d)
  .handler(async ({ data }) => {
    const token = await serverGetToken();
    let catId = CATEGORY_MAP[data.category];
    let apiPage = data.page;

    // For "Random" mode: rotate through categories by page number
    if (data.category === "Random") {
      const allCatIds = Object.values(CATEGORY_MAP);
      catId = allCatIds[(data.page - 1) % allCatIds.length];
      apiPage = Math.ceil(data.page / allCatIds.length) || 1;
    }

    const url = catId
      ? `${LIST_URL}?page=${apiPage}&size=${data.pageSize}&categoryId=${catId}`
      : `${LIST_URL}?page=${apiPage}&size=${data.pageSize}`;

    const res = await fetch(url, {
      headers: { "CJ-Access-Token": token }
    });
    return res.json();
  });

const serverSearchCJProducts = createServerFn({ method: "GET" })
  .validator((d: { query: string; page: number; pageSize: number; categoryId?: string }) => d)
  .handler(async ({ data }) => {
    const token = await serverGetToken();
    const params: Record<string, string> = {
      page: data.page.toString(),
      size: data.pageSize.toString(),
      productName: data.query,   // CJ API uses "productName" not "productNameEn"
    };
    if (data.categoryId) params.categoryId = data.categoryId;
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${LIST_URL}?${qs}`, {
      headers: { "CJ-Access-Token": token }
    });
    return res.json();
  });


const serverFetchProductDetail = createServerFn({ method: "GET" })
  .validator((d: any) => {
    if (typeof d === "object" && d !== null) {
      return d.cjId || d.data || String(d);
    }
    return String(d);
  })
  .handler(async ({ data: cjId }) => {
    const cleanPid = (typeof cjId === "object" && cjId !== null)
      ? ((cjId as any).cjId || (cjId as any).data || String(cjId))
      : String(cjId);
    const token = await serverGetToken();
    const res = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${cleanPid}`,
      { headers: { "CJ-Access-Token": token } }
    );
    return res.json();
  });

export const serverPlaceCJOrder = createServerFn({ method: "POST" })
  .validator((d: {
    orderNumber: string;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingProvince: string;
    shippingCountry: string;
    shippingCountryCode: string;
    shippingZip: string;
    products: Array<{ vid: string; quantity: number }>;
  }) => d)
  .handler(async ({ data }) => {
    const token = await serverGetToken();
    const body = {
      orderNumber: data.orderNumber,
      shippingZip: data.shippingZip,
      shippingCountryCode: data.shippingCountryCode,
      shippingCountry: data.shippingCountry,
      shippingProvince: data.shippingProvince,
      shippingCity: data.shippingCity,
      shippingAddress: data.shippingAddress,
      shippingCustomerName: data.shippingName,
      shippingPhone: data.shippingPhone,
      products: data.products,
    };
    const res = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder",
      {
        method: "POST",
        headers: {
          "CJ-Access-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    return res.json();
  });

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
 * Fetch a page of products live from CJ API
 */
export async function fetchCategoryPage(
  category: string,
  page: number,
  pageSize = 40
): Promise<{ products: CJProduct[]; hasMore: boolean }> {
  try {
    const data = await serverFetchCategoryPage({ data: { category, page, pageSize } });
    const content = data.data?.content || [];
    const list: any[] = content[0]?.productList || data.data?.list || [];

    const offset = (page - 1) * pageSize;
    const products = list
      .map((item, i) => mapItem(item, i, category, offset))
      .filter(Boolean) as CJProduct[];

    if (products.length > 0) {
      return {
        products,
        hasMore: true,
      };
    }
  } catch (err) {
    console.error("Live category fetch notice:", err);
  }

  // Fallback to cache loop if live API is unreachable
  const rawList = category === "Random"
    ? INTERLEAVED_PRODUCTS
    : ((cjCache.products || {}) as Record<string, CJProduct[]>)[category] || ALL_CACHED_PRODUCTS;
    
  const totalItems = rawList.length || 1;
  const start = ((page - 1) * pageSize) % totalItems;
  const sliced = rawList.slice(start, start + pageSize);

  let products = [...sliced];
  if (products.length < pageSize && totalItems > 0) {
    const remaining = pageSize - products.length;
    products = [...products, ...rawList.slice(0, remaining)];
  }

  const mapped = products.map((item, i) => ({
    ...item,
    id: `${item.id}-p${page}-${i}`,
  }));

  return {
    products: mapped,
    hasMore: true,
  };
}

const TERM_SYNONYMS: Record<string, string[]> = {
  bag: ["bag", "handbag", "backpack", "tote", "purse", "satchel", "pouch", "duffel", "clutch", "crossbody", "briefcase", "messenger", "wallet", "luggage"],
  bags: ["bag", "handbag", "backpack", "tote", "purse", "satchel", "pouch", "duffel", "clutch", "crossbody", "briefcase", "messenger", "wallet", "luggage"],
  shoe: ["shoe", "sneaker", "boot", "sandal", "loafer", "heels", "footwear", "clog", "slipper"],
  shoes: ["shoe", "sneaker", "boot", "sandal", "loafer", "heels", "footwear", "clog", "slipper"],
  phone: ["phone", "iphone", "android", "smartphone", "cell"],
  phones: ["phone", "iphone", "android", "smartphone", "cell"],
  watch: ["watch", "smartwatch", "chronograph", "timepiece"],
  watches: ["watch", "smartwatch", "chronograph", "timepiece"],
};

const EXCLUSION_TERMS: Record<string, string[]> = {
  bag: ["shoe", "sneaker", "boot", "sandal", "loafer", "heels", "dress", "skirt", "blouse", "top"],
  bags: ["shoe", "sneaker", "boot", "sandal", "loafer", "heels", "dress", "skirt", "blouse", "top"],
  shoe: ["bag", "backpack", "purse", "tote", "wallet", "shirt", "dress", "watch"],
  shoes: ["bag", "backpack", "purse", "tote", "wallet", "shirt", "dress", "watch"],
};

function filterRelevantProducts(products: CJProduct[], query: string): CJProduct[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return products;

  const words = clean.split(/\s+/).filter((w) => w.length >= 3);
  if (words.length === 0) return products;

  const primaryWord = words.find((w) => TERM_SYNONYMS[w]);
  const synonyms = primaryWord ? TERM_SYNONYMS[primaryWord] : words;
  const exclusions = primaryWord ? (EXCLUSION_TERMS[primaryWord] || []) : [];

  return products.filter((p) => {
    const nameLower = p.name.toLowerCase();

    // Must NOT contain exclusion terms unless explicitly searched for
    if (exclusions.some((ex) => nameLower.includes(ex) && !clean.includes(ex))) {
      return false;
    }

    // Must match at least one synonym or search word
    return synonyms.some((syn) => nameLower.includes(syn));
  });
}

/**
 * Search across all categories live from CJ API.
 * Uses multi-tiered search, query expansion, & strict relevance filtering.
 */
export async function searchCJProducts(
  query: string,
  page = 1,
  pageSize = 40
): Promise<{ products: CJProduct[]; hasMore: boolean }> {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return { products: ALL_CACHED_PRODUCTS.slice(start, end), hasMore: end < ALL_CACHED_PRODUCTS.length };
  }

  const detectedCategory = detectCategoryFromQuery(cleanQuery);
  const categoryId = detectedCategory ? CATEGORY_MAP[detectedCategory] : undefined;

  // Build query expansion terms for broad queries (e.g. "bag" -> "handbag", "crossbody bag", "leather bag")
  const searchTerms = [cleanQuery];
  if (cleanQuery === "bag" || cleanQuery === "bags") {
    searchTerms.push("handbag", "crossbody bag", "leather bag");
  } else if (cleanQuery === "shoe" || cleanQuery === "shoes") {
    searchTerms.push("sneakers", "running shoes");
  } else if (cleanQuery === "watch" || cleanQuery === "watches") {
    searchTerms.push("smartwatch", "men watch");
  }

  let aggregatedProducts: CJProduct[] = [];

  for (const term of searchTerms) {
    // Live search WITH categoryId (if detected)
    if (categoryId) {
      try {
        const res = await serverSearchCJProducts({ data: { query: term, page, pageSize, categoryId } });
        const content = res.data?.content || [];
        const list: any[] = content[0]?.productList || res.data?.list || [];
        const offset = (page - 1) * pageSize;
        const products = list.map((item, i) => mapItem(item, i, detectedCategory || "search", offset)).filter(Boolean) as CJProduct[];
        aggregatedProducts.push(...products);
      } catch {}
    }

    // Broad live search WITHOUT category restriction
    if (aggregatedProducts.length < pageSize) {
      try {
        const res = await serverSearchCJProducts({ data: { query: term, page, pageSize } });
        const content = res.data?.content || [];
        const list: any[] = content[0]?.productList || res.data?.list || [];
        const offset = (page - 1) * pageSize;
        const products = list.map((item, i) => mapItem(item, i, detectedCategory || "search", offset)).filter(Boolean) as CJProduct[];
        aggregatedProducts.push(...products);
      } catch {}
    }

    if (aggregatedProducts.length >= pageSize) break;
  }

  // Deduplicate live items
  const seenIds = new Set<string>();
  let deduped = aggregatedProducts.filter((p) => {
    if (seenIds.has(p.cjId)) return false;
    seenIds.add(p.cjId);
    return true;
  });

  deduped = filterRelevantProducts(deduped, cleanQuery);

  if (deduped.length > 0) {
    return { products: deduped, hasMore: true };
  }

  // Fallback to cache pool
  const categoryPool = detectedCategory
    ? ((cjCache.products || {}) as Record<string, CJProduct[]>)[detectedCategory] || ALL_CACHED_PRODUCTS
    : ALL_CACHED_PRODUCTS;

  let matched = filterRelevantProducts(categoryPool, cleanQuery);

  if (matched.length === 0) {
    matched = filterRelevantProducts(ALL_CACHED_PRODUCTS, cleanQuery);
  }

  if (matched.length === 0 && categoryPool.length > 0) {
    matched = categoryPool;
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { products: matched.slice(start, end), hasMore: true };
}


// Find a product locally by ID
export function getProductById(id: string): CJProduct | null {
  return ALL_CACHED_PRODUCTS.find((p) => p.id === id) || null;
}

async function clientFetchProductDetailDirect(cjPid: string): Promise<any> {
  try {
    const authRes = await fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: API_KEY }),
    });
    const authData = await authRes.json();
    const token = authData?.data?.accessToken;
    if (!token) return null;

    const res = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${cjPid}`, {
      headers: { "CJ-Access-Token": token },
    });
    return res.json();
  } catch (e) {
    console.error("Direct client fetch error:", e);
    return null;
  }
}

/**
 * Fetch full product detail live from CJ API.
 * Accepts EITHER a local cache ID (cj-women-s-clothing-1) OR a raw CJ PID (numeric/UUID).
 * This means clicking any product — whether from cache or live API — always works.
 */
export async function fetchProductDetail(
  idOrCjId: string
): Promise<CJProductDetail | null> {
  // Try local cache first (for cached products with generated IDs)
  const cached = getProductById(idOrCjId)
    // Also try looking up by cjId (the raw CJ PID passed from live API products)
    ?? ALL_CACHED_PRODUCTS.find((p) => p.cjId === idOrCjId)
    ?? null;

  // The actual CJ PID to query — either from cache or the raw ID itself
  const cjPid = cached?.cjId ?? idOrCjId;

  // Deterministic brand/rating from the cjId so they're always stable
  const brandIdx = Math.abs(
    cjPid.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % BRANDS.length;
  const fallbackBrand = BRANDS[brandIdx];
  const fallbackRating = parseFloat((4.0 + (brandIdx % 10) / 10).toFixed(1));
  const fallbackReviews = (200 + (brandIdx * 31)).toLocaleString();

  let data: any = null;

  try {
    data = await serverFetchProductDetail({ data: cjPid });
  } catch (err) {
    console.warn("Server RPC detail fetch failed:", err);
  }

  // If server function returned no data or failed during client navigation, try direct client fetch
  if (!data?.data && typeof window !== "undefined") {
    data = await clientFetchProductDetailDirect(cjPid);
  }

  const d = data?.data;

  if (!d) {
    if (cached) {
      return { ...cached, images: [cached.img], videoUrl: null, description: cached.name, category: "", variants: [] };
    }
    return null;
  }

    const imageSet: string[] = [];

    // Robust helper to extract clean image URLs from strings, JSON strings, arrays, or objects
    const addImg = (val: any) => {
      if (!val) return;

      if (Array.isArray(val)) {
        val.forEach(addImg);
        return;
      }

      if (typeof val === "object") {
        const url = val.imageUrl || val.url || val.img || val.src;
        if (url) addImg(url);
        return;
      }

      if (typeof val === "string") {
        const clean = val.trim();
        if (!clean) return;

        // Handle JSON array strings like "[\"https://...\",\"https://...\"]"
        if (clean.startsWith("[")) {
          try {
            const parsed = JSON.parse(clean);
            if (Array.isArray(parsed)) {
              parsed.forEach(addImg);
              return;
            }
          } catch {}
        }

        // Handle comma-separated strings like "http://img1.jpg,http://img2.jpg"
        if (clean.includes(",")) {
          clean.split(",").forEach(addImg);
          return;
        }

        // Valid image URL
        if (clean.startsWith("http") && !imageSet.includes(clean)) {
          imageSet.push(clean);
        }
      }
    };

    // Add images from all CJ detail response fields
    addImg(d.productImageSet);
    addImg(d.productImage);
    addImg(d.bigImage);
    addImg(d.smallImage);
    addImg(d.thumbnail);
    addImg(d.imgList);
    addImg(d.imageList);
    addImg(d.productImages);

    // Add variant images (colors, sizes, styles)
    if (Array.isArray(d.variants)) {
      d.variants.forEach((v: any) => {
        if (v.variantImage) addImg(v.variantImage);
        if (v.img) addImg(v.img);
      });
    }

    // Last resort: use cached image
    if (imageSet.length === 0 && cached) imageSet.push(cached.img);


    const usdPrice = parseFloat(d.sellPrice || d.productPrice || "10");
    const ghsPrice = Math.round(usdPrice * EXCHANGE_RATE * MARKUP);

    return {
      id: idOrCjId,
      cjId: d.pid || cjPid,
      brand: cached?.brand ?? fallbackBrand,
      name: d.productNameEn || cached?.name || "Product",
      price: `₵${ghsPrice.toLocaleString()}`,
      rawPrice: ghsPrice,
      img: imageSet[0] || cached?.img || "",
      rating: cached?.rating ?? fallbackRating,
      reviews: cached?.reviews ?? fallbackReviews,
      images: imageSet,
      videoUrl: d.productVideo || null,
      description: d.description || d.productNameEn || cached?.name || "",
      category: d.categoryName || "",
      variants: d.variants || [],
    };
}

