import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Mic, Sparkles, Heart, Filter, SlidersHorizontal, ArrowUpRight, Flame, ShieldCheck, ChevronRight, Loader2, Check, ShoppingCart, RefreshCw, Layers, CheckCircle2, PackagePlus, Zap, Store, User } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import heroSummer from "@/assets/home-hero-summer.jpg";
import curated from "@/assets/home-curated.jpg";
import bag from "@/assets/home-bag.jpg";
import watch from "@/assets/home-watch.jpg";
import tote from "@/assets/prod-tote.jpg";
import { getCJProducts, getCJSearch, parseCJSafetyPrice, fetchCategoryPage, CJProduct, CATEGORIES } from "@/lib/cjApi";
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
  { id: "cj-women-1", cjId: "2505020329151621400", brand: "Aura Studio", name: "Casual Loose Trousers Women's Suit", price: "₵137", rawPrice: 137, img: "https://cf.cjdropshipping.com/quick/product/5b6710b1-8222-44e7-a886-dfcff97b6fdb.jpg", rating: 4.8, reviews: "120" },
  { id: "cj-tech-1", cjId: "18237192", brand: "Sony", name: "Wireless Noise Cancelling Gaming Headphones", price: "₵389", rawPrice: 389, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", rating: 4.9, reviews: "450" },
  { id: "cj-men-1", cjId: "98127391", brand: "Off-White", name: "Streetwear Oversized Graphic Hoodie", price: "₵245", rawPrice: 245, img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80", rating: 4.7, reviews: "98" },
  { id: "cj-watch-1", cjId: "77619283", brand: "Nordic", name: "Minimalist Chronograph Gold Watch", price: "₵520", rawPrice: 520, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", rating: 4.9, reviews: "310" },
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
        const allCatKeys = [
          "Consumer Electronics",
          "Home, Garden & Furniture",
          "Women's Clothing",
          "Phones & Accessories",
          "Men's Clothing",
          "Jewelry & Watches",
          "Computer & Office",
          "Bags & Shoes",
          "Toys, Kids & Babies",
          "Sports & Outdoors",
          "Home Improvement",
          "Pet Supplies",
          "Automobiles & Motorcycles",
          "Health, Beauty & Hair"
        ];
        const perCat = 4;
        const results = await Promise.allSettled(
          allCatKeys.map((c) => fetchCategoryPage(c, pageNum, perCat))
        );
        const arrays = results
          .filter((r): r is PromiseFulfilledResult<{ products: CJProduct[]; hasMore: boolean }> => r.status === "fulfilled")
          .map((r) => r.value.products);
        const maxLen = Math.max(...arrays.map((a) => a.length), 0);
        const interleaved: CJProduct[] = [];
        for (let i = 0; i < maxLen; i++) {
          for (const arr of arrays) {
            if (i < arr.length) interleaved.push(arr[i]);
          }
        }
        newItems = interleaved.length > 0 ? interleaved.sort(() => Math.random() - 0.5) : DEFAULT_FALLBACK_PRODUCTS;
        more = true;
      } else {
        const res = await fetchCategoryPage(cat, pageNum, 50);
        newItems = res.products.length > 0 ? res.products : DEFAULT_FALLBACK_PRODUCTS;
        more = true;
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
            {/* Top Search Header with Profile Icon on Top Right */}
            <div className="px-6 pt-5 flex items-center gap-3">
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
                <span style={{ fontSize: 14, color: "#8A8A8A", fontWeight: 400 }}>
                  Search 45,000+ products & brands
                </span>
              </Link>
              <Link
                to="/profile"
                aria-label="Profile"
                className="flex items-center justify-center shrink-0 overflow-hidden"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  background: "#F7F7F5",
                  boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
                }}
              >
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="User Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={19} color="#111" />
                )}
              </Link>
            </div>

            {/* Vendor Portal Quick Access Bar (Visible if Vendor) */}
            {vendorProfile?.verified && (
              <div className="px-6 mt-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-white fill-white text-blue-600" />
                    <span className="text-xs font-bold truncate">Vendor: {vendorProfile.storeName}</span>
                  </div>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-3 py-1 rounded-full bg-white text-blue-700 text-xs font-bold shadow hover:bg-gray-100 flex items-center gap-1 shrink-0"
                  >
                    <PackagePlus size={13} /> Add Product
                  </button>
                </div>
              </div>
            )}

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
              {newArrivals.map((p) => {
                const isLiked = wishlist.includes(p.id);
                const isAdded = addedToCartIds.includes(p.id);
                return (
                  <Link
                    to="/product/$id"
                    params={{ id: p.cjId || p.id }}
                    key={p.id}
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
                {trending.map((p) => {
                  const isLiked = wishlist.includes(p.id);
                  const isAdded = addedToCartIds.includes(p.id);
                  const isVendorItem = p.vendorVerified || p.id?.startsWith("v-");
                  return (
                    <Link
                      to="/product/$id"
                      params={{ id: p.cjId || p.id }}
                      key={p.id}
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
