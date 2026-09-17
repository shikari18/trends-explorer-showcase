import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Mic, Camera, Sparkles, Heart, Filter, SlidersHorizontal, ArrowUpRight, Flame, ShieldCheck, ChevronRight, Loader2, Check, ShoppingCart, RefreshCw, Layers, CheckCircle2, PackagePlus, Zap, Store, User } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import heroSummer from "@/assets/home-hero-summer.jpg";
import curated from "@/assets/home-curated.jpg";
import bag from "@/assets/home-bag.jpg";
import watch from "@/assets/home-watch.jpg";
import tote from "@/assets/prod-tote.jpg";
import { fetchCategoryPage, CJProduct, CATEGORIES } from "@/lib/cjApi";
import { getVendorProfile, getVendorProducts, VendorProduct } from "@/lib/vendor";
import { VendorAddProductModal } from "@/components/vendor/VendorAddProductModal";

export const Route = createFileRoute("/home")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Trends — Explore Curated Products" },
      { name: "description", content: "Discover top trending fashion, tech, decor, and accessories on Trends." },
    ],
  }),
});

const DEFAULT_FALLBACK_PRODUCTS: CJProduct[] = [
  { id: "cj-women-s-clothing-1", cjId: "2505020329151621400", brand: "Aura Studio", name: "Casual Loose Trousers Women's Shirt Fashion Suit", price: "₵137", rawPrice: 137, img: "https://cf.cjdropshipping.com/quick/product/5b6710b1-8222-44e7-a886-dfcff97b6fdb.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-women-s-clothing-2", cjId: "2406290916451620500", brand: "Nordic Craft", name: "Classic Style Short Knitted V-neck Cardigan Sweater", price: "₵91", rawPrice: 91, img: "https://cf.cjdropshipping.com/quick/product/dad12102-6497-4581-bc9a-54aa41f5e95f.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-pet-supplies-1", cjId: "1369107303852281856", brand: "Aura Studio", name: "Collapsible Cat Channel Rolling Floor Cylinder Toy", price: "₵46", rawPrice: 46, img: "https://cf.cjdropshipping.com/1615255412919.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-pet-supplies-2", cjId: "1838126988578934784", brand: "Nordic Craft", name: "Dual-use Pet Comb & Cleaning Needle for Dog & Cat", price: "₵65", rawPrice: 65, img: "https://cf.cjdropshipping.com/32d11bbf-613d-450f-8cd2-0fc0405e3861.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-home-garden-furniture-1", cjId: "2506110148321624700", brand: "Aura Studio", name: "Smooth Breathable Silk Fitted Bed Sheet", price: "₵93", rawPrice: 93, img: "https://cf.cjdropshipping.com/quick/product/54794c21-f650-4049-aaee-f3c782e33287.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-home-garden-furniture-2", cjId: "2411100651541612500", brand: "Nordic Craft", name: "Tassel Sofa Cover Solid Color Knitted Blanket", price: "₵150", rawPrice: 150, img: "https://cf.cjdropshipping.com/quick/product/a1614b30-63c2-4c9b-aad7-6304494fe457.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-health-beauty-hair-1", cjId: "1796048277855543296", brand: "Aura Studio", name: "Handmade Wearing Nail Summer Sweet Bean Enhancement", price: "₵26", rawPrice: 26, img: "https://cf.cjdropshipping.com/quick/product/4e5124ae-18ab-4f10-991b-563ff546226a.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-health-beauty-hair-2", cjId: "2411220237201628100", brand: "Nordic Craft", name: "Horse Eye Crystal Pointed Glass Silver Bottom Diamond", price: "₵16", rawPrice: 16, img: "https://cf.cjdropshipping.com/quick/product/4f469a96-f0a0-48ea-94c7-2a74d8a639b6.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-jewelry-watches-1", cjId: "2412121245401604400", brand: "Aura Studio", name: "Colored Glaze Neutral Red Beaded Artisan Bracelet", price: "₵20", rawPrice: 20, img: "https://cf.cjdropshipping.com/quick/product/710d9b62-85a7-4abc-a1e0-8c746849d08c.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-jewelry-watches-2", cjId: "2031178774204350466", brand: "Nordic Craft", name: "Fashion French Style Flower Starfish Pentagram Ring", price: "₵21", rawPrice: 21, img: "https://cf.cjdropshipping.com/b0fed91f-fb72-4da6-8f24-2daef6e81e61.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-men-s-clothing-1", cjId: "2409110325081601200", brand: "Aura Studio", name: "Cute Flowers Princess Shirt Shorts Two-piece Set", price: "₵58", rawPrice: 58, img: "https://cf.cjdropshipping.com/quick/product/9d51c224-348e-4717-8eb4-6d351e949c93.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-men-s-clothing-2", cjId: "1434802968384901120", brand: "Nordic Craft", name: "Men's Briefs Cotton Underwear Set", price: "₵24", rawPrice: 24, img: "https://cf.cjdropshipping.com/65317d2b-88f5-4d52-866e-4002bc025cd4.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-bags-shoes-1", cjId: "2406080135531605500", brand: "Aura Studio", name: "Handdrawn Gradient Women's Multifunctional Shoulder Bag", price: "₵322", rawPrice: 322, img: "https://cf.cjdropshipping.com/quick/product/08f7b836-9444-43d9-98cd-67468de9403d.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-bags-shoes-2", cjId: "1613161733328220160", brand: "Nordic Craft", name: "Simple And Fashionable Frosted Short Women's Purse", price: "₵28", rawPrice: 28, img: "https://cf.cjdropshipping.com/c4c5d0a2-2c4f-4307-8d93-e83f0f179e24.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-toys-kids-babies-1", cjId: "2406260643431622100", brand: "Aura Studio", name: "Microphone Bracket Fixed Hair Clip Conversion Set", price: "₵18", rawPrice: 18, img: "https://cf.cjdropshipping.com/quick/product/1d500f59-03a4-459a-8dde-446740d664eb.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-toys-kids-babies-2", cjId: "1798610042850258944", brand: "Nordic Craft", name: "Underwater World 3D Submarine False Window Wall Decal", price: "₵22", rawPrice: 22, img: "https://cf.cjdropshipping.com/quick/product/5a88de1f-716c-4720-802a-5e73f4ee373e.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-sports-outdoors-1", cjId: "1394930678163968000", brand: "Aura Studio", name: "Korean Fashion Casual High-top Sports Walking Shoes", price: "₵223", rawPrice: 223, img: "https://cf.cjdropshipping.com/1621411090894.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-sports-outdoors-2", cjId: "2412120333271608200", brand: "Nordic Craft", name: "Outdoor Non-slip Wear-resistant Sports Running Shoes", price: "₵228", rawPrice: 228, img: "https://cf.cjdropshipping.com/quick/product/92516746-91aa-471b-a1b1-f23dd05f4272.jpg", rating: 4.3, reviews: "57" },
  { id: "cj-consumer-electronics-1", cjId: "1667079131651121152", brand: "Aura Studio", name: "Leisure Business Top Layer Cowhide Leather Watch Strap", price: "₵66", rawPrice: 66, img: "https://cf.cjdropshipping.com/d3ea5aeb-ffe2-4a55-8d31-b61b9c1c0fdc.jpg", rating: 4.2, reviews: "50" },
  { id: "cj-consumer-electronics-2", cjId: "1734754524750950400", brand: "Nordic Craft", name: "Creative Butterfly Clasp Metal Replacement Wristband", price: "₵111", rawPrice: 111, img: "https://cf.cjdropshipping.com/17024256/1734754532845555712.jpg", rating: 4.3, reviews: "57" },
];

