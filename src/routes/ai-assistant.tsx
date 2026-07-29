import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Clock, Plus, Mic, Camera, ArrowUp, GitCompare, Gift, Wand2, PackageSearch, ArrowLeft, ShoppingCart, Heart, Check, Sparkles, Star } from "lucide-react";
import { PhoneFrame, StatusBar } from "@/components/phone/PhoneFrame";
import { searchCJProducts, CJProduct } from "@/lib/cjApi";

export const Route = createFileRoute("/ai-assistant")({
  component: AI,
  head: () => ({ meta: [{ title: "Trends AI — Shopping Assistant" }] }),
});

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  products?: CJProduct[];
  isCompare?: boolean;
}

function AI() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello 👋 I'm Trends AI, your personal shopping assistant. Ask me to find products, compare items, discover luxury styles, or pick the perfect gift!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [addedCartIds, setAddedCartIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wishlist");
      if (saved) setLikedIds(JSON.parse(saved));
    }
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (likedIds.includes(id)) {
      updated = likedIds.filter((x) => x !== id);
    } else {
      updated = [...likedIds, id];
    }
    setLikedIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(updated));
    }
  };

  const addToCart = (p: CJProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      let cart = saved ? JSON.parse(saved) : [];
      const existing = cart.find((it: any) => it.id === p.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: p.id,
          brand: p.brand,
          name: p.name,
          color: "Default",
          size: "One Size",
          price: p.rawPrice,
          img: p.img,
          qty: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setAddedCartIds((prev) => [...prev, p.id]);
      setTimeout(() => setAddedCartIds((prev) => prev.filter((x) => x !== p.id)), 1500);
      import("sonner").then(({ toast }) => toast.success(`${p.name} added to cart!`));
    }
  };

  const handleSendPrompt = async (promptText: string) => {
    const query = promptText.trim();
    if (!query) return;

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = { id: userMsgId, sender: "user", text: query };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const isCompare = /compare|vs|difference|which is better/i.test(query);

    try {
      // Fetch matching products live from CJ API
      const { products } = await searchCJProducts(query, 1, isCompare ? 4 : 3);

      setIsTyping(false);

      if (products && products.length > 0) {
        let aiText = `I found ${products.length} top options matching "${query}" in our catalog:`;
        if (isCompare) {
          aiText = `Here is a side-by-side comparison for "${query}":`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: aiText,
            products,
            isCompare,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: `I couldn't find items matching "${query}" directly. Try searching for broader terms like "leather bag", "shoes", "earbuds", or "watch".`,
          },
        ]);
      }
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Sorry, I had trouble searching right now. Please try again.",
        },
      ]);
    }
  };

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-36">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4">
              <button
                onClick={() => navigate({ to: "/home" })}
                aria-label="Back"
                style={circle()}
                className="flex items-center justify-center"
              >
                <ArrowLeft size={17} color="#111" />
              </button>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Trends AI</div>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: "welcome",
                      sender: "ai",
                      text: "Hello 👋 I'm Trends AI, your personal shopping assistant. Ask me to find products, compare items, or pick the perfect gift!",
                    },
                  ])
                }
                aria-label="Clear chat"
                style={circle()}
                className="flex items-center justify-center"
              >
                <Clock size={17} color="#111" />
              </button>
            </div>

            {/* Glowing Orb Header */}
            <div className="mt-4 flex justify-center relative">
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(220px 160px at 50% 50%, rgba(15,98,254,0.18), transparent 70%)" }} />
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 999,
                  background: "radial-gradient(circle at 30% 25%, #ffffff 0%, #d9e6ff 35%, #7aa5ff 65%, #0F62FE 100%)",
                  boxShadow: "0 25px 50px -15px rgba(15,98,254,0.5), inset 0 0 25px rgba(255,255,255,0.6)",
                }}
              />
            </div>

            <div className="px-6 mt-4 text-center">
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111", letterSpacing: -0.7, lineHeight: 1.15 }}>How can I help you shop today?</h1>
              <p className="mt-1.5 mx-auto" style={{ fontSize: 12.5, color: "#666", maxWidth: 300, lineHeight: 1.4 }}>
                Ask anything, compare products live, discover new styles, or get instant recommendations.
              </p>
            </div>

            {/* Messages */}
            <div className="px-5 mt-5 space-y-3.5">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-3">
                  <Bubble ai={msg.sender === "ai"}>{msg.text}</Bubble>

                  {/* Render Product Cards inside AI Message */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2">
                      {msg.isCompare ? (
                        /* Comparison Matrix View */
                        <div className="space-y-3 p-3.5" style={{ borderRadius: 24, background: "rgba(255,255,255,0.95)", boxShadow: "0 12px 30px -15px rgba(17,17,17,0.15), inset 0 0 0 1px rgba(17,17,17,0.06)" }}>
                          <div className="flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.2 }}>
                            <GitCompare size={14} /> Product Comparison Matrix
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {msg.products.map((p) => (
                              <div
                                key={p.id}
                                onClick={() => navigate({ to: "/product/$id", params: { id: p.cjId } })}
                                className="p-2.5 flex flex-col justify-between cursor-pointer group"
                                style={{ borderRadius: 18, background: "#F7F7F5", border: "1px solid rgba(17,17,17,0.06)" }}
                              >
                                <div className="relative overflow-hidden" style={{ borderRadius: 14, aspectRatio: "1/1" }}>
                                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="mt-2">
                                  <div style={{ fontSize: 9.5, color: "#8A8A8A", fontWeight: 700, textTransform: "uppercase" }}>{p.brand}</div>
                                  <div className="line-clamp-2" style={{ fontSize: 11.5, fontWeight: 600, color: "#111", lineHeight: 1.2 }}>{p.name}</div>
                                  <div className="mt-1 flex items-center justify-between">
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0F62FE" }}>{p.price}</span>
                                    <div className="flex items-center gap-0.5" style={{ fontSize: 10, color: "#FFA800", fontWeight: 700 }}>
                                      <Star size={10} fill="#FFA800" color="#FFA800" /> {p.rating}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => addToCart(p, e)}
                                  className="mt-2.5 w-full flex items-center justify-center gap-1"
                                  style={{
                                    height: 30,
                                    borderRadius: 12,
                                    background: addedCartIds.includes(p.id) ? "#34C759" : "#111",
                                    color: "#fff",
                                    fontSize: 11,
                                    fontWeight: 700,
                                  }}
                                >
                                  {addedCartIds.includes(p.id) ? <Check size={12} /> : <ShoppingCart size={12} />}
                                  {addedCartIds.includes(p.id) ? "Added" : "Add to Cart"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Standard Product Cards Stream */
                        <div className="flex gap-3 overflow-x-auto py-1 px-1" style={{ scrollbarWidth: "none" }}>
                          {msg.products.map((p) => {
                            const isLiked = likedIds.includes(p.id);
                            const isAdded = addedCartIds.includes(p.id);
                            return (
                              <div
                                key={p.id}
                                onClick={() => navigate({ to: "/product/$id", params: { id: p.cjId } })}
                                className="shrink-0 cursor-pointer group transition-all"
                                style={{
                                  width: 170,
                                  borderRadius: 20,
                                  background: "#FFFFFF",
                                  boxShadow: "0 4px 20px -10px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.06)",
                                  overflow: "hidden",
                                }}
                              >
                                <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "#F7F7F5" }}>
                                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  <button
                                    onClick={(e) => toggleWishlist(p.id, e)}
                                    className="absolute top-2 right-2 flex items-center justify-center"
                                    style={{
                                      width: 28,
                                      height: 28,
                                      borderRadius: 999,
                                      background: "rgba(255,255,255,0.9)",
                                      backdropFilter: "blur(12px)",
                                    }}
                                  >
                                    <Heart size={13} strokeWidth={2.4} fill={isLiked ? "#FF3B30" : "none"} color={isLiked ? "#FF3B30" : "#111"} />
                                  </button>
                                </div>
                                <div className="p-3">
                                  <div style={{ fontSize: 9.5, color: "#8A8A8A", fontWeight: 700, textTransform: "uppercase" }}>{p.brand}</div>
                                  <div className="truncate mt-0.5" style={{ fontSize: 12.5, fontWeight: 600, color: "#111" }}>{p.name}</div>
                                  <div className="mt-1 flex items-center justify-between">
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{p.price}</span>
                                    <button
                                      onClick={(e) => addToCart(p, e)}
                                      className="flex items-center justify-center transition-all"
                                      style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 999,
                                        background: isAdded ? "#34C759" : "#0F62FE",
                                        color: "#fff",
                                      }}
                                    >
                                      {isAdded ? <Check size={13} strokeWidth={3} /> : <ShoppingCart size={13} strokeWidth={2.2} />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3.5" style={{ borderRadius: 20, background: "rgba(255,255,255,0.9)", maxWidth: 180 }}>
                  <Sparkles size={16} className="animate-spin" color="#0F62FE" />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#666" }}>Trends AI thinking…</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions Grid */}
            <div className="px-5 mt-6 grid grid-cols-2 gap-2.5">
              <Action icon={<GitCompare size={16} />} label="Compare Products" onClick={() => handleSendPrompt("Compare top smartphones and bags")} />
              <Action icon={<Gift size={16} />} label="Find Gifts" onClick={() => handleSendPrompt("Best gifts under ₵500")} />
              <Action icon={<Wand2 size={16} />} label="Style Me" onClick={() => handleSendPrompt("Vacation outfits and accessories")} />
              <Action icon={<PackageSearch size={16} />} label="Popular Items" onClick={() => handleSendPrompt("Popular electronics and watches")} />
            </div>

            {/* Suggested prompt chips */}
            <div className="mt-5 flex gap-2 overflow-x-auto px-5" style={{ scrollbarWidth: "none" }}>
              {["Best gifts under ₵500", "Compare iPhones", "Luxury handbags", "Find matching shoes", "Wireless earbuds", "Mechanical keyboard"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSendPrompt(s)}
                  className="shrink-0 active:scale-95 transition-transform"
                  style={{
                    height: 32,
                    padding: "0 14px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#111",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -10px rgba(17,17,17,0.15)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="absolute left-0 right-0 flex justify-center z-20" style={{ bottom: 90 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="flex items-center gap-2 px-2"
            style={{
              width: "90%",
              height: 54,
              borderRadius: 999,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(24px) saturate(160%)",
              boxShadow: "0 20px 40px -18px rgba(17,17,17,0.25), inset 0 0 0 1px rgba(17,17,17,0.06)",
            }}
          >
            <button type="button" onClick={() => navigate({ to: "/search" })} className="flex items-center justify-center shrink-0" style={{ width: 38, height: 38, borderRadius: 999, background: "#F7F7F5" }}>
              <Plus size={16} color="#111" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Trends AI anything…"
              className="flex-1 bg-transparent outline-none px-1"
              style={{ fontSize: 13.5, color: "#111", fontWeight: 500 }}
            />
            <button type="button" onClick={() => navigate({ to: "/visual-search" })} className="flex items-center justify-center shrink-0" style={{ width: 34, height: 34 }}>
              <Camera size={17} color="#111" />
            </button>
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center justify-center shrink-0 disabled:opacity-50 transition-opacity"
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: "#0F62FE",
                color: "#fff",
                boxShadow: "0 8px 18px -6px rgba(15,98,254,0.55)",
              }}
            >
              <ArrowUp size={17} />
            </button>
          </form>
        </div>
      </>
    </PhoneFrame>
  );
}

function Bubble({ children, ai }: { children: React.ReactNode; ai?: boolean }) {
  return (
    <div className={ai ? "" : "flex justify-end"}>
      <div
        className="p-3.5"
        style={{
          maxWidth: "85%",
          borderRadius: 22,
          background: ai ? "rgba(255,255,255,0.92)" : "#111",
          color: ai ? "#111" : "#fff",
          fontSize: 13.5,
          lineHeight: 1.5,
          letterSpacing: -0.1,
          boxShadow: ai
            ? "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)"
            : "0 12px 24px -14px rgba(17,17,17,0.4)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Action({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-4 flex flex-col gap-3 text-left w-full active:scale-95 transition-transform"
      style={{
        borderRadius: 22,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)",
      }}
    >
      <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(15,98,254,0.10)", color: "#0F62FE" }}>
        {icon}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>{label}</div>
    </button>
  );
}

function circle() {
  return {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
  } as const;
}