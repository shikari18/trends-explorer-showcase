import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Mic, Camera, Heart, ArrowUpRight, ShoppingCart } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import heroSummer from "@/assets/home-hero-summer.jpg";
import prodBag from "@/assets/home-bag.jpg";
import prodHeadphones from "@/assets/home-headphones.jpg";
import prodSneaker from "@/assets/home-sneaker.jpg";
import prodWatch from "@/assets/home-watch.jpg";
import rec1 from "@/assets/home-rec-1.jpg";
import rec2 from "@/assets/home-rec-2.jpg";
import curated from "@/assets/home-curated.jpg";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/home")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Trends — Home" },
      { name: "description", content: "Discover curated collections and premium products on Trends." },
    ],
  }),
});

const CATEGORIES = ["Fashion", "Shoes", "Electronics", "Beauty", "Home", "Sports", "Gaming", "Luxury"];

const NEW_ARRIVALS = [
  { name: "Leather Weekender", brand: "Bennett & Co.", price: "?680", img: prodBag },
  { name: "WH-1000XM6", brand: "Sony", price: "?449", img: prodHeadphones },
  { name: "Air Max Runner", brand: "Nike", price: "?180", img: prodSneaker },
  { name: "Watch Ultra 2", brand: "Apple", price: "?799", img: prodWatch },
];

const BRANDS = ["Apple", "Nike", "Adidas", "Sony", "Samsung", "Dyson"];

