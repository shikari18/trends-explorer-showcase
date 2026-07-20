import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Image as ImageIcon, Sparkles, RotateCcw, AlertCircle, ShoppingCart, Check } from "lucide-react";
import { PhoneFrame, HomeIndicator } from "@/components/phone/PhoneFrame";
import { searchCJProducts, CJProduct } from "@/lib/cjApi";

// Gemini API key — loaded from env var VITE_GEMINI_KEY (set on Render.com)
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY as string || "";

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

  // AI & Matching state
  const [searchError, setSearchError] = useState("");
  const [matchedProducts, setMatchedProducts] = useState<CJProduct[]>([]);
  const [addedToCartIds, setAddedToCartIds] = useState<string[]>([]);

  const startCamera = useCallback(async (facing: "environment" | "user") => {
    setStatus("loading");
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

      const track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities?.() as any;
      setTorchSupported(!!(caps?.torch));
      setStatus("live");
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
    setSearchError("");
    setMatchedProducts([]);
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Perform AI analysis and matching
  const captureAndAnalyze = async (base64Image?: string) => {
    setScanning(true);
    setDetected(false);
    setSearchError("");
    setMatchedProducts([]);

    try {
      let base64Data = base64Image;

      // If no file picked, capture frame from video camera
      if (!base64Data && videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context creation failed");
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        base64Data = canvas.toDataURL("image/jpeg").split(",")[1];
      }

      if (!base64Data) {
        setSearchError("No image stream to scan.");
        setScanning(false);
        return;
      }

      // If no key provided, fallback to smart demo mode
      if (!GEMINI_KEY) {
        setTimeout(async () => {
          const { PRODUCTS } = await import("@/lib/products");
          // Grab 1-2 random items from local catalog
          const count = 1 + Math.floor(Math.random() * 2);
          const shuffled = [...PRODUCTS].sort(() => 0.5 - Math.random());
          const selection = shuffled.slice(0, count);
          
          if (selection.length > 0) {
            setMatchedProducts(selection as any[]);
            setDetected(true);
          } else {
            setSearchError("No items available in store.");
          }
          setScanning(false);
        }, 1500);
        return;
      }

      // Send frame to Gemini 1.5 Flash Vision API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Identify the product/item shown in this image. Respond with ONLY 1 to 2 descriptive search keywords (e.g. 'shoes', 'watch', 'bag', 'sunglasses', 'shirt'). Do not include brands, punctuation, or extra words." },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data
                  }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const detectedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      console.log("AI Detected keywords:", detectedText);

      if (!detectedText) {
        setSearchError("AI could not identify item.");
        setScanning(false);
        return;
      }

      // Search matching products in catalog
      const { products: matches } = await searchCJProducts(detectedText, 1, 4);

      if (matches && matches.length > 0) {
        setMatchedProducts(matches);
        setDetected(true);
      } else {
        setSearchError(`Detected "${detectedText}" but it is not available in our store.`);
      }
    } catch (err) {
      console.error("AI scanning error:", err);
      setSearchError("Vision API query failed.");
    } finally {
      setScanning(false);
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      captureAndAnalyze(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryClick = () => fileInputRef.current?.click();

  const addToCart = (p: CJProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      let items = saved ? JSON.parse(saved) : [];
      const existing = items.find((it: any) => it.id === p.id);
      if (existing) {
        existing.qty += 1;
      } else {
        items.push({
          id: p.id, brand: p.brand, name: p.name,
          color: "Default", size: "One Size",
          price: p.rawPrice, img: p.img, qty: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(items));
      setAddedToCartIds((prev) => [...prev, p.id]);
      setTimeout(() => setAddedToCartIds((prev) => prev.filter((x) => x !== p.id)), 1500);
      import("sonner").then(({ toast }) => toast.success(`${p.name} added to cart!`));
    }
  };

  return (
    <PhoneFrame>
      <>
        {/* Camera stream */}
        <video
          ref={videoRef}
          aria-hidden
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ background: "#000" }}
        />

        {/* Scan line overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* Camera loading/error views */}
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20" style={{ background: "rgba(0,0,0,0.85)" }}>
            <div className="w-9 h-9 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Initializing Camera…</span>
          </div>
        )}

        {status === "denied" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center z-20" style={{ background: "rgba(0,0,0,0.9)" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <ImageIcon size={24} color="rgba(255,255,255,0.7)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Camera Permission Needed</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 6, lineHeight: 1.5 }}>
                Please allow camera access in your browser settings to scan items.
              </div>
            </div>
            <button
              onClick={() => startCamera(facingMode)}
              style={{ height: 40, padding: "0 22px", borderRadius: 999, background: "#0F62FE", fontSize: 13, fontWeight: 600, color: "#fff" }}
            >
              Allow Camera
            </button>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleGallerySelect}
        />

        {/* UI Overlay Container */}
        <div className="relative z-10 flex flex-col justify-between h-full text-white">
          {/* Top navigation */}
          <div className="flex items-center justify-between px-5 pt-14">
            <Link to="/search" className="flex items-center justify-center" aria-label="Back" style={glassStyle}>
              <ArrowLeft size={18} strokeWidth={2.2} color="#fff" />
            </Link>
            <div style={{ fontSize: 15.5, fontWeight: 600, color: "#fff", letterSpacing: -0.2 }}>AI Visual Search</div>
            <button
              onClick={() => handleGalleryClick()}
              style={glassStyle}
              className="flex items-center justify-center"
              aria-label="Upload from gallery"
            >
              <ImageIcon size={17} strokeWidth={2} color="#fff" />
            </button>
          </div>

          {/* Scanner viewfinder frame */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div
              className="relative transition-all"
              style={{
                width: 270,
                height: 320,
                borderRadius: 28,
                boxShadow: scanning 
                  ? "inset 0 0 0 2px #0F62FE, 0 0 40px rgba(15,98,254,0.4)"
                  : "inset 0 0 0 1.5px rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.02)",
                overflow: "hidden"
              }}
            >
              {/* Bracket corners */}
              {[
                { top: 10, left: 10, borderTop: 3, borderLeft: 3 },
                { top: 10, right: 10, borderTop: 3, borderRight: 3 },
                { bottom: 10, left: 10, borderBottom: 3, borderLeft: 3 },
                { bottom: 10, right: 10, borderBottom: 3, borderRight: 3 },
              ].map((b, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: 18,
                    height: 18,
                    borderColor: scanning ? "#0F62FE" : "#fff",
                    borderStyle: "solid",
                    borderTopWidth: b.borderTop || 0,
                    borderLeftWidth: b.borderLeft || 0,
                    borderBottomWidth: b.borderBottom || 0,
                    borderRightWidth: b.borderRight || 0,
                    top: b.top,
                    left: b.left,
                    right: b.right,
                    bottom: b.bottom,
                    borderRadius: 4
                  }}
                />
              ))}

              {/* Scanning indicator */}
              {scanning && (
                <div
                  className="absolute left-0 right-0"
                  style={{
                    height: 3,
                    background: "linear-gradient(90deg, rgba(15,98,254,0) 0%, rgba(15,98,254,0.9) 50%, rgba(15,98,254,0) 100%)",
                    boxShadow: "0 0 15px #0F62FE",
                    animation: "scanline 2s infinite ease-in-out",
                    top: "0%"
                  }}
                />
              )}

              {/* Center status badge */}
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3"
                style={{
                  top: 14,
                  height: 26,
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(12px)",
                  whiteSpace: "nowrap"
                }}
              >
                <Sparkles size={11} color="#0F62FE" />
                <span style={{ fontSize: 11, fontWeight: 600 }}>
                  {scanning ? "AI analyzing..." : detected ? "Item matched!" : "Point & scan"}
                </span>
              </div>
            </div>
          </div>

          {/* Results card overlay */}
          {(detected || searchError) && (
            <div className="px-5 pb-4">
              {searchError ? (
                <div
                  className="flex items-center gap-3 p-4"
                  style={{
                    borderRadius: 20,
                    background: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)"
                  }}
                >
                  <AlertCircle size={20} color="#FF3B30" className="shrink-0" />
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>
                    {searchError}
                  </div>
                </div>
              ) : (
                <div
                  className="p-4"
                  style={{
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(28px)",
                    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5), inset 0 0 0 1px #fff"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.5, textTransform: "uppercase" }}>
                      Scan Results
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#34C759" }}>
                      Matched
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {matchedProducts.map((p) => {
                      const isAdded = addedToCartIds.includes(p.id);
                      return (
                        <Link
                          key={p.id}
                          to="/product/$id"
                          params={{ id: p.id }}
                          className="flex items-center gap-3 p-2 transition-colors hover:bg-slate-100/50 rounded-xl"
                          style={{ border: "1px solid rgba(17,17,17,0.06)", background: "#fff" }}
                        >
                          <img src={p.img} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate" style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{p.name}</div>
                            <div style={{ fontSize: 11.5, color: "#8A8A8A" }}>{p.brand}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{p.price}</span>
                            <button
                              onClick={(e) => addToCart(p, e)}
                              className="flex items-center justify-center z-10 shrink-0"
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: 999,
                                background: isAdded ? "#34C759" : "rgba(17,17,17,0.05)"
                              }}
                            >
                              {isAdded ? <Check size={11} color="#fff" strokeWidth={3} /> : <ShoppingCart size={11} color="#111" />}
                            </button>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom actions panel */}
          <div className="flex items-center justify-center gap-8 pb-14 pt-4">
            <button
              onClick={handleGalleryClick}
              className="flex items-center justify-center"
              style={{ ...glassStyle, width: 54, height: 54 }}
              aria-label="Upload gallery file"
            >
              <ImageIcon size={20} color="#fff" />
            </button>

            {/* Scanning shutter */}
            <button
              onClick={() => captureAndAnalyze()}
              disabled={scanning}
              className="flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              style={{
                width: 80,
                height: 80,
                borderRadius: 999,
                background: scanning ? "#0F62FE" : "rgba(255,255,255,0.95)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
              }}
              aria-label="Capture & Search"
            >
              <div style={{ width: 60, height: 60, borderRadius: 999, border: "2px solid #fff", background: scanning ? "#0F62FE" : "transparent" }} />
            </button>

            <button
              onClick={flipCamera}
              className="flex items-center justify-center"
              style={{ ...glassStyle, width: 54, height: 54 }}
              aria-label="Flip camera direction"
            >
              <RotateCcw size={20} color="#fff" />
            </button>
          </div>
        </div>

        <style>{`
          @keyframes scanline {
            0%   { top: 4%; }
            50%  { top: 92%; }
            100% { top: 4%; }
          }
        `}</style>

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

const glassStyle = {
  width: 40,
  height: 40,
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  backdropFilter: "blur(24px) saturate(160%)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
};
