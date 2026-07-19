import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, SlidersHorizontal, Heart, Star, ChevronDown } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import hero from "@/assets/cat-fashion-hero.jpg";
import tote from "@/assets/prod-tote.jpg";
import loafer from "@/assets/prod-loafer.jpg";
import sunglasses from "@/assets/prod-sunglasses.jpg";
import sneaker from "@/assets/prod-sneaker2.jpg";
import jacket from "@/assets/prod-jacket.jpg";
import wallet from "@/assets/prod-wallet.jpg";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryDetail,
  head: ({ params }) => {
    const title = capitalize(params.slug);
    return {
      meta: [
        { title: `Trends — ${title}` },
        { name: "description", content: `Explore curated ${title.toLowerCase()} pieces from the world's leading designers.` },
      ],
    };
  },
});

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const FILTERS = ["All", "Men", "Women", "Accessories", "Bags", "Shoes", "Watches", "New", "Sale"];

const PRODUCTS = [
  { brand: "Saint Laurent", name: "Leather Tote", price: "?2,890", rating: 5, img: tote },
  { brand: "Gucci", name: "Horsebit Loafers", price: "?980", rating: 5, img: loafer },
  { brand: "Prada", name: "Symbole Sunglasses", price: "?540", rating: 4, img: sunglasses },
  { brand: "Balenciaga", name: "Triple S Sneakers", price: "?1,190", rating: 5, img: sneaker },
  { brand: "Tom Ford", name: "Wool Jacket", price: "?3,450", rating: 5, img: jacket },
  { brand: "Louis Vuitton", name: "Monogram Wallet", price: "?540", rating: 4, img: wallet },
];

function CategoryDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("All");
  const title = capitalize(slug);

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
                <ChevronLeft size={20} strokeWidth={2.2} color="#111" />
              </button>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>
                {title}
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
                  aspectRatio: "4 / 3.4",
                  borderRadius: 32,
                  boxShadow:
                    "0 24px 50px -24px rgba(17,17,17,0.22), 0 8px 20px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                <img src={hero} alt="Luxury fashion campaign" className="w-full h-full object-cover" />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(20,15,10,0.45) 100%)",
                  }}
                />
                <div className="absolute left-5 right-5 bottom-5">
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>
                    New Season
                  </div>
                  <div
                    className="mt-1"
                    style={{ fontSize: 26, lineHeight: 1.05, fontWeight: 700, letterSpacing: -0.7, color: "#fff" }}
                  >
                    Luxury Fashion
                  </div>
                  <div
                    className="mt-1.5"
                    style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", letterSpacing: -0.1, maxWidth: 240 }}
                  >
                    Curated pieces from the world's leading designers.
                  </div>
                </div>
              </div>
            </div>

            {/* Filter chips */}
            <div className="mt-6">
              <div className="flex gap-2 overflow-x-auto px-5 pb-1" style={{ scrollbarWidth: "none" }}>
                {FILTERS.map((f) => {
                  const isActive = f === active;
                  return (
                    <button
                      key={f}
                      onClick={() => setActive(f)}
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
                    Newest
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
              {PRODUCTS.map((p) => (
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
                  <div className="relative" style={{ background: "#F7F7F5" }}>
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="w-full object-cover"
                      style={{ aspectRatio: "4 / 5" }}
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
                          fill={i < p.rating ? "#111" : "#E5E5E2"}
                          color={i < p.rating ? "#111" : "#E5E5E2"}
                        />
                      ))}
                    </div>
                    <div className="mt-1.5" style={{ fontSize: 13.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>
                      {p.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAB */}
        <button
          aria-label="Filter"
          className="absolute flex items-center justify-center"
          style={{
            right: 20,
            bottom: 100,
            width: 52,
            height: 52,
            borderRadius: 999,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(24px) saturate(160%)",
            boxShadow:
              "0 16px 30px -12px rgba(17,17,17,0.28), 0 6px 14px -6px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(255,255,255,0.6)",
          }}
        >
          <SlidersHorizontal size={18} strokeWidth={2.2} color="#111" />
        </button>

        <BottomNav active="collections" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}