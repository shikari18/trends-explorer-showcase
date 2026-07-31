import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Mic, Camera, Heart, ArrowUpRight, ShoppingCart, Check, Loader2 } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import heroSummer from "@/assets/home-hero-summer.jpg";
import curated from "@/assets/home-curated.jpg";
import { fetchCategoryPage, CATEGORIES, CATEGORY_MAP, CJProduct } from "@/lib/cjApi";

export const Route = createFileRoute("/home")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Trends — Home" },
      { name: "description", content: "Discover millions of products on Trends." },
    ],
  }),
});

const BRANDS = ["Apple", "Nike", "Adidas", "Sony", "Samsung", "Dyson"];

function Home() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("Random");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedToCartIds, setAddedToCartIds] = useState<string[]>([]);

  // Live products state
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load wishlist
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wishlist");
      setWishlist(saved ? JSON.parse(saved) : []);
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

      if (cat === "Random") {
        // Balanced 14-category mix (Tech, Furniture, Clothes, Jewelry, Shoes, Toys, etc.)
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
        // Fetch 4 products from ALL 14 categories = 56 diverse products per page
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
        // Shuffle on app refresh for exciting variety
        newItems = interleaved.sort(() => Math.random() - 0.5);
        more = true;
      } else {
        const res = await fetchCategoryPage(cat, pageNum, 50);
        newItems = res.products;
        more = true;
      }

      setProducts((prev) => (pageNum === 1 ? newItems : [...prev, ...newItems]));
      setHasMore(more);
      setPage(pageNum + 1);
    } catch (e) {
      console.error(e);
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

  const addToCart = (p: CJProduct, e: React.MouseEvent) => {
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

  // Dynamic daily rotation for 8 New Arrivals (changes every day)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const newArrivalsOffset = (dayOfYear * 8) % Math.max(1, products.length - 8);
  const newArrivals = products.slice(newArrivalsOffset, newArrivalsOffset + 8);
  const recommended = products.slice(newArrivalsOffset + 8, newArrivalsOffset + 14);
  const trending = products;

  // 9 Hero Banner Themes (auto-cycles every 4 seconds with smooth cross-fade)
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

  const [heroIndex, setHeroIndex] = useState(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_THEMES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentHero = HERO_THEMES[heroIndex];

  return (
    <PhoneFrame>
      <>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{ height: 320, background: "radial-gradient(80% 100% at 50% 0%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)" }}
        />
        <StatusBar />

        <div
          ref={mainScrollRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <div className="pb-32">
            <div className="px-6 pt-6 flex items-start justify-between">
              <div>
                <div style={{ fontSize: 13.5, color: "#8A8A8A", letterSpacing: -0.1, fontWeight: 500 }}>Good Morning</div>
                <h1 className="mt-1" style={{ fontSize: 28, lineHeight: 1.1, fontWeight: 700, letterSpacing: -0.8, color: "#111111" }}>
                  Victor <span style={{ fontWeight: 400 }}>👋</span>
                </h1>
              </div>
              <Link to="/profile" aria-label="Go to profile" className="flex items-center justify-center shrink-0"
                style={{ width: 44, height: 44, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 8px 20px -12px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)", fontSize: 15, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>
                V
              </Link>
            </div>
            <p className="px-6 mt-1.5" style={{ fontSize: 14.5, color: "#666666", letterSpacing: -0.1 }}>
              What are you looking for today?
            </p>

            <div className="px-6 mt-5">
              <div 
                onClick={() => navigate({ to: "/search" })}
                className="flex items-center gap-2.5 pl-4 pr-2 w-full cursor-pointer select-none"
                style={{ height: 54, borderRadius: 24, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -14px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)" }}
              >
                <Search size={18} strokeWidth={2} color="#8A8A8A" />
                <div className="flex-1 text-left" style={{ fontSize: 15, color: "#8A8A8A", letterSpacing: -0.1 }}>
                  Search products, brands...
                </div>
                <IconCircle><Mic size={16} strokeWidth={2} color="#111" /></IconCircle>
                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="relative z-10">
                  <Link to="/visual-search" aria-label="Visual search">
                    <IconCircle accent><Camera size={16} strokeWidth={2} color="#fff" /></IconCircle>
                  </Link>
                </div>
              </div>
            </div>

            {/* Dynamic Hero Banner (Smooth Cross-Fade Carousel across 9 Themes) */}
            <div className="px-6 mt-6">
              <div className="relative w-full overflow-hidden"
                style={{ aspectRatio: "4 / 5", borderRadius: 24, background: "#F2EFE9", boxShadow: "0 24px 50px -24px rgba(17,17,17,0.20), 0 8px 20px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)" }}>
                {HERO_THEMES.map((hero, idx) => {
                  const isActive = idx === heroIndex;
                  return (
                    <div
                      key={hero.title}
                      className="absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scale(1)" : "scale(1.04)",
                        zIndex: isActive ? 10 : 0
                      }}
                    >
                      <img src={hero.img} alt={hero.title} className="w-full h-full object-cover" />
                      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(10,10,10,0.65) 100%)" }} />
                      <div className="absolute left-5 top-5 pointer-events-auto">
                        <div className="inline-flex items-center gap-1.5 px-2.5" style={{ height: 26, borderRadius: 999, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)" }}>
                          <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0F62FE" }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#111", letterSpacing: 0.2, textTransform: "uppercase" }}>{hero.tag}</span>
                        </div>
                      </div>
                      <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between pointer-events-auto">
                        <div>
                          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.85)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>{hero.subtitle}</div>
                          <div className="mt-1" style={{ fontSize: 24, lineHeight: 1.1, fontWeight: 700, letterSpacing: -0.7, color: "#fff", whiteSpace: "pre-line" }}>{hero.title}</div>
                        </div>
                        <Link to="/category/$slug" params={{ slug: hero.slug }} className="inline-flex items-center gap-1.5 px-4"
                          style={{ height: 38, borderRadius: 999, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", fontSize: 13.5, fontWeight: 600, color: "#111", letterSpacing: -0.2, boxShadow: "0 6px 16px -6px rgba(17,17,17,0.3)" }}>
                          Explore <ArrowUpRight size={14} strokeWidth={2.4} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New Arrivals — 8 items daily rotation, no see all button */}
            <div className="flex items-end justify-between px-6 mt-8">
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.6, color: "#111" }}>New Arrivals</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto px-6 mt-4" style={{ scrollbarWidth: "none" }}>
              {initialLoading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : newArrivals.map((p) => {
                    const isLiked = wishlist.includes(p.id);
                    const isAdded = addedToCartIds.includes(p.id);
                    return (
                      <Link to="/product/$id" params={{ id: p.cjId }} key={p.id} className="shrink-0 overflow-hidden block"
                        style={{ width: 172, borderRadius: 22, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                        <div className="relative" style={{ background: "#F7F7F5" }}>
                          <img
                            src={p.img}
                            alt={p.name}
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
                            }}
                            className="w-full object-cover"
                            style={{ aspectRatio: "1/1" }}
                          />
                          <button onClick={(e) => toggleWishlist(p.id, e)} aria-label="Wishlist"
                            className="absolute top-2.5 right-2.5 flex items-center justify-center transition-all duration-300 z-10"
                            style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}>
                            <Heart size={14} strokeWidth={2.4} fill={isLiked ? "#FF3B30" : "none"} color={isLiked ? "#FF3B30" : "#111"} />
                          </button>
                        </div>
                        <div className="px-3.5 py-3">
                          <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 600, textTransform: "uppercase" }}>{p.brand}</div>
                          <div className="mt-0.5 truncate" style={{ fontSize: 14, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>{p.name}</div>
                          <div className="mt-1 flex items-center justify-between">
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{p.price}</span>
                            <button onClick={(e) => addToCart(p, e)} aria-label="Add to cart"
                              className="flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                              style={{ width: 29, height: 29, borderRadius: 999, background: isAdded ? "#34C759" : "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)", transition: "background-color 0.3s ease" }}>
                              {isAdded ? <Check size={12} color="#fff" strokeWidth={3} /> : <ShoppingCart size={12} color="#111" strokeWidth={2.2} />}
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
            </div>

            {/* Recommended — no see all button */}
            {!initialLoading && recommended.length > 0 && (
              <>
                <div className="flex items-end justify-between px-6 mt-8">
                  <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.6, color: "#111" }}>Recommended For You</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 px-6 mt-4">
                  {recommended.map((p) => {
                    const isAdded = addedToCartIds.includes(p.id);
                    return (
                      <Link to="/product/$id" params={{ id: p.cjId }} key={p.id} className="overflow-hidden block"
                        style={{ borderRadius: 22, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                        <div className="relative">
                          <img
                            src={p.img}
                            alt={p.name}
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
                            }}
                            className="w-full object-cover"
                            style={{ aspectRatio: "4/5" }}
                          />
                          <button onClick={(e) => addToCart(p, e)} aria-label="Add to cart"
                            className="absolute bottom-2.5 right-2.5 flex items-center justify-center transition-all z-10"
                            style={{ width: 29, height: 29, borderRadius: 999, background: isAdded ? "#34C759" : "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)", transition: "background-color 0.3s ease" }}>
                            {isAdded ? <Check size={12} color="#fff" strokeWidth={3} /> : <ShoppingCart size={12} color="#111" strokeWidth={2.2} />}
                          </button>
                        </div>
                        <div className="px-3.5 py-3">
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111" }}>{p.name}</div>
                          <div className="mt-0.5" style={{ fontSize: 13, color: "#666" }}>{p.price}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {/* Trending — full infinite list with Category Dropdown Filter */}
            <div className="flex items-end justify-between px-6 mt-8 relative">
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.6, color: "#111" }}>All {activeCat} Products</h2>
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

            <div className="grid grid-cols-2 gap-3 px-6 mt-4">
              {initialLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonGridCard key={i} />)
                : trending.map((p) => {
                    const isLiked = wishlist.includes(p.id);
                    const isAdded = addedToCartIds.includes(p.id);
                    return (
                      <Link to="/product/$id" params={{ id: p.cjId }} key={p.id} className="overflow-hidden block group active:scale-[0.98] transition-all"
                        style={{ borderRadius: 22, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                        <div className="relative overflow-hidden" style={{ background: "#F7F7F5" }}>
                          <img
                            src={p.img}
                            alt={p.name}
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
                            }}
                            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            style={{ aspectRatio: "1/1" }}
                          />
                          <button onClick={(e) => toggleWishlist(p.id, e)} aria-label="Wishlist"
                            className="absolute top-2.5 right-2.5 flex items-center justify-center transition-all duration-300"
                            style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}>
                            <Heart size={14} strokeWidth={2.4} fill={isLiked ? "#FF3B30" : "none"} color={isLiked ? "#FF3B30" : "#111"} />
                          </button>
                        </div>
                        <div className="px-3.5 py-3">
                          <div style={{ fontSize: 10, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 700, textTransform: "uppercase" }}>{p.brand}</div>
                          <div className="mt-0.5 truncate" style={{ fontSize: 13.5, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>{p.name}</div>
                          <div className="mt-1 flex items-center justify-between">
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{p.price}</span>
                            <button onClick={(e) => addToCart(p, e)} aria-label="Add to cart"
                              className="flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                              style={{ width: 29, height: 29, borderRadius: 999, background: isAdded ? "#34C759" : "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)", transition: "background-color 0.3s ease" }}>
                              {isAdded ? <Check size={12} color="#fff" strokeWidth={3} /> : <ShoppingCart size={12} color="#111" strokeWidth={2.2} />}
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
            </div>

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="flex justify-center py-6">
              {loading && hasMore && <Loader2 size={24} className="animate-spin text-neutral-400" />}
            </div>

            {/* Brands */}
            <SectionHeader title="Popular Brands" action="Explore" />
            <div className="flex gap-2.5 overflow-x-auto px-6 mt-4" style={{ scrollbarWidth: "none" }}>
              {["Aura", "Nordic", "Luxe", "Verve", "Prism", "Zenith"].map((b) => (
                <div key={b} className="shrink-0 flex items-center justify-center"
                  style={{ width: 92, height: 68, borderRadius: 20, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 10px 24px -16px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)", fontSize: 14, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>
                  {b}
                </div>
              ))}
            </div>

            {/* Daily Curated */}
            <div className="px-6 mt-8">
              <div className="relative w-full overflow-hidden"
                style={{ aspectRatio: "16/10", borderRadius: 24, boxShadow: "0 24px 50px -24px rgba(17,17,17,0.22), 0 8px 20px -12px rgba(17,17,17,0.1), inset 0 0 0 1px rgba(17,17,17,0.03)" }}>
                <img src={curated} alt="Curated lifestyle" loading="lazy" className="w-full h-full object-cover" />
                <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20,15,10,0.4) 100%)" }} />
                <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between">
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>Daily Curated</div>
                    <div className="mt-1" style={{ fontSize: 20, lineHeight: 1.1, fontWeight: 700, letterSpacing: -0.5, color: "#fff", maxWidth: 200 }}>Picks for a<br />quiet weekend</div>
                  </div>
                  <button className="inline-flex items-center gap-1.5 px-3.5"
                    style={{ height: 34, borderRadius: 999, background: "rgba(255,255,255,0.95)", fontSize: 12.5, fontWeight: 600, color: "#111", letterSpacing: -0.2, boxShadow: "0 6px 16px -6px rgba(17,17,17,0.3)" }}>
                    View Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomNav active="home" variant="home" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function SkeletonCard() {
  return (
    <div className="shrink-0 overflow-hidden" style={{ width: 172, borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
      <div className="animate-pulse" style={{ aspectRatio: "1/1", background: "#F3F3F3", borderRadius: "0 0 0 0" }} />
      <div className="px-3.5 py-3 space-y-2">
        <div className="animate-pulse h-2.5 rounded-full bg-gray-200 w-1/2" />
        <div className="animate-pulse h-3 rounded-full bg-gray-200 w-5/6" />
        <div className="animate-pulse h-3 rounded-full bg-gray-200 w-1/3" />
      </div>
    </div>
  );
}

function SkeletonGridCard() {
  return (
    <div className="overflow-hidden" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
      <div className="animate-pulse" style={{ aspectRatio: "1/1", background: "#F3F3F3" }} />
      <div className="px-3.5 py-3 space-y-2">
        <div className="animate-pulse h-2 rounded-full bg-gray-200 w-1/2" />
        <div className="animate-pulse h-3 rounded-full bg-gray-200 w-5/6" />
        <div className="animate-pulse h-3 rounded-full bg-gray-200 w-1/3" />
      </div>
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-end justify-between px-6 mt-8">
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.6, color: "#111" }}>{title}</h2>
      <button style={{ fontSize: 13, fontWeight: 600, color: "#0F62FE", letterSpacing: -0.2 }}>{action}</button>
    </div>
  );
}

function IconCircle({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center justify-center shrink-0"
      style={{ width: 38, height: 38, borderRadius: 999, background: accent ? "#111111" : "rgba(255,255,255,0.9)", boxShadow: accent ? "0 6px 14px -6px rgba(17,17,17,0.4), inset 0 1px 0 rgba(255,255,255,0.1)" : "inset 0 0 0 1px rgba(17,17,17,0.06), 0 2px 6px -2px rgba(17,17,17,0.08)" }}>
      {children}
    </div>
  );
}
