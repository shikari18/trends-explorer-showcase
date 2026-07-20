import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, SlidersHorizontal, Heart, Star, ChevronDown, ShoppingCart, Check, Loader2 } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import hero from "@/assets/cat-fashion-hero.jpg";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryDetail,
  head: ({ params }) => {
    const title = params.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return {
      meta: [
        { title: `Trends — ${title}` },
        { name: "description", content: `Explore millions of ${title.toLowerCase()} items live from CJ Dropshipping.` },
      ],
    };
  },
});

const FILTERS = ["All", "Hot Selling", "New", "Under ₵100", "₵100 - ₵500", "Over ₵500"];

function CategoryDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  
  // Map slug back to exact CJ category name
  const categoryName = (import.meta.env.DEV ? "" : "") || (() => {
    const SLUG_MAP: Record<string, string> = {
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
    return SLUG_MAP[slug] || "Women's Clothing";
  })();

  const [activeFilter, setActiveFilter] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedToCartIds, setAddedToCartIds] = useState<string[]>([]);

  // Live products pagination states
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load wishlist
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wishlist");
      setWishlist(saved ? JSON.parse(saved) : []);
    }
  }, []);

  // Fetch page callback
  const loadPage = useCallback(async (cat: string, pageNum: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const { fetchCategoryPage } = await import("@/lib/cjApi");
      const { products: newItems, hasMore: more } = await fetchCategoryPage(cat, pageNum, 40);
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

  // Initial load when category slug changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    loadPage(categoryName, 1);
  }, [slug, categoryName]); // eslint-disable-line

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPage(categoryName, page);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, page, categoryName, loadPage]);

  // Local storage handlers
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
          id: p.id,
          brand: p.brand,
          name: p.name,
          color: "Default",
          size: "One Size",
          price: p.rawPrice,
          img: p.img,
          qty: 1
        });
      }
      localStorage.setItem("cart", JSON.stringify(items));
      setAddedToCartIds((prev) => [...prev, p.id]);
      setTimeout(() => setAddedToCartIds((prev) => prev.filter((x) => x !== p.id)), 1500);

      import("sonner").then(({ toast }) => {
        toast.success(`${p.name} added to cart!`);
      });
    }
  };

  // Filter items locally by active filter
  const filteredProducts = products.filter(p => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Hot Selling") return p.rating >= 4.5;
    if (activeFilter === "New") return p.reviews ? parseInt(p.reviews.replace(/,/g, "")) < 300 : true;
    if (activeFilter === "Under ₵100") return p.rawPrice < 100;
    if (activeFilter === "₵100 - ₵500") return p.rawPrice >= 100 && p.rawPrice <= 500;
    if (activeFilter === "Over ₵500") return p.rawPrice > 500;
    return true;
  });

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            {/* Top nav */}
            <div className="flex items-center justify-between px-5 pt-4">
              <button
                onClick={() => navigate({ to: "/collections" })}
                aria-label="Back"
                className="flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 1px 2px rgba(17,17,17,0.04), 0 8px 20px -12px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.06)",
                }}
              >
                <ChevronLeft size={20} strokeWidth={2.2} color="#111" />
              </button>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>
                {categoryName}
              </div>
              <button
                aria-label="Filter"
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 1px 2px rgba(17,17,17,0.04), 0 8px 20px -12px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.06)",
                }}
              >
                <SlidersHorizontal size={16} strokeWidth={2.2} color="#111" />
              </button>
            </div>

            {/* Hero */}
            <div className="px-5 mt-4">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "4 / 2.3",
                  borderRadius: 24,
                  boxShadow:
                    "0 24px 50px -24px rgba(17,17,17,0.22), 0 8px 20px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                <img src={hero} alt="Category campaign banner" className="w-full h-full object-cover" />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(20,15,10,0.45) 100%)",
                  }}
                />
                <div className="absolute left-5 right-5 bottom-4">
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>
                    Live Inventory
                  </div>
                  <div
                    className="mt-0.5"
                    style={{ fontSize: 22, lineHeight: 1.05, fontWeight: 700, letterSpacing: -0.6, color: "#fff" }}
                  >
                    {categoryName}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter chips */}
            <div className="mt-6">
              <div className="flex gap-2 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
                {FILTERS.map((f) => {
                  const isActive = f === activeFilter;
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className="shrink-0"
                      style={{
                        height: 36,
                        padding: "0 14px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: -0.2,
                        color: isActive ? "#fff" : "#111",
                        background: isActive ? "#0F62FE" : "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(20px)",
                        boxShadow: isActive
                          ? "0 8px 20px -8px rgba(15,98,254,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                          : "0 1px 2px rgba(17,17,17,0.04), 0 6px 16px -10px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.05)",
                      }}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort & Filter */}
            <div className="px-5 mt-5">
              <div
                className="flex items-center justify-between px-4"
                style={{
                  height: 52,
                  borderRadius: 20,
                  background: "#FFFFFF",
                  boxShadow:
                    "0 1px 2px rgba(17,17,17,0.04), 0 10px 24px -16px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12.5, color: "#8A8A8A", letterSpacing: -0.1 }}>Sort by</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>
                    Popularity
                  </span>
                  <ChevronDown size={14} strokeWidth={2.4} color="#111" />
                </div>
                <div className="flex items-center gap-1.5" style={{ fontSize: 13.5, fontWeight: 600, color: "#111" }}>
                  <SlidersHorizontal size={14} strokeWidth={2} color="#111" />
                  Filter
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 gap-3 px-5 mt-5">
              {initialLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonGridCard key={i} />)
                : filteredProducts.map((p) => {
                    const isLiked = wishlist.includes(p.id);
                    const isAdded = addedToCartIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className="overflow-hidden"
                        style={{
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
                            className="w-full object-cover"
                            style={{ aspectRatio: "1 / 1" }}
                          />
                          <button
                            onClick={(e) => toggleWishlist(p.id, e)}
                            aria-label="Wishlist"
                            className="absolute top-2.5 right-2.5 flex items-center justify-center transition-all duration-300"
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 999,
                              background: "rgba(255,255,255,0.9)",
                              backdropFilter: "blur(16px)",
                              boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
                            }}
                          >
                            <Heart size={14} strokeWidth={2.4} fill={isLiked ? "#FF3B30" : "none"} color={isLiked ? "#FF3B30" : "#111111"} />
                          </button>
                        </div>
                        <div className="px-3.5 py-3">
                          <div style={{ fontSize: 10.5, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 600, textTransform: "uppercase" }}>
                            {p.brand}
                          </div>
                          <div className="mt-0.5 truncate" style={{ fontSize: 13.5, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>
                            {p.name}
                          </div>
                          <div className="flex items-center gap-0.5 mt-1.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                strokeWidth={0}
                                fill={i < Math.round(p.rating) ? "#111" : "#E5E5E2"}
                                color={i < Math.round(p.rating) ? "#111" : "#E5E5E2"}
                              />
                            ))}
                          </div>
                          <div className="mt-2.5 flex items-center justify-between">
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>
                              {p.price}
                            </span>
                            <button
                              onClick={(e) => addToCart(p, e)}
                              aria-label="Add to cart"
                              className="flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                              style={{
                                width: 29,
                                height: 29,
                                borderRadius: 999,
                                background: isAdded ? "#34C759" : "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(16px)",
                                boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)",
                                transition: "background-color 0.3s ease"
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
                      </div>
                    );
                  })}
            </div>

            {/* Infinite loading sentinel */}
            <div ref={sentinelRef} className="flex justify-center py-6">
              {loading && !initialLoading && (
                <div className="flex items-center gap-2" style={{ color: "#8A8A8A", fontSize: 13 }}>
                  <Loader2 size={16} className="animate-spin" />
                  Loading more items...
                </div>
              )}
              {!hasMore && !initialLoading && products.length > 0 && (
                <div style={{ fontSize: 12, color: "#C9C9C7", fontWeight: 600 }}>
                  All items loaded ({products.length.toLocaleString()})
                </div>
              )}
            </div>
          </div>
        </div>

        <BottomNav active="collections" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function SkeletonGridCard() {
  return (
    <div className="overflow-hidden" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
      <div className="animate-pulse" style={{ aspectRatio: "1/1", background: "#F3F3F3" }} />
      <div className="px-3.5 py-3 space-y-2">
        <div className="animate-pulse h-2.5 rounded-full bg-gray-200 w-1/2" />
        <div className="animate-pulse h-3 rounded-full bg-gray-200 w-5/6" />
        <div className="animate-pulse h-3 rounded-full bg-gray-200 w-1/3" />
      </div>
    </div>
  );
}