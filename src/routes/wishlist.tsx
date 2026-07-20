import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Heart, Star, Plus, Sparkles, ShoppingBag, ShoppingCart } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import { PRODUCTS } from "@/lib/products";
import tote from "@/assets/prod-tote.jpg";
import watch from "@/assets/home-watch.jpg";
import headphones from "@/assets/home-headphones.jpg";
import sneaker from "@/assets/home-sneaker.jpg";
import wallet from "@/assets/prod-wallet.jpg";
import sunglasses from "@/assets/prod-sunglasses.jpg";
import jacket from "@/assets/prod-jacket.jpg";
import loafer from "@/assets/prod-loafer.jpg";

export const Route = createFileRoute("/wishlist")({
  component: Wishlist,
  head: () => ({ meta: [{ title: "Trends — Wishlist" }] }),
});

const COLLECTIONS = ["Favorites", "Luxury Bags", "Tech", "Fashion", "Shoes", "Accessories"];

const AI = [
  { name: "Leather Wallet", img: wallet },
  { name: "Luxury Sunglasses", img: sunglasses },
  { name: "Premium Watch", img: watch },
  { name: "Designer Jacket", img: jacket },
  { name: "Loafers", img: loafer },
];

function Wishlist() {
  const [col, setCol] = useState("Favorites");
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wishlist");
      const parsed: string[] = saved ? JSON.parse(saved) : [];
      const validIds = ["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12","p13","p14","p15","p16","p17","p18","p19","p20"];
      const clean = parsed.filter((id) => validIds.includes(id));
      setWishlist(clean);
      localStorage.setItem("wishlist", JSON.stringify(clean));
    }
  }, []);

  const removeWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = prev.filter((x) => x !== id);
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

  const wishlistedItems = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-4">
              <div style={{ width: 40 }} />
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Wishlist</div>
              <button aria-label="Search" style={circle()} className="flex items-center justify-center">
                <Search size={17} color="#111" />
              </button>
            </div>
            <div className="px-6 mt-4">
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Saved</h1>
              <div className="mt-1 flex items-center gap-2" style={{ fontSize: 13, color: "#666" }}>
                <span style={{ fontWeight: 600 }}>{wishlistedItems.length} {wishlistedItems.length === 1 ? "item" : "items"}</span>
                <span style={{ width: 3, height: 3, borderRadius: 999, background: "#C9C9C7" }} />
                <span>{wishlistedItems.length > 0 ? 1 : 0} collection</span>
              </div>
            </div>

            {/* Collections */}
            <div className="mt-5 flex gap-5 overflow-x-auto px-6 pb-1" style={{ scrollbarWidth: "none" }}>
              {COLLECTIONS.map((c) => {
                const active = c === col;
                return (
                  <button key={c} onClick={() => setCol(c)} className="shrink-0 flex flex-col items-center"
                    style={{ paddingBottom: 6, borderBottom: active ? "2px solid #0F62FE" : "2px solid transparent" }}>
                    <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? "#111" : "#8A8A8A", letterSpacing: -0.2 }}>
                      {c}{c === "Favorites" ? " ♥" : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            {wishlistedItems.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 px-5 mt-4">
                {wishlistedItems.map((p) => (
                  <Link key={p.id} to="/product"
                    className="overflow-hidden block active:scale-[0.98] transition-all"
                    style={{
                      borderRadius: 22, background: "#fff",
                      boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                    }}>
                    <div className="relative" style={{ background: "#F7F7F5" }}>
                      <img src={p.img} alt={p.name} loading="lazy" className="w-full object-cover" style={{ aspectRatio: "1/1.1" }} />
                      <button
                        onClick={(e) => removeWishlist(p.id, e)}
                        aria-label="Remove from wishlist"
                        className="absolute top-2.5 right-2.5 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}
                      >
                        <Heart size={13} fill="#FF3B30" color="#FF3B30" />
                      </button>
                    </div>
                    <div className="px-3 py-3">
                      <div style={{ fontSize: 10.5, color: "#8A8A8A", letterSpacing: 0.3, fontWeight: 700, textTransform: "uppercase" }}>{p.brand}</div>
                      <div className="mt-0.5 truncate" style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>{p.name}</div>
                      <div className="mt-1 flex items-center gap-1">
                        <Star size={10} fill="#111" color="#111" />
                        <span style={{ fontSize: 10.5, color: "#666", fontWeight: 600 }}>{p.rating || "4.8"}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{p.price}</div>
                        <button
                          onClick={(e) => addToCart(p, e)}
                          aria-label="Add to cart"
                          className="flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                          style={{ width: 29, height: 29, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)" }}
                        >
                          <ShoppingCart size={12} color="#111" strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                  <ShoppingBag size={28} className="text-slate-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Your wishlist is empty</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-[240px]">
                  Explore products on the home screen and tap the heart icon to save them here.
                </p>
                <Link
                  to="/home"
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/10"
                >
                  Explore Products
                </Link>
              </div>
            )}

            {/* AI Suggestions */}
            <div className="px-5 mt-6">
              <div className="p-4"
                style={{
                  borderRadius: 24,
                  background: "linear-gradient(180deg, rgba(15,98,254,0.06) 0%, rgba(255,255,255,1) 100%)",
                  boxShadow: "inset 0 0 0 1px rgba(15,98,254,0.12), 0 12px 28px -18px rgba(17,17,17,0.14)",
                }}>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} color="#0F62FE" strokeWidth={2.4} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.4, textTransform: "uppercase" }}>Recommended</span>
                </div>
                <div className="mt-1" style={{ fontSize: 14.5, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Based on your wishlist</div>
                <div className="mt-3 flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  {AI.map((p) => (
                    <div key={p.name} className="shrink-0" style={{ width: 108 }}>
                      <div style={{ borderRadius: 16, overflow: "hidden", background: "#F7F7F5", aspectRatio: "1/1" }}>
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-1.5 truncate" style={{ fontSize: 11.5, fontWeight: 600, color: "#111" }}>{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomNav active="wishlist" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function circle() {
  return {
    width: 40, height: 40, borderRadius: 999,
    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
  } as const;
}
