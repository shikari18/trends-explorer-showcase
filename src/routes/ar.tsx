import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MoreHorizontal, RotateCw, Maximize2, Camera, RefreshCw, Star } from "lucide-react";
import { PhoneFrame, HomeIndicator } from "@/components/phone/PhoneFrame";
import bg from "@/assets/home-curated.jpg";
import tote from "@/assets/prod-tote.jpg";

export const Route = createFileRoute("/ar")({
  component: AR,
  head: () => ({ meta: [{ title: "Trends — View in AR" }] }),
});

function AR() {
  return (
    <PhoneFrame>
      <>
        <img src={bg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ filter: "saturate(1.02)" }} />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)" }} />

        <div className="relative" style={{ color: "#fff" }}>
          {/* Top nav */}
          <div className="flex items-center justify-between px-5 mt-1">
            <Link to="/product" aria-label="Back" style={glassBtn()} className="flex items-center justify-center">
              <ArrowLeft size={18} color="#fff" />
            </Link>
            <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3 }}>View in AR</div>
            <button aria-label="More" style={glassBtn()} className="flex items-center justify-center">
              <MoreHorizontal size={18} color="#fff" />
            </button>
          </div>

          {/* AR product placement */}
          <div className="absolute left-0 right-0 flex justify-center" style={{ top: 240 }}>
            <div className="relative">
              {/* Placement ring */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: -30,
                  width: 220,
                  height: 60,
                  borderRadius: "50%",
                  background: "radial-gradient(50% 60% at 50% 50%, rgba(15,98,254,0.35) 0%, rgba(15,98,254,0) 70%)",
                  boxShadow: "inset 0 0 0 1.5px rgba(15,98,254,0.4)",
                }}
              />
              <div
                className="relative overflow-hidden"
                style={{
                  width: 200,
                  height: 220,
                  borderRadius: 24,
                  boxShadow: "0 40px 60px -20px rgba(0,0,0,0.55), 0 20px 30px -10px rgba(0,0,0,0.4)",
                }}
              >
                <img src={tote} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* AR controls */}
          <div className="absolute right-4 flex flex-col gap-2.5" style={{ top: 130 }}>
            {[RotateCw, Maximize2, Camera, RefreshCw].map((Icon, i) => (
              <button key={i} style={glassBtn(48)} className="flex items-center justify-center">
                <Icon size={18} color="#fff" strokeWidth={2} />
              </button>
            ))}
          </div>

          {/* Floating product card */}
          <div className="absolute left-4 right-4" style={{ bottom: 168 }}>
            <div
              className="flex items-center gap-3 p-3"
              style={{
                borderRadius: 22,
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(28px) saturate(160%)",
                boxShadow: "0 20px 40px -16px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.6)",
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", background: "#F7F7F5" }}>
                <img src={tote} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.4, textTransform: "uppercase" }}>Saint Laurent</div>
                <div className="mt-0.5 truncate" style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Luxury Leather Tote</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} fill="#111" color="#111" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#111" }}>4.9</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>?2,450</span>
                </div>
              </div>
              <Link
                to="/product"
                className="inline-flex items-center px-3"
                style={{ height: 34, borderRadius: 999, background: "#0F62FE", fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: -0.1 }}
              >
                View Details
              </Link>
            </div>
          </div>

          {/* Sticky actions */}
          <div className="absolute left-4 right-4" style={{ bottom: 66 }}>
            <div
              className="flex items-center gap-2 p-2"
              style={{
                borderRadius: 26,
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(28px) saturate(160%)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
              }}
            >
              <Link
                to="/cart"
                className="flex-1 inline-flex items-center justify-center"
                style={{ height: 50, borderRadius: 22, background: "rgba(255,255,255,0.95)", fontSize: 14, fontWeight: 700, color: "#111" }}
              >
                Add to Cart
              </Link>
              <Link
                to="/checkout"
                className="flex-1 inline-flex items-center justify-center"
                style={{ height: 50, borderRadius: 22, background: "#0F62FE", fontSize: 14, fontWeight: 700, color: "#fff", boxShadow: "0 10px 24px -10px rgba(15,98,254,0.6)" }}
              >
                Buy Now
              </Link>
            </div>
          </div>

          <div className="absolute left-8 right-8 text-center" style={{ bottom: 28, fontSize: 11.5, color: "rgba(255,255,255,0.8)", letterSpacing: -0.1, lineHeight: 1.5 }}>
            Move your phone slowly to place the product in your space.
          </div>
        </div>

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function glassBtn(size = 40) {
  return {
    width: size,
    height: size,
    borderRadius: 999,
    background: "rgba(255,255,255,0.16)",
    backdropFilter: "blur(24px) saturate(160%)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
  } as const;
}
