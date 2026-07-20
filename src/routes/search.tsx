import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon, Mic, Camera, Clock, X, Heart } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import watch from "@/assets/home-watch.jpg";
import wallet from "@/assets/prod-wallet.jpg";
import camera from "@/assets/prod-camera.jpg";
import sneaker from "@/assets/home-sneaker.jpg";

export const Route = createFileRoute("/search")({
  component: SearchScreen,
  head: () => ({
    meta: [
      { title: "Trends — Search" },
      { name: "description", content: "Search products, brands, and collections on Trends." },
    ],
  }),
});

const TRENDING = [
  "Luxury Watches",
  "Nike Shoes",
  "MacBook Pro",
  "Designer Bags",
  "Gaming Setup",
  "Perfume",
  "Summer Collection",
  "Apple Accessories",
];

const SUGGESTED = [
  { name: "Watch Ultra 2", brand: "Apple", price: "₵799", img: watch },
  { name: "Monogram Wallet", brand: "Louis Vuitton", price: "₵540", img: wallet },
  { name: "Alpha 7 IV", brand: "Sony", price: "₵2,498", img: camera },
  { name: "Air Max Runner", brand: "Nike", price: "₵180", img: sneaker },
];

function SearchScreen() {
  const [recent, setRecent] = useState([
    "Sony WH-1000XM6",
    "Leather Messenger Bag",
    "Dyson Airwrap",
    "AirPods Pro",
  ]);

  return (
    <PhoneFrame>
      <>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 260,
            background:
              "radial-gradient(80% 100% at 50% 0%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            {/* Title */}
            <div className="px-6 pt-4">
              <h1 style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 700, letterSpacing: -0.9, color: "#111" }}>
                Search
              </h1>
            </div>

            {/* Search bar */}
            <div className="px-6 mt-4">
              <div
                className="flex items-center gap-2.5 px-4"
                style={{
                  height: 54,
                  borderRadius: 24,
                  background: "#F7F7F5",
                  boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                <SearchIcon size={18} strokeWidth={2} color="#8A8A8A" />
                <input
                  autoFocus={false}
                  placeholder="Search products, brands, or collections..."
                  className="flex-1 bg-transparent outline-none min-w-0"
                  style={{ fontSize: 14.5, color: "#111", letterSpacing: -0.1 }}
                />
                <button
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: "#0F62FE",
                    boxShadow: "0 6px 14px -6px rgba(15,98,254,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                  aria-label="Voice search"
                >
                  <Mic size={16} strokeWidth={2} color="#fff" />
                </button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3 px-6 mt-5">
              <Link to="/visual-search">
                <QuickAction
                  icon={<Camera size={20} strokeWidth={2} color="#0F62FE" />}
                  title="Visual Search"
                  subtitle="Find products using your camera."
                />
              </Link>
              <QuickAction
                icon={<Mic size={20} strokeWidth={2} color="#0F62FE" />}
                title="Voice Search"
                subtitle="Search naturally with your voice."
              />
            </div>

            {/* Trending */}
            <div className="px-6 mt-8">
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4, color: "#111" }}>
                Trending Searches
              </h2>
              <div className="flex flex-wrap gap-2 mt-3">
                {TRENDING.map((t) => (
                  <button
                    key={t}
                    style={{
                      height: 34,
                      padding: "0 14px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(20px)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#111",
                      letterSpacing: -0.2,
                      boxShadow:
                        "0 1px 2px rgba(17,17,17,0.04), 0 6px 16px -10px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.05)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent */}
            <div className="px-6 mt-8">
              <div className="flex items-end justify-between">
                <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4, color: "#111" }}>
                  Recent
                </h2>
                <button style={{ fontSize: 12.5, fontWeight: 600, color: "#0F62FE", letterSpacing: -0.2 }}>
                  Clear all
                </button>
              </div>
              <div
                className="mt-3 overflow-hidden"
                style={{
                  borderRadius: 22,
                  background: "#FFFFFF",
                  boxShadow:
                    "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}
              >
                {recent.map((r, i) => (
                  <div
                    key={r}
                    className="flex items-center gap-3 px-4"
                    style={{
                      height: 54,
                      borderTop: i === 0 ? "none" : "1px solid rgba(17,17,17,0.05)",
                    }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 32, height: 32, borderRadius: 999, background: "#F7F7F5" }}
                    >
                      <Clock size={14} strokeWidth={2} color="#8A8A8A" />
                    </div>
                    <div className="flex-1 truncate" style={{ fontSize: 14, color: "#111", letterSpacing: -0.1 }}>
                      {r}
                    </div>
                    <button
                      onClick={() => setRecent((prev) => prev.filter((x) => x !== r))}
                      aria-label="Remove"
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 28, height: 28, borderRadius: 999 }}
                    >
                      <X size={14} strokeWidth={2} color="#8A8A8A" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested */}
            <div className="mt-8">
              <h2 className="px-6" style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4, color: "#111" }}>
                Suggested for You
              </h2>
              <div className="flex gap-3 overflow-x-auto px-6 mt-4" style={{ scrollbarWidth: "none" }}>
                {SUGGESTED.map((p) => (
                  <div
                    key={p.name}
                    className="shrink-0 overflow-hidden"
                    style={{
                      width: 168,
                      borderRadius: 22,
                      background: "#FFFFFF",
                      boxShadow:
                        "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                    }}
                  >
                    <div className="relative" style={{ background: "#F7F7F5" }}>
                      <img src={p.img} alt={p.name} loading="lazy" className="w-full object-cover" style={{ aspectRatio: "1 / 1" }} />
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
                      <div className="mt-0.5 truncate" style={{ fontSize: 13.5, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>
                        {p.name}
                      </div>
                      <div className="mt-1" style={{ fontSize: 13.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>
                        {p.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <BottomNav active="search" variant="search" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function QuickAction({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div
      className="p-4"
      style={{
        borderRadius: 22,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        boxShadow:
          "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.05)",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          background: "rgba(15,98,254,0.10)",
        }}
      >
        {icon}
      </div>
      <div className="mt-3" style={{ fontSize: 14.5, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>
        {title}
      </div>
      <div className="mt-1" style={{ fontSize: 12, color: "#666", letterSpacing: -0.05, lineHeight: 1.35 }}>
        {subtitle}
      </div>
    </div>
  );
}