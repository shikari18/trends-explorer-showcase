import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Image as ImageIcon, Zap, ZapOff, Sparkles, RotateCcw } from "lucide-react";
import { PhoneFrame, HomeIndicator } from "@/components/phone/PhoneFrame";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "live" | "denied" | "error">("loading");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [torch, setTorch] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState(false);

  const startCamera = useCallback(async (facing: "environment" | "user") => {
    setStatus("loading");
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check torch support
      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities?.() as any;
      setTorchSupported(!!(caps?.torch));

      setStatus("live");

      // Auto-simulate scan after 2s for demo purposes
      setTimeout(() => setScanning(true), 800);
      setTimeout(() => setDetected(true), 2800);
    } catch (err: any) {
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setStatus("denied");
      } else {
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode, startCamera]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    const next = !torch;
    try {
      await (track as any).applyConstraints({ advanced: [{ torch: next }] });
      setTorch(next);
    } catch (_) {}
  };

  const flipCamera = () => {
    setDetected(false);
    setScanning(false);
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleGallery = () => fileInputRef.current?.click();

  return (
    <PhoneFrame>
      <>
        {/* Real camera video */}
        <video
          ref={videoRef}
          aria-hidden
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ background: "#000" }}
        />

        {/* Darkening overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        {/* Loading / denied / error states */}
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: "rgba(0,0,0,0.75)" }}>
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", letterSpacing: -0.1 }}>Starting camera…</span>
          </div>
        )}

        {status === "denied" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: "rgba(0,0,0,0.85)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
              <ImageIcon size={28} color="rgba(255,255,255,0.6)" />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.4 }}>Camera Access Denied</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6, lineHeight: 1.5 }}>
                Please allow camera access in your browser settings to use Visual Search.
              </div>
            </div>
            <button
              onClick={() => startCamera(facingMode)}
              style={{ height: 42, padding: "0 24px", borderRadius: 999, background: "#0F62FE", fontSize: 13.5, fontWeight: 600, color: "#fff" }}
            >
              Try Again
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center" style={{ background: "rgba(0,0,0,0.85)" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.4 }}>Camera Unavailable</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>Your device may not support camera access in this context.</div>
            <button onClick={() => startCamera(facingMode)} style={{ height: 42, padding: "0 24px", borderRadius: 999, background: "#0F62FE", fontSize: 13.5, fontWeight: 600, color: "#fff" }}>
              Retry
            </button>
          </div>
        )}

        {/* Hidden file input for gallery */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Pick from gallery"
          onChange={() => { setScanning(true); setTimeout(() => setDetected(true), 1500); }}
        />

        <div className="relative" style={{ color: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Top nav */}
          <div className="flex items-center justify-between px-5 pt-14">
            <Link to="/search" className="flex items-center justify-center" aria-label="Back" style={{ ...glass(), width: 40, height: 40, borderRadius: 999 }}>
              <ArrowLeft size={18} strokeWidth={2} color="#fff" />
            </Link>
            <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3, color: "#fff" }}>Visual Search</div>
            <button
              aria-label="Pick from gallery"
              onClick={handleGallery}
              style={{ ...glass(), width: 40, height: 40, borderRadius: 999 }}
              className="flex items-center justify-center"
            >
              <ImageIcon size={17} strokeWidth={2} color="#fff" />
            </button>
          </div>

          {/* Scanner frame — centred in remaining space */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className="relative"
              style={{
                width: 300,
                height: 360,
                borderRadius: 32,
                boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.55), 0 0 0 1px rgba(15,98,254,0.25), 0 30px 80px -30px rgba(15,98,254,0.4)",
                background: "rgba(255,255,255,0.02)",
                overflow: "hidden",
              }}
            >
              {/* Corner brackets */}
              {([
                { top: 10, left: 10, borderTop: 2, borderLeft: 2 },
                { top: 10, right: 10, borderTop: 2, borderRight: 2 },
                { bottom: 10, left: 10, borderBottom: 2, borderLeft: 2 },
                { bottom: 10, right: 10, borderBottom: 2, borderRight: 2 },
              ] as const).map((c, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderColor: "#fff",
                    borderStyle: "solid",
                    borderTopWidth: (c as any).borderTop ?? 0,
                    borderRightWidth: (c as any).borderRight ?? 0,
                    borderBottomWidth: (c as any).borderBottom ?? 0,
                    borderLeftWidth: (c as any).borderLeft ?? 0,
                    ...(c as any),
                  }}
                />
              ))}

              {/* Animated scan line */}
              {scanning && !detected && (
                <div
                  className="absolute left-0 right-0"
                  style={{
                    height: 2,
                    background: "linear-gradient(90deg, rgba(15,98,254,0) 0%, rgba(15,98,254,0.95) 50%, rgba(15,98,254,0) 100%)",
                    boxShadow: "0 0 22px 2px rgba(15,98,254,0.7)",
                    animation: "scanline 1.8s ease-in-out infinite",
                    top: "0%",
                  }}
                />
              )}

              {/* AI Detecting / Detected badge */}
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3"
                style={{
                  top: 16,
                  height: 28,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                <Sparkles size={11} strokeWidth={2.4} color="#0F62FE" />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#111", letterSpacing: -0.1 }}>
                  {detected ? "Product Found!" : scanning ? "AI Scanning…" : "Point at a product"}
                </span>
              </div>

              {/* Detected glow border */}
              {detected && (
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: 32,
                    boxShadow: "inset 0 0 0 2px rgba(15,98,254,0.9)",
                    animation: "pulse-border 1.2s ease-in-out infinite",
                  }}
                />
              )}
            </div>
          </div>

          {/* Detected product card */}
          {detected && (
            <div className="px-5 pb-4">
              <div
                className="p-4"
                style={{
                  borderRadius: 24,
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(28px) saturate(160%)",
                  boxShadow: "0 20px 60px -20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.6)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: "#0F62FE", letterSpacing: 0.4, textTransform: "uppercase" }}>Detected Product</div>
                  <div className="flex items-center gap-1 px-2" style={{ height: 22, borderRadius: 999, background: "rgba(15,98,254,0.10)" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#0F62FE", letterSpacing: -0.1 }}>92% Match</span>
                  </div>
                </div>
                <div className="mt-1.5" style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>Luxury Leather Tote</div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.2, fontWeight: 600, textTransform: "uppercase" }}>Saint Laurent</div>
                    <div className="mt-1" style={{ fontSize: 16, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>$2,450</div>
                  </div>
                  <Link
                    to="/product"
                    className="inline-flex items-center px-4"
                    style={{ height: 40, borderRadius: 999, background: "#0F62FE", fontSize: 13.5, fontWeight: 600, color: "#fff", letterSpacing: -0.2, boxShadow: "0 10px 24px -10px rgba(15,98,254,0.6)" }}
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Bottom controls */}
          <div className="flex items-center justify-center gap-8 pb-14 pt-4">
            <button
              aria-label="Pick from gallery"
              onClick={handleGallery}
              className="flex items-center justify-center"
              style={{ ...glass(), width: 54, height: 54, borderRadius: 999 }}
            >
              <ImageIcon size={20} strokeWidth={2} color="#fff" />
            </button>

            {/* Shutter */}
            <button
              aria-label="Capture"
              onClick={() => { setScanning(true); setTimeout(() => setDetected(true), 1500); }}
              className="flex items-center justify-center"
              style={{
                width: 82,
                height: 82,
                borderRadius: 999,
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 20px 40px -14px rgba(0,0,0,0.5), inset 0 0 0 4px rgba(255,255,255,0.35), 0 0 0 2px rgba(255,255,255,0.9)",
              }}
            >
              <div style={{ width: 62, height: 62, borderRadius: 999, background: "#fff" }} />
            </button>

            {/* Torch or Flip */}
            {torchSupported ? (
              <button
                aria-label="Toggle torch"
                onClick={toggleTorch}
                className="flex items-center justify-center"
                style={{ ...glass(), width: 54, height: 54, borderRadius: 999, background: torch ? "rgba(255,220,0,0.25)" : undefined }}
              >
                {torch ? <ZapOff size={20} strokeWidth={2} color="#FFD700" /> : <Zap size={20} strokeWidth={2} color="#fff" />}
              </button>
            ) : (
              <button
                aria-label="Flip camera"
                onClick={flipCamera}
                className="flex items-center justify-center"
                style={{ ...glass(), width: 54, height: 54, borderRadius: 999 }}
              >
                <RotateCcw size={20} strokeWidth={2} color="#fff" />
              </button>
            )}
          </div>

          {/* Hint */}
          {!detected && (
            <div
              className="absolute left-8 right-8 text-center"
              style={{ bottom: 52, fontSize: 11.5, color: "rgba(255,255,255,0.7)", letterSpacing: -0.1, lineHeight: 1.5 }}
            >
              Point your camera at any product to instantly identify it.
            </div>
          )}
        </div>

        {/* Scan animation keyframes */}
        <style>{`
          @keyframes scanline {
            0%   { top: 8%; }
            50%  { top: 88%; }
            100% { top: 8%; }
          }
          @keyframes pulse-border {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
          }
        `}</style>

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
