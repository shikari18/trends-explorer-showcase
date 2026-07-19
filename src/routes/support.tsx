import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Search, MessageCircle, Phone, Mail, HelpCircle, ChevronRight } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";

export const Route = createFileRoute("/support")({
  component: Support,
  head: () => ({ meta: [{ title: "Trends — Support" }] }),
});

function Support() {
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-4">
              <Link to="/profile" aria-label="Back" className="flex items-center justify-center" style={circle()}><ChevronLeft size={18} color="#111" /></Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Support</div>
              <button aria-label="Search" style={circle()} className="flex items-center justify-center"><Search size={16} color="#111" /></button>
            </div>

            {/* Hero */}
            <div className="mx-5 mt-4 p-6 relative overflow-hidden"
              style={{ borderRadius: 28, background: "linear-gradient(135deg, rgba(15,98,254,0.08) 0%, rgba(255,255,255,0.9) 100%)",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 20px 40px -18px rgba(17,17,17,0.18), inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
              <div aria-hidden style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 999, background: "radial-gradient(circle, rgba(15,98,254,0.25), transparent 70%)" }} />
              <div aria-hidden style={{ position: "absolute", bottom: -30, left: -30, width: 140, height: 140, borderRadius: 999, background: "radial-gradient(circle, rgba(52,199,89,0.15), transparent 70%)" }} />
              <h1 className="relative" style={{ fontSize: 26, fontWeight: 700, color: "#111", letterSpacing: -0.7 }}>How can we help?</h1>
              <p className="relative mt-1.5" style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>Our support team is available 24/7 to assist you.</p>
            </div>

            {/* Quick actions */}
            <div className="px-5 mt-5 grid grid-cols-2 gap-3">
              <Action icon={<MessageCircle size={16} />} title="Live Chat" sub="Chat with an expert" />
              <Action icon={<Phone size={16} />} title="Call Us" sub="Speak with support" />
              <Action icon={<Mail size={16} />} title="Email Support" sub="Get help by email" />
              <Action icon={<HelpCircle size={16} />} title="Help Center" sub="Browse FAQs" />
            </div>

            {/* Recent */}
            <div className="mx-5 mt-5 p-4"
              style={{ borderRadius: 22, background: "#fff",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1.2, textTransform: "uppercase" }}>Recent Conversations</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(52,199,89,0.12)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: "#34C759" }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>Order #TRD-482917</div>
                  <div style={{ fontSize: 12, color: "#34C759", fontWeight: 600 }}>Resolved</div>
                </div>
                <button style={{ height: 32, padding: "0 12px", borderRadius: 999, background: "#F7F7F5", fontSize: 12, fontWeight: 600, color: "#111" }}>View</button>
              </div>
            </div>

            {/* Popular topics */}
            <div className="px-6 mt-6" style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1.2, textTransform: "uppercase" }}>Popular Help</div>
            <div className="mt-3 flex flex-wrap gap-2 px-5">
              {["Track an Order","Returns","Refunds","Payments","Shipping","Account","Coupons","Security"].map((t) => (
                <button key={t}
                  style={{ height: 32, padding: "0 14px", borderRadius: 999, background: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 600, color: "#111",
                    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -10px rgba(17,17,17,0.15)" }}>{t}</button>
              ))}
            </div>

            {/* Need more help */}
            <div className="mx-5 mt-6 p-5"
              style={{ borderRadius: 24, background: "#fff",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 20px 40px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>Still need assistance?</div>
              <div className="mt-1" style={{ fontSize: 12.5, color: "#666" }}>Our specialists usually reply within a few minutes.</div>
              <button className="mt-4 w-full flex items-center justify-center gap-2"
                style={{ height: 52, borderRadius: 20, background: "#0F62FE", color: "#fff", fontSize: 14, fontWeight: 700, boxShadow: "0 12px 24px -10px rgba(15,98,254,0.55)" }}>
                Contact Support <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <BottomNav active="profile" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function Action({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="p-4"
      style={{ borderRadius: 22, background: "#fff",
        boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
      <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(15,98,254,0.10)", color: "#0F62FE" }}>{icon}</div>
      <div className="mt-3" style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>{title}</div>
      <div className="mt-0.5" style={{ fontSize: 11.5, color: "#666" }}>{sub}</div>
    </div>
  );
}
function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}