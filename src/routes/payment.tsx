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

  // Quick test toggle (lets user test with ₵5 without exceeding MTN's standard wallet limit)
  const [useTestAmount, setUseTestAmount] = useState(false);
  const activeTotal = useTestAmount ? 5 : total;

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
          amountGHS: activeTotal,
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

    // Auto-reset launching state after 8 seconds in case browser popup blocker or modal loses focus
    const resetTimer = setTimeout(() => {
      setPayStatus((prev) => (prev === "launching" ? "idle" : prev));
    }, 8000);

    if (pop?.setup) {
      try {
        const setupConfig: any = {
          key: publicKey,
          email: customerEmail,
          amount: Math.round(activeTotal * 100),
          currency: "GHS",
          ref,
          channels: ["card", "mobile_money", "bank"],
          onClose: () => {
            clearTimeout(resetTimer);
            setPayStatus("idle");
            setStatusMessage("");
          },
          callback: async (response: any) => {
            clearTimeout(resetTimer);
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
        clearTimeout(resetTimer);
        console.error("Popup setup error:", e);
        if (authUrl) {
          window.location.href = authUrl;
        } else {
          setPayStatus("error");
          setStatusMessage("Could not open Paystack popup. Please try again.");
        }
      }
    } else if (authUrl) {
      clearTimeout(resetTimer);
      window.location.href = authUrl;
    } else {
      clearTimeout(resetTimer);
      setPayStatus("error");
      setStatusMessage("Could not connect to Paystack. Please check your connection.");
    }
  };

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32 px-5 pt-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Link to="/checkout" aria-label="Back" style={circle()} className="flex items-center justify-center active:scale-95 transition-transform">
                <ArrowLeft size={18} color="#111" />
              </Link>
              <div className="text-[15px] font-semibold text-gray-900 tracking-tight">Checkout</div>
              <div style={circle()} className="flex items-center justify-center">
                <ShieldCheck size={17} className="text-emerald-500" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <Progress step={3} labels={["Cart", "Checkout", "Payment"]} />
            </div>

            {/* Title */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-950 tracking-tight">Review & Pay</h1>
              <p className="text-xs text-gray-500 mt-0.5">Secure payment via Paystack</p>
            </div>

            {/* Status Feedback banner */}
            {payStatus !== "idle" && (
              <div className="mt-3">
                {payStatus === "launching" && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900">
                    <Loader2 size={18} className="animate-spin text-sky-600 shrink-0" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold">Opening Paystack...</p>
                      <p className="text-[11px] text-sky-700">Authorise on your phone or card.</p>
                    </div>
                    {directPayUrl && (
                      <a
                        href={directPayUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-sky-600 underline flex items-center gap-1"
                      >
                        Open <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                )}

                {payStatus === "verifying" && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900">
                    <Loader2 size={18} className="animate-spin text-amber-600 shrink-0" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold">Verifying payment...</p>
                      <p className="text-[11px] text-amber-700">Fulfilling order with CJ Dropshipping.</p>
                    </div>
                  </div>
                )}

                {payStatus === "success" && (
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                    <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold">Payment Verified!</p>
                      <p className="text-[11px] text-emerald-700">{statusMessage || "Redirecting to your receipt..."}</p>
                    </div>
                  </div>
                )}

                {payStatus === "error" && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-900 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <AlertCircle size={15} className="text-red-600 shrink-0" />
                      <span>{statusMessage}</span>
                    </div>
                    <button
                      onClick={handleLaunchPaystack}
                      className="text-xs font-bold text-red-700 underline flex items-center gap-1"
                    >
                      <RefreshCw size={11} /> Try again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Compact Order Summary Card */}
            <div className="mt-3.5 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                <span className="font-bold text-gray-900">Order Summary ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
                {shippingAddress?.city && (
                  <span className="text-gray-500 text-[11px]">Ship to {shippingAddress.city}</span>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-800 font-medium">₵{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Worldwide Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-950 pt-1 border-t border-gray-50">
                  <span>Total</span>
                  <span className="text-base text-gray-950 tracking-tight">₵{activeTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Discreet test switcher for MTN limit verification */}
              <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">
                  {useTestAmount ? "Testing at ₵5 (MoMo friendly)" : "Standard amount"}
                </span>
                <button
                  type="button"
                  onClick={() => setUseTestAmount(!useTestAmount)}
                  className="px-2 py-0.5 rounded-md font-semibold text-[10.5px] transition-colors border"
                  style={{
                    backgroundColor: useTestAmount ? "#EFF6FF" : "#F3F4F6",
                    borderColor: useTestAmount ? "#93C5FD" : "#E5E7EB",
                    color: useTestAmount ? "#1D4ED8" : "#4B5563",
                  }}
                >
                  {useTestAmount ? "Reset to ₵" + total.toLocaleString() : "Test with ₵5"}
                </button>
              </div>
            </div>

            {/* Compact Paystack Payment Card */}
            <div className="mt-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 font-bold text-xs">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      Paystack
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">Live</span>
                    </div>
                    <p className="text-[11px] text-gray-500">MTN MoMo, Telecel, Card, Bank</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </div>
              </div>

              {/* Supported payment pills */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-gray-100">
                <span className="text-[10.5px] font-medium px-2 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-100 flex items-center gap-1">
                  <Smartphone size={10} className="text-amber-600" /> MTN MoMo
                </span>
                <span className="text-[10.5px] font-medium px-2 py-1 rounded-md bg-red-50 text-red-900 border border-red-100 flex items-center gap-1">
                  <Smartphone size={10} className="text-red-600" /> Telecel
                </span>
                <span className="text-[10.5px] font-medium px-2 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-100 flex items-center gap-1">
                  <CreditCard size={10} className="text-blue-600" /> Card / Visa
                </span>
              </div>
            </div>

            {/* Note on MTN Limits & MoMo Approvals */}
            <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Smartphone size={13} className="text-amber-600 shrink-0" />
                <span>MTN MoMo Payment Tips</span>
              </div>
              <p className="text-amber-900 leading-relaxed">
                &bull; <strong>No pop-up?</strong> Dial <code className="font-bold bg-amber-100/80 px-1 py-0.5 rounded text-amber-950">*170#</code> &rarr; <strong>6</strong> (My Wallet) &rarr; <strong>3</strong> (My Approvals).
              </p>
              <p className="text-amber-900 leading-relaxed">
                &bull; <strong>Amounts over ₵2,000:</strong> Bank of Ghana limits Tier 1 wallets to ₵2,000/day. Use <strong>Card (Visa/Mastercard)</strong> for amounts above ₵2,000.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Pay Bar */}
        <div className="absolute left-4 right-4 z-20" style={{ bottom: 18 }}>
          <div
            className="flex items-center gap-3 px-4"
            style={{
              height: 60,
              borderRadius: 20,
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 14px 30px -10px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px] text-gray-500 font-medium">To Pay</div>
              <div className="text-base font-bold text-gray-900 truncate">₵{activeTotal.toLocaleString()}</div>
            </div>
            <button
              onClick={handleLaunchPaystack}
              disabled={payStatus === "launching" || payStatus === "verifying"}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#00C3F7] hover:bg-[#00b0df] active:scale-95 transition-transform disabled:opacity-50 cursor-pointer shadow-md shadow-sky-500/20"
            >
              {payStatus === "launching" ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Opening...</span>
                </>
              ) : payStatus === "verifying" ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock size={12} />
                  <span>Pay Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function circle() {
  return {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 4px 10px -4px rgba(17,17,17,0.1)",
  } as const;
}
