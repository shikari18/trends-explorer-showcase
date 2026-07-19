import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Package, Tag, Sparkles, CheckCircle2, Gift, ShieldCheck } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";

export const Route = createFileRoute("/notifications")({
  component: Notifications,
  head: () => ({ meta: [{ title: "Trends — Notifications" }] }),
});

const FILTERS = ["All", "Orders", "Price Drops", "Recommendations", "Offers", "Account"];

type N = { icon: React.ReactNode; tone: string; title: string; desc: string; time: string; unread?: boolean };

const TODAY: N[] = [
  { icon: <Package size={17} />, tone: "#0F62FE", title: "Order Shipped", desc: "Your Apple Watch Ultra 3 has been shipped.", time: "2 min ago", unread: true },
  { icon: <Tag size={17} />, tone: "#0F62FE", title: "Price Drop", desc: "Luxury Leather Tote is now 15% off.", time: "35 min ago", unread: true },
  { icon: <Sparkles size={17} />, tone: "#0F62FE", title: "AI Recommendation", desc: "Based on your wishlist, we found new arrivals you'll love.", time: "1 hour ago", unread: true },
];
const EARLIER: N[] = [
  { icon: <CheckCircle2 size={17} />, tone: "#34C759", title: "Order Delivered", desc: "Your Sony WH-1000XM6 has been delivered.", time: "Yesterday" },
  { icon: <Gift size={17} />, tone: "#FF9500", title: "Exclusive Offer", desc: "Members receive free express shipping this weekend.", time: "Yesterday" },
  { icon: <ShieldCheck size={17} />, tone: "#111", title: "Account Security", desc: "A new device signed into your account.", time: "Yesterday" },
];

function Notifications() {
  const [f, setF] = useState("All");
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative h-[calc(100%-54px)] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-2">
              <Link to="/profile" aria-label="Back" className="flex items-center justify-center" style={circle()}><ChevronLeft size={18} color="#111" /></Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3, color: "#111" }}>Notifications</div>
              <button style={{ fontSize: 12.5, fontWeight: 600, color: "#0F62FE" }}>Mark all read</button>
            </div>
            <div className="px-6 mt-4">
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Inbox</h1>
              <p className="mt-1" style={{ fontSize: 13.5, color: "#666" }}>Every update from Trends, curated for you.</p>
            </div>
            <div className="mt-5 flex gap-2 overflow-x-auto px-6" style={{ scrollbarWidth: "none" }}>
              {FILTERS.map((x) => {
                const a = x === f;
                return (
                  <button key={x} onClick={() => setF(x)} className="shrink-0"
                    style={{ height: 34, padding: "0 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, letterSpacing: -0.2,
                      color: a ? "#fff" : "#111",
                      background: a ? "#0F62FE" : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(20px)",
                      boxShadow: a ? "0 8px 18px -8px rgba(15,98,254,0.5)" : "0 1px 2px rgba(17,17,17,0.04), 0 6px 16px -10px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.05)" }}>{x}</button>
                );
              })}
            </div>
            <SectionHeader label="Today" />
            <div className="px-5 space-y-2.5">{TODAY.map((n, i) => <Card key={i} n={n} />)}</div>
            <SectionHeader label="Yesterday" />
            <div className="px-5 space-y-2.5">{EARLIER.map((n, i) => <Card key={i} n={n} />)}</div>
          </div>
        </div>
        <BottomNav active="profile" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <div className="px-6 mt-6 mb-3" style={{ fontSize: 12, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>;
}

function Card({ n }: { n: N }) {
  return (
    <div className="p-4 flex items-start gap-3"
      style={{ borderRadius: 22, background: "#fff",
        boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
      <div className="flex items-center justify-center shrink-0"
        style={{ width: 40, height: 40, borderRadius: 14, background: `${n.tone}14`, color: n.tone }}>{n.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>{n.title}</div>
          {n.unread && <span style={{ width: 7, height: 7, borderRadius: 999, background: "#0F62FE" }} />}
        </div>
        <div className="mt-1" style={{ fontSize: 12.5, color: "#666", lineHeight: 1.45 }}>{n.desc}</div>
        <div className="mt-1.5" style={{ fontSize: 11, color: "#8A8A8A" }}>{n.time}</div>
      </div>
    </div>
  );
}

function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}