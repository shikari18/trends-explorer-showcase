import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, ShieldCheck, Lock, Check, Loader2,
  AlertCircle, CheckCircle2, RefreshCw, Smartphone, CreditCard,
  Building, ExternalLink,
} from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { Progress } from "./checkout";
import {
  serverInitializePaystack,
  serverVerifyAndFulfillOrder,
} from "@/lib/cjApi";

export const Route = createFileRoute("/payment")({
  component: Payment,
  head: () => ({ meta: [{ title: "Trends — Payment" }] }),
});

type PayStatus = "idle" | "launching" | "verifying" | "success" | "error";

function Payment() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("zonezenith18@gmail.com");
  const [shippingAddress, setShippingAddress] = useState<any>(null);

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Payment flow state
  const [payStatus, setPayStatus] = useState<PayStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [directPayUrl, setDirectPayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ id: "demo-item", name: "Trends Luxury Order", price: 3798, qty: 1 }]);
        } catch { setCartItems([{ id: "demo-item", name: "Trends Luxury Order", price: 3798, qty: 1 }]); }
      } else {
        setCartItems([{ id: "demo-item", name: "Trends Luxury Order", price: 3798, qty: 1 }]);
      }

      const savedUser = localStorage.getItem("user") || localStorage.getItem("gUser");
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.email) setUserEmail(u.email);
        } catch {}
      }

      const savedAddress = localStorage.getItem("shippingAddress");
      if (savedAddress) {
        try {
          const addr = JSON.parse(savedAddress);
          setShippingAddress(addr);
          if (addr.email) setUserEmail(addr.email);
        } catch {}
      }

      // Preload Paystack inline script for instant popup launch
      const existingScript = document.getElementById("paystack-inline-js");
      if (!existingScript) {
        const s = document.createElement("script");
        s.id = "paystack-inline-js";
        s.src = "https://js.paystack.co/v1/inline.js";
        s.async = true;
        document.head.appendChild(s);
      }
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => {
    const p = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
    const q = typeof item.qty === "number" ? item.qty : parseInt(item.qty) || 1;
    return sum + p * q;
  }, 0) || 3798;

  const discountAmount = subtotal * discountPercent;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError("");
    if (couponInput.trim().toUpperCase() === "TRENDS10") {
      setDiscountPercent(0.10);
      setCouponApplied(true);
      import("sonner").then(({ toast }) => toast.success("Coupon Applied! 10% off."));
    } else {
      setCouponError("Invalid code. Try 'TRENDS10' for 10% off.");
    }
  };

  const makeRef = () => "TRD-" + Date.now() + "-" + Math.floor(Math.random() * 9999);

  // ── Finalize order with CJ Dropshipping after verified payment ──
  const finalizeOrder = async (reference: string) => {
    setPayStatus("verifying");
    setStatusMessage("Payment confirmed! Fulfilling order with CJ Dropshipping...");
    try {
      const result = await serverVerifyAndFulfillOrder({
        data: {
          paystackReference: reference,
          orderNumber: reference,
          shippingName: shippingAddress?.name || "Customer",
          shippingPhone: shippingAddress?.phone || "0240000000",
          shippingAddress: shippingAddress?.address || "Delivery Address",
          shippingCity: shippingAddress?.city || "Accra",
          shippingProvince: shippingAddress?.province || "Greater Accra",
          shippingCountry: shippingAddress?.country || "Ghana",
          shippingCountryCode: shippingAddress?.countryCode || "GH",
          shippingZip: shippingAddress?.zip || "00233",
          cartItems: cartItems.map(item => ({
            vid: item.vid || item.cjId || item.id || "",
            cjId: item.cjId || item.id || "",
            id: item.id || "",
            name: item.name || "Item",
            qty: typeof item.qty === "number" ? item.qty : parseInt(item.qty) || 1,
            price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
            rawPrice: item.rawPrice || (typeof item.price === "number" ? item.price : parseFloat(item.price)) || 0,
          })),
        },
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("lastOrderSplit", JSON.stringify(result?.split || {}));
        localStorage.setItem("lastOrderRef", reference);
        localStorage.setItem("lastCJOrderId", result?.cjOrderId || "");
        localStorage.removeItem("cart");
        sessionStorage.removeItem("trends_active_payment");
      }
      setPayStatus("success");
      setStatusMessage("Order successfully placed!");
      setTimeout(() => navigate({ to: "/order-success" }), 1200);
    } catch {
      if (typeof window !== "undefined") {
        localStorage.setItem("lastOrderRef", reference);
        localStorage.removeItem("cart");
      }
      setTimeout(() => navigate({ to: "/order-success" }), 1500);
    }
  };

  // ── Main: Launch Official Paystack Popup ──
  const handleLaunchPaystack = async () => {
    if (payStatus === "launching" || payStatus === "verifying") return;
    setPayStatus("launching");
    setStatusMessage("Opening Paystack secure checkout...");
    setDirectPayUrl(null);

    const ref = makeRef();
    const customerEmail = userEmail || shippingAddress?.email || "zonezenith18@gmail.com";

    // 1. Ensure Paystack inline script is ready
    if (!(window as any).PaystackPop) {
      await new Promise<void>((resolve) => {
        const existing = document.getElementById("paystack-inline-js");
        if (existing) {
          existing.addEventListener("load", () => resolve());
          setTimeout(resolve, 1500);
        } else {
          const s = document.createElement("script");
          s.id = "paystack-inline-js";
          s.src = "https://js.paystack.co/v1/inline.js";
          s.onload = () => resolve();
          s.onerror = () => resolve();
          document.head.appendChild(s);
          setTimeout(resolve, 1500);
        }
      });
    }

    // 2. Initialize transaction on server (gets access_code & verified authorization URL)
    let accessCode: string | null = null;
    let authUrl: string | null = null;

    try {
      const initRes = await serverInitializePaystack({
        data: {
          email: customerEmail,
          amountGHS: total,
          reference: ref,
          metadata: {
            custom_fields: [
              { display_name: "Customer Name", variable_name: "customer_name", value: shippingAddress?.name || "Customer" },
              { display_name: "Phone Number", variable_name: "phone_number", value: shippingAddress?.phone || "" },
              { display_name: "Shipping Address", variable_name: "shipping_address", value: `${shippingAddress?.address || ""}, ${shippingAddress?.city || ""}` },
            ],
          },
        },
      });
      if (initRes.status && initRes.accessCode) {
        accessCode = initRes.accessCode;
        authUrl = initRes.authorizationUrl;
        setDirectPayUrl(authUrl);
      }
    } catch (err) {
      console.warn("Paystack server initialize fallback:", err);
    }

    // 3. Open the official Paystack popup modal
    const pop = (window as any).PaystackPop;
    const publicKey = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string) || "pk_live_4ee89791424f3443c50d3d7295a996a29fdeeeec";

    if (pop?.setup) {
      try {
        const setupConfig: any = {
          key: publicKey,
          email: customerEmail,
          amount: Math.round(total * 100),
          currency: "GHS",
          ref,
          channels: ["card", "mobile_money", "bank"],
          onClose: () => {
            setPayStatus("idle");
            setStatusMessage("");
          },
          callback: async (response: any) => {
            const confirmedRef = response?.reference || ref;
            await finalizeOrder(confirmedRef);
          },
        };

        if (accessCode) {
          setupConfig.access_code = accessCode;
        }

        const handler = pop.setup(setupConfig);
        handler?.openIframe?.();
        setStatusMessage("Please complete payment in the Paystack modal.");
      } catch (e) {
        console.error("Popup setup error:", e);
        if (authUrl) {
          window.location.href = authUrl;
        } else {
          setPayStatus("error");
          setStatusMessage("Could not open Paystack popup. Please try again.");
        }
      }
    } else if (authUrl) {
      window.location.href = authUrl;
    } else {
      setPayStatus("error");
      setStatusMessage("Could not connect to Paystack. Please check your connection.");
    }
  };

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-36">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4">
              <Link to="/checkout" aria-label="Back" style={circle()} className="flex items-center justify-center">
                <ArrowLeft size={18} color="#111" />
              </Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Payment</div>
              <button style={circle()} className="flex items-center justify-center"><ShieldCheck size={17} color="#0F62FE" /></button>
            </div>

            <div className="px-6 mt-5">
              <h1 style={{ fontSize: 30, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Choose payment</h1>
              <p className="text-xs text-gray-500 mt-1">Direct bank integration — real-time verification</p>
            </div>

            <div className="px-6 mt-4"><Progress step={3} labels={["Cart", "Checkout", "Payment"]} /></div>

            {/* Status Feedback */}
            {payStatus !== "idle" && (
              <div className="px-5 mt-5">
                {payStatus === "launching" && (
                  <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-blue-50 border border-blue-100 text-center">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <div className="text-sm font-bold text-blue-900">Connecting to Paystack...</div>
                    <div className="text-xs text-blue-700">Complete payment in the official popup modal.</div>
                    {directPayUrl && (
                      <a
                        href={directPayUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Popup blocked? Tap here to open payment page <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                )}

                {payStatus === "verifying" && (
                  <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-amber-50 border border-amber-100 text-center">
                    <Loader2 size={32} className="animate-spin text-amber-600" />
                    <div className="text-sm font-bold text-amber-900">Verifying payment...</div>
                    <div className="text-xs text-amber-700">{statusMessage || "Finalizing order and notifying warehouse."}</div>
                  </div>
                )}

                {payStatus === "success" && (
                  <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-emerald-50 border border-emerald-100 text-center">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                    <div className="text-sm font-bold text-emerald-900">Payment Successful!</div>
                    <div className="text-xs text-emerald-700">{statusMessage}</div>
                  </div>
                )}

                {payStatus === "error" && (
                  <div className="flex flex-col gap-3 p-5 rounded-3xl bg-red-50 border border-red-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-red-900">
                      <AlertCircle size={18} className="text-red-600" />
                      Payment Issue
                    </div>
                    <div className="text-xs text-red-700 leading-relaxed">{statusMessage}</div>
                    <button
                      onClick={handleLaunchPaystack}
                      className="py-2.5 px-4 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={13} /> Try Opening Paystack Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Official Paystack All-In-One Method Card ── */}
            <div className="px-5 mt-5">
              <div
                style={{
                  borderRadius: 24,
                  background: "#fff",
                  boxShadow: "0 0 0 2px #00C3F7, 0 16px 36px -16px rgba(0,195,247,0.3)",
                }}
                className="overflow-hidden p-5"
              >
                <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,195,247,0.1)" }}>
                    <ShieldCheck size={26} className="text-[#00C3F7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-gray-900 tracking-tight">Paystack Secure Portal</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-[#00a3ce]">Official</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Supports Mobile Money, Cards & Banks</p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#00C3F7] flex items-center justify-center shrink-0">
                    <Check size={14} color="#fff" strokeWidth={3} />
                  </div>
                </div>

                {/* Accepted Payment Channels */}
                <div className="mt-4 space-y-2.5">
                  <div className="text-[11.5px] font-bold text-gray-700">Accepted inside the popup:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 font-semibold">
                      <Smartphone size={14} className="text-amber-600 shrink-0" />
                      <span>MTN MoMo</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50/70 border border-red-200/60 text-red-900 font-semibold">
                      <Smartphone size={14} className="text-red-600 shrink-0" />
                      <span>Telecel Cash</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-blue-900 font-semibold">
                      <CreditCard size={14} className="text-blue-600 shrink-0" />
                      <span>Visa & Mastercard</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/60 text-purple-900 font-semibold">
                      <Building size={14} className="text-purple-600 shrink-0" />
                      <span>Bank Transfer</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 pt-1 leading-relaxed">
                    When you click the button below, Paystack's official modal will open on your screen. You can select your preferred payment option and complete securely.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Destination Preview */}
            {shippingAddress && (
              <div className="px-5 mt-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-1.5 text-xs">
                  <div className="font-bold text-gray-800 flex items-center justify-between">
                    <span>Delivering To</span>
                    <Link to="/checkout" className="text-blue-600 font-semibold hover:underline text-[11px]">Edit</Link>
                  </div>
                  <div className="text-gray-900 font-semibold">{shippingAddress.name} &bull; {shippingAddress.phone}</div>
                  <div className="text-gray-500">{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.province}</div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="px-5 mt-4">
              <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Order Summary</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{cartItems.length} Items</div>
                </div>
                <div className="mt-3 space-y-2" style={{ fontSize: 13.5 }}>
                  <Row label="Subtotal" value={`₵${subtotal.toLocaleString()}`} />
                  {discountPercent > 0 && <Row label="Discount (10%)" value={<span style={{ color: "#34C759", fontWeight: 700 }}>-₵${discountAmount.toLocaleString()}</span>} />}
                  <Row label="Worldwide Shipping" value={<span style={{ color: "#34C759", fontWeight: 700 }}>Free</span>} />
                </div>
                <div className="my-3" style={{ height: 1, background: "rgba(17,17,17,0.06)" }} />
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 14, color: "#666" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: -0.6 }}>₵{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="px-6 mt-4 flex items-center justify-center gap-2 text-[11.5px] text-gray-400">
              <Lock size={12} className="text-emerald-500" />
              <span>PCI-DSS Level 1 &bull; 256-bit SSL encrypted Paystack gateway</span>
            </div>
          </div>
        </div>

        {/* Sticky Pay Bar */}
        <div className="absolute left-4 right-4 z-20" style={{ bottom: 18 }}>
          <div className="flex items-center gap-3 pl-5 pr-2" style={{ height: 66, borderRadius: 24, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(28px) saturate(160%)", boxShadow: "0 20px 40px -14px rgba(17,17,17,0.22), inset 0 0 0 1px rgba(255,255,255,0.6)" }}>
            <div className="flex-1">
              <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.3, fontWeight: 600, textTransform: "uppercase" }}>Total to Pay</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>₵{total.toLocaleString()}</div>
            </div>
            <button
              onClick={handleLaunchPaystack}
              disabled={payStatus === "launching" || payStatus === "verifying"}
              className="inline-flex items-center justify-center gap-2 px-6 disabled:opacity-50 cursor-pointer active:scale-95 transition-transform"
              style={{
                height: 52,
                borderRadius: 20,
                background: "#00C3F7",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                boxShadow: "0 12px 24px -8px rgba(0,195,247,0.5)",
              }}
            >
              {payStatus === "launching" || payStatus === "verifying" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Lock size={14} />
              )}
              {payStatus === "launching" ? "Opening..." : payStatus === "verifying" ? "Verifying..." : `Pay ₵${total.toLocaleString()}`}
            </button>
          </div>
        </div>

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: "#666" }}>{label}</span>
      <span style={{ color: "#111", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function circle() {
  return {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
  } as const;
}
