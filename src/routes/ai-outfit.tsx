import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Clock, Upload, Camera, Sparkles, RotateCcw } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import jacket from "@/assets/prod-jacket.jpg";
import sneaker from "@/assets/home-sneaker.jpg";
import watch from "@/assets/home-watch.jpg";
import bag from "@/assets/home-bag.jpg";

export const Route = createFileRoute("/ai-outfit")({
  component: AIOutfit,
  head: () => ({ meta: [{ title: "Trends AI — Outfit Builder" }] }),
});

const OUTFIT = [
  { name: "Cashmere Jacket", price: "?1,290", img: jacket },
  { name: "Wool Trousers", price: "?480", img: jacket },
  { name: "Runner Sneakers", price: "?390", img: sneaker },
  { name: "Luxury Watch", price: "?2,150", img: watch },
  { name: "Leather Bag", price: "?1,860", img: bag },
];

function AIOutfit() {
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-40">
            <div className="flex items-center justify-between px-5 pt-4">
              <Link to="/ai-assistant" aria-label="Back" className="flex items-center justify-center" style={circle()}><ChevronLeft size={18} color="#111" /></Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>AI Outfit Builder</div>
              <button aria-label="History" style={circle()} className="flex items-center justify-center"><Clock size={16} color="#111" /></button>
            </div>

            {/* Upload */}
            <div className="mx-5 mt-4 p-6 text-center relative overflow-hidden"
              style={{ borderRadius: 26, background: "linear-gradient(160deg, rgba(15,98,254,0.06), #fff)",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 20px 40px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
              <div aria-hidden style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 999, background: "radial-gradient(circle, rgba(15,98,254,0.20), transparent 70%)" }} />
              <div className="relative mx-auto flex items-center justify-center" style={{ width: 72, height: 72, borderRadius: 22, background: "#fff", boxShadow: "0 16px 30px -12px rgba(17,17,17,0.18)" }}>
                <Sparkles size={32} color="#0F62FE" strokeWidth={1.6} />
              </div>
              <div className="mt-4" style={{ fontSize: 20, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>Build a look from anything</div>
              <div className="mt-1" style={{ fontSize: 12.5, color: "#666" }}>Upload a garment or take a photo — AI does the rest.</div>
              <div className="mt-4 flex gap-2 justify-center">
                <button className="flex items-center gap-1.5" style={{ height: 42, padding: "0 16px", borderRadius: 999, background: "#111", color: "#fff", fontSize: 13, fontWeight: 700 }}><Upload size={14} /> Upload</button>
                <button className="flex items-center gap-1.5" style={{ height: 42, padding: "0 16px", borderRadius: 999, background: "#fff", color: "#111", fontSize: 13, fontWeight: 700, boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08)" }}><Camera size={14} /> Take Photo</button>
              </div>
            </div>

            {/* Selected item */}
            <div className="mx-5 mt-4 p-4 flex items-center gap-4"
              style={{ borderRadius: 22, background: "#fff",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, overflow: "hidden", background: "#F7F7F5" }}>
                <img src={jacket} alt="Selected" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8A8A8A", letterSpacing: 0.5, textTransform: "uppercase" }}>Analyzed</div>
                <div className="mt-0.5" style={{ fontSize: 14.5, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Luxury Beige Hoodie</div>
                <div className="mt-0.5 flex items-center gap-1" style={{ fontSize: 11.5, color: "#34C759", fontWeight: 600 }}><Sparkles size={11} /> AI matched successfully</div>
              </div>
            </div>

            {/* AI analysis */}
            <div className="mx-5 mt-3 p-4"
              style={{ borderRadius: 22, background: "linear-gradient(180deg, rgba(15,98,254,0.04), #fff)",
                boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
              <div className="flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 700, color: "#0F62FE", letterSpacing: 1, textTransform: "uppercase" }}><Sparkles size={12} /> AI Analysis</div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[["Style","Modern Minimalist"],["Occasion","Smart Casual"],["Season","Autumn"],["Confidence","98%"]].map(([k,v])=>(
                  <div key={k}><div style={{ fontSize: 10, color: "#8A8A8A" }}>{k}</div><div className="mt-0.5" style={{ fontSize: 11.5, fontWeight: 700, color: "#111", letterSpacing: -0.1 }}>{v}</div></div>
                ))}
              </div>
            </div>

            {/* Generated outfit */}
            <div className="px-6 mt-6 flex items-center justify-between">
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>Your outfit</div>
              <div style={{ fontSize: 12, color: "#666" }}>5 pieces</div>
            </div>
            <div className="mx-5 mt-3 grid grid-cols-2 gap-3">
              {OUTFIT.map((p,i) => (
                <div key={i} className="p-2"
                  style={{ borderRadius: 22, background: "#fff",
                    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                  <div style={{ aspectRatio: "1/1", borderRadius: 16, overflow: "hidden", background: "#F7F7F5" }}>
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-1.5 pt-2 pb-1">
                    <div className="truncate" style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{p.name}</div>
                    <div className="mt-0.5" style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{p.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested looks */}
            <div className="px-6 mt-6" style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>Try another look</div>
            <div className="mt-3 flex gap-2 overflow-x-auto px-5" style={{ scrollbarWidth: "none" }}>
              {["Office","Weekend","Travel","Evening"].map((l) => (
                <button key={l} className="shrink-0"
                  style={{ height: 34, padding: "0 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, color: "#111",
                    background: "rgba(255,255,255,0.9)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -10px rgba(17,17,17,0.15)" }}>{l} Look</button>
              ))}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="absolute left-0 right-0 flex justify-center gap-2 px-5" style={{ bottom: 100 }}>
          <button className="flex items-center justify-center gap-1.5" style={{ height: 52, padding: "0 20px", borderRadius: 24, background: "rgba(255,255,255,0.9)", color: "#111", fontSize: 13.5, fontWeight: 700, backdropFilter: "blur(20px)", boxShadow: "0 14px 30px -12px rgba(17,17,17,0.2), inset 0 0 0 1px rgba(17,17,17,0.06)" }}><RotateCcw size={14} /> Regenerate</button>
          <button className="flex-1 flex items-center justify-center" style={{ height: 52, borderRadius: 24, background: "#0F62FE", color: "#fff", fontSize: 14, fontWeight: 700, boxShadow: "0 16px 30px -10px rgba(15,98,254,0.55)" }}>Shop Complete Outfit</button>
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