function Home() {
  const [activeCat, setActiveCat] = useState("Fashion");
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Always start fresh — clear any old defaults that may have had pre-filled reds
      const saved = localStorage.getItem("wishlist");
      const parsed: string[] = saved ? JSON.parse(saved) : [];
      // Only keep IDs that are actual product IDs (not old default strings)
      const validIds = ["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12","p13","p14","p15","p16","p17","p18","p19","p20"];
      const clean = parsed.filter((id) => validIds.includes(id));
      setWishlist(clean);
      localStorage.setItem("wishlist", JSON.stringify(clean));
    }
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  };

  const addToCart = (p: typeof PRODUCTS[number], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      let items = saved ? JSON.parse(saved) : [
        { id: "t", brand: "Saint Laurent", name: "Luxury Leather Tote", color: "Cream", size: "M", price: 2450, img: "/src/assets/prod-tote.jpg", qty: 1 },
        { id: "w", brand: "Apple", name: "Watch Ultra 3", color: "Titanium", size: "49mm", price: 899, img: "/src/assets/home-watch.jpg", qty: 1 },
        { id: "h", brand: "Sony", name: "WH-1000XM6", color: "Black", size: "One", price: 449, img: "/src/assets/home-headphones.jpg", qty: 1 },
      ];
      
      const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, ""));
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
          price: priceNum || 99,
          img: p.img,
          qty: 1
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(items));
      import("sonner").then(({ toast }) => {
        toast.success(`${p.name} added to cart!`);
      });
    }
  };

  return (
    <PhoneFrame>
      <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: 320,
              background:
                "radial-gradient(80% 100% at 50% 0%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <StatusBar />

          {/* Scroll area */}
          <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            <div className="pb-32">
              {/* Greeting */}
              <div className="px-6 pt-6 flex items-start justify-between">
                <div>
                  <div style={{ fontSize: 13.5, color: "#8A8A8A", letterSpacing: -0.1, fontWeight: 500 }}>
                    Good Morning
                  </div>
                  <h1
                    className="mt-1"
                    style={{
                      fontSize: 28,
                      lineHeight: 1.1,
                      fontWeight: 700,
                      letterSpacing: -0.8,
                      color: "#111111",
                    }}
                  >
                    Victor <span style={{ fontWeight: 400 }}>👋</span>
                  </h1>
                </div>
                <Link
                  to="/profile"
                  aria-label="Go to profile"
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "0 1px 2px rgba(17,17,17,0.04), 0 8px 20px -12px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111",
                    letterSpacing: -0.2,
                  }}
                >
                  V
                </Link>
              </div>
              <p
                className="px-6 mt-1.5"
                style={{ fontSize: 14.5, color: "#666666", letterSpacing: -0.1 }}
              >
                What are you looking for today?
              </p>

              {/* Search */}
              <div className="px-6 mt-5">
                <div
                  className="flex items-center gap-2.5 pl-4 pr-2"
                  style={{
                    height: 54,
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -14px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)",
                  }}
                >
                  <Search size={18} strokeWidth={2} color="#8A8A8A" />
                  <input
                    placeholder="Search products, brands..."
                    className="flex-1 bg-transparent outline-none min-w-0"
                    style={{ fontSize: 15, color: "#111111", letterSpacing: -0.1 }}
                  />
                  <IconCircle>
                    <Mic size={16} strokeWidth={2} color="#111" />
                  </IconCircle>
                  <Link to="/visual-search" aria-label="Visual search">
                    <IconCircle accent>
                      <Camera size={16} strokeWidth={2} color="#fff" />
                    </IconCircle>
                  </Link>
                </div>
              </div>

              {/* Featured Collection */}
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
                  <img
                    src={heroSummer}
                    alt="Summer essentials — linen shirt, straw hat and sunglasses"
                    className="w-full h-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20,15,10,0.35) 100%)",
                    }}
                  />
                  <div className="absolute left-5 top-5">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5"
                      style={{
                        height: 26,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(16px)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0F62FE" }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#111", letterSpacing: 0.2, textTransform: "uppercase" }}>
                        Current Collection
                      </span>
                    </div>
                  </div>
                  <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between">
                    <div>
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.85)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>
                        Summer 26
                      </div>
                      <div
                        className="mt-1"
                        style={{
                          fontSize: 26,
                          lineHeight: 1.05,
                          fontWeight: 700,
                          letterSpacing: -0.7,
                          color: "#fff",
                        }}
                      >
                        Summer<br />Essentials
                      </div>
                    </div>
                    <button
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
                      Explore
                      <ArrowUpRight size={14} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-7">
                <div className="flex gap-2 overflow-x-auto px-6 pb-1" style={{ scrollbarWidth: "none" }}>
                  {CATEGORIES.map((cat) => {
                    const active = cat === activeCat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCat(cat)}
                        className="shrink-0 transition-all"
                        style={{
                          height: 38,
                          padding: "0 16px",
                          borderRadius: 999,
                          fontSize: 13.5,
                          fontWeight: 600,
                          letterSpacing: -0.2,
                          color: active ? "#fff" : "#111",
                          background: active ? "#0F62FE" : "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(20px)",
                          boxShadow: active
                            ? "0 8px 20px -8px rgba(15,98,254,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                            : "0 1px 2px rgba(17,17,17,0.04), 0 6px 16px -10px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.05)",
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* New Arrivals */}
              <SectionHeader title="New Arrivals" action="See all" />
              <div className="flex gap-3 overflow-x-auto px-6 mt-4" style={{ scrollbarWidth: "none" }}>
                {NEW_ARRIVALS.map((p) => (
                  <Link
                    to="/product"
                    key={p.name}
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
                        className="w-full object-cover"
                        style={{ aspectRatio: "1 / 1" }}
                      />
                      <button
                        aria-label="Save"
                        className="absolute top-2.5 right-2.5 flex items-center justify-center"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(16px)",
                          boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
                        }}
                      >
                        <Heart size={14} strokeWidth={2} color="#111" />
                      </button>
                    </div>
                    <div className="px-3.5 py-3">
                      <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 600, textTransform: "uppercase" }}>
                        {p.brand}
                      </div>
                      <div
                        className="mt-0.5 truncate"
                        style={{ fontSize: 14, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}
                      >
                        {p.name}
                      </div>
                      <div className="mt-1.5" style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>
                        {p.price}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Recommended */}
              <SectionHeader title="Recommended For You" action="See all" />
              <div className="grid grid-cols-2 gap-3 px-6 mt-4">
                {[
                  { img: rec1, name: "Cashmere Knit", price: "?320" },
                  { img: rec2, name: "Ceramic Vase", price: "?95" },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="overflow-hidden"
                    style={{
                      borderRadius: 22,
                      background: "#FFFFFF",
                      boxShadow:
                        "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                    }}
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="w-full object-cover"
                      style={{ aspectRatio: "4 / 5" }}
                    />
                    <div className="px-3.5 py-3">
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>
                        {p.name}
                      </div>
                      <div className="mt-0.5" style={{ fontSize: 13, color: "#666", letterSpacing: -0.1 }}>
                        {p.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trending Styles - 20 items */}
              <SectionHeader title="Trending Styles" action="Filters" />
              <div className="grid grid-cols-2 gap-3 px-6 mt-4">
                {PRODUCTS.map((p) => {
                  const isLiked = wishlist.includes(p.id);
                  return (
                    <Link
                      to="/product"
                      key={p.id}
                      className="overflow-hidden block group relative active:scale-[0.98] transition-all"
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
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ aspectRatio: "1 / 1" }}
                        />
                        <button
                          onClick={(e) => toggleWishlist(p.id, e)}
                          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                          className="absolute top-2.5 right-2.5 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
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
                            color={isLiked ? "#FF3B30" : "#111111"}
                          />
                        </button>
                      </div>
                      <div className="px-3.5 py-3">
                        <div style={{ fontSize: 10, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 700, textTransform: "uppercase" }}>
                          {p.brand}
                        </div>
                        <div
                          className="mt-0.5 truncate"
                          style={{ fontSize: 13.5, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}
                        >
                          {p.name}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
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
                              background: "rgba(255,255,255,0.9)",
                              backdropFilter: "blur(16px)",
                              boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)"
                            }}
                          >
                            <ShoppingCart size={12} color="#111" strokeWidth={2.2} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Popular Brands */}
              <SectionHeader title="Popular Brands" action="See all" />
              <div className="flex gap-2.5 overflow-x-auto px-6 mt-4" style={{ scrollbarWidth: "none" }}>
                {BRANDS.map((b) => (
                  <div
                    key={b}
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 92,
                      height: 68,
                      borderRadius: 20,
                      background: "#FFFFFF",
                      boxShadow:
                        "0 1px 2px rgba(17,17,17,0.04), 0 10px 24px -16px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#111",
                      letterSpacing: -0.3,
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>

              {/* Daily Curated */}
              <div className="px-6 mt-8">
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: "16 / 10",
                    borderRadius: 24,
                    boxShadow:
                      "0 24px 50px -24px rgba(17,17,17,0.22), 0 8px 20px -12px rgba(17,17,17,0.1), inset 0 0 0 1px rgba(17,17,17,0.03)",
                  }}
                >
                  <img
                    src={curated}
                    alt="Curated home lifestyle scene"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20,15,10,0.4) 100%)" }}
                  />
                  <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between">
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>
                        Daily Curated
                      </div>
                      <div
                        className="mt-1"
                        style={{ fontSize: 20, lineHeight: 1.1, fontWeight: 700, letterSpacing: -0.5, color: "#fff", maxWidth: 200 }}
                      >
                        Picks for a<br />quiet weekend
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center gap-1.5 px-3.5"
                      style={{
                        height: 34,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.95)",
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#111",
                        letterSpacing: -0.2,
                        boxShadow: "0 6px 16px -6px rgba(17,17,17,0.3)",
                      }}
                    >
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

function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-end justify-between px-6 mt-8">
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.6, color: "#111" }}>{title}</h2>
      <button style={{ fontSize: 13, fontWeight: 600, color: "#0F62FE", letterSpacing: -0.2 }}>
        {action}
      </button>
    </div>
  );
}

function IconCircle({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: 38,
        height: 38,
        borderRadius: 999,
        background: accent ? "#111111" : "rgba(255,255,255,0.9)",
        boxShadow: accent
          ? "0 6px 14px -6px rgba(17,17,17,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "inset 0 0 0 1px rgba(17,17,17,0.06), 0 2px 6px -2px rgba(17,17,17,0.08)",
      }}
    >
      {children}
    </div>
  );
}
