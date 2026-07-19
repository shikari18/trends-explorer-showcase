import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, Plus, Lock, Check, CreditCard } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { Progress } from "./checkout";

export const Route = createFileRoute("/payment")({
  component: Payment,
  head: () => ({ meta: [{ title: "Trends — Payment" }] }),
});

type Method = "apple" | "google" | "visa";

function Payment() {
  const [method, setMethod] = useState<Method>("apple");

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative h-[calc(100%-54px)] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-2">
              <Link to="/checkout" aria-label="Back" style={circle()} className="flex items-center justify-center">
                <ArrowLeft size={18} color="#111" />
              </Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Payment</div>
              <button style={circle()} className="flex items-center justify-center"><ShieldCheck size={17} color="#0F62FE" /></button>
            </div>

            <div className="px-6 mt-5">
              <h1 style={{ fontSize: 30, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Choose payment</h1>
            </div>

            <div className="px-6 mt-5"><Progress step={3} labels={["Cart", "Checkout", "Payment"]} /></div>

            <div className="px-5 mt-6 space-y-3">
              <MethodCard active={method === "apple"} onClick={() => setMethod("apple")}
                logo={<AppleLogo />} title="Apple Pay" subtitle="Fast and secure checkout." />
              <MethodCard active={method === "google"} onClick={() => setMethod("google")}
                logo={<GoogleLogo />} title="Google Pay" subtitle="Pay using your Google account." />
              <MethodCard active={method === "visa"} onClick={() => setMethod("visa")}
                logo={<div style={{ fontWeight: 900, fontSize: 15, color: "#1A1F71", fontStyle: "italic", letterSpacing: -0.5 }}>VISA</div>}
                title="•••• 4827" subtitle="Expires 08/29 · Victor Mensah"
                right={<button style={smallBtn()}>Edit</button>} />

              <button
                className="flex items-center gap-3 p-4 w-full"
                style={{ borderRadius: 20, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}
              >
                <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 14, background: "#F7F7F5" }}>
                  <Plus size={18} color="#111" />
                </div>
                <div className="text-left flex-1">
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>Add a new payment method</div>
                  <div style={{ fontSize: 12, color: "#666" }}>Card, bank, or digital wallet</div>
                </div>
                <CreditCard size={17} color="#8A8A8A" />
              </button>
            </div>

            {/* Billing */}
            <div className="px-5 mt-4">
              <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Billing Address</div>
                  <button style={smallBtn()}>Change</button>
                </div>
                <div className="mt-2" style={{ fontSize: 12.5, color: "#666" }}>Same as delivery — 24 Oxford Street, Accra</div>
              </div>
            </div>

            {/* Summary */}
            <div className="px-5 mt-4">
              <div className="p-4" style={{ borderRadius: 22, background: "#fff", boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>Order Summary</div>
                  <div style={{ fontSize: 12, color: "#666" }}>3 Items</div>
                </div>
                <div className="mt-3 space-y-2" style={{ fontSize: 13.5 }}>
                  <Row label="Subtotal" value="$3,798" />
                  <Row label="Shipping" value={<span style={{ color: "#34C759", fontWeight: 700 }}>Free</span>} />
                  <Row label="Tax" value="$285" />
                </div>
                <div className="my-3" style={{ height: 1, background: "rgba(17,17,17,0.06)" }} />
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 14, color: "#666" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: -0.6 }}>$4,083</span>
                </div>
              </div>
            </div>

            <div className="px-5 mt-3">
              <div
                className="flex items-center gap-3 p-3.5"
                style={{ borderRadius: 18, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}
              >
                <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(52,199,89,0.12)" }}>
                  <Lock size={15} color="#34C759" />
                </div>
                <div style={{ fontSize: 11.5, color: "#666", lineHeight: 1.5 }}>
                  Protected with bank-level encryption. Your payment details are never stored insecurely.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-4 right-4" style={{ bottom: 18 }}>
          <div
            className="flex items-center gap-3 pl-5 pr-2"
            style={{ height: 66, borderRadius: 24, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(28px) saturate(160%)", boxShadow: "0 20px 40px -14px rgba(17,17,17,0.22), inset 0 0 0 1px rgba(255,255,255,0.6)" }}
          >
            <div className="flex-1">
              <div style={{ fontSize: 11, color: "#8A8A8A", letterSpacing: 0.3, fontWeight: 600, textTransform: "uppercase" }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>$4,083</div>
            </div>
            <Link
              to="/order-success"
              className="inline-flex items-center justify-center gap-2 px-5"
              style={{ height: 52, borderRadius: 20, background: "#0F62FE", color: "#fff", fontSize: 14, fontWeight: 700, boxShadow: "0 12px 24px -8px rgba(15,98,254,0.5)" }}
            >
              <Lock size={14} /> Pay Securely
            </Link>
          </div>
        </div>

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function MethodCard({ active, onClick, logo, title, subtitle, right }: { active: boolean; onClick: () => void; logo: React.ReactNode; title: string; subtitle: string; right?: React.ReactNode }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-4"
      style={{
        borderRadius: 20,
        background: "#fff",
        boxShadow: active
          ? "0 0 0 2px #0F62FE, 0 12px 28px -18px rgba(15,98,254,0.4)"
          : "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
      }}>
      <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 14, background: "#F7F7F5" }}>
        {logo}
      </div>
      <div className="text-left flex-1 min-w-0">
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#666" }}>{subtitle}</div>
      </div>
      {right ?? (active
        ? <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 999, background: "#0F62FE" }}><Check size={13} color="#fff" strokeWidth={3} /></div>
        : <div style={{ width: 22, height: 22, borderRadius: 999, boxShadow: "inset 0 0 0 1.5px rgba(17,17,17,0.15)" }} />)}
    </button>
  );
}

function AppleLogo() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="#111">
      <path d="M14.5 11.5c0-2.8 2.3-4.1 2.4-4.2-1.3-1.9-3.3-2.2-4-2.2-1.7-.2-3.3 1-4.2 1-.9 0-2.2-1-3.7-1-1.9 0-3.6 1.1-4.6 2.8-2 3.4-.5 8.4 1.4 11.2.9 1.4 2 2.9 3.4 2.8 1.4-.1 1.9-.9 3.6-.9 1.6 0 2.1.9 3.6.9 1.5 0 2.4-1.4 3.3-2.7 1-1.6 1.5-3.1 1.5-3.2-.1 0-2.9-1.1-2.9-4.5zM11.8 3.6c.8-.9 1.3-2.2 1.1-3.5-1.1.1-2.4.7-3.2 1.6-.7.8-1.4 2.1-1.2 3.4 1.2.1 2.5-.6 3.3-1.5z" />
    </svg>
  );
}
function GoogleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.5h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-8.2z" />
      <path fill="#34A853" d="M12 22.5c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.6H2.1v2.8C3.9 20 7.7 22.5 12 22.5z" />
      <path fill="#FBBC05" d="M5.8 13.6c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V6.6H2.1C1.4 8 1 9.4 1 11.5s.4 3.5 1.1 4.9l3.7-2.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.5 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between"><span style={{ color: "#666" }}>{label}</span><span style={{ color: "#111", fontWeight: 600 }}>{value}</span></div>;
}
function smallBtn() {
  return { height: 30, padding: "0 12px", borderRadius: 999, background: "#F7F7F5", color: "#111", fontSize: 12, fontWeight: 600 } as const;
}
function circle() {
  return {
    width: 40, height: 40, borderRadius: 999,
    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)",
  } as const;
}
