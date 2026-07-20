import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const API_KEY = "CJ5632497@api@dd88d4a73e5d4f07905c86c16f263276";
const AUTH_URL = "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken";
const LIST_URL = "https://developers.cjdropshipping.com/api2.0/v1/product/listV2";

const CATEGORY_MAP = {
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

const EXCHANGE_RATE = 15.0;
const MARKUP = 1.1;

const BRANDS = [
  "Saint Laurent","Prada","Nike","Sony","Gucci","Louis Vuitton","Adidas","Dyson",
  "Versace","Burberry","Balenciaga","Dior","Hermes","Chanel","Fendi","YSL",
  "Zara","H&M","Uniqlo","ASOS","Levi's","Tommy Hilfiger","Calvin Klein","Ralph Lauren",
  "Armani","Valentino","Givenchy","Bottega Veneta","Celine","Off-White"
];

async function fetchForCategory(token, catName, catId) {
  const products = [];
  let pageNum = 1;
  const PAGE_SIZE = 50;
  const TARGET_COUNT = 200; // Fetch 200 products per category for catalog size/performance balance

  console.log(`\n[${catName}] Fetching up to ${TARGET_COUNT} products...`);

  while (products.length < TARGET_COUNT && pageNum <= 10) {
    await sleep(1250);

    let res, data;
    try {
      res = await fetch(`${LIST_URL}?page=${pageNum}&size=${PAGE_SIZE}&categoryId=${catId}`, {
        headers: { "CJ-Access-Token": token }
      });
      data = await res.json();
    } catch (err) {
      console.log(`  [${catName}] Page ${pageNum} error, retrying...`);
      await sleep(2000);
      continue;
    }

    const content = data.data?.content || [];
    const list = content[0]?.productList || data.data?.list || [];

    if (list.length === 0) {
      console.log(`  [${catName}] Page ${pageNum} returned no products. Ending early.`);
      break;
    }

    for (const item of list) {
      if (products.length >= TARGET_COUNT) break;

      const usdPrice = parseFloat(item.sellPrice || "10");
      const ghsPrice = Math.round(usdPrice * EXCHANGE_RATE * MARKUP);

      let name = item.nameEn || item.productNameEn || "Product";
      name = name.split(" - ")[0].split(" | ")[0].trim();
      if (name.length > 55) name = name.substring(0, 52) + "...";

      const brand = BRANDS[products.length % BRANDS.length];
      const img = item.bigImage || item.productImage;
      if (!img) continue;

      products.push({
        id: `cj-${catName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${products.length + 1}`,
        cjId: item.id || item.pid,
        brand,
        name,
        price: `₵${ghsPrice.toLocaleString()}`,
        rawPrice: ghsPrice,
        img,
        rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
        reviews: Math.floor(20 + Math.random() * 980).toLocaleString()
      });
    }

    console.log(`  [${catName}] Page ${pageNum}: total items so far: ${products.length}`);
    pageNum++;

    if (list.length < PAGE_SIZE) {
      break;
    }
  }

  return products;
}

async function main() {
  const authRes = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: API_KEY })
  });
  const authData = await authRes.json();
  if (!authData.result || !authData.data?.accessToken) {
    throw new Error(`Auth failed: ${JSON.stringify(authData)}`);
  }
  const token = authData.data.accessToken;
  console.log("Authenticated with CJ API.");

  const cache = {
    categories: Object.keys(CATEGORY_MAP),
    products: {}
  };

  for (const [catName, catId] of Object.entries(CATEGORY_MAP)) {
    const items = await fetchForCategory(token, catName, catId);
    cache.products[catName] = items;
  }

  const outputPath = path.join(__dirname, "cjCache.json");
  fs.writeFileSync(outputPath, JSON.stringify(cache, null, 2), "utf8");
  console.log(`\nSuccessfully cached CJ catalog with 14 categories. Total items: ${Object.values(cache.products).flat().length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
