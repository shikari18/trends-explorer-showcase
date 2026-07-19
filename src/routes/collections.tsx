import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import editors from "@/assets/col-editors.jpg";
import fashion from "@/assets/col-fashion.jpg";
import shoes from "@/assets/col-shoes.jpg";
import electronics from "@/assets/col-electronics.jpg";
import beauty from "@/assets/col-beauty.jpg";
import home from "@/assets/col-home.jpg";
import sports from "@/assets/col-sports.jpg";
import luxury from "@/assets/col-luxury.jpg";
import gaming from "@/assets/col-gaming.jpg";
import trending from "@/assets/col-trending.jpg";

export const Route = createFileRoute("/collections")({
  component: Collections,
  head: () => ({
    meta: [
      { title: "Trends — Collections" },
      { name: "description", content: "Explore curated categories crafted for every lifestyle." },
    ],
  }),
});

const COLLECTIONS: { name: string; count: string; img: string; slug?: string }[] = [
  { name: "Fashion", count: "2,340 items", img: fashion, slug: "fashion" },
  { name: "Shoes", count: "1,185 items", img: shoes },
  { name: "Electronics", count: "3,012 items", img: electronics },
  { name: "Beauty", count: "892 items", img: beauty },
  { name: "Home", count: "1,470 items", img: home },
  { name: "Sports", count: "624 items", img: sports },
  { name: "Luxury", count: "456 items", img: luxury },
  { name: "Gaming", count: "738 items", img: gaming },
];

function Collections() {
  const [query, setQuery] = useState("");
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
        <div className="relative h-[calc(100%-54px)] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="pb-32">
            {/* Title */}
            <div className="px-6 pt-4">
              <h1
                style={{
                  fontSize: 32,
                  lineHeight: 1.05,
                  fontWeight: 700,
                  letterSpacing: -0.9,
                  color: "#111",
                }}
              >
                Collections
              </h1>
              <p
                className="mt-2"
                style={{ fontSize: 14.5, color: "#666", letterSpacing: -0.1, maxWidth: 300 }}
              >
                Explore curated categories crafted for every lifestyle.
              </p>
            </div>

            {/* Search */}
            <div className="px-6 mt-5">
              <div
                className="flex items-center gap-2.5 px-4"
                style={{
                  height: 52,
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -14px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)",
                }}
              >
                <Search size={18} strokeWidth={2} color="#8A8A8A" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search collections..."
                  className="flex-1 bg-transparent outline-none min-w-0"
                  style={{ fontSize: 15, color: "#111", letterSpacing: -0.1 }}
                />
              </div>
            </div>

            {/* Featured / Editor's Picks */}
            <div className="px-6 mt-6">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "4 / 4.6",
                  borderRadius: 24,
                  boxShadow:
                    "0 24px 50px -24px rgba(17,17,17,0.20), 0 8px 20px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                <img
                  src={editors}
                  alt="Editor's picks — luxury fashion campaign"
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20,15,10,0.4) 100%)",
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
                      Featured
                    </span>
                  </div>
                </div>
                <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between">
                  <div>
                    <div
                      style={{
                        fontSize: 24,
                        lineHeight: 1.1,
                        fontWeight: 700,
                        letterSpacing: -0.6,
                        color: "#fff",
                      }}
                    >
                      Editor's Picks
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        fontSize: 12.5,
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: -0.1,
                        maxWidth: 200,
                      }}
                    >
                      Handpicked products for this season.
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 px-4 shrink-0"
                    style={{
                      height: 36,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.95)",
                      fontSize: 13,
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

            {/* Grid */}
            <div className="px-6 mt-8">
              <div className="flex items-end justify-between mb-4">
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, color: "#111" }}>
                  All Collections
                </h2>
                <span style={{ fontSize: 12.5, color: "#8A8A8A", letterSpacing: -0.1 }}>
                  {COLLECTIONS.length} categories
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {COLLECTIONS.map((c) => (
                  <Link
                    key={c.name}
                    to={c.slug ? "/category/$slug" : "/collections"}
                    params={c.slug ? { slug: c.slug } : undefined}
                    className="relative overflow-hidden block"
                    style={{
                      borderRadius: 22,
                      background: "#F7F7F5",
                      aspectRatio: "1 / 1.15",
                      boxShadow:
                        "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                    }}
                  >
                    <img
                      src={c.img}
                      alt={c.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(15,10,5,0.55) 100%)",
                      }}
                    />
                    <div className="absolute left-3.5 right-3.5 bottom-3.5">
                      <div
                        className="inline-flex items-center gap-1.5 px-2 mb-2"
                        style={{
                          height: 22,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.78)",
                          backdropFilter: "blur(12px)",
                          fontSize: 10.5,
                          color: "#111",
                          fontWeight: 600,
                          letterSpacing: 0.1,
                        }}
                      >
                        {c.count}
                      </div>
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          letterSpacing: -0.4,
                          color: "#fff",
                          lineHeight: 1.1,
                        }}
                      >
                        {c.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div className="px-6 mt-8">
              <h2 className="mb-3" style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, color: "#111" }}>
                Trending Now
              </h2>
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "16 / 10",
                  borderRadius: 24,
                  boxShadow:
                    "0 24px 50px -24px rgba(17,17,17,0.22), 0 8px 20px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                <img
                  src={trending}
                  alt="Summer luxury collection"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20,15,10,0.45) 100%)",
                  }}
                />
                <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between">
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>
                      Trending
                    </div>
                    <div
                      className="mt-1"
                      style={{ fontSize: 20, lineHeight: 1.1, fontWeight: 700, letterSpacing: -0.5, color: "#fff", maxWidth: 210 }}
                    >
                      Summer Luxury<br />Collection
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center px-3.5 shrink-0"
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

        <BottomNav active="collections" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}