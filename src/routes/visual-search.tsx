import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Image as ImageIcon, Zap, Sparkles } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import bg from "@/assets/cat-fashion-hero.jpg";
import tote from "@/assets/prod-tote.jpg";

export const Route = createFileRoute("/visual-search")({
  component: VisualSearch,
  head: () => ({
    meta: [
      { title: "Trends — Visual Search" },
      { name: "description", content: "Point your camera at any product to identify it and find similar items." },
    ],
  }),
});

function VisualSearch() {
  return (
    <PhoneFrame>
      <>
        {/* Camera preview background (blurred boutique) */}
        <img
          src={bg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "blur(14px) saturate(1.05)", transform: "scale(1.15)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        <div className="relative" style={{ color: "#fff" }}>
          <StatusBarLight />

          {/* Top nav */}
          <div className="flex items-center justify-between px-5 mt-1">
            <Link
              to="/search"
              className="flex items-center justify-center"
              aria-label="Back"
              style={{ ...glass(), width: 40, height: 40, borderRadius: 999 }}
            >
              <ArrowLeft size={18} strokeWidth={2} color="#fff" />
            </Link>
            <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3, color: "#fff" }}>
              Visual Search
            </div>
            <button
              aria-label="Gallery"
              style={{ ...glass(), width: 40, height: 40, borderRadius: 999 }}
              className="flex items-center justify-center"
            >
              <ImageIcon size={17} strokeWidth={2} color="#fff" />
            </button>
          </div>

          {/* Scanning frame */}
          <div className="absolute left-0 right-0 flex justify-center" style={{ top: 128 }}>
            <div
              className="relative overflow-hidden"
              style={{
                width: 300,
                height: 380,
                borderRadius: 32,
                boxShadow:
                  "inset 0 0 0 1.5px rgba(255,255,255,0.55), 0 0 0 1px rgba(15,98,254,0.25), 0 30px 80px -30px rgba(15,98,254,0.4)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <img src={tote} alt="Detected: leather tote" className="w-full h-full object-cover" />
              {/* Corner brackets */}
              {[
                { top: 10, left: 10, borderTop: 2, borderLeft: 2 },
                { top: 10, right: 10, borderTop: 2, borderRight: 2 },
                { bottom: 10, left: 10, borderBottom: 2, borderLeft: 2 },
                { bottom: 10, right: 10, borderBottom: 2, borderRight: 2 },
              ].map((c, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderColor: "#fff",
                    borderStyle: "solid",
                    borderTopWidth: c.borderTop ?? 0,
                    borderRightWidth: c.borderRight ?? 0,
                    borderBottomWidth: c.borderBottom ?? 0,
                    borderLeftWidth: c.borderLeft ?? 0,
                    ...c,
                  }}
                />
              ))}
              {/* Scan line */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: "58%",
                  height: 2,
                  background:
                    "linear-gradient(90deg, rgba(15,98,254,0) 0%, rgba(15,98,254,0.9) 50%, rgba(15,98,254,0) 100%)",
                  boxShadow: "0 0 22px 2px rgba(15,98,254,0.7)",
                }}
              />
              {/* Detecting tag */}
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3"
                style={{
                  top: 18,
                  height: 28,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)",
                }}
              >
                <Sparkles size={11} strokeWidth={2.4} color="#0F62FE" />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#111", letterSpacing: -0.1 }}>
                  AI Detecting…
                </span>
              </div>
            </div>
          </div>

          {/* AI Recognition card */}
          <div className="absolute left-5 right-5" style={{ bottom: 210 }}>
            <div
              className="p-4"
              style={{
                borderRadius: 24,
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(28px) saturate(160%)",
                boxShadow:
                  "0 20px 60px -20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.6), 0 0 0 1px rgba(15,98,254,0.15)",
              }}
            >
              <div className="flex items-center justify-between">
                <div style={{ fontSize: 10.5, fontWeight: 600, color: "#0F62FE", letterSpacing: 0.4, textTransform: "uppercase" }}>
                  Detected Product
                </div>
                <div
                  className="flex items-center gap-1 px-2"
                  style={{
                    height: 22,
                    borderRadius: 999,
                    background: "rgba(15,98,254,0.10)",
                  }}
                >
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#0F62FE", letterSpacing: -0.1 }}>92% Match</span>
                </div>
              </div>
              <div className="mt-1.5" style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>
                Luxury Leather Tote
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 600, textTransform: "uppercase" }}>
                    Saint Laurent
                  </div>
                  <div className="mt-1" style={{ fontSize: 16, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>
                    $2,450
                  </div>
                </div>
                <Link
                  to="/product"
                  className="inline-flex items-center px-4"
                  style={{
                    height: 40,
                    borderRadius: 999,
                    background: "#0F62FE",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: -0.2,
                    boxShadow: "0 10px 24px -10px rgba(15,98,254,0.6)",
                  }}
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="absolute left-0 right-0 flex items-center justify-center gap-8" style={{ bottom: 96 }}>
            <button
              aria-label="Upload"
              className="flex items-center justify-center"
              style={{ ...glass(), width: 54, height: 54, borderRadius: 999 }}
            >
              <ImageIcon size={20} strokeWidth={2} color="#fff" />
            </button>
            <button
              aria-label="Capture"
              className="flex items-center justify-center"
              style={{
                width: 82,
                height: 82,
                borderRadius: 999,
                background: "rgba(255,255,255,0.95)",
                boxShadow:
                  "0 20px 40px -14px rgba(0,0,0,0.5), inset 0 0 0 4px rgba(255,255,255,0.35), 0 0 0 2px rgba(255,255,255,0.9)",
              }}
            >
              <div style={{ width: 62, height: 62, borderRadius: 999, background: "#fff" }} />
            </button>
            <button
              aria-label="Flash"
              className="flex items-center justify-center"
              style={{ ...glass(), width: 54, height: 54, borderRadius: 999 }}
            >
              <Zap size={20} strokeWidth={2} color="#fff" />
            </button>
          </div>

          {/* Hint */}
          <div
            className="absolute left-8 right-8 text-center"
            style={{ bottom: 52, fontSize: 11.5, color: "rgba(255,255,255,0.75)", letterSpacing: -0.1, lineHeight: 1.5 }}
          >
            Point your camera at any product to instantly identify it and find similar items.
          </div>
        </div>

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function glass() {
  return {
    background: "rgba(255,255,255,0.14)",
    backdropFilter: "blur(24px) saturate(160%)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
  } as const;
}

function StatusBarLight() {
  return (
    <div className="relative" style={{ height: 54 }}>
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: 10, width: 120, height: 34, borderRadius: 20, background: "#000" }}
            />
          </div>
  );
}
