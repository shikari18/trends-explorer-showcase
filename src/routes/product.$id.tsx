import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Share2, Heart, Star, Check, ShoppingCart,
  ChevronLeft, ChevronRight, Play, Pause, Loader2, Box
} from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { fetchProductDetail, CJProductDetail, EXCHANGE_RATE, MARKUP } from "@/lib/cjApi";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
  head: () => ({
    meta: [
      { title: "Trends — Product" },
      { name: "description", content: "View product details, images and videos." },
    ],
  }),
});

function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<CJProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Variant selector states
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setShowVideo(false);
    fetchProductDetail(id).then((p) => {
      setProduct(p);
      setLoading(false);
      
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("wishlist");
        const list = saved ? JSON.parse(saved) : [];
        setWishlist(list.includes(id));
      }
    });
  }, [id]);

  // Set default variants when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const colors: string[] = [];
      const sizes: string[] = [];
      product.variants.forEach((v: any) => {
        const key = v.variantKey || "";
        const parts = key.split("-");
        if (parts[0] && !colors.includes(parts[0].trim())) {
          colors.push(parts[0].trim());
        }
        if (parts[1] && !sizes.includes(parts[1].trim())) {
          sizes.push(parts[1].trim());
        }
      });
      if (colors.length > 0) setSelectedColor(colors[0]);
      if (sizes.length > 0) setSelectedSize(sizes[0]);
    } else {
      setSelectedColor("");
      setSelectedSize("");
    }
  }, [product]);

  const toggleWishlist = () => {
    if (!product) return;
    const saved = localStorage.getItem("wishlist");
    let list = saved ? JSON.parse(saved) : [];
    if (wishlist) {
      list = list.filter((x: string) => x !== id);
    } else {
      list.push(id);
    }
    localStorage.setItem("wishlist", JSON.stringify(list));
    setWishlist(!wishlist);
  };

  // Extract unique colors and sizes for display
  const uniqueColors: string[] = [];
  const uniqueSizes: string[] = [];
  if (product?.variants) {
    product.variants.forEach((v: any) => {
      const key = v.variantKey || "";
      const parts = key.split("-");
      const colorVal = parts[0]?.trim();
      const sizeVal = parts[1]?.trim();
      if (colorVal && !uniqueColors.includes(colorVal)) uniqueColors.push(colorVal);
      if (sizeVal && !uniqueSizes.includes(sizeVal)) uniqueSizes.push(sizeVal);
    });
  }

  // Find active variant matching selected color & size
  const matchedVariant = product?.variants?.find((v: any) => {
    const key = v.variantKey || "";
    const parts = key.split("-");
    const colorVal = parts[0]?.trim() || "";
    const sizeVal = parts[1]?.trim() || "";
    const colorMatch = !selectedColor || colorVal === selectedColor;
    const sizeMatch = !selectedSize || sizeVal === selectedSize;
    return colorMatch && sizeMatch;
  });

  // Calculate dynamic GHS price of the selected variant
  const activeUsdPrice = matchedVariant 
    ? parseFloat(matchedVariant.variantSellPrice) 
    : (product ? parseFloat(product.price.replace(/[^0-9.]/g, "")) / (EXCHANGE_RATE * MARKUP) : 10);
  const activeGhsPrice = matchedVariant 
    ? Math.round(activeUsdPrice * EXCHANGE_RATE * MARKUP) 
    : (product ? product.rawPrice : 0);
  const priceDisplay = `₵${activeGhsPrice.toLocaleString()}`;

  const allMedia = product
    ? [
        ...product.images,
        ...(product.videoUrl ? ["__video__"] : []),
      ]
    : [];

  // Determine current active main image (selected variant image overrides index if active)
  const activeImgUrl = (matchedVariant && matchedVariant.variantImage) 
    ? matchedVariant.variantImage 
    : (allMedia[activeImg] || product?.img || "");

  const addToCart = () => {
    if (!product) return;
    const saved = localStorage.getItem("cart");
    let items = saved ? JSON.parse(saved) : [];
    const colorLabel = selectedColor || "Default";
    const sizeLabel = selectedSize || "One Size";
    const itemId = `${product.id}-${colorLabel}-${sizeLabel}`;

    const existing = items.find((i: any) => i.id === itemId);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: itemId,
        productId: product.id,
        brand: product.brand,
        name: product.name,
        color: colorLabel,
        size: sizeLabel,
        price: activeGhsPrice,
        img: activeImgUrl,
        qty: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(items));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    import("sonner").then(({ toast }) => toast.success("Added to cart!"));
  };

  const handleVideoToggle = () => {
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
      setVideoPlaying(false);
    } else {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  const currentIsVideo = allMedia[activeImg] === "__video__";

  if (loading) {
    return (
      <PhoneFrame>
        <>
          <StatusBar />
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <Loader2 size={32} className="animate-spin" style={{ color: "#0F62FE" }} />
            <div style={{ fontSize: 14, color: "#8A8A8A", fontWeight: 500 }}>Loading product...</div>
          </div>
          <HomeIndicator />
        </>
      </PhoneFrame>
    );
  }

  if (!product) {
    return (
      <PhoneFrame>
        <>
          <StatusBar />
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div style={{ fontSize: 40 }}>😕</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Product not found</div>
            <button
              onClick={() => navigate({ to: "/home" })}
              style={{ fontSize: 14, fontWeight: 600, color: "#0F62FE" }}
            >
              Go back home
            </button>
          </div>
          <HomeIndicator />
        </>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div
          className="relative flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <div className="pb-40">
            {/* Top nav */}
            <div className="flex items-center justify-between px-5 pt-4">
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    window.history.back();
                  } else {
                    navigate({ to: "/home" });
                  }
                }}
                aria-label="Back"
                className="flex items-center justify-center"
                style={circleBtnStyle}
              >
                <ArrowLeft size={18} color="#111" />
              </button>
              <div style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: -0.3, color: "#111" }}>
                Product Detail
              </div>
              <button aria-label="Share" className="flex items-center justify-center" style={circleBtnStyle}>
                <Share2 size={17} color="#111" />
              </button>
            </div>

            {/* Main media viewer */}
            <div className="mt-4 px-5">
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "1 / 1.05",
                  borderRadius: 28,
                  background: "#F7F7F5",
                  boxShadow: "0 24px 60px -30px rgba(17,17,17,0.25), inset 0 0 0 1px rgba(17,17,17,0.03)",
                }}
              >
                {/* Image or Video */}
                {currentIsVideo && product.videoUrl ? (
                  <div className="w-full h-full relative">
                    <video
                      ref={videoRef}
                      src={product.videoUrl}
                      className="w-full h-full object-cover"
                      loop
                      playsInline
                      onPlay={() => setVideoPlaying(true)}
                      onPause={() => setVideoPlaying(false)}
                    />
                    <button
                      onClick={handleVideoToggle}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 999,
                          background: "rgba(0,0,0,0.45)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {videoPlaying ? (
                          <Pause size={24} color="#fff" fill="#fff" />
                        ) : (
                          <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                        )}
                      </div>
                    </button>
                  </div>
                ) : (
                  <img
                    src={activeImgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Wishlist button */}
                <button
                  onClick={toggleWishlist}
                  aria-label="Wishlist"
                  className="absolute top-4 right-4 flex items-center justify-center transition-all"
                  style={{ ...circleBtnStyle, width: 42, height: 42 }}
                >
                  <Heart
                    size={17}
                    fill={wishlist ? "#FF3B30" : "none"}
                    color={wishlist ? "#FF3B30" : "#111"}
                  />
                </button>

                {/* AR button */}
                <div
                  className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3.5"
                  style={{
                    height: 34,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(16px)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#111",
                    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
                  }}
                >
                  <Box size={12} strokeWidth={2.2} />
                  View in AR
                </div>

                {/* Navigation arrows (if multiple images) */}
                {allMedia.length > 1 && (
                  <>
                    {activeImg > 0 && (
                      <button
                        onClick={() => { setActiveImg(activeImg - 1); setVideoPlaying(false); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
                      >
                        <ChevronLeft size={16} color="#111" />
                      </button>
                    )}
                    {activeImg < allMedia.length - 1 && (
                      <button
                        onClick={() => { setActiveImg(activeImg + 1); setVideoPlaying(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
                      >
                        <ChevronRight size={16} color="#111" />
                      </button>
                    )}
                  </>
                )}

                {/* Dot indicators */}
                {allMedia.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allMedia.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setActiveImg(i); setVideoPlaying(false); }}
                        style={{
                          width: i === activeImg ? 20 : 6,
                          height: 6,
                          borderRadius: 999,
                          background: i === activeImg ? "#111" : "rgba(255,255,255,0.85)",
                          boxShadow: i === activeImg ? "none" : "inset 0 0 0 1px rgba(17,17,17,0.1)",
                          transition: "width 0.2s ease",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {allMedia.length > 1 && (
              <div className="flex gap-2 px-5 mt-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {allMedia.map((media, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImg(i); setVideoPlaying(false); }}
                    className="shrink-0 overflow-hidden relative"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 14,
                      background: "#F7F7F5",
                      boxShadow:
                        i === activeImg
                          ? "0 0 0 2.5px #0F62FE"
                          : "inset 0 0 0 1px rgba(17,17,17,0.08)",
                    }}
                  >
                    {media === "__video__" ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900">
                        <Play size={18} color="#fff" fill="#fff" />
                      </div>
                    ) : (
                      <img
                        src={media as string}
                        alt={`View ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="px-6 mt-5">
              <div className="flex items-center gap-2">
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {product.brand}
                </div>
                <div
                  className="inline-flex items-center gap-1 px-2"
                  style={{ height: 20, borderRadius: 999, background: "rgba(15,98,254,0.10)" }}
                >
                  <Check size={10} strokeWidth={3} color="#0F62FE" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.2 }}>CJ Verified</span>
                </div>
              </div>
              <h1 className="mt-1.5" style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, color: "#111", lineHeight: 1.25 }}>
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex" style={{ gap: 1 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < Math.round(product.rating) ? "#111" : "#E5E5E2"}
                      color={i < Math.round(product.rating) ? "#111" : "#E5E5E2"}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111" }}>{product.rating}</span>
                <span style={{ fontSize: 12.5, color: "#8A8A8A" }}>({product.reviews} Reviews)</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div style={{ fontSize: 28, fontWeight: 700, color: "#111", letterSpacing: -0.8 }}>
                  {priceDisplay}
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: "#34C759", boxShadow: "0 0 0 3px rgba(52,199,89,0.18)" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#34C759" }}>In Stock</span>
                </div>
              </div>
            </div>

            {/* Dynamic Colors Selection */}
            {uniqueColors.length > 0 && (
              <div className="px-6 mt-6">
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>Color</div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {uniqueColors.map((c) => {
                    const active = c === selectedColor;
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className="px-4 py-2 rounded-full font-semibold transition-all cursor-pointer"
                        style={{
                          fontSize: 12.5,
                          background: active ? "#0F62FE" : "#fff",
                          color: active ? "#fff" : "#111",
                          boxShadow: active ? "0 4px 12px rgba(15,98,254,0.25)" : "inset 0 0 0 1px rgba(17,17,17,0.08)"
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Sizes Selection */}
            {uniqueSizes.length > 0 && (
              <div className="px-6 mt-5">
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>Size</div>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {uniqueSizes.map((s) => {
                    const active = s === selectedSize;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className="px-4 py-2 rounded-full font-semibold transition-all cursor-pointer"
                        style={{
                          fontSize: 12.5,
                          background: active ? "#0F62FE" : "#fff",
                          color: active ? "#fff" : "#111",
                          boxShadow: active ? "0 4px 12px rgba(15,98,254,0.25)" : "inset 0 0 0 1px rgba(17,17,17,0.08)"
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description (rendered with full HTML + spec styles) */}
            {product.description && (
              <div className="px-6 mt-6">
                <Card>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3, marginBottom: 8 }}>
                    Description
                  </div>
                  <div
                    className="product-description-container"
                    style={{
                      fontSize: 13,
                      color: "#444",
                      lineHeight: 1.55,
                      maxHeight: 450,
                      overflowY: "auto",
                      scrollbarWidth: "none"
                    }}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </Card>
              </div>
            )}

            {/* All images grid */}
            {product.images.length > 1 && (
              <div className="px-6 mt-4">
                <Card>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3, marginBottom: 12 }}>
                    All Photos ({product.images.length})
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className="overflow-hidden cursor-pointer"
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: 12,
                          background: "#F7F7F5",
                          boxShadow: i === activeImg ? "0 0 0 2px #0F62FE" : "inset 0 0 0 1px rgba(17,17,17,0.06)",
                        }}
                      >
                        <img src={img} alt={`Photo ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Category tag */}
            {product.category && (
              <div className="px-6 mt-4">
                <div className="inline-flex items-center gap-1.5 px-3"
                  style={{ height: 30, borderRadius: 999, background: "#F7F7F5", fontSize: 12, fontWeight: 600, color: "#666", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}>
                  📦 {product.category}
                </div>
              </div>
            )}

            {/* Reviews card */}
            <div className="px-6 mt-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Customer Reviews</div>
                  <div className="flex items-center gap-1">
                    <Star size={13} fill="#111" color="#111" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{product.rating}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: "linear-gradient(135deg, #EFE7D9, #B98A5B)", flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>Verified Buyer</div>
                    <div className="mt-0.5 flex" style={{ gap: 1 }}>
                      {[0,1,2,3,4].map((i) => <Star key={i} size={10} fill="#111" color="#111" />)}
                    </div>
                    <p className="mt-1" style={{ fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>
                      Great quality product! Exactly as described. Fast shipping too.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="absolute left-4 right-4" style={{ bottom: 18 }}>
          <div
            className="flex items-center gap-2 p-2"
            style={{
              borderRadius: 26,
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(24px) saturate(160%)",
              boxShadow: "0 20px 40px -16px rgba(17,17,17,0.2), inset 0 0 0 1px rgba(255,255,255,0.6)",
            }}
          >
            <button
              onClick={addToCart}
              className="flex-1 inline-flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              style={{
                height: 52,
                borderRadius: 22,
                background: addedToCart ? "#34C759" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                color: addedToCart ? "#fff" : "#111",
                boxShadow: addedToCart ? "none" : "inset 0 0 0 1px rgba(17,17,17,0.08)",
                transition: "background 0.3s ease, color 0.3s ease",
              }}
            >
              {addedToCart ? (
                <><Check size={16} strokeWidth={3} /> Added!</>
              ) : (
                <><ShoppingCart size={16} strokeWidth={2} /> Add to Cart</>
              )}
            </button>
            <button
              onClick={() => navigate({ to: "/checkout" })}
              className="flex-1 inline-flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              style={{
                height: 52,
                borderRadius: 22,
                background: "#0F62FE",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                boxShadow: "0 12px 24px -10px rgba(15,98,254,0.6)",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Global Description Style Fix */}
        <style>{`
          .product-description-container img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 12px;
            margin: 8px 0;
            display: block;
          }
          .product-description-container p {
            margin-bottom: 6px;
          }
          .product-description-container table {
            width: 100% !important;
            border-collapse: collapse;
            margin: 8px 0;
            font-size: 11px;
          }
          .product-description-container td {
            border: 1px solid rgba(17,17,17,0.06);
            padding: 4px;
          }
        `}</style>

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4"
      style={{
        borderRadius: 22,
        background: "#fff",
        boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
      }}
    >
      {children}
    </div>
  );
}

const circleBtnStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 999,
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(16px)",
  boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
};
