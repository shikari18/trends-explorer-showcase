import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Gift, Minus, Plus, X, Check, ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  component: Cart,
  head: () => ({ meta: [{ title: "Trends — Shopping Cart" }] }),
});

function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems([]);
        localStorage.setItem("cart", JSON.stringify([]));
      }
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + tax;

  // Pull recommended items dynamically from the parsed products list
  const recommendedItems = PRODUCTS.slice(4, 7);

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-44">
            <div className="flex items-center justify-between px-5 pt-4">
              <Link to="/home" aria-label="Back" style={circle()} className="flex items-center justify-center">
                <ArrowLeft size={18} color="#111" />
              </Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Shopping Cart</div>
              <button onClick={() => setItems([])} aria-label="Clear" style={circle()} className="flex items-center justify-center">
                <Trash2 size={17} color="#111" />
              </button>
            </div>

            <div className="px-6 mt-5">
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Your Cart</h1>
              <div className="mt-1 flex items-center gap-2" style={{ fontSize: 13, color: "#666" }}>
                <span style={{ fontWeight: 600 }}>{items.length} Items</span>
                <span style={{ width: 3, height: 3, borderRadius: 999, background: "#C9C9C7" }} />
                <span>₵{total.toLocaleString()} total</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="px-5 mt-5 space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-3 p-3"
                  style={{
                    borderRadius: 22,
                    background: "#fff",
                    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 10px 24px -14px rgba(17,17,17,0.1), inset 0 0 0 1px rgba(17,17,17,0.04)",
                  }}
                >
                  <div style={{ width: 76, height: 76, borderRadius: 18, overflow: "hidden", background: "#F7F7F5", flexShrink: 0 }}>
                    <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8A8A8A", letterSpacing: 0.4, textTransform: "uppercase" }}>{it.brand}</div>
                    <div className="mt-0.5 truncate" style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>{it.name}</div>
                    <div className="mt-0.5" style={{ fontSize: 11.5, color: "#666" }}>{it.color} · {it.size}</div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>₵{it.price.toLocaleString()}</div>
                      <div
                        className="flex items-center"
                        style={{ height: 28, borderRadius: 999, background: "#F7F7F5", padding: "0 2px" }}
                      >
                        <button onClick={() => setItems((p) => p.map((x) => x.id === it.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}
                          style={{ width: 24, height: 24, borderRadius: 999, display: "flex", alignItems: "center", justify: "center" }}>
                          <Minus size={12} color="#111" />
                        </button>
                        <span style={{ minWidth: 20, textAlign: "center", fontSize: 12.5, fontWeight: 700, color: "#111" }}>{it.qty}</span>
                        <button onClick={() => setItems((p) => p.map((x) => x.id === it.id ? { ...x, qty: x.qty + 1 } : x))}
                          style={{ width: 24, height: 24, borderRadius: 999, background: "#0F62FE", display: "flex", alignItems: "center", justify: "center" }}>
                          <Plus size={12} color="#fff" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setItems((p) => p.filter((x) => x.id !== it.id))}
                    aria-label="Remove"
                    style={{ width: 28, height: 28, borderRadius: 999, background: "#F7F7F5", display: "flex", alignItems: "center", justify: "center", alignSelf: "flex-start" }}
                  >
                    <X size={13} color="#8A8A8A" />
                  </button>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="px-5 mt-4">
              <div
                className="flex items-center gap-3 pl-4 pr-2"
                style={{ height: 56, borderRadius: 20, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}
              >
                <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 12, background: "rgba(15,98,254,0.1)" }}>
                  <Gift size={15} color="#0F62FE" />
                </div>
                <input placeholder="Enter promo code" className="flex-1 bg-transparent outline-none min-w-0" style={{ fontSize: 13.5, color: "#111", letterSpacing: -0.1 }} />
                <button style={{ height: 36, padding: "0 16px", borderRadius: 999, background: "#111", color: "#fff", fontSize: 12.5, fontWeight: 600 }}>Apply</button>
              </div>
            </div>

            {/* Summary */}
            <div className="px-5 mt-4">
              <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Order Summary</div>
                <div className="mt-3 space-y-2" style={{ fontSize: 13.5 }}>
                  <Row label="Subtotal" value={`₵${subtotal.toLocaleString()}`} />
                  <Row label="Shipping" value={<span style={{ color: "#34C759", fontWeight: 700 }}>Free</span>} />
                  <Row label="Tax" value={`₵${tax.toLocaleString()}`} />
                </div>
                <div className="my-3" style={{ height: 1, background: "rgba(17,17,17,0.06)" }} />
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 14, color: "#666" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: -0.6 }}>₵{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Trust */}
            <div className="px-5 mt-4 flex items-center justify-between" style={{ fontSize: 11.5, color: "#666", fontWeight: 600 }}>
              <Trust icon={<ShieldCheck size={13} color="#34C759" />} text="Secure Checkout" />
              <Trust icon={<Truck size={13} color="#0F62FE" />} text="Free Returns" />
              <Trust icon={<BadgeCheck size={13} color="#111" />} text="Verified" />
            </div>

            {/* You may also like */}
            <div className="mt-6">
              <div className="px-6 flex items-center justify-between">
                <div style={{ fontSize: 17, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>You May Also Like</div>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto px-5" style={{ scrollbarWidth: "none" }}>
                {recommendedItems.map((p) => (
                  <div key={p.name} className="shrink-0" style={{ width: 148, borderRadius: 20, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)", overflow: "hidden" }}>
                    <img src={p.img} alt={p.name} className="w-full object-cover" style={{ aspectRatio: "1/1" }} />
                    <div className="px-3 py-2.5">
                      <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600, color: "#111" }}>{p.name}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111" }}>{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky checkout */}
        <div className="absolute left-4 right-4" style={{ bottom: 96 }}>
          <div
            className="flex items-center gap-3 pl-5 pr-2"
            style={{
              height: 64,
              borderRadius: 24,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(28px) saturate(160%)",
              boxShadow: "0 20px 40px -14px rgba(17,17,17,0.22), inset 0 0 0 1px rgba(255,255,255,0.6)",
            }}
          >
            <div className="flex-1">
              <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.3, fontWeight: 600, textTransform: "uppercase" }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>₵{total.toLocaleString()}</div>
            </div>
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center px-6"
              style={{ height: 50, borderRadius: 20, background: "#0F62FE", color: "#fff", fontSize: 14.5, fontWeight: 700, letterSpacing: -0.2, boxShadow: "0 12px 24px -8px rgba(15,98,254,0.5)" }}
            >
              Checkout
            </Link>
          </div>
        </div>

        <BottomNav active="cart" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: "#666" }}>{label}</span>
      <span style={{ color: "#111", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Trust({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function circle() {
  return {
    width: 40, height: 40, borderRadius: 999,
    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
  } as const;
}
