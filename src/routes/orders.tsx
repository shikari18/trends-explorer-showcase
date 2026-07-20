import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronRight, HelpCircle } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import tote from "@/assets/prod-tote.jpg";
import watch from "@/assets/home-watch.jpg";
import headphones from "@/assets/home-headphones.jpg";

export const Route = createFileRoute("/orders")({
  component: Orders,
  head: () => ({ meta: [{ title: "Trends — Orders" }] }),
});

const FILTERS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const ORDERS = [
  { id: "TRD-482917", name: "Luxury Leather Tote", brand: "Saint Laurent", date: "Sep 18, 2026", total: "₵2,450", status: "Delivered", tone: "#34C759", cta: "View Details", img: tote },
  { id: "TRD-482643", name: "Watch Ultra 3", brand: "Apple", date: "Sep 14, 2026", total: "₵899", status: "Shipped", tone: "#0F62FE", cta: "Track Package", img: watch },
  { id: "TRD-481998", name: "WH-1000XM6", brand: "Sony", date: "Sep 10, 2026", total: "₵449", status: "Processing", tone: "#FF9500", cta: "View Status", img: headphones },
];

function Orders() {
  const [filter, setFilter] = useState("All");
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-4">
              <div style={{ width: 40 }} />
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Orders</div>
              <button aria-label="Search" style={circle()} className="flex items-center justify-center">
                <Search size={17} color="#111" />
              </button>
            </div>
            <div className="px-6 mt-4">
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Your Orders</h1>
              <p className="mt-1" style={{ fontSize: 13.5, color: "#666" }}>Track and manage every purchase.</p>
            </div>

            {/* Filters */}
            <div className="mt-5 flex gap-2 overflow-x-auto px-6" style={{ scrollbarWidth: "none" }}>
              {FILTERS.map((f) => {
                const active = f === filter;
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    className="shrink-0"
                    style={{
                      height: 34, padding: "0 14px", borderRadius: 999,
                      fontSize: 12.5, fontWeight: 600, letterSpacing: -0.2,
                      color: active ? "#fff" : "#111",
                      background: active ? "#0F62FE" : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(20px)",
                      boxShadow: active
                        ? "0 8px 18px -8px rgba(15,98,254,0.5)"
                        : "0 1px 2px rgba(17,17,17,0.04), 0 6px 16px -10px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.05)",
                    }}>
                    {f}
                  </button>
                );
              })}
            </div>

            {/* Orders */}
            <div className="px-5 mt-5 space-y-3">
              {ORDERS.map((o) => (
                <div key={o.id}
                  className="p-3"
                  style={{
                    borderRadius: 22, background: "#fff",
                    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
                  }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 72, height: 72, borderRadius: 18, overflow: "hidden", background: "#F7F7F5" }}>
                      <img src={o.img} alt={o.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8A8A8A", letterSpacing: 0.4, textTransform: "uppercase" }}>{o.brand}</div>
                        <div className="inline-flex items-center gap-1 px-1.5" style={{ height: 18, borderRadius: 999, background: `${o.tone}18` }}>
                          <span style={{ width: 5, height: 5, borderRadius: 999, background: o.tone }} />
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: o.tone, letterSpacing: 0.2 }}>{o.status.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="mt-0.5 truncate" style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>{o.name}</div>
                      <div className="mt-0.5" style={{ fontSize: 11.5, color: "#666" }}>#{o.id} · {o.date}</div>
                    </div>
                    <ChevronRight size={16} color="#8A8A8A" />
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(17,17,17,0.05)" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>{o.total}</div>
                    <button style={{ height: 34, padding: "0 14px", borderRadius: 999, background: "#F7F7F5", fontSize: 12.5, fontWeight: 600, color: "#111", letterSpacing: -0.1 }}>
                      {o.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Help */}
            <div className="px-5 mt-4">
              <div className="flex items-center gap-3 p-4"
                style={{ borderRadius: 20, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
                <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(15,98,254,0.10)" }}>
                  <HelpCircle size={16} color="#0F62FE" />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Need help with an order?</div>
                  <div style={{ fontSize: 11.5, color: "#666" }}>We reply within an hour.</div>
                </div>
                <button style={{ fontSize: 12.5, fontWeight: 700, color: "#0F62FE" }}>Contact →</button>
              </div>
            </div>
          </div>
        </div>
        <BottomNav active="profile" />
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
