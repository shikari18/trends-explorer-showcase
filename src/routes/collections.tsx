import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Search, ArrowUpRight, ChevronRight, 
  Shirt, PawPrint, Sofa, Sparkles, Watch, 
  User, ShoppingBag, Baby, Compass, Laptop, 
  Wrench, Car, Smartphone, Monitor 
} from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import editors from "@/assets/col-editors.jpg";
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

const COLLECTIONS_LIST = [
  { name: "Women's Clothing", slug: "womens-clothing", icon: "Shirt" },
  { name: "Pet Supplies", slug: "pet-supplies", icon: "PawPrint" },
  { name: "Home, Garden & Furniture", slug: "home-garden-furniture", icon: "Sofa" },
  { name: "Health, Beauty & Hair", slug: "health-beauty-hair", icon: "Sparkles" },
  { name: "Jewelry & Watches", slug: "jewelry-watches", icon: "Watch" },
  { name: "Men's Clothing", slug: "mens-clothing", icon: "User" },
  { name: "Bags & Shoes", slug: "bags-shoes", icon: "ShoppingBag" },
  { name: "Toys, Kids & Babies", slug: "toys-kids-babies", icon: "Baby" },
  { name: "Sports & Outdoors", slug: "sports-outdoors", icon: "Compass" },
  { name: "Consumer Electronics", slug: "consumer-electronics", icon: "Laptop" },
  { name: "Home Improvement", slug: "home-improvement", icon: "Wrench" },
  { name: "Automobiles & Motorcycles", slug: "automobiles-motorcycles", icon: "Car" },
  { name: "Phones & Accessories", slug: "phones-accessories", icon: "Smartphone" },
  { name: "Computer & Office", slug: "computer-office", icon: "Monitor" }
];

const getIcon = (name: string) => {
  switch (name) {
    case "Shirt": return <Shirt size={17} strokeWidth={2} color="#111" />;
    case "PawPrint": return <PawPrint size={17} strokeWidth={2} color="#111" />;
    case "Sofa": return <Sofa size={17} strokeWidth={2} color="#111" />;
    case "Sparkles": return <Sparkles size={17} strokeWidth={2} color="#111" />;
    case "Watch": return <Watch size={17} strokeWidth={2} color="#111" />;
    case "User": return <User size={17} strokeWidth={2} color="#111" />;
    case "ShoppingBag": return <ShoppingBag size={17} strokeWidth={2} color="#111" />;
    case "Baby": return <Baby size={17} strokeWidth={2} color="#111" />;
    case "Compass": return <Compass size={17} strokeWidth={2} color="#111" />;
    case "Laptop": return <Laptop size={17} strokeWidth={2} color="#111" />;
    case "Wrench": return <Wrench size={17} strokeWidth={2} color="#111" />;
    case "Car": return <Car size={17} strokeWidth={2} color="#111" />;
    case "Smartphone": return <Smartphone size={17} strokeWidth={2} color="#111" />;
    case "Monitor": return <Monitor size={17} strokeWidth={2} color="#111" />;
    default: return <Shirt size={17} strokeWidth={2} color="#111" />;
  }
};

function Collections() {
  const [query, setQuery] = useState("");

  const filteredCollections = COLLECTIONS_LIST.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  );

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
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
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
                Explore categories and source products directly from CJ.
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
                  aspectRatio: "4 / 2.3",
                  borderRadius: 24,
                  boxShadow:
                    "0 24px 50px -24px rgba(17,17,17,0.20), 0 8px 20px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                <img
                  src={editors}
                  alt="Editor's picks campaign"
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
                <div className="absolute left-5 top-4">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5"
                    style={{
                      height: 24,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0F62FE" }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#111", letterSpacing: 0.2, textTransform: "uppercase" }}>
                      Featured Category
                    </span>
                  </div>
                </div>
                <div className="absolute left-5 right-5 bottom-4 flex items-end justify-between">
                  <div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: -0.5,
                        color: "#fff",
                        lineHeight: 1.1,
                      }}
                    >
                      Women's Clothing
                    </div>
                    <div
                      className="mt-0.5"
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      Discover the latest arrivals live from CJ.
                    </div>
                  </div>
                  <Link
                    to="/category/$slug"
                    params={{ slug: "womens-clothing" }}
                    className="inline-flex items-center gap-1.5 px-4 shrink-0"
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
                    Explore
                    <ArrowUpRight size={14} strokeWidth={2.4} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Premium Category List Layout matching the requested image */}
            <div className="px-6 mt-8">
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, color: "#111", marginBottom: "16px" }}>
                All Categories
              </h2>

              <div 
                className="overflow-hidden"
                style={{
                  borderRadius: 24,
                  background: "#FFFFFF",
                  boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 16px 36px -18px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.04)"
                }}
              >
                {filteredCollections.map((c, index) => (
                  <Link
                    key={c.name}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-center justify-between px-4 transition-colors hover:bg-slate-50 active:bg-slate-100"
                    style={{
                      height: 56,
                      borderTop: index === 0 ? "none" : "1px solid rgba(17,17,17,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Left circular icon container */}
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 999,
                          background: "#F7F7F5",
                          boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)"
                        }}
                      >
                        {getIcon(c.icon)}
                      </div>
                      
                      {/* Middle Category Name */}
                      <span
                        style={{
                          fontSize: 14.5,
                          fontWeight: 600,
                          color: "#111",
                          letterSpacing: -0.2
                        }}
                      >
                        {c.name}
                      </span>
                    </div>

                    {/* Right Arrow/Chevron */}
                    <ChevronRight size={16} strokeWidth={2.4} color="#C9C9C7" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer space indicator */}
            <div className="px-6 mt-8">
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: "16 / 9",
                  borderRadius: 24,
                  boxShadow:
                    "0 24px 50px -24px rgba(17,17,17,0.22), 0 8px 20px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                <img
                  src={trending}
                  alt="Summer luxury collection banner"
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
                <div className="absolute left-5 right-5 bottom-4 flex items-end justify-between">
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 600 }}>
                      Trending
                    </div>
                    <div
                      className="mt-0.5"
                      style={{ fontSize: 18, lineHeight: 1.1, fontWeight: 700, letterSpacing: -0.4, color: "#fff" }}
                    >
                      Summer Luxury
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center px-3.5 shrink-0"
                    style={{
                      height: 32,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.95)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#111",
                      letterSpacing: -0.2,
                      boxShadow: "0 6px 16px -6px rgba(17,17,17,0.3)",
                    }}
                  >
                    View
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