import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Share2, Heart, Star, Check, Sparkles, ChevronRight, Box } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import tote from "@/assets/prod-tote.jpg";
import wallet from "@/assets/prod-wallet.jpg";
import sunglasses from "@/assets/prod-sunglasses.jpg";
import watch from "@/assets/home-watch.jpg";

export const Route = createFileRoute("/product")({
  component: Product,
  head: () => ({
    meta: [
      { title: "Trends — Luxury Leather Tote" },
      { name: "description", content: "Saint Laurent Luxury Leather Tote — premium Italian leather craftsmanship." },
    ],
  }),
});

const COLORS = [
  { name: "Black", hex: "#141414" },
  { name: "Cream", hex: "#EFE7D9" },
  { name: "Brown", hex: "#5B3A22" },
  { name: "Tan", hex: "#B98A5B" },
];
const SIZES = ["Small", "Medium", "Large"];

function Product() {
  const [color, setColor] = useState("Cream");
  const [size, setSize] = useState("Medium");

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative h-[calc(100%-54px)] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="pb-40">
            {/* Top nav */}
            <div className="flex items-center justify-between px-5 pt-2">
              <Link to="/search" aria-label="Back" style={circleBtn()} className="flex items-center justify-center">
                <ArrowLeft size={18} color="#111" />
              </Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3, color: "#111" }}>Product</div>
              <button aria-label="Share" style={circleBtn()} className="flex items-center justify-center">
                <Share2 size={17} color="#111" />
              </button>
            </div>

            {/* Hero image */}
            <div className="mt-4 px-5">
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "1 / 1.05",
                  borderRadius: 28,
                  background: "#F7F7F5",
                  boxShadow: "0 24px 60px -30px rgba(17,17,17,0.25), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                <img src={tote} alt="Luxury Leather Tote" className="w-full h-full object-cover" />
                <button
                  aria-label="Wishlist"
                  className="absolute top-4 right-4 flex items-center justify-center"
                  style={{ ...circleBtn(), width: 42, height: 42 }}
                >
                  <Heart size={17} color="#111" />
                </button>
                <Link
                  to="/ar"
                  className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3.5"
                  style={{
                    height: 36,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(16px)",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#111",
                    letterSpacing: -0.2,
                    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 8px 20px -12px rgba(17,17,17,0.2)",
                  }}
                >
                  <Box size={13} strokeWidth={2.2} />
                  View in AR
                </Link>
                {/* Pagination dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: i === 0 ? 20 : 6,
                        height: 6,
                        borderRadius: 999,
                        background: i === 0 ? "#111" : "rgba(255,255,255,0.85)",
                        boxShadow: i === 0 ? "none" : "inset 0 0 0 1px rgba(17,17,17,0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="px-6 mt-6">
              <div className="flex items-center gap-2">
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.5, textTransform: "uppercase" }}>
                  Saint Laurent
                </div>
                <div
                  className="inline-flex items-center gap-1 px-2"
                  style={{ height: 20, borderRadius: 999, background: "rgba(15,98,254,0.10)" }}
                >
                  <Check size={10} strokeWidth={3} color="#0F62FE" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.2 }}>Verified</span>
                </div>
              </div>
              <h1 className="mt-1.5" style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.7, color: "#111", lineHeight: 1.1 }}>
                Luxury Leather Tote
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex" style={{ gap: 1 }}>
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} fill="#111" color="#111" />)}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111" }}>4.9</span>
                <span style={{ fontSize: 12.5, color: "#8A8A8A" }}>(1,248 Reviews)</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div style={{ fontSize: 30, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>$2,450</div>
                <div className="inline-flex items-center gap-1.5">
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: "#34C759", boxShadow: "0 0 0 3px rgba(52,199,89,0.18)" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#34C759", letterSpacing: -0.1 }}>In Stock</span>
                </div>
              </div>
            </div>

            {/* Color */}
            <div className="px-6 mt-7">
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Color</div>
              <div className="mt-3 flex items-center gap-3">
                {COLORS.map((c) => {
                  const active = c.name === color;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      className="flex items-center justify-center"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 999,
                        background: "#fff",
                        boxShadow: active
                          ? "0 0 0 2px #0F62FE, inset 0 0 0 3px #fff"
                          : "inset 0 0 0 1px rgba(17,17,17,0.08)",
                      }}
                      aria-label={c.name}
                    >
                      <span style={{ width: 30, height: 30, borderRadius: 999, background: c.hex, boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)" }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div className="px-6 mt-6">
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Size</div>
              <div className="mt-3 flex items-center gap-2">
                {SIZES.map((s) => {
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      style={{
                        height: 40,
                        padding: "0 18px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: -0.2,
                        color: active ? "#fff" : "#111",
                        background: active ? "#0F62FE" : "#fff",
                        boxShadow: active
                          ? "0 8px 20px -8px rgba(15,98,254,0.5)"
                          : "inset 0 0 0 1px rgba(17,17,17,0.08)",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="px-6 mt-6">
              <Card>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Description</div>
                <p className="mt-2" style={{ fontSize: 13.5, color: "#666", lineHeight: 1.55, letterSpacing: -0.05 }}>
                  Hand-finished in Italy, this signature tote is cut from full-grain calfskin and shaped to hold the essentials of a considered day. Soft structure, quiet hardware.
                </p>
                <button className="mt-2" style={{ fontSize: 12.5, fontWeight: 600, color: "#0F62FE", letterSpacing: -0.1 }}>
                  Read More
                </button>
              </Card>
            </div>

            {/* Specs */}
            <div className="px-6 mt-4">
              <Card>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Specifications</div>
                <div className="mt-3 grid grid-cols-2 gap-y-3">
                  {[
                    ["Material", "Italian Leather"],
                    ["Dimensions", "38 × 26 × 14 cm"],
                    ["Weight", "1.1 kg"],
                    ["Warranty", "2 Years"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 600, textTransform: "uppercase" }}>{k}</div>
                      <div className="mt-0.5" style={{ fontSize: 13, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Reviews */}
            <div className="px-6 mt-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Customer Reviews</div>
                  <div className="flex items-center gap-1">
                    <Star size={13} fill="#111" color="#111" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>4.9</span>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 999, background: "linear-gradient(135deg, #EFE7D9, #B98A5B)" }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Amara O.</div>
                    <div className="mt-0.5 flex" style={{ gap: 1 }}>
                      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={10} fill="#111" color="#111" />)}
                    </div>
                    <p className="mt-1" style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5, letterSpacing: -0.05 }}>
                      The leather has the softest hand — it looks even better in person than the photos suggest.
                    </p>
                  </div>
                </div>
                <button className="mt-3 inline-flex items-center gap-1" style={{ fontSize: 12.5, fontWeight: 600, color: "#0F62FE" }}>
                  View All Reviews <ChevronRight size={12} />
                </button>
              </Card>
            </div>

            {/* AI Suggestions */}
            <div className="px-6 mt-4">
              <div
                className="p-4"
                style={{
                  borderRadius: 24,
                  background: "linear-gradient(180deg, rgba(15,98,254,0.06) 0%, rgba(255,255,255,1) 100%)",
                  boxShadow: "inset 0 0 0 1px rgba(15,98,254,0.12), 0 12px 28px -18px rgba(17,17,17,0.14)",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} color="#0F62FE" strokeWidth={2.4} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.4, textTransform: "uppercase" }}>
                    AI Recommendation
                  </span>
                </div>
                <div className="mt-1.5" style={{ fontSize: 14.5, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>
                  Pairs perfectly with
                </div>
                <div className="mt-3 flex gap-3">
                  {[
                    { name: "Leather Wallet", img: wallet },
                    { name: "Silk Scarf", img: sunglasses },
                    { name: "Luxury Watch", img: watch },
                  ].map((p) => (
                    <div key={p.name} className="flex-1">
                      <div style={{ borderRadius: 16, overflow: "hidden", background: "#F7F7F5", aspectRatio: "1/1" }}>
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-1.5 truncate" style={{ fontSize: 11.5, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="absolute left-4 right-4" style={{ bottom: 18 }}>
          <div
            className="flex items-center gap-2 p-2"
            style={{
              borderRadius: 26,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(24px) saturate(160%)",
              boxShadow: "0 20px 40px -16px rgba(17,17,17,0.2), inset 0 0 0 1px rgba(255,255,255,0.6)",
            }}
          >
            <Link
              to="/cart"
              className="flex-1 inline-flex items-center justify-center"
              style={{ height: 52, borderRadius: 22, background: "#fff", fontSize: 14, fontWeight: 700, color: "#111", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)" }}
            >
              Add to Cart
            </Link>
            <Link
              to="/checkout"
              className="flex-1 inline-flex items-center justify-center"
              style={{ height: 52, borderRadius: 22, background: "#0F62FE", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 12px 24px -10px rgba(15,98,254,0.6)" }}
            >
              Buy Now
            </Link>
          </div>
        </div>

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4"
      style={{
        borderRadius: 22,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
      }}
    >
      {children}
    </div>
  );
}

function circleBtn() {
  return {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
  } as const;
}
