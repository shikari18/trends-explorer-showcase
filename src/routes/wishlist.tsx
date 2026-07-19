import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Heart, Star, Plus, Sparkles } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
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
const PRODUCTS = [
  { brand: "Saint Laurent", name: "Luxury Leather Tote", price: "?2,450", img: tote },
  { brand: "Apple", name: "Watch Ultra 3", price: "?899", img: watch },
  { brand: "Sony", name: "WH-1000XM6", price: "?449", img: headphones },
  { brand: "Nike", name: "Air Max Premium", price: "?220", img: sneaker },
  { brand: "Louis Vuitton", name: "Pocket Organizer", price: "?690", img: wallet },
  { brand: "Ray-Ban", name: "Aviator Classic", price: "?180", img: sunglasses },
];
const AI = [
  { name: "Leather Wallet", img: wallet },
  { name: "Luxury Sunglasses", img: sunglasses },
  { name: "Premium Watch", img: watch },
  { name: "Designer Jacket", img: jacket },
  { name: "Loafers", img: loafer },
];

function Wishlist() {
  const [col, setCol] = useState("Favorites");
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
                <span style={{ fontWeight: 600 }}>24 items</span>
                <span style={{ width: 3, height: 3, borderRadius: 999, background: "#C9C9C7" }} />
                <span>3 collections</span>
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
            <div className="grid grid-cols-2 gap-3 px-5 mt-4">
              {PRODUCTS.map((p) => (
                <Link key={p.name} to="/product"
                  className="overflow-hidden"
                  style={{
                    borderRadius: 22, background: "#fff",
                    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                  }}>
                  <div className="relative" style={{ background: "#F7F7F5" }}>
                    <img src={p.img} alt={p.name} loading="lazy" className="w-full object-cover" style={{ aspectRatio: "1/1.1" }} />
                    <div className="absolute top-2.5 right-2.5 flex items-center justify-center"
                      style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}>
                      <Heart size={13} fill="#0F62FE" color="#0F62FE" />
                    </div>
                  </div>
                  <div className="px-3 py-3">
                    <div style={{ fontSize: 10.5, color: "#8A8A8A", letterSpacing: 0.3, fontWeight: 700, textTransform: "uppercase" }}>{p.brand}</div>
                    <div className="mt-0.5 truncate" style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>{p.name}</div>
                    <div className="mt-1 flex items-center gap-1">
                      <Star size={10} fill="#111" color="#111" />
                      <span style={{ fontSize: 10.5, color: "#666", fontWeight: 600 }}>4.9</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{p.price}</div>
                      <button aria-label="Add to cart" className="flex items-center justify-center"
                        style={{ width: 26, height: 26, borderRadius: 999, background: "#0F62FE" }}>
                        <Plus size={13} color="#fff" strokeWidth={2.6} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

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
