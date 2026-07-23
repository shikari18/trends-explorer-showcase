import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft, ShieldCheck, MapPin, Truck, Package, Check,
  Loader2, User, LogIn, X
} from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { serverPlaceCJOrder } from "@/lib/cjApi";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Trends — Checkout" }] }),
});

// ---------------------------------------------------------------------------
// Minimal Google Identity Services sign-in
// Requires VITE_GOOGLE_CLIENT_ID env variable set in Render
// ---------------------------------------------------------------------------
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string || "";

function loadGsiScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).google?.accounts?.id) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

function parseJwt(token: string): GoogleUser | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return null; }
}

// ---------------------------------------------------------------------------

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Shipping form
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    country: "Ghana",
    countryCode: "GH",
    zip: "00000",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      setCartItems(saved ? JSON.parse(saved) : []);
      // Restore signed-in user
      const u = localStorage.getItem("gUser");
      if (u) {
        const parsed = JSON.parse(u) as GoogleUser;
        setGoogleUser(parsed);
        setForm((f) => ({ ...f, name: parsed.name }));
      }
    }
  }, []);

  // Initialise Google Sign-In
  const initGsi = async () => {
    if (!GOOGLE_CLIENT_ID) return;
    await loadGsiScript();
    const google = (window as any).google;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (resp: { credential: string }) => {
        const user = parseJwt(resp.credential);
        if (user) {
          setGoogleUser(user);
          localStorage.setItem("gUser", JSON.stringify(user));
          setForm((f) => ({ ...f, name: user.name }));
          setShowSignInModal(false);
        }
      },
    });
    setGsiReady(true);
  };

  const handleGoogleSignIn = async () => {
    if (!GOOGLE_CLIENT_ID) {
      // No client ID configured — demo mode
      const demoUser: GoogleUser = {
        name: "Demo User",
        email: "demo@trends.app",
        picture: "",
        sub: "demo-" + Date.now(),
      };
      setGoogleUser(demoUser);
      localStorage.setItem("gUser", JSON.stringify(demoUser));
      setForm((f) => ({ ...f, name: demoUser.name }));
      setShowSignInModal(false);
      return;
    }
    if (!gsiReady) await initGsi();
    (window as any).google.accounts.id.prompt();
  };

  const signOut = () => {
    setGoogleUser(null);
    localStorage.removeItem("gUser");
    setForm((f) => ({ ...f, name: "" }));
  };

  const subtotal = cartItems.reduce((s: number, i: any) => s + i.price * i.qty, 0);
  const shipping = 30;
  const tax = Math.round(subtotal * 0.075);
  const total = subtotal + tax + shipping;

  const handleProceed = () => {
    if (!googleUser) {
      setShowSignInModal(true);
    } else {
      navigate({ to: "/payment" });
    }
  };

  const handlePlaceOrder = async () => {
    if (!googleUser) { setShowSignInModal(true); return; }
    if (!form.phone || !form.address || !form.city) {
      setOrderError("Please fill in your phone, address, and city.");
      return;
    }

    setPlacing(true);
    setOrderError("");

    try {
      const orderNumber = `TRD-${Date.now()}`;
      const products = cartItems.map((item: any) => ({
        vid: item.variantId || item.id,
        quantity: item.qty || 1,
      }));

      const result = await serverPlaceCJOrder({
        data: {
          orderNumber,
          shippingName: form.name || googleUser.name,
          shippingPhone: form.phone,
          shippingAddress: form.address,
          shippingCity: form.city,
          shippingProvince: form.province || form.city,
          shippingCountry: form.country,
          shippingCountryCode: form.countryCode,
          shippingZip: form.zip || "00000",
          products,
        },
      });

      if (result.result) {
        localStorage.removeItem("cart");
        setOrderPlaced(true);
      } else {
        // CJ order may fail if products need specific variant IDs; still navigate to payment
        navigate({ to: "/payment" });
      }
    } catch (err) {
      console.error("Order placement error:", err);
      navigate({ to: "/payment" });
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <PhoneFrame>
        <>
          <StatusBar />
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="flex items-center justify-center" style={{ width: 80, height: 80, borderRadius: 999, background: "rgba(52,199,89,0.12)" }}>
              <Check size={36} color="#34C759" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#111", letterSpacing: -0.7 }}>Order Placed!</div>
              <p className="mt-2" style={{ fontSize: 14, color: "#666", lineHeight: 1.55 }}>
                Your order has been submitted to CJ Dropshipping.<br />You'll receive shipping updates via email.
              </p>
            </div>
            <Link to="/home" className="inline-flex items-center justify-center" style={{ height: 52, padding: "0 32px", borderRadius: 999, background: "#0F62FE", color: "#fff", fontSize: 14, fontWeight: 700 }}>
              Back to Home
            </Link>
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
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-36">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4">
              <Link to="/cart" aria-label="Back" style={circle()} className="flex items-center justify-center">
                <ArrowLeft size={18} color="#111" />
              </Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Checkout</div>
              <button aria-label="Secure" style={circle()} className="flex items-center justify-center">
                <ShieldCheck size={17} color="#0F62FE" />
              </button>
            </div>

            <div className="px-6 mt-5">
              <h1 style={{ fontSize: 30, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Almost there</h1>
              <p className="mt-1" style={{ fontSize: 13.5, color: "#666", letterSpacing: -0.1 }}>
                Sign in and confirm your details to continue.
              </p>
            </div>

            {/* Progress */}
            <div className="px-6 mt-6">
              <Progress step={2} labels={["Cart", "Checkout", "Payment"]} />
            </div>

            {/* Sign In Card */}
            <div className="px-5 mt-6">
              <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                {googleUser ? (
                  <div className="flex items-center gap-3">
                    {googleUser.picture ? (
                      <img src={googleUser.picture} alt={googleUser.name} className="rounded-full object-cover" style={{ width: 42, height: 42 }} />
                    ) : (
                      <div className="flex items-center justify-center" style={{ width: 42, height: 42, borderRadius: 999, background: "rgba(15,98,254,0.1)" }}>
                        <User size={20} color="#0F62FE" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{googleUser.name}</div>
                      <div className="truncate" style={{ fontSize: 12, color: "#8A8A8A" }}>{googleUser.email}</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5" style={{ height: 26, borderRadius: 999, background: "rgba(52,199,89,0.1)" }}>
                      <Check size={10} color="#34C759" strokeWidth={3} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#34C759" }}>Signed in</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>Sign in to continue</div>
                    <button
                      onClick={() => setShowSignInModal(true)}
                      className="w-full flex items-center justify-center gap-3 active:scale-95 transition-all"
                      style={{ height: 48, borderRadius: 16, background: "#fff", boxShadow: "inset 0 0 0 1.5px rgba(17,17,17,0.12)", fontSize: 14, fontWeight: 600, color: "#111" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Form */}
            <div className="px-5 mt-4">
              <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={14} color="#0F62FE" />
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.4, textTransform: "uppercase" }}>Delivery Details</div>
                </div>
                {[
                  { key: "phone", label: "Phone Number", placeholder: "+233 XX XXX XXXX" },
                  { key: "address", label: "Street Address", placeholder: "24 Oxford Street" },
                  { key: "city", label: "City", placeholder: "Accra" },
                  { key: "province", label: "Region / Province", placeholder: "Greater Accra" },
                  { key: "zip", label: "Postal Code (optional)", placeholder: "00000" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="mb-3">
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#8A8A8A", marginBottom: 5, letterSpacing: 0.2 }}>{label}</div>
                    <input
                      value={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full outline-none"
                      style={{ height: 44, padding: "0 14px", borderRadius: 14, background: "#F7F7F5", fontSize: 14, color: "#111", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery method */}
            <div className="px-5 mt-4">
              <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Delivery Method</div>
                <div className="mt-3 flex items-center gap-3 p-3" style={{ borderRadius: 18, background: "rgba(15,98,254,0.06)", boxShadow: "inset 0 0 0 1.5px rgba(15,98,254,0.3)" }}>
                  <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(15,98,254,0.12)" }}>
                    <Truck size={17} color="#0F62FE" />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>CJ Express Delivery</div>
                    <div style={{ fontSize: 11.5, color: "#666" }}>7–15 Business Days · Ships from CJ Warehouse</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>₵30</div>
                    <div className="flex items-center justify-center" style={{ width: 20, height: 20, borderRadius: 999, background: "#0F62FE" }}>
                      <Check size={12} color="#fff" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="px-5 mt-4">
              <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Order Summary</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{cartItems.length} Items</div>
                </div>
                <div className="mt-3 space-y-2" style={{ fontSize: 13.5 }}>
                  <Row label="Subtotal" value={`₵${subtotal.toLocaleString()}`} />
                  <Row label="Shipping" value={`₵${shipping.toLocaleString()}`} />
                  <Row label="Tax (7.5%)" value={`₵${tax.toLocaleString()}`} />
                </div>
                <div className="my-3" style={{ height: 1, background: "rgba(17,17,17,0.06)" }} />
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 14, color: "#666" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: -0.6 }}>₵{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* CJ products notice */}
            <div className="px-5 mt-3">
              <div className="flex items-center gap-2.5 p-3.5" style={{ borderRadius: 18, background: "rgba(15,98,254,0.04)", boxShadow: "inset 0 0 0 1px rgba(15,98,254,0.1)" }}>
                <Package size={15} color="#0F62FE" />
                <div style={{ fontSize: 12, color: "#444", lineHeight: 1.45 }}>
                  <strong style={{ color: "#0F62FE" }}>Shipped by CJ Dropshipping.</strong> Your order goes directly to CJ's warehouse and ships worldwide. Millions of products available.
                </div>
              </div>
            </div>

            {orderError && (
              <div className="px-5 mt-3">
                <div style={{ fontSize: 13, color: "#FF3B30", padding: "10px 14px", borderRadius: 14, background: "rgba(255,59,48,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,59,48,0.15)" }}>
                  {orderError}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky bottom bar */}
        <div className="absolute left-4 right-4" style={{ bottom: 18 }}>
          <div className="flex items-center gap-3 pl-5 pr-2" style={{ height: 66, borderRadius: 24, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(28px) saturate(160%)", boxShadow: "0 20px 40px -14px rgba(17,17,17,0.22), inset 0 0 0 1px rgba(255,255,255,0.6)" }}>
            <div className="flex-1">
              <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.3, fontWeight: 600, textTransform: "uppercase" }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>₵{total.toLocaleString()}</div>
            </div>
            {googleUser ? (
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="inline-flex items-center justify-center gap-2 px-5 active:scale-95 transition-all"
                style={{ height: 52, borderRadius: 20, background: "#0F62FE", color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: -0.2, boxShadow: "0 12px 24px -8px rgba(15,98,254,0.5)", minWidth: 160 }}
              >
                {placing ? <><Loader2 size={16} className="animate-spin" /> Placing...</> : "Place Order →"}
              </button>
            ) : (
              <button
                onClick={() => setShowSignInModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 active:scale-95 transition-all"
                style={{ height: 52, borderRadius: 20, background: "#0F62FE", color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: -0.2, boxShadow: "0 12px 24px -8px rgba(15,98,254,0.5)" }}
              >
                <LogIn size={16} />
                Sign In to Pay
              </button>
            )}
          </div>
        </div>

        {/* Google Sign In Modal */}
        {showSignInModal && (
          <div className="absolute inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
            <div className="w-full p-5 pb-8" style={{ borderRadius: "28px 28px 0 0", background: "#fff", boxShadow: "0 -20px 60px -20px rgba(17,17,17,0.2)" }}>
              {/* Handle */}
              <div className="flex justify-center mb-5">
                <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(17,17,17,0.12)" }} />
              </div>
              <button onClick={() => setShowSignInModal(false)} className="absolute top-5 right-5 flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 999, background: "#F7F7F5" }}>
                <X size={14} color="#111" />
              </button>

              <div style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: -0.6 }}>Sign in to continue</div>
              <p className="mt-1.5" style={{ fontSize: 13.5, color: "#666", lineHeight: 1.5 }}>
                Sign in to place your order and track your shipment from CJ Dropshipping.
              </p>

              <button
                onClick={handleGoogleSignIn}
                className="mt-5 w-full flex items-center justify-center gap-3 active:scale-95 transition-all"
                style={{ height: 54, borderRadius: 18, background: "#fff", boxShadow: "inset 0 0 0 1.5px rgba(17,17,17,0.12)", fontSize: 15, fontWeight: 600, color: "#111" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <p className="mt-4 text-center" style={{ fontSize: 11.5, color: "#8A8A8A", lineHeight: 1.5 }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        )}

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

export function Progress({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="flex items-center">
      {labels.map((l, i) => {
        const done = i < step - 1;
        const active = i === step - 1;
        return (
          <div key={l} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, background: done ? "#0F62FE" : active ? "#fff" : "#F7F7F5", boxShadow: active ? "0 0 0 2px #0F62FE" : done ? "none" : "inset 0 0 0 1px rgba(17,17,17,0.1)" }}>
                {done ? <Check size={12} color="#fff" strokeWidth={3} /> : active ? <span style={{ width: 8, height: 8, borderRadius: 999, background: "#0F62FE" }} /> : null}
              </div>
              <span style={{ fontSize: 11.5, fontWeight: active || done ? 700 : 500, color: active || done ? "#111" : "#8A8A8A", letterSpacing: -0.1 }}>{l}</span>
            </div>
            {i < labels.length - 1 && (
              <div className="flex-1 mx-2" style={{ height: 1, background: i < step - 1 ? "#0F62FE" : "rgba(17,17,17,0.1)" }} />
            )}
          </div>
        );
      })}
    </div>
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
    width: 40, height: 40, borderRadius: 999,
    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
  } as const;
}
