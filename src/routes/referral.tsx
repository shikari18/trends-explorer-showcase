import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Gift, Copy, Share2, Users, Sparkles } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";

export const Route = createFileRoute("/referral")({
  component: Referral,
  head: () => ({ meta: [{ title: "Trends — Refer & Earn" }] }),
});

function Referral() {
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative h-[calc(100%-54px)] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-2">
              <Link to="/profile" aria-label="Back" className="flex items-center justify-center" style={circle()}><ChevronLeft size={18} color="#111" /></Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Refer & Earn</div>
              <div style={{ width: 40 }} />
            </div>

            {/* Hero */}
            <div className="mx-5 mt-4 p-6 relative overflow-hidden"
              style={{ borderRadius: 28, background: "linear-gradient(160deg, rgba(15,98,254,0.10), rgba(255,255,255,0.9))",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 22px 44px -18px rgba(17,17,17,0.18), inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
              <div aria-hidden style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: 999, background: "radial-gradient(circle, rgba(15,98,254,0.28), transparent 70%)" }} />
              <div className="relative flex items-center justify-center mb-4" style={{ width: 78, height: 78, borderRadius: 24, background: "#fff", boxShadow: "0 20px 40px -14px rgba(17,17,17,0.2)" }}>
                <Gift size={38} color="#0F62FE" strokeWidth={1.6} />
              </div>
              <h1 className="relative" style={{ fontSize: 28, fontWeight: 700, color: "#111", letterSpacing: -0.7 }}>Invite Friends</h1>
              <p className="relative mt-2" style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>Share Trends with friends and earn exclusive rewards when they complete their first purchase.</p>
            </div>

            {/* Referral code */}
            <div className="mx-5 mt-4 p-4"
              style={{ borderRadius: 22, background: "#fff",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1.2, textTransform: "uppercase" }}>Your Code</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1" style={{ fontSize: 26, fontWeight: 700, color: "#111", letterSpacing: 2, fontFamily: "SF Mono, ui-monospace, monospace" }}>TREND20</div>
                <button className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 12, background: "#F7F7F5" }}><Copy size={15} color="#111" /></button>
                <button className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 12, background: "#0F62FE" }}><Share2 size={15} color="#fff" /></button>
              </div>
            </div>

            {/* Reward split */}
            <div className="mx-5 mt-3 p-4 grid grid-cols-2 gap-3"
              style={{ borderRadius: 22, background: "linear-gradient(180deg, rgba(15,98,254,0.05), #fff)",
                boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
              <div><div style={{ fontSize: 11, color: "#666" }}>You get</div><div className="mt-1" style={{ fontSize: 20, fontWeight: 700, color: "#0F62FE", letterSpacing: -0.4 }}>$20 credit</div></div>
              <div><div style={{ fontSize: 11, color: "#666" }}>They get</div><div className="mt-1" style={{ fontSize: 20, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>15% off</div></div>
            </div>

            {/* How it works */}
            <div className="px-6 mt-6" style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1.2, textTransform: "uppercase" }}>How It Works</div>
            <div className="mx-5 mt-3 space-y-2.5">
              {[
                ["01","Invite Friends","Send your code via any app"],
                ["02","They Make Their First Order","With 15% off applied automatically"],
                ["03","Both Receive Rewards","Credits appear instantly"],
              ].map(([n,t,d]) => (
                <div key={n} className="p-4 flex items-center gap-3"
                  style={{ borderRadius: 20, background: "#fff",
                    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                  <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 999, background: "#0F62FE", color: "#fff", fontSize: 12, fontWeight: 700 }}>{n}</div>
                  <div className="flex-1">
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{t}</div>
                    <div style={{ fontSize: 11.5, color: "#666" }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mx-5 mt-6 p-4"
              style={{ borderRadius: 22, background: "#fff",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
              <div className="flex items-center gap-2"><Users size={14} color="#111" /><span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>Your progress</span></div>
              <div className="mt-3 grid grid-cols-3">
                {[["Invited","12"],["Successful","8"],["Earned","$160"]].map(([k,v],i)=>(
                  <div key={k} className="text-center" style={{ borderLeft: i? "1px solid rgba(17,17,17,0.06)" : "none" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>{v}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-5 mt-5">
              <button className="w-full flex items-center justify-center gap-2"
                style={{ height: 54, borderRadius: 24, background: "#0F62FE", color: "#fff", fontSize: 15, fontWeight: 700, boxShadow: "0 14px 30px -10px rgba(15,98,254,0.6)" }}>
                <Sparkles size={16} /> Invite Friends
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

function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}