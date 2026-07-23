import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, Mic, Camera, Clock, X, Heart, ShoppingCart, Check, Loader2 } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import { searchCJProducts, CJProduct } from "@/lib/cjApi";

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
  "Wireless Earbuds",
  "Gaming Chair",
  "Sneakers",
  "Handbag",
  "Smart Watch",
  "Perfume",
  "Yoga Mat",
  "Phone Case",
];

function SearchScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CJProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [addedToCartIds, setAddedToCartIds] = useState<string[]>([]);
  const [recent, setRecent] = useState([
    "Wireless Headphones",
    "Gaming Mouse",
    "Leather Handbag",
    "Running Shoes",
  ]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced live search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { products } = await searchCJProducts(trimmed, 1, 20);
        setResults(products);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      import("sonner").then(({ toast }) => toast.error("Voice search not supported on this browser."));
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    import("sonner").then(({ toast }) => {
      toast.info("Listening... Speak now.", { id: "voice-search" });
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        toast.success(`Voice: "${transcript}"`, { id: "voice-search" });
      };
      recognition.onerror = () => toast.error("Speech recognition failed.", { id: "voice-search" });
      recognition.start();
    });
  };

  const addToCart = (p: CJProduct, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.id === p.id);
    if (!existing) { cart.push({ ...p, quantity: 1 }); localStorage.setItem("cart", JSON.stringify(cart)); }
    setAddedToCartIds((prev) => [...prev, p.id]);
    setTimeout(() => setAddedToCartIds((prev) => prev.filter((id) => id !== p.id)), 2000);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    if (!recent.includes(term)) setRecent((prev) => [term, ...prev.slice(0, 5)]);
  };

  const isSearching = query.trim().length > 0;

  return (
    <PhoneFrame>
      <>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{ height: 260, background: "radial-gradient(80% 100% at 50% 0%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)" }}
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
                style={{ height: 54, borderRadius: 24, background: "#F7F7F5", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.03)" }}
              >
                {searching
                  ? <Loader2 size={18} strokeWidth={2} color="#0F62FE" className="animate-spin shrink-0" />
                  : <SearchIcon size={18} strokeWidth={2} color="#8A8A8A" className="shrink-0" />
                }
                <input
                  autoFocus={false}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      if (!recent.includes(query.trim())) setRecent((prev) => [query.trim(), ...prev.slice(0, 5)]);
                    }
                  }}
                  placeholder="Search products, brands, or collections..."
                  className="flex-1 bg-transparent outline-none min-w-0"
                  style={{ fontSize: 14.5, color: "#111", letterSpacing: -0.1 }}
                />
                {query.length > 0 && (
                  <button onClick={() => setQuery("")} className="shrink-0 flex items-center justify-center" style={{ width: 28, height: 28, borderRadius: 999 }}>
                    <X size={14} strokeWidth={2} color="#8A8A8A" />
                  </button>
                )}
                <button
                  onClick={startVoiceSearch}
                  className="flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                  style={{ width: 36, height: 36, borderRadius: 999, background: "#0F62FE", boxShadow: "0 6px 14px -6px rgba(15,98,254,0.5), inset 0 1px 0 rgba(255,255,255,0.2)" }}
                  aria-label="Voice search"
                >
                  <Mic size={16} strokeWidth={2} color="#fff" />
                </button>
              </div>
            </div>

            {/* Quick actions (only show when not searching) */}
            {!isSearching && (
              <div className="grid grid-cols-2 gap-3 px-6 mt-5">
                <Link to="/visual-search">
                  <QuickAction
                    icon={<Camera size={20} strokeWidth={2} color="#0F62FE" />}
                    title="Visual Search"
                    subtitle="Find products using your camera."
                  />
                </Link>
                <button onClick={startVoiceSearch} className="text-left w-full cursor-pointer">
                  <QuickAction
                    icon={<Mic size={20} strokeWidth={2} color="#0F62FE" />}
                    title="Voice Search"
                    subtitle="Search naturally with your voice."
                  />
                </button>
              </div>
            )}

            {/* LIVE SEARCH RESULTS */}
            {isSearching && (
              <div className="px-6 mt-5">
                {searching && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 size={28} strokeWidth={1.5} color="#0F62FE" className="animate-spin" />
                    <p style={{ fontSize: 14, color: "#8A8A8A" }}>Searching for "{query}"...</p>
                  </div>
                )}

                {!searching && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <SearchIcon size={32} strokeWidth={1.2} color="#CCC" />
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>No results for "{query}"</p>
                    <p style={{ fontSize: 13, color: "#8A8A8A" }}>Try a different keyword</p>
                  </div>
                )}

                {results.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4, color: "#111" }}>
                        Results for "{query}"
                      </h2>
                      <span style={{ fontSize: 12.5, color: "#8A8A8A" }}>{results.length} items</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {results.map((p) => {
                        const isAdded = addedToCartIds.includes(p.id);
                        return (
                          <Link
                            key={p.id}
                            to="/product/$id"
                            params={{ id: p.cjId }}
                            className="overflow-hidden block group active:scale-[0.98] transition-all"
                            style={{ borderRadius: 22, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)" }}
                          >
                            <div className="relative overflow-hidden" style={{ background: "#F7F7F5" }}>
                              <img src={p.img} alt={p.name} loading="lazy" className="w-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ aspectRatio: "1/1" }} />
                              <button
                                onClick={(e) => addToCart(p, e)}
                                className="absolute bottom-2.5 right-2.5 flex items-center justify-center transition-all z-10"
                                style={{ width: 29, height: 29, borderRadius: 999, background: isAdded ? "#34C759" : "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)", transition: "background-color 0.3s ease" }}
                                aria-label="Add to cart"
                              >
                                {isAdded ? <Check size={12} color="#fff" strokeWidth={3} /> : <ShoppingCart size={12} color="#111" strokeWidth={2.2} />}
                              </button>
                            </div>
                            <div className="px-3.5 py-3">
                              <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 600, textTransform: "uppercase" }}>{p.brand}</div>
                              <div className="mt-0.5 truncate" style={{ fontSize: 13.5, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>{p.name}</div>
                              <div className="mt-1" style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{p.price}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Default state — only show when not searching */}
            {!isSearching && (
              <>
                {/* Trending */}
                <div className="px-6 mt-8">
                  <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4, color: "#111" }}>
                    Trending Searches
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleTrendingClick(t)}
                        style={{ height: 34, padding: "0 14px", borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", fontSize: 13, fontWeight: 600, color: "#111", letterSpacing: -0.2, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 6px 16px -10px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.05)" }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent */}
                {recent.length > 0 && (
                  <div className="px-6 mt-8">
                    <div className="flex items-end justify-between">
                      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4, color: "#111" }}>
                        Recent
                      </h2>
                      <button onClick={() => setRecent([])} style={{ fontSize: 12.5, fontWeight: 600, color: "#0F62FE", letterSpacing: -0.2 }}>
                        Clear all
                      </button>
                    </div>
                    <div className="mt-3 overflow-hidden" style={{ borderRadius: 22, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                      {recent.map((r, i) => (
                        <button
                          key={r}
                          onClick={() => setQuery(r)}
                          className="w-full flex items-center gap-3 px-4 text-left"
                          style={{ height: 54, borderTop: i === 0 ? "none" : "1px solid rgba(17,17,17,0.05)" }}
                        >
                          <div className="flex items-center justify-center shrink-0" style={{ width: 32, height: 32, borderRadius: 999, background: "#F7F7F5" }}>
                            <Clock size={14} strokeWidth={2} color="#8A8A8A" />
                          </div>
                          <div className="flex-1 truncate" style={{ fontSize: 14, color: "#111", letterSpacing: -0.1 }}>{r}</div>
                          <div
                            onClick={(e) => { e.stopPropagation(); setRecent((prev) => prev.filter((x) => x !== r)); }}
                            className="flex items-center justify-center shrink-0"
                            style={{ width: 28, height: 28, borderRadius: 999 }}
                          >
                            <X size={14} strokeWidth={2} color="#8A8A8A" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
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
      style={{ borderRadius: 22, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.05)" }}
    >
      <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(15,98,254,0.10)" }}>
        {icon}
      </div>
      <div className="mt-3" style={{ fontSize: 14.5, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>{title}</div>
      <div className="mt-1" style={{ fontSize: 12, color: "#666", letterSpacing: -0.05, lineHeight: 1.35 }}>{subtitle}</div>
    </div>
  );
}