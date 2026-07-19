import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, Plus, Mic, Camera, ArrowUp, GitCompare, Gift, Wand2, PackageSearch, ArrowLeft } from "lucide-react";
import { PhoneFrame, StatusBar } from "@/components/phone/PhoneFrame";


export const Route = createFileRoute("/ai-assistant")({
  component: AI,
  head: () => ({ meta: [{ title: "Trends AI — Shopping Assistant" }] }),
});

function AI() {
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-40">
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
              <button aria-label="History" style={circle()} className="flex items-center justify-center"><Clock size={17} color="#111" /></button>
            </div>


            {/* Orb */}
            <div className="mt-4 flex justify-center relative">
              <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(220px 160px at 50% 50%, rgba(15,98,254,0.18), transparent 70%)" }} />
              <div style={{
                width: 132, height: 132, borderRadius: 999,
                background: "radial-gradient(circle at 30% 25%, #ffffff 0%, #d9e6ff 35%, #7aa5ff 65%, #0F62FE 100%)",
                boxShadow: "0 30px 60px -20px rgba(15,98,254,0.55), inset 0 0 30px rgba(255,255,255,0.6)",
              }} />
            </div>

            <div className="px-6 mt-6 text-center">
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111", letterSpacing: -0.7, lineHeight: 1.15 }}>How can I help you shop today?</h1>
              <p className="mt-2 mx-auto" style={{ fontSize: 13, color: "#666", maxWidth: 300, lineHeight: 1.5 }}>Ask anything, compare products, discover new styles, or get personalized recommendations.</p>
            </div>

            {/* Conversation */}
            <div className="px-5 mt-6 space-y-2.5">
              <Bubble ai>Hello Victor 👋<br/>I'm your personal shopping assistant. I can help you find products, compare items, discover luxury brands, or choose the perfect gift.</Bubble>
              <Bubble>I'm looking for a premium leather bag under ?2,500.</Bubble>
              <Bubble ai>I found three handcrafted leather bags from Saint Laurent, Gucci, and Prada that match your style and budget. Would you like to compare them?</Bubble>
            </div>

            {/* Quick actions */}
            <div className="px-5 mt-6 grid grid-cols-2 gap-2.5">
              <Action icon={<GitCompare size={16} />} label="Compare Products" />
              <Action icon={<Gift size={16} />} label="Find Gifts" />
              <Action icon={<Wand2 size={16} />} label="Style Me" />
              <Action icon={<PackageSearch size={16} />} label="Track My Order" />
            </div>

            {/* Suggested prompts */}
            <div className="mt-5 flex gap-2 overflow-x-auto px-5" style={{ scrollbarWidth: "none" }}>
              {["Best gifts under ?500", "Compare iPhones", "Luxury handbags", "Find matching shoes", "Vacation outfits", "Office setup"].map((s) => (
                <button key={s} className="shrink-0"
                  style={{ height: 32, padding: "0 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, color: "#111",
                    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
                    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -10px rgba(17,17,17,0.15)" }}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Smart input */}
        <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 100 }}>
          <div className="flex items-center gap-2 px-2" style={{
            width: "88%", height: 54, borderRadius: 999,
            background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px) saturate(160%)",
            boxShadow: "0 20px 40px -18px rgba(17,17,17,0.25), inset 0 0 0 1px rgba(17,17,17,0.05)",
          }}>
            <button className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 999, background: "#F7F7F5" }}><Plus size={16} color="#111" /></button>
            <div className="flex-1" style={{ fontSize: 13.5, color: "#8A8A8A" }}>Ask Trends AI anything…</div>
            <button className="flex items-center justify-center" style={{ width: 34, height: 34 }}><Mic size={17} color="#111" /></button>
            <button className="flex items-center justify-center" style={{ width: 34, height: 34 }}><Camera size={17} color="#111" /></button>
            <button className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 999, background: "#0F62FE", color: "#fff", boxShadow: "0 8px 18px -6px rgba(15,98,254,0.55)" }}><ArrowUp size={17} /></button>
          </div>
        </div>

      </>
    </PhoneFrame>
  );
}

function Bubble({ children, ai }: { children: React.ReactNode; ai?: boolean }) {
  return (
    <div className={ai ? "" : "flex justify-end"}>
      <div className="p-3.5"
        style={{
          maxWidth: "82%", borderRadius: 22,
          background: ai ? "rgba(255,255,255,0.9)" : "#111",
          color: ai ? "#111" : "#fff",
          fontSize: 13.5, lineHeight: 1.5, letterSpacing: -0.1,
          boxShadow: ai
            ? "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)"
            : "0 12px 24px -14px rgba(17,17,17,0.4)",
        }}>{children}</div>
    </div>
  );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="p-4 flex flex-col gap-3"
      style={{ borderRadius: 22, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)",
        boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
      <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(15,98,254,0.10)", color: "#0F62FE" }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>{label}</div>
    </div>
  );
}

function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}