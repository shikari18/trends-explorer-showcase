import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, ShieldCheck, Lock, Check, CreditCard, Tag, Loader2,
  Smartphone, AlertCircle, CheckCircle2, XCircle, RefreshCw, PhoneCall,
} from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { Progress } from "./checkout";
import {
  serverChargeCard,
  serverSubmitOtp,
  serverChargeMobileMoney,
  serverVerifyPaystackRef,
  serverVerifyAndFulfillOrder,
} from "@/lib/cjApi";

export const Route = createFileRoute("/payment")({
  component: Payment,
  head: () => ({ meta: [{ title: "Trends — Payment" }] }),
});

type Method = "visa" | "momo" | "telecel" | "paystack";
type PayStatus = "idle" | "processing" | "otp" | "waiting_momo" | "success" | "failed" | "declined" | "insufficient";

function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("visa");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [momoNumber, setMomoNumber] = useState("");
  const [userEmail, setUserEmail] = useState("customer@trendsshop.com");
  const [shippingAddress, setShippingAddress] = useState<any>(null);

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardErrors, setCardErrors] = useState<{ [k: string]: string }>({});

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Payment flow state
  const [payStatus, setPayStatus] = useState<PayStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [currentRef, setCurrentRef] = useState("");
  const [momoPolling, setMomoPolling] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [isCheckingManually, setIsCheckingManually] = useState(false);
  const pollInterval = useRef<any>(null);

  // Helper to update payment status and persist active state across app switching
  const updatePayState = (status: PayStatus, msg = "", ref = currentRef) => {
    setPayStatus(status);
    setStatusMessage(msg);
    if (ref) setCurrentRef(ref);
    if (typeof window !== "undefined") {
      if (status === "otp" || status === "waiting_momo") {
        try {
          sessionStorage.setItem("trends_active_payment", JSON.stringify({
            status,
            message: msg,
            reference: ref,
            method,
            momoNumber,
            timestamp: Date.now(),
          }));
        } catch {}
      } else {
        try {
          sessionStorage.removeItem("trends_active_payment");
        } catch {}
      }
    }
  };

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
        try { const u = JSON.parse(savedUser); if (u.email) setUserEmail(u.email); if (u.name) setCardHolder(u.name); } catch {}
      }
      const savedAddress = localStorage.getItem("shippingAddress");
      if (savedAddress) {
        try {
          const addr = JSON.parse(savedAddress);
          setShippingAddress(addr);
          if (addr.phone) setMomoNumber(addr.phone);
          if (addr.name && !cardHolder) setCardHolder(addr.name);
        } catch {}
      }

      // Check if user was in the middle of OTP or MoMo when switching apps
      try {
        const active = sessionStorage.getItem("trends_active_payment");
        if (active) {
          const parsed = JSON.parse(active);
          // If within last 24 hours, restore the active payment screen
          if (parsed && parsed.reference && (Date.now() - (parsed.timestamp || 0) < 24 * 60 * 60 * 1000)) {
            setCurrentRef(parsed.reference);
            setPayStatus(parsed.status);
            setStatusMessage(parsed.message || "");
            if (parsed.method) setMethod(parsed.method);
            if (parsed.momoNumber) setMomoNumber(parsed.momoNumber);
            if (parsed.status === "waiting_momo") {
              startMomoPoll(parsed.reference);
            }
          } else {
            sessionStorage.removeItem("trends_active_payment");
          }
        }
      } catch {}
    }
    return () => { if (pollInterval.current) clearInterval(pollInterval.current); };
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

  // Card formatters
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    setCardNumber(raw.replace(/(\d{4})/g, "$1 ").trim());
    if (cardErrors.cardNumber) setCardErrors(p => ({ ...p, cardNumber: "" }));
  };
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    setCardExpiry(raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2, 4)}` : raw);
    if (cardErrors.cardExpiry) setCardErrors(p => ({ ...p, cardExpiry: "" }));
  };
  const handleCvvChange = (val: string) => {
    setCardCvv(val.replace(/\D/g, "").slice(0, 4));
    if (cardErrors.cardCvv) setCardErrors(p => ({ ...p, cardCvv: "" }));
  };
  const getCardBrand = (num: string) => {
    const c = num.replace(/\s/g, "");
    if (c.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(c) || /^2[2-7]/.test(c)) return "MC";
    if (/^3[47]/.test(c)) return "AMEX";
    return null;
  };
  const validateCard = () => {
    const errors: { [k: string]: string } = {};
    if (cardNumber.replace(/\s/g, "").length < 15) errors.cardNumber = "Enter a valid card number";
    if (!cardHolder.trim()) errors.cardHolder = "Enter cardholder name";
    if (cardExpiry.length < 5) errors.cardExpiry = "MM/YY required";
    if (cardCvv.length < 3) errors.cardCvv = "3–4 digits required";
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const makeRef = () => "TRD-" + Date.now() + "-" + Math.floor(Math.random() * 9999);

  // ── Translate Paystack status to human message ──
  const friendlyMessage = (status: string, msg: string): { text: string; type: PayStatus } => {
    const s = (status || "").toLowerCase();
    const m = (msg || "").toLowerCase();
    if (s === "success") return { text: "Payment successful! 🎉", type: "success" };
    if (s === "send_otp" || s === "send_phone" || s === "send_birthday" || s === "send_pin")
      return { text: msg || "Enter the OTP sent to your phone to complete payment.", type: "otp" };
    if (m.includes("insufficient") || m.includes("not enough") || m.includes("balance"))
      return { text: "Insufficient funds — please top up your account and try again.", type: "insufficient" };
    if (m.includes("declined") || m.includes("invalid") || m.includes("failed") || s === "failed")
      return { text: msg || "Payment declined. Check your details and try again.", type: "declined" };
    if (m.includes("limit"))
      return { text: "Payment limit reached. Try another number or contact your bank.", type: "declined" };
    if (s === "ongoing" || s === "pending")
      return { text: "Waiting for your approval on the phone...", type: "waiting_momo" };
    return { text: msg || "Something went wrong. Please try again.", type: "failed" };
  };

  // ── After a successful payment reference, finalize order with CJ ──
  const finalizeOrder = async (reference: string) => {
    setPayStatus("success");
    setStatusMessage("Payment confirmed! Placing your CJ order...");
    try {
      const result = await serverVerifyAndFulfillOrder({
        data: {
          paystackReference: reference,
          orderNumber: reference,
          shippingName: shippingAddress?.name || cardHolder || "Customer",
          shippingPhone: shippingAddress?.phone || momoNumber || "0240000000",
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
      }
    } catch {}
    setTimeout(() => navigate({ to: "/order-success" }), 1200);
  };

  // ── Instant recheck when user switches back from dialer to tab ──
  useEffect(() => {
    if (payStatus !== "waiting_momo" || !currentRef) return;
    const handleRecheck = async () => {
      if (document.visibilityState === "visible") {
        try {
          const res = await serverVerifyPaystackRef({ data: currentRef });
          if (res.verified || res.status === "success") {
            if (pollInterval.current) clearInterval(pollInterval.current);
            setMomoPolling(false);
            await finalizeOrder(currentRef);
          }
        } catch {}
      }
    };
    window.addEventListener("focus", handleRecheck);
    document.addEventListener("visibilitychange", handleRecheck);
    return () => {
      window.removeEventListener("focus", handleRecheck);
      document.removeEventListener("visibilitychange", handleRecheck);
    };
  }, [payStatus, currentRef]);

  // ── Poll MoMo status until success (Never auto-fail or decline while waiting) ──
  const startMomoPoll = (reference: string) => {
    setMomoPolling(true);
    if (pollInterval.current) clearInterval(pollInterval.current);
    pollInterval.current = setInterval(async () => {
      try {
        const res = await serverVerifyPaystackRef({ data: reference });
        if (res.verified || res.status === "success") {
          clearInterval(pollInterval.current);
          setMomoPolling(false);
          await finalizeOrder(reference);
        }
        // If not yet verified, keep waiting patiently.
        // Never trigger "declined" or "failed" in the background!
      } catch {
        // Ignore temporary network blips while polling
      }
    }, 4000);
  };

  // ── Manual check button for user after approving in *170# ──
  const handleManualCheckStatus = async () => {
    if (!currentRef || isCheckingManually) return;
    setIsCheckingManually(true);
    try {
      const res = await serverVerifyPaystackRef({ data: currentRef });
      if (res.verified || res.status === "success") {
        if (pollInterval.current) clearInterval(pollInterval.current);
        setMomoPolling(false);
        await finalizeOrder(currentRef);
      } else {
        const { toast } = await import("sonner");
        toast.info("Awaiting approval. If you just entered your PIN in *170#, please wait 3-5 seconds and tap again.");
      }
    } catch {
      const { toast } = await import("sonner");
      toast.error("Could not check payment status. Please check your internet connection.");
    } finally {
      setIsCheckingManually(false);
    }
  };

  // ── Fallback to official Paystack popup modal if network push fails ──
  const handleOpenPaystackPopup = async () => {
    if (pollInterval.current) clearInterval(pollInterval.current);
    setMomoPolling(false);
    try {
      await new Promise<void>((resolve) => {
        if ((window as any).PaystackPop) return resolve();
        const s = document.createElement("script");
        s.src = "https://js.paystack.co/v1/inline.js";
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      });
      const key = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string) || "pk_live_4ee89791424f3443c50d3d7295a996a29fdeeeec";
      const pop = (window as any).PaystackPop;
      if (pop?.setup) {
        const handler = pop.setup({
          key, email: userEmail,
          amount: Math.round(total * 100), currency: "GHS", ref: currentRef || makeRef(),
          onClose: () => {},
          callback: (response: any) => finalizeOrder(response?.reference || currentRef),
        });
        handler?.openIframe?.();
      }
    } catch {}
  };

  // ── Main Pay Handler ──
  const handleProcessPayment = async () => {
    if (payStatus === "processing" || payStatus === "waiting_momo") return;
    updatePayState("processing", "");

    if (method === "visa") {
      if (!validateCard()) { updatePayState("idle", ""); return; }
      const [mm, yy] = cardExpiry.split("/");
      const ref = makeRef();
      setCurrentRef(ref);
      try {
        const res = await serverChargeCard({
          data: {
            email: userEmail,
            amountGHS: total,
            cardNumber,
            expiryMonth: mm,
            expiryYear: yy.length === 2 ? "20" + yy : yy,
            cvv: cardCvv,
            reference: ref,
          },
        });
        if (res.status === "success") {
          await finalizeOrder(res.reference || ref);
        } else if (res.status === "send_otp" || res.status === "send_pin" || res.status === "send_phone") {
          updatePayState("otp", res.message || res.displayText || "Enter the OTP code sent to your phone to verify your card.", res.reference || ref);
        } else {
          const f = friendlyMessage(res.status, res.message || res.displayText);
          updatePayState(f.type, f.text, res.reference || ref);
        }
      } catch (e: any) {
        updatePayState("failed", "Payment failed. Please check your connection and try again.", ref);
      }
      return;
    }

    if (method === "momo" || method === "telecel") {
      if (!momoNumber.trim() || momoNumber.replace(/\D/g, "").length < 9) {
        updatePayState("idle", "");
        import("sonner").then(({ toast }) => toast.error("Enter a valid phone number."));
        return;
      }
      const ref = makeRef();
      setCurrentRef(ref);
      const provider = method === "momo" ? "mtn" : "vod";
      try {
        const res = await serverChargeMobileMoney({
          data: {
            email: userEmail,
            amountGHS: total,
            phone: momoNumber,
            provider,
            reference: ref,
          },
        });
        if (res.status === "success") {
          await finalizeOrder(res.reference || ref);
        } else if (res.status === "send_otp") {
          // CRITICAL: If network sent an OTP via SMS (e.g. Telecel/Vodafone or SMS authorization),
          // SHOW THE OTP INPUT SCREEN so the customer can type/paste their OTP!
          updatePayState("otp", res.message || res.displayText || `Enter the OTP code sent to ${momoNumber} to approve this payment.`, res.reference || ref);
        } else {
          updatePayState("waiting_momo", res.message || res.displayText || `A payment prompt has been sent to ${momoNumber}. Enter your PIN to approve.`, res.reference || ref);
          startMomoPoll(res.reference || ref);
        }
      } catch {
        updatePayState("waiting_momo", `Connecting to ${method === "momo" ? "MTN" : "Telecel"}... Check your phone for prompt.`, ref);
        startMomoPoll(ref);
      }
      return;
    }

    // Paystack option — open popup only if user explicitly chose it
    try {
      await new Promise<void>((resolve) => {
        if ((window as any).PaystackPop) return resolve();
        const s = document.createElement("script");
        s.src = "https://js.paystack.co/v1/inline.js";
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      });
      const ref = makeRef();
      setCurrentRef(ref);
      const key = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string) || "pk_live_4ee89791424f3443c50d3d7295a996a29fdeeeec";
      const pop = (window as any).PaystackPop;
      if (pop?.setup) {
        const handler = pop.setup({
          key, email: userEmail,
          amount: Math.round(total * 100), currency: "GHS", ref,
          onClose: () => updatePayState("idle", ""),
          callback: (response: any) => finalizeOrder(response?.reference || ref),
        });
        handler?.openIframe?.();
      }
    } catch { updatePayState("idle", ""); }
  };

  // ── Submit OTP (for card 3DS or MoMo SMS verification) ──
  const handleSubmitOtp = async () => {
    if (!otpValue.trim() || isSubmittingOtp) return;
    setIsSubmittingOtp(true);
    setStatusMessage("Verifying OTP with your bank...");
    try {
      const res = await serverSubmitOtp({ data: { otp: otpValue.trim(), reference: currentRef } });
      if (res.status === "success") {
        await finalizeOrder(res.reference || currentRef);
      } else if (res.status === "send_otp") {
        setIsSubmittingOtp(false);
        updatePayState("otp", res.message || res.displayText || "Invalid OTP code. Please check and try again.", currentRef);
      } else {
        // Any other response means OTP passed and prompt is active! Transition directly to waiting_momo
        setIsSubmittingOtp(false);
        updatePayState("waiting_momo", res.message || res.displayText || "OTP verified! Please authorize the prompt or dial *170#.", currentRef);
        startMomoPoll(res.reference || currentRef);
      }
    } catch {
      setIsSubmittingOtp(false);
      updatePayState("waiting_momo", "OTP submitted! Please authorize the prompt or dial *170# on your phone.", currentRef);
      startMomoPoll(currentRef);
    }
  };

  const cardBrand = getCardBrand(cardNumber);
  const isProcessing = payStatus === "processing" || payStatus === "waiting_momo";

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

            {/* ── Payment Status Block ── */}
            {payStatus !== "idle" && (
              <div className="px-5 mt-5">
                {/* Processing */}
                {payStatus === "processing" && (
                  <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-blue-50 border border-blue-100">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <div className="text-sm font-bold text-blue-900">Processing payment...</div>
                    <div className="text-xs text-blue-700 text-center">Connecting securely to your bank. Please wait.</div>
                  </div>
                )}

                {/* Waiting for MoMo approval */}
                {payStatus === "waiting_momo" && (
                  <div className="flex flex-col items-center gap-3.5 p-5 rounded-3xl text-center" style={{ background: method === "momo" ? "#FFFDF5" : "#FDF8F8", border: `1.5px solid ${method === "momo" ? "#FFCC00" : "#F9A8A8"}` }}>
                    <div className="rounded-full flex items-center justify-center shadow-sm" style={{ background: method === "momo" ? "#FFCC00" : "#E30613", width: 52, height: 52 }}>
                      <Smartphone size={24} color={method === "momo" ? "#111" : "#fff"} className="animate-pulse" />
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: method === "momo" ? "#7A5000" : "#8B0000" }}>
                        {method === "momo" ? "📲 MTN MoMo Authorization" : "📲 Telecel Authorization"}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Amount: <strong className="text-gray-900">₵{total.toLocaleString()}</strong> &bull; <span className="font-semibold text-gray-800">{momoNumber}</span>
                      </div>
                    </div>

                    {/* Step-by-step instructions */}
                    <div className="bg-white rounded-2xl p-3.5 text-xs text-left space-y-2 w-full border border-gray-100 shadow-sm">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5 text-[12px]">
                        <AlertCircle size={14} className="text-amber-500 shrink-0" />
                        {method === "momo" ? "Didn't receive the prompt on your screen?" : "Didn't receive the prompt?"}
                      </div>
                      {method === "momo" ? (
                        <div className="text-[11.5px] text-gray-600 space-y-1.5 leading-relaxed">
                          <p className="text-gray-700">MTN pop-ups can be delayed by network congestion. You can approve immediately via USSD:</p>
                          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 font-medium text-amber-950 space-y-1">
                            <div>1. Dial <strong className="font-bold text-black">*170#</strong></div>
                            <div>2. Choose <strong className="font-bold text-black">6 (My Wallet)</strong></div>
                            <div>3. Choose <strong className="font-bold text-black">3 (My Approvals)</strong></div>
                            <div>4. Enter your MoMo PIN & select <strong>1 to Approve</strong></div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11.5px] text-gray-600 space-y-1.5 leading-relaxed">
                          <p className="text-gray-700">Telecel prompt delayed? Approve directly:</p>
                          <div className="bg-red-50 border border-red-200/80 rounded-xl p-2.5 font-medium text-red-950 space-y-1">
                            <div>1. Dial <strong className="font-bold text-black">*110#</strong></div>
                            <div>2. Check pending approvals & enter your PIN</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="w-full space-y-2">
                      <a
                        href={method === "momo" ? "tel:*170%23" : "tel:*110%23"}
                        className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-opacity active:opacity-80"
                        style={{ background: method === "momo" ? "#111" : "#E30613" }}
                      >
                        <PhoneCall size={14} />
                        {method === "momo" ? "Tap to Dial *170# to Approve" : "Tap to Dial *110# to Approve"}
                      </a>

                      <button
                        type="button"
                        onClick={handleManualCheckStatus}
                        disabled={isCheckingManually}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 shadow-xs"
                      >
                        <RefreshCw size={13} className={isCheckingManually ? "animate-spin text-blue-600" : "text-gray-500"} />
                        {isCheckingManually ? "Checking authorization..." : "I've Approved — Check Status Now"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-0.5">
                      <Loader2 size={12} className="animate-spin text-amber-600" />
                      Auto-checking every 5s (updates instantly when approved)
                    </div>

                    <div className="flex items-center justify-center gap-3 text-xs pt-1">
                      <button
                        type="button"
                        onClick={handleOpenPaystackPopup}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Use Paystack Portal instead
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => { if (pollInterval.current) clearInterval(pollInterval.current); updatePayState("idle", ""); }}
                        className="text-red-500 font-semibold hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Input */}
                {payStatus === "otp" && (
                  <div className="flex flex-col gap-3 p-5 rounded-3xl bg-indigo-50 border border-indigo-100">
                    <div className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-indigo-600" />
                      One-Time Password Required
                    </div>
                    <div className="text-xs text-indigo-700 leading-relaxed">
                      {statusMessage || "Enter the OTP code sent to your phone or email to complete payment."}
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={10}
                      autoFocus
                      value={otpValue}
                      onChange={e => setOtpValue(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter OTP code"
                      className="px-4 py-3 rounded-xl text-center text-xl font-bold tracking-widest bg-white border border-indigo-200 outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleSubmitOtp}
                      disabled={otpValue.length < 3 || isSubmittingOtp}
                      className="py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {isSubmittingOtp ? <Loader2 size={16} className="animate-spin" /> : null}
                      {isSubmittingOtp ? "Verifying..." : "Verify & Complete Payment"}
                    </button>
                    <button
                      onClick={() => { updatePayState("idle", ""); setOtpValue(""); }}
                      className="text-xs text-gray-500 font-medium hover:underline"
                    >
                      Cancel & try again
                    </button>
                  </div>
                )}

                {/* Success */}
                {payStatus === "success" && (
                  <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-emerald-50 border border-emerald-100 text-center">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                    <div className="font-bold text-sm text-emerald-900">Payment Successful!</div>
                    <div className="text-xs text-emerald-700">{statusMessage || "Your order is confirmed and being processed."}</div>
                    <Loader2 size={14} className="animate-spin text-emerald-400" />
                  </div>
                )}

                {/* Declined / Failed / Insufficient */}
                {(payStatus === "failed" || payStatus === "declined" || payStatus === "insufficient") && (
                  <div className="flex flex-col gap-3 p-5 rounded-3xl border" style={{ background: payStatus === "insufficient" ? "#FFFBEB" : "#FFF5F5", borderColor: payStatus === "insufficient" ? "#FCD34D" : "#FCA5A5" }}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: payStatus === "insufficient" ? "#FEF3C7" : "#FEE2E2" }}>
                        {payStatus === "insufficient" ? <AlertCircle size={16} className="text-yellow-600" /> : <XCircle size={16} className="text-red-500" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: payStatus === "insufficient" ? "#92400E" : "#991B1B" }}>
                          {payStatus === "insufficient" ? "Insufficient Funds" : payStatus === "declined" ? "Payment Declined" : "Payment Failed"}
                        </div>
                        <div className="text-xs mt-0.5 leading-relaxed" style={{ color: payStatus === "insufficient" ? "#78350F" : "#7F1D1D" }}>
                          {statusMessage}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { updatePayState("idle", ""); setOtpValue(""); }}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white"
                      style={{ background: payStatus === "insufficient" ? "#D97706" : "#DC2626" }}
                    >
                      <RefreshCw size={13} /> Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Payment Method Cards ── (hidden while processing/OTP/waiting) */}
            {(payStatus === "idle" || payStatus === "failed" || payStatus === "declined" || payStatus === "insufficient") && (
              <div className="px-5 mt-6 space-y-3">

                {/* Option 1: Card */}
                <div className="overflow-hidden transition-all duration-300" style={{
                  borderRadius: 22, background: "#fff",
                  boxShadow: method === "visa"
                    ? "0 0 0 2px #0F62FE, 0 14px 30px -14px rgba(15,98,254,0.35)"
                    : "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}>
                  <button type="button" onClick={() => setMethod("visa")} className="w-full flex items-center gap-3 p-4 cursor-pointer">
                    <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(15,98,254,0.08)" }}>
                      <CreditCard size={22} className="text-blue-600" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>Credit / Debit Card</div>
                      <div style={{ fontSize: 12, color: "#666" }}>Direct charge — no external popup</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 text-[10px] font-bold text-gray-400">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">VISA</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">MC</span>
                      </div>
                      {method === "visa"
                        ? <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, background: "#0F62FE" }}><Check size={13} color="#fff" strokeWidth={3} /></div>
                        : <div style={{ width: 22, height: 22, borderRadius: 999, boxShadow: "inset 0 0 0 1.5px rgba(17,17,17,0.15)" }} />}
                    </div>
                  </button>

                  {method === "visa" && (
                    <div className="px-4 pb-5 pt-1 border-t border-gray-100 animate-fadeIn space-y-3">
                      {/* Card Number */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11.5px] font-bold text-gray-700">Card Number</label>
                          {cardBrand && <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{cardBrand}</span>}
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="text" inputMode="numeric" placeholder="4000 1234 5678 9010"
                            value={cardNumber} onChange={e => handleCardNumberChange(e.target.value)}
                            className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wider bg-gray-50 outline-none border transition-colors ${cardErrors.cardNumber ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600 focus:bg-white"}`}
                          />
                          <div className="absolute right-3.5 text-gray-400"><Lock size={13} /></div>
                        </div>
                        {cardErrors.cardNumber && <span className="text-[10.5px] text-red-500 mt-1 block font-medium">{cardErrors.cardNumber}</span>}
                      </div>

                      {/* Cardholder */}
                      <div>
                        <label className="text-[11.5px] font-bold text-gray-700 mb-1 block">Cardholder Name</label>
                        <input
                          type="text" placeholder="e.g. Ama Mensah" value={cardHolder}
                          onChange={e => { setCardHolder(e.target.value); if (cardErrors.cardHolder) setCardErrors(p => ({ ...p, cardHolder: "" })); }}
                          className={`w-full px-3.5 py-3 rounded-xl text-xs font-medium bg-gray-50 outline-none border transition-colors ${cardErrors.cardHolder ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600 focus:bg-white"}`}
                        />
                        {cardErrors.cardHolder && <span className="text-[10.5px] text-red-500 mt-1 block font-medium">{cardErrors.cardHolder}</span>}
                      </div>

                      {/* Expiry + CVV */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11.5px] font-bold text-gray-700 mb-1 block">Expiry Date</label>
                          <input
                            type="text" inputMode="numeric" placeholder="MM/YY" value={cardExpiry}
                            onChange={e => handleExpiryChange(e.target.value)}
                            className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold text-center bg-gray-50 outline-none border transition-colors ${cardErrors.cardExpiry ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600 focus:bg-white"}`}
                          />
                          {cardErrors.cardExpiry && <span className="text-[10.5px] text-red-500 mt-1 block font-medium">{cardErrors.cardExpiry}</span>}
                        </div>
                        <div>
                          <label className="text-[11.5px] font-bold text-gray-700 mb-1 block">CVV / CVC</label>
                          <input
                            type="password" inputMode="numeric" placeholder="•••" maxLength={4} value={cardCvv}
                            onChange={e => handleCvvChange(e.target.value)}
                            className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold text-center tracking-widest bg-gray-50 outline-none border transition-colors ${cardErrors.cardCvv ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600 focus:bg-white"}`}
                          />
                          {cardErrors.cardCvv && <span className="text-[10.5px] text-red-500 mt-1 block font-medium">{cardErrors.cardCvv}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                        <Lock size={12} className="text-emerald-600" />
                        <span>256-bit encrypted direct connection to Paystack</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 2: MTN MoMo */}
                <div className="overflow-hidden transition-all duration-300" style={{
                  borderRadius: 22, background: "#fff",
                  boxShadow: method === "momo"
                    ? "0 0 0 2px #FFCC00, 0 14px 30px -14px rgba(255,204,0,0.4)"
                    : "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}>
                  <button type="button" onClick={() => setMethod("momo")} className="w-full flex items-center gap-3 p-4 cursor-pointer">
                    <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 14, background: "#FFF9E6" }}>
                      <MoMoLogo />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>MTN Mobile Money</div>
                      <div style={{ fontSize: 12, color: "#666" }}>Instant USSD prompt sent to your phone</div>
                    </div>
                    {method === "momo"
                      ? <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, background: "#FFCC00" }}><Check size={13} color="#111" strokeWidth={3} /></div>
                      : <div style={{ width: 22, height: 22, borderRadius: 999, boxShadow: "inset 0 0 0 1.5px rgba(17,17,17,0.15)" }} />}
                  </button>
                  {method === "momo" && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2">
                      <label className="text-[11.5px] font-bold text-gray-700 block">MTN MoMo Number</label>
                      <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:border-yellow-500 focus-within:bg-white transition-colors">
                        <span className="text-xs font-bold text-gray-500">🇬🇭 +233</span>
                        <input type="tel" value={momoNumber} onChange={e => setMomoNumber(e.target.value)} placeholder="024 XXX XXXX" className="flex-1 bg-transparent text-xs font-bold text-gray-900 outline-none" />
                      </div>
                      <p className="text-[11px] text-gray-500">A payment authorization prompt will pop up on this phone. Enter your PIN to finish.</p>
                    </div>
                  )}
                </div>

                {/* Option 3: Telecel */}
                <div className="overflow-hidden transition-all duration-300" style={{
                  borderRadius: 22, background: "#fff",
                  boxShadow: method === "telecel"
                    ? "0 0 0 2px #E30613, 0 14px 30px -14px rgba(227,6,19,0.3)"
                    : "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}>
                  <button type="button" onClick={() => setMethod("telecel")} className="w-full flex items-center gap-3 p-4 cursor-pointer">
                    <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 14, background: "#FDE8E9" }}>
                      <TelecelLogo />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>Telecel Cash</div>
                      <div style={{ fontSize: 12, color: "#666" }}>Instant prompt to your Telecel wallet</div>
                    </div>
                    {method === "telecel"
                      ? <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, background: "#E30613" }}><Check size={13} color="#fff" strokeWidth={3} /></div>
                      : <div style={{ width: 22, height: 22, borderRadius: 999, boxShadow: "inset 0 0 0 1.5px rgba(17,17,17,0.15)" }} />}
                  </button>
                  {method === "telecel" && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2">
                      <label className="text-[11.5px] font-bold text-gray-700 block">Telecel Cash Number</label>
                      <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:border-red-500 focus-within:bg-white transition-colors">
                        <span className="text-xs font-bold text-gray-500">🇬🇭 +233</span>
                        <input type="tel" value={momoNumber} onChange={e => setMomoNumber(e.target.value)} placeholder="027 XXX XXXX" className="flex-1 bg-transparent text-xs font-bold text-gray-900 outline-none" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 4: Paystack Portal */}
                <div className="overflow-hidden transition-all duration-300" style={{
                  borderRadius: 22, background: "#fff",
                  boxShadow: method === "paystack"
                    ? "0 0 0 2px #00C3F7, 0 14px 30px -14px rgba(0,195,247,0.35)"
                    : "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}>
                  <button type="button" onClick={() => setMethod("paystack")} className="w-full flex items-center gap-3 p-4 cursor-pointer">
                    <div className="flex items-center justify-center shrink-0" style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(0,195,247,0.08)" }}>
                      <PaystackLogo />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>Paystack Portal Popup</div>
                      <div style={{ fontSize: 12, color: "#666" }}>Open the official Paystack popup modal</div>
                    </div>
                    {method === "paystack"
                      ? <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, background: "#00C3F7" }}><Check size={13} color="#fff" strokeWidth={3} /></div>
                      : <div style={{ width: 22, height: 22, borderRadius: 999, boxShadow: "inset 0 0 0 1.5px rgba(17,17,17,0.15)" }} />}
                  </button>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="px-5 mt-5">
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
          </div>
        </div>

        {/* Sticky Pay Bar */}
        {(payStatus === "idle" || payStatus === "failed" || payStatus === "declined" || payStatus === "insufficient") && (
          <div className="absolute left-4 right-4 z-20" style={{ bottom: 18 }}>
            <div className="flex items-center gap-3 pl-5 pr-2" style={{ height: 66, borderRadius: 24, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(28px) saturate(160%)", boxShadow: "0 20px 40px -14px rgba(17,17,17,0.22), inset 0 0 0 1px rgba(255,255,255,0.6)" }}>
              <div className="flex-1">
                <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.3, fontWeight: 600, textTransform: "uppercase" }}>Total to Pay</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>₵{total.toLocaleString()}</div>
              </div>
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 px-6 disabled:opacity-50 cursor-pointer active:scale-95 transition-transform"
                style={{
                  height: 52, borderRadius: 20,
                  background: method === "momo" ? "#FFCC00" : method === "telecel" ? "#E30613" : "#0F62FE",
                  color: method === "momo" ? "#111" : "#fff",
                  fontSize: 14, fontWeight: 700,
                  boxShadow: "0 12px 24px -8px rgba(15,98,254,0.5)",
                }}
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
                {method === "visa" ? `Pay ₵${total.toLocaleString()}` : method === "momo" ? "Pay with MoMo" : method === "telecel" ? "Pay with Telecel" : "Open Paystack"}
              </button>
            </div>
          </div>
        )}

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function PaystackLogo() {
  return <div style={{ fontWeight: 900, fontSize: 11, color: "#00C3F7", letterSpacing: -0.3 }}>PS+</div>;
}
function MoMoLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="20" fill="#FFCC00" />
      <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fontWeight: 800, fill: "#1A1A1A", fontFamily: "sans-serif" }}>MoMo</text>
    </svg>
  );
}
function TelecelLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="20" fill="#E30613" />
      <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 9, fontWeight: 800, fill: "#FFFFFF", fontFamily: "sans-serif" }}>TCEL</text>
    </svg>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span style={{ color: "#666" }}>{label}</span><span style={{ color: "#111", fontWeight: 600 }}>{value}</span></div>;
}
function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}
