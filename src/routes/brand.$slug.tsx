import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Share2, Star, BadgeCheck, Heart } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import hero from "@/assets/cat-fashion-hero.jpg";
import tote from "@/assets/prod-tote.jpg";
import loafer from "@/assets/prod-loafer.jpg";
import wallet from "@/assets/prod-wallet.jpg";
import sunglasses from "@/assets/prod-sunglasses.jpg";

export const Route = createFileRoute("/brand/$slug")({
  component: BrandStore,
  head: () => ({ meta: [{ title: "Trends — Brand Store" }] }),
});

const CATS = ["All", "New Arrivals", "Bags", "Shoes", "Accessories", "Ready-to-Wear", "Sale"];
const PRODUCTS = [
  { name: "Leather Tote", price: "$2,450", img: tote },
  { name: "Chelsea Boots", price: "$1,290", img: loafer },
  { name: "Bifold Wallet", price: "$690", img: wallet },
  { name: "Cassandre Sunglasses", price: "$520", img: sunglasses },
];

function BrandStore() {
  const { slug } = useParams({ from: "/brand/$slug" });
  const brand = slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "Saint Laurent";
  const [cat, setCat] = useState("All");
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-4">
              <Link to="/home" aria-label="Back" className="flex items-center justify-center" style={circle()}><ChevronLeft size={18} color="#111" /></Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Brand Store</div>
              <button aria-label="Share" style={circle()} className="flex items-center justify-center"><Share2 size={16} color="#111" /></button>
            </div>

            {/* Hero */}
            <div className="mt-3 mx-5" style={{ height: 220, borderRadius: 28, overflow: "hidden", position: "relative",
              boxShadow: "0 20px 40px -18px rgba(17,17,17,0.35)" }}>
              <img src={hero} alt={brand} className="w-full h-full object-cover" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35))" }} />
              <div style={{ position: "absolute", left: 18, bottom: 16, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", opacity: 0.9 }}>Autumn 2026</div>
            </div>

            {/* Brand info */}
            <div className="px-5 mt-5 flex items-center gap-4">
              <div className="flex items-center justify-center" style={{ width: 62, height: 62, borderRadius: 999, background: "#111", color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: -0.5, boxShadow: "0 12px 24px -10px rgba(17,17,17,0.4)" }}>{brand.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>{brand}</div>
                  <BadgeCheck size={16} color="#0F62FE" fill="#0F62FE" />
                </div>
                <div className="mt-0.5 flex items-center gap-2" style={{ fontSize: 12, color: "#666" }}>
                  <span className="flex items-center gap-0.5"><Star size={11} fill="#111" color="#111" /> 4.9</span>
                  <span>· 12.4K Reviews</span>
                </div>
              </div>
              <button style={{ height: 34, padding: "0 16px", borderRadius: 999, background: "#0F62FE", color: "#fff", fontSize: 12.5, fontWeight: 700 }}>Follow</button>
            </div>
            <p className="px-5 mt-3" style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>Official luxury fashion house known for timeless craftsmanship and premium leather goods.</p>

            {/* Stats */}
            <div className="mx-5 mt-4 p-4 grid grid-cols-3"
              style={{ borderRadius: 22, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
              {[["Products","1,284"],["Followers","542K"],["Founded","1961"]].map(([k,v],i)=>(
                <div key={k} className="text-center" style={{ borderLeft: i? "1px solid rgba(17,17,17,0.06)" : "none" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>{v}</div>
                  <div className="mt-0.5" style={{ fontSize: 11, color: "#666" }}>{k}</div>
                </div>
              ))}
            </div>

            {/* Category chips */}
            <div className="mt-5 flex gap-2 overflow-x-auto px-5" style={{ scrollbarWidth: "none" }}>
              {CATS.map((c) => {
                const a = c === cat;
                return <button key={c} onClick={()=>setCat(c)} className="shrink-0"
                  style={{ height: 34, padding: "0 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                    color: a ? "#fff" : "#111", background: a ? "#0F62FE" : "rgba(255,255,255,0.9)",
                    boxShadow: a ? "0 8px 18px -8px rgba(15,98,254,0.5)" : "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>{c}</button>;
              })}
            </div>

            {/* Featured collection */}
            <div className="mx-5 mt-5 p-5 flex items-center gap-4"
              style={{ borderRadius: 24, background: "linear-gradient(135deg, #111 0%, #2a2a2a 100%)", color: "#fff",
                boxShadow: "0 20px 40px -18px rgba(17,17,17,0.4)" }}>
              <div className="flex-1">
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", opacity: 0.65 }}>Featured</div>
                <div className="mt-1" style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.5 }}>Autumn Luxury Collection</div>
                <div className="mt-1" style={{ fontSize: 12, opacity: 0.7 }}>Curated pieces from the latest runway.</div>
              </div>
              <button style={{ height: 34, padding: "0 14px", borderRadius: 999, background: "#fff", color: "#111", fontSize: 12.5, fontWeight: 700 }}>Explore</button>
            </div>

            {/* Products */}
            <div className="px-5 mt-5 grid grid-cols-2 gap-3">
              {PRODUCTS.map((p) => (
                <div key={p.name} className="p-2"
                  style={{ borderRadius: 22, background: "#fff",
                    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                  <div className="relative" style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "1/1", background: "#F7F7F5" }}>
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    <button className="absolute top-2 right-2 flex items-center justify-center"
                      style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)" }}>
                      <Heart size={14} color="#111" />
                    </button>
                  </div>
                  <div className="px-1.5 pt-2 pb-1">
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8A8A8A", letterSpacing: 0.4, textTransform: "uppercase" }}>{brand}</div>
                    <div className="mt-0.5 truncate" style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{p.name}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{p.price}</div>
                      <div className="flex items-center gap-0.5" style={{ fontSize: 11, color: "#666" }}><Star size={10} fill="#111" color="#111" />4.9</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div className="mx-5 mt-5 p-4"
              style={{ borderRadius: 22, background: "#fff",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
              <div className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
                {[0,1,2,3,4].map(i=><Star key={i} size={12} fill="#111" color="#111" />)}<span className="ml-1">4.9</span>
              </div>
              <div className="mt-2" style={{ fontSize: 13, color: "#111", lineHeight: 1.5, fontStyle: "italic" }}>"Exceptional craftsmanship and outstanding quality."</div>
              <button className="mt-3" style={{ height: 34, padding: "0 14px", borderRadius: 999, background: "#F7F7F5", fontSize: 12.5, fontWeight: 600, color: "#111" }}>Read All Reviews</button>
            </div>
          </div>
        </div>
        <BottomNav active="home" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}