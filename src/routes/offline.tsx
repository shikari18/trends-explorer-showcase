import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudOff } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";

export const Route = createFileRoute("/offline")({
  component: Offline,
  head: () => ({ meta: [{ title: "Trends — Offline" }] }),
});

function Offline() {
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative h-[calc(100%-54px)] flex flex-col items-center justify-center px-8 text-center">
          <div className="relative flex items-center justify-center"
            style={{ width: 168, height: 168, borderRadius: 999,
              background: "linear-gradient(160deg, rgba(255,255,255,0.9), rgba(247,247,245,0.9))",
              boxShadow: "0 30px 60px -20px rgba(17,17,17,0.2), inset 0 0 0 1px rgba(17,17,17,0.05), inset 0 20px 40px rgba(255,255,255,0.6)",
              backdropFilter: "blur(24px)" }}>
            <div aria-hidden style={{ position: "absolute", inset: -30, background: "radial-gradient(circle, rgba(15,98,254,0.10), transparent 70%)", borderRadius: 999 }} />
            <CloudOff size={68} color="#0F62FE" strokeWidth={1.6} />
          </div>
          <h1 className="mt-8" style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>You're Offline</h1>
          <p className="mt-3" style={{ fontSize: 14, color: "#666", lineHeight: 1.5, maxWidth: 280 }}>We couldn't connect to the internet. Check your connection and try again.</p>
          <button className="mt-8 w-full max-w-xs" style={{ height: 54, borderRadius: 24, background: "#0F62FE", color: "#fff", fontSize: 15, fontWeight: 700, boxShadow: "0 14px 30px -10px rgba(15,98,254,0.6)" }}>Retry</button>
          <Link to="/home" className="mt-3 flex items-center justify-center w-full max-w-xs" style={{ height: 54, borderRadius: 24, background: "#fff", color: "#111", fontSize: 15, fontWeight: 700, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 24px -14px rgba(17,17,17,0.2), inset 0 0 0 1px rgba(17,17,17,0.06)" }}>Continue Browsing</Link>
          <div className="mt-10" style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.5 }}>Error Code · 404 • Network Unavailable</div>
        </div>
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}