function Home() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedToCartIds, setAddedToCartIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<{ name?: string; email?: string; avatar?: string; isVendor?: boolean } | null>(null);
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Auto-cycle hero banner theme every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 9);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Load wishlist, current user, & vendor products
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist");
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          setCurrentUser(null);
        }
      }

      setVendorProfile(getVendorProfile());
      setVendorProducts(getVendorProducts());
    }
  }, []);

  // Reset and reload when category changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
  }, [activeCat]);

  const mainScrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Restore scroll position when returning from product detail page
  useEffect(() => {
    const saved = sessionStorage.getItem("trends_home_scroll");
    if (saved && mainScrollRef.current) {
      setTimeout(() => {
        if (mainScrollRef.current) mainScrollRef.current.scrollTop = Number(saved);
      }, 60);
    }
  }, []);

  const handleScroll = () => {
    if (mainScrollRef.current) {
      sessionStorage.setItem("trends_home_scroll", String(mainScrollRef.current.scrollTop));
    }
  };

  // Fetch a page of products
  const loadPage = useCallback(async (cat: string, pageNum: number) => {
    if (loading) return;
    setLoading(true);
    try {
      let newItems: CJProduct[];
      let more: boolean;

      if (cat.includes("Express") || cat.includes("1-2")) {
        // Express 1-2 Days category strictly loads vendor uploaded products
        newItems = [];
        more = false;
      } else if (cat === "Random" || cat === "All") {
        const res = await fetchCategoryPage("Random", pageNum, 40);
        newItems = res.products.length > 0 ? res.products : DEFAULT_FALLBACK_PRODUCTS;
        more = res.hasMore;
      } else {
        const res = await fetchCategoryPage(cat, pageNum, 40);
        newItems = res.products.length > 0 ? res.products : DEFAULT_FALLBACK_PRODUCTS;
        more = res.hasMore;
      }

      setProducts((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));
      setHasMore(more);
      setPage(pageNum + 1);
    } catch (e) {
      console.error(e);
      setProducts((prev) => (prev.length === 0 ? DEFAULT_FALLBACK_PRODUCTS : prev));
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading]);

  // Initial load on category change
  useEffect(() => {
    loadPage(activeCat, 1);
  }, [activeCat]); // eslint-disable-line

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPage(activeCat, page);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, activeCat, loadPage]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  };

  const addToCart = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      let items = saved ? JSON.parse(saved) : [];
      const existing = items.find((it: any) => it.id === p.id);
      if (existing) {
        existing.qty += 1;
      } else {
        items.push({
          id: p.id, brand: p.brand, name: p.name,
          color: "Default", size: "One Size",
          price: p.rawPrice, img: p.img, qty: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(items));
      setAddedToCartIds((prev) => [...prev, p.id]);
      setTimeout(() => setAddedToCartIds((prev) => prev.filter((x) => x !== p.id)), 1500);
      import("sonner").then(({ toast }) => toast.success(`${p.name} added to cart!`));
    }
  };

  const mappedVendorProducts = (Array.isArray(vendorProducts) ? vendorProducts : []).map((vp) => ({
    id: vp.id || `v-${Math.random()}`,
    cjId: vp.id || `v-${Math.random()}`,
    brand: vp.vendorName || "Ghana Vendor Store",
    name: vp.title || "Vendor Product",
    price: `₵${(Number(vp.price || 10) * 15).toLocaleString()}`,
    rawPrice: Number(vp.price || 10) * 15,
    img: (Array.isArray(vp.images) && vp.images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviews: "1",
    vendorName: vp.vendorName || "Ghana Vendor",
    vendorVerified: true,
  }));

  const isExpressSelected = activeCat.includes("Express") || activeCat.includes("1-2");
  const pool = products.length > 0 ? products : DEFAULT_FALLBACK_PRODUCTS;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const newArrivalsOffset = (dayOfYear * 8) % Math.max(1, pool.length - 8);
  const newArrivals = [...mappedVendorProducts, ...pool.slice(newArrivalsOffset, newArrivalsOffset + 8)];
  const trending = isExpressSelected ? mappedVendorProducts : [...mappedVendorProducts, ...pool];

  // 9 Hero Banner Themes
  const HERO_THEMES = [
    { title: "Pro Gaming\nHeadsets & Gear", subtitle: "Level Up Your Setup", tag: "Gaming Gear", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80", slug: "consumer-electronics" },
    { title: "Educational Toys\n& Kids Gaming", subtitle: "Play & Learn Collection", tag: "Toys & Hobbies", img: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=800&q=80", slug: "toys-kids-babies" },
    { title: "Summer\nEssentials", subtitle: "Hot Weather Favorites", tag: "Summer 26", img: heroSummer, slug: "womens-clothing" },
    { title: "Luxury Gold\n& Gemstones", subtitle: "Artisan Fine Jewelry", tag: "Fine Jewelry", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80", slug: "jewelry-watches" },
    { title: "Streetwear\n& Urban Tops", subtitle: "Bold Modern Apparel", tag: "Streetwear", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80", slug: "mens-clothing" },
    { title: "Performance\nSneakers & Boots", subtitle: "Step Into Comfort", tag: "Footwear", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", slug: "bags-shoes" },
    { title: "Smart Gadgets\n& Audio Gear", subtitle: "Next-Gen Technology", tag: "Tech Essentials", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", slug: "phones-accessories" },
    { title: "Premium Pet\nSupplies & Toys", subtitle: "Pamper Your Pets", tag: "Pet Accessories", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80", slug: "pet-supplies" },
    { title: "Modern Home\n& Living Decor", subtitle: "Transform Your Space", tag: "Home Aesthetics", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", slug: "home-garden-furniture" }
  ];

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div
          ref={mainScrollRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <div className="pb-36">
            {/* Top Header Section (Brought down with generous top padding) */}
            <div className="px-6 pt-7">
              {/* Top Row: Subtitle tag + Right Actions (Add Product, Wishlist, Profile Avatar) */}
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontSize: 13, color: "#8A8A8A", fontWeight: 500 }}>
                    {vendorProfile?.verified ? "Verified Vendor Portal" : currentUser ? "Welcome Back" : "Welcome"}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111111", letterSpacing: -0.6, textTransform: "uppercase" }}>
                      {vendorProfile?.verified
                        ? (vendorProfile.storeName || "VENDOR")
                        : (currentUser?.name ? currentUser.name : "GUEST")}
                    </h1>
                    {vendorProfile?.verified && (
                      <CheckCircle2 size={18} className="text-blue-600 fill-blue-600 text-white shrink-0" />
                    )}
                  </div>
                </div>

                {/* Right Action Icons Row */}
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  {/* Add Product Button if Verified Vendor */}
                  {vendorProfile?.verified && currentUser && (
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <PackagePlus size={14} /> Add Product
                    </button>
                  )}

                  {/* Wishlist Heart Button */}
                  <Link
                    to="/wishlist"
                    aria-label="Wishlist"
                    className="w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center transition-colors relative"
                  >
                    <Heart size={18} fill="#FF3B30" color="#FF3B30" />
                  </Link>

                  {/* Profile Avatar Button */}
                  <Link
                    to="/profile"
                    aria-label="Profile"
                    className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0 flex items-center justify-center bg-gray-100/80 hover:bg-gray-200 transition-colors"
                  >
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="User Profile" className="w-full h-full object-cover" />
                    ) : currentUser?.name ? (
                      <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                        {currentUser.name[0].toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 text-gray-700 flex items-center justify-center">
                        <User size={18} className="text-gray-700" />
                      </div>
                    )}
                  </Link>
                </div>
              </div>

              {/* Subtitle Search Prompt */}
              <p className="mt-1.5 text-xs text-gray-500 font-medium">
                What are you looking for today?
              </p>

              {/* Search Bar Row */}
              <div className="mt-4 flex items-center gap-2.5">
                <Link
                  to="/search"
                  className="flex-1 flex items-center gap-2.5 px-4"
                  style={{
                    height: 48,
                    borderRadius: 999,
                    background: "#F7F7F5",
                    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
                  }}
                >
                  <Search size={17} color="#8A8A8A" />
                  <span style={{ fontSize: 13.5, color: "#8A8A8A", fontWeight: 400 }}>
                    Search products, brands...
                  </span>
                </Link>

                <Link
                  to="/search"
                  aria-label="Voice search"
                  className="w-10 h-10 rounded-full bg-[#F7F7F5] flex items-center justify-center border border-gray-200/60 shrink-0"
                >
                  <Mic size={17} color="#111" />
                </Link>
              </div>
            </div>

            {/* Dynamic Hero Banner */}
            <div className="px-6 mt-6">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "4 / 5",
                  borderRadius: 24,
                  background: "#F2EFE9",
                  boxShadow:
                    "0 24px 50px -24px rgba(17,17,17,0.20), 0 8px 20px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                {HERO_THEMES.map((hero, idx) => {
                  const isActive = idx === heroIndex;
                  return (
                    <div
                      key={hero.title}
                      className="absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scale(1)" : "scale(1.04)",
                        zIndex: isActive ? 10 : 0,
                      }}
                    >
                      <img src={hero.img} alt={hero.title} className="w-full h-full object-cover" />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(10,10,10,0.65) 100%)",
                        }}
                      />
                      <div className="absolute left-5 top-5 pointer-events-auto">
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5"
                          style={{
                            height: 26,
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.85)",
                            backdropFilter: "blur(16px)",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0F62FE" }} />
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#111",
                              letterSpacing: 0.2,
                              textTransform: "uppercase",
                            }}
                          >
                            {hero.tag}
                          </span>
                        </div>
                      </div>
                      <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between pointer-events-auto">
                        <div>
                          <div
                            style={{
                              fontSize: 11.5,
                              color: "rgba(255,255,255,0.85)",
                              letterSpacing: 0.4,
                              textTransform: "uppercase",
                              fontWeight: 600,
                            }}
                          >
                            {hero.subtitle}
                          </div>
                          <div
                            className="mt-1"
                            style={{
                              fontSize: 24,
                              lineHeight: 1.1,
                              fontWeight: 700,
                              letterSpacing: -0.7,
                              color: "#fff",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {hero.title}
                          </div>
                        </div>
                        <Link
                          to="/category/$slug"
                          params={{ slug: hero.slug }}
                          className="inline-flex items-center gap-1.5 px-4"
                          style={{
                            height: 38,
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(20px)",
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#111",
                            letterSpacing: -0.2,
                            boxShadow: "0 6px 16px -6px rgba(17,17,17,0.3)",
                          }}
                        >
                          Explore <ArrowUpRight size={14} strokeWidth={2.4} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New Arrivals Section */}
            <div className="flex items-end justify-between px-6 mt-8">
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.6, color: "#111" }}>New Arrivals</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto px-6 mt-4" style={{ scrollbarWidth: "none" }}>
              {newArrivals.map((p, idx) => {
                const isLiked = wishlist.includes(p.id);
                const isAdded = addedToCartIds.includes(p.id);
                return (
                  <Link
                    to="/product/$id"
                    params={{ id: p.cjId || p.id }}
                    key={`${p.id}-${idx}`}
                    className="shrink-0 overflow-hidden block"
                    style={{
                      width: 172,
                      borderRadius: 22,
                      background: "#FFFFFF",
                      boxShadow:
                        "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                    }}
                  >
                    <div className="relative" style={{ background: "#F7F7F5" }}>
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
                        }}
                        className="w-full object-cover"
                        style={{ aspectRatio: "1/1" }}
                      />
                      <button
                        onClick={(e) => toggleWishlist(p.id, e)}
                        aria-label="Wishlist"
                        className="absolute top-2.5 right-2.5 flex items-center justify-center transition-all duration-300 z-10"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(16px)",
                          boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
                        }}
                      >
                        <Heart
                          size={14}
                          strokeWidth={2.4}
                          fill={isLiked ? "#FF3B30" : "none"}
                          color={isLiked ? "#FF3B30" : "#111"}
                        />
                      </button>
                    </div>
                    <div className="px-3.5 py-3">
                      <div
                        style={{
                          fontSize: 11,
                          color: "#8A8A8A",
                          letterSpacing: 0.2,
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {p.brand}
                      </div>
                      <div
                        className="mt-0.5 truncate"
                        style={{ fontSize: 14, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}
                      >
                        {p.name}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{p.price}</span>
                        <button
                          onClick={(e) => addToCart(p, e)}
                          aria-label="Add to cart"
                          className="flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                          style={{
                            width: 29,
                            height: 29,
                            borderRadius: 999,
                            background: isAdded ? "#34C759" : "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(16px)",
                            boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)",
                            transition: "background-color 0.3s ease",
                          }}
                        >
                          {isAdded ? (
                            <Check size={12} color="#fff" strokeWidth={3} />
                          ) : (
                            <ShoppingCart size={12} color="#111" strokeWidth={2.2} />
                          )}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Trending / All Products — full list with Category Dropdown Filter */}
            <div className="flex items-end justify-between px-6 mt-8 relative">
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.6, color: "#111" }}>
                {isExpressSelected ? "⚡ Ghana Vendor Express (1-2 Days)" : (activeCat === "Random" || activeCat === "All" || activeCat === "All Products" ? "All Products" : `${activeCat} Products`)}
              </h2>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                style={{ fontSize: 13, fontWeight: 600, color: "#0F62FE", letterSpacing: -0.2 }}
                className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 transition-colors"
              >
                Categories ▾
              </button>

              {/* Category Dropdown Modal */}
              {showCategoryDropdown && (
                <div className="absolute right-6 top-10 z-50 w-64 bg-white dark:bg-neutral-900 rounded-2xl p-2 shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-72 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">Select Category</div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCat(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-colors font-medium ${
                        cat === activeCat
                          ? "bg-blue-600 text-white font-bold"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Grid or Express Empty State */}
            {isExpressSelected && trending.length === 0 ? (
              <div className="mx-6 mt-4 p-8 text-center bg-amber-50/60 dark:bg-amber-950/30 rounded-3xl border border-amber-200/60 dark:border-amber-900/40">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                  ⚡
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">No Local Express Vendor Products Yet</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 max-w-xs mx-auto leading-relaxed font-medium">
                  Verified Ghana vendors have not uploaded products yet. Vendors can go to Profile & Settings to upload products for 1–2 day express delivery across Ghana!
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => setActiveCat("All")}
                    className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow hover:bg-blue-700 transition-colors"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-6 mt-4">
                {trending.map((p, idx) => {
                  const isLiked = wishlist.includes(p.id);
                  const isAdded = addedToCartIds.includes(p.id);
                  const isVendorItem = p.vendorVerified || p.id?.startsWith("v-");
                  return (
                    <Link
                      to="/product/$id"
                      params={{ id: p.cjId || p.id }}
                      key={`${p.id}-${idx}`}
                      className="overflow-hidden block group active:scale-[0.98] transition-all relative"
                      style={{
                        borderRadius: 22,
                        background: "#FFFFFF",
                        boxShadow:
                          "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                      }}
                    >
                      <div className="relative overflow-hidden" style={{ background: "#F7F7F5" }}>
                        <img
                          src={p.img}
                          alt={p.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
                          }}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ aspectRatio: "1/1" }}
                        />
                        {isVendorItem && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md flex items-center gap-0.5 z-10">
                            <Zap size={10} className="fill-white" /> 1-2 Days
                          </div>
                        )}
                        <button
                          onClick={(e) => toggleWishlist(p.id, e)}
                          aria-label="Wishlist"
                          className="absolute top-2.5 right-2.5 flex items-center justify-center transition-all duration-300 z-10"
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(16px)",
                            boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
                          }}
                        >
                          <Heart
                            size={14}
                            strokeWidth={2.4}
                            fill={isLiked ? "#FF3B30" : "none"}
                            color={isLiked ? "#FF3B30" : "#111"}
                          />
                        </button>
                      </div>
                      <div className="px-3.5 py-3">
                        <div
                          style={{
                            fontSize: 11,
                            color: "#8A8A8A",
                            letterSpacing: 0.2,
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {p.brand}
                        </div>
                        <div
                          className="mt-0.5 truncate"
                          style={{ fontSize: 14, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}
                        >
                          {p.name}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{p.price}</span>
                          <button
                            onClick={(e) => addToCart(p, e)}
                            aria-label="Add to cart"
                            className="flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                            style={{
                              width: 29,
                              height: 29,
                              borderRadius: 999,
                              background: isAdded ? "#34C759" : "rgba(255,255,255,0.9)",
                              backdropFilter: "blur(16px)",
                              boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)",
                              transition: "background-color 0.3s ease",
                            }}
                          >
                            {isAdded ? (
                              <Check size={12} color="#fff" strokeWidth={3} />
                            ) : (
                              <ShoppingCart size={12} color="#111" strokeWidth={2.2} />
                            )}
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className="py-6 flex justify-center">
              {loading && <Loader2 size={24} className="animate-spin text-blue-600" />}
            </div>
          </div>
        </div>

        {/* Vendor Add Product Modal */}
        {currentUser && vendorProfile?.verified && (
          <VendorAddProductModal
            isOpen={showAddProductModal}
            onClose={() => setShowAddProductModal(false)}
            onSuccess={() => {
              setVendorProducts(getVendorProducts());
            }}
            vendorName={vendorProfile.storeName || currentUser.name || "Vendor"}
            vendorId={vendorProfile.vendorId || "v-1"}
          />
        )}

        <BottomNav active="home" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function circleBtnStyle() {
  return {
    width: 44,
    height: 44,
    borderRadius: 999,
    background: "#F7F7F5",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
  } as const;
}
