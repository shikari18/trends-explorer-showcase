import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, MapPin, Truck, Package, Check } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Trends — Checkout" }] }),
});

function Checkout() {
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
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
                Confirm your details to continue.
              </p>
            </div>

            {/* Progress */}
            <div className="px-6 mt-6">
              <Progress step={2} labels={["Cart", "Checkout", "Payment"]} />
            </div>

            {/* Delivery Address */}
            <div className="px-5 mt-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} color="#0F62FE" />
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#0F62FE", letterSpacing: 0.4, textTransform: "uppercase" }}>Delivery Address</div>
                  </div>
                  <button style={smallBtn()}>Change</button>
                </div>
                <div className="mt-3" style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>Victor Mensah</div>
                <div className="mt-1" style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>
                  24 Oxford Street<br />East Legon, Accra, Ghana<br />+233 XX XXX XXXX
                </div>
              </Card>
            </div>

            {/* Delivery Method */}
            <div className="px-5 mt-4">
              <Card>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Delivery Method</div>
                <div
                  className="mt-3 flex items-center gap-3 p-3"
                  style={{ borderRadius: 18, background: "rgba(15,98,254,0.06)", boxShadow: "inset 0 0 0 1.5px rgba(15,98,254,0.3)" }}
                >
                  <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(15,98,254,0.12)" }}>
                    <Truck size={17} color="#0F62FE" />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>Express Delivery</div>
                    <div style={{ fontSize: 11.5, color: "#666" }}>2–4 Business Days</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#34C759" }}>Free</div>
                    <div className="flex items-center justify-center" style={{ width: 20, height: 20, borderRadius: 999, background: "#0F62FE" }}>
                      <Check size={12} color="#fff" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="px-5 mt-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Order Summary</div>
                  <div style={{ fontSize: 12, color: "#666" }}>3 Items</div>
                </div>
                <div className="mt-3 space-y-2" style={{ fontSize: 13.5 }}>
                  <Row label="Subtotal" value="₵3,798" />
                  <Row label="Shipping" value={<span style={{ color: "#34C759", fontWeight: 700 }}>Free</span>} />
                  <Row label="Tax" value="₵285" />
                </div>
                <div className="my-3" style={{ height: 1, background: "rgba(17,17,17,0.06)" }} />
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 14, color: "#666" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: -0.6 }}>₵4,083</span>
                </div>
              </Card>
            </div>

            {/* Security */}
            <div className="px-5 mt-4">
              <div
                className="flex items-center gap-3 p-3.5"
                style={{
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)",
                }}
              >
                <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(52,199,89,0.12)" }}>
                  <ShieldCheck size={16} color="#34C759" />
                </div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                  Your payment information is encrypted and securely processed.
                </div>
              </div>
            </div>

            {/* ETA */}
            <div className="px-5 mt-3">
              <div
                className="flex items-center gap-3 p-3.5"
                style={{ borderRadius: 18, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}
              >
                <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(15,98,254,0.10)" }}>
                  <Package size={16} color="#0F62FE" />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", letterSpacing: 0.3, textTransform: "uppercase" }}>Estimated Arrival</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>Tuesday, September 24</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute left-4 right-4" style={{ bottom: 18 }}>
          <div
            className="flex items-center gap-3 pl-5 pr-2"
            style={{
              height: 66,
              borderRadius: 24,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(28px) saturate(160%)",
              boxShadow: "0 20px 40px -14px rgba(17,17,17,0.22), inset 0 0 0 1px rgba(255,255,255,0.6)",
            }}
          >
            <div className="flex-1">
              <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.3, fontWeight: 600, textTransform: "uppercase" }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>₵4,083</div>
            </div>
            <Link
              to="/payment"
              className="inline-flex items-center justify-center px-5"
              style={{ height: 52, borderRadius: 20, background: "#0F62FE", color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: -0.2, boxShadow: "0 12px 24px -8px rgba(15,98,254,0.5)" }}
            >
              Continue to Payment
            </Link>
          </div>
        </div>

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
              <div
                className="flex items-center justify-center"
                style={{
                  width: 22, height: 22, borderRadius: 999,
                  background: done ? "#0F62FE" : active ? "#fff" : "#F7F7F5",
                  boxShadow: active ? "0 0 0 2px #0F62FE" : done ? "none" : "inset 0 0 0 1px rgba(17,17,17,0.1)",
                }}
              >
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

function Card({ children }: { children: React.ReactNode }) {
  return <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>{children}</div>;
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span style={{ color: "#666" }}>{label}</span><span style={{ color: "#111", fontWeight: 600 }}>{value}</span></div>;
}
function smallBtn() {
  return { height: 30, padding: "0 12px", borderRadius: 999, background: "#F7F7F5", color: "#111", fontSize: 12, fontWeight: 600, letterSpacing: -0.1 } as const;
}
function circle() {
  return {
    width: 40, height: 40, borderRadius: 999,
    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
  } as const;
}
