import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Bell, Sparkles } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import sneaker from "@/assets/home-sneaker.jpg";
import bag from "@/assets/home-bag.jpg";
import watch from "@/assets/home-watch.jpg";
import jacket from "@/assets/prod-jacket.jpg";
import camera from "@/assets/prod-camera.jpg";

export const Route = createFileRoute("/drops")({
  component: Drops,
  head: () => ({ meta: [{ title: "Trends — Exclusive Drops" }] }),
});

const UPCOMING = [
  { brand: "Louis Vuitton", name: "Summer Drop", date: "Oct 18", countdown: "4d 12h", img: bag },
  { brand: "Apple", name: "Limited Accessories", date: "Oct 21", countdown: "7d 06h", img: watch },
  { brand: "Nike", name: "Air Max Elite", date: "Oct 25", countdown: "11d 04h", img: sneaker },
  { brand: "Gucci", name: "Capsule Collection", date: "Nov 02", countdown: "19d 22h", img: jacket },
];
const PAST = [
  { brand: "Leica", name: "M11 Titanium", img: camera },
  { brand: "Prada", name: "Cloudbust Runner", img: sneaker },
];

function Drops() {
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative h-[calc(100%-54px)] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-2">
              <Link to="/home" aria-label="Back" className="flex items-center justify-center" style={circle()}><ChevronLeft size={18} color="#111" /></Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Exclusive Drops</div>
              <button aria-label="Notifications" style={circle()} className="flex items-center justify-center"><Bell size={16} color="#111" /></button>
            </div>

            <div className="px-6 mt-4">
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Drops</h1>
              <p className="mt-1" style={{ fontSize: 13.5, color: "#666" }}>Limited-edition releases, curated for Trends.</p>
            </div>

            {/* Hero */}
            <div className="mx-5 mt-5 relative overflow-hidden"
              style={{ borderRadius: 28, boxShadow: "0 30px 60px -20px rgba(17,17,17,0.45)" }}>
              <img src={sneaker} alt="Hero drop" style={{ width: "100%", height: 340, objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75))" }} />
              <div className="absolute top-4 left-4" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", color: "#fff", padding: "5px 10px", borderRadius: 999, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>Limited Edition</div>
              <div className="absolute bottom-4 left-4 right-4" style={{ color: "#fff" }}>
                <div style={{ fontSize: 11, opacity: 0.85, letterSpacing: 0.6 }}>Jordan × Travis Scott</div>
                <div className="mt-1" style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>The Cactus Jack Drop</div>
                <div className="mt-3 flex gap-1.5">
                  {[["02","D"],["14","H"],["36","M"],["24","S"]].map(([n,l]) => (
                    <div key={l} className="text-center" style={{ width: 52, padding: "8px 0", borderRadius: 14, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(20px)" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{n}</div>
                      <div style={{ fontSize: 9, opacity: 0.7, letterSpacing: 0.6 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full" style={{ height: 46, borderRadius: 20, background: "#fff", color: "#111", fontSize: 14, fontWeight: 700 }}>Notify Me</button>
              </div>
            </div>

            {/* Upcoming */}
            <div className="px-6 mt-6 flex items-center justify-between">
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>Upcoming</div>
              <button style={{ fontSize: 12, fontWeight: 600, color: "#0F62FE" }}>See all</button>
            </div>
            <div className="px-5 mt-3 space-y-3">
              {UPCOMING.map((d) => (
                <div key={d.name} className="p-3 flex items-center gap-3"
                  style={{ borderRadius: 22, background: "#fff",
                    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                  <div style={{ width: 72, height: 72, borderRadius: 18, overflow: "hidden", background: "#F7F7F5" }}>
                    <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8A8A8A", letterSpacing: 0.5, textTransform: "uppercase" }}>{d.brand}</div>
                    <div className="mt-0.5" style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>{d.name}</div>
                    <div className="mt-1 flex items-center gap-2" style={{ fontSize: 11.5, color: "#666" }}>
                      <span>{d.date}</span><span>·</span>
                      <span style={{ color: "#0F62FE", fontWeight: 700 }}>in {d.countdown}</span>
                    </div>
                  </div>
                  <button style={{ height: 34, padding: "0 14px", borderRadius: 999, background: "#F7F7F5", fontSize: 12, fontWeight: 700, color: "#111" }}>Notify</button>
                </div>
              ))}
            </div>

            {/* Past */}
            <div className="px-6 mt-6" style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>Past Drops</div>
            <div className="px-5 mt-3 grid grid-cols-2 gap-3">
              {PAST.map((p) => (
                <div key={p.name} className="relative overflow-hidden"
                  style={{ borderRadius: 20, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14)" }}>
                  <div style={{ aspectRatio: "1/1", background: "#F7F7F5", position: "relative" }}>
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" style={{ filter: "grayscale(0.2)" }} />
                    <div className="absolute top-2 left-2" style={{ fontSize: 9.5, fontWeight: 700, color: "#fff", padding: "4px 8px", borderRadius: 999, background: "rgba(17,17,17,0.85)", letterSpacing: 0.5 }}>SOLD OUT</div>
                  </div>
                  <div className="px-3 py-2.5">
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#8A8A8A", letterSpacing: 0.4, textTransform: "uppercase" }}>{p.brand}</div>
                    <div className="mt-0.5 truncate" style={{ fontSize: 12.5, fontWeight: 600, color: "#111" }}>{p.name}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Member card */}
            <div className="mx-5 mt-6 p-5"
              style={{ borderRadius: 24, background: "linear-gradient(135deg, #0F62FE 0%, #4A8BFF 100%)", color: "#fff",
                boxShadow: "0 24px 48px -18px rgba(15,98,254,0.55)" }}>
              <div className="flex items-center gap-2"><Sparkles size={16} /><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Trends Premium</span></div>
              <div className="mt-2" style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.4 }}>Early access to every drop.</div>
              <div className="mt-1" style={{ fontSize: 12.5, opacity: 0.85 }}>Premium members shop 24 hours before public release.</div>
              <button className="mt-4" style={{ height: 40, padding: "0 18px", borderRadius: 999, background: "#fff", color: "#0F62FE", fontSize: 13, fontWeight: 700 }}>Join Premium</button>
            </div>
          </div>
        </div>
        <BottomNav active="home" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}