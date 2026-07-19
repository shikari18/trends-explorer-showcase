import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Package } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";

export const Route = createFileRoute("/order-success")({
  component: OrderSuccess,
  head: () => ({ meta: [{ title: "Trends — Order Confirmed" }] }),
});

function OrderSuccess() {
  return (
    <PhoneFrame>
      <>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(80% 60% at 50% 20%, rgba(52,199,89,0.10) 0%, rgba(255,255,255,0) 60%)" }}
        />
        <StatusBar />
        <div className="relative h-[calc(100%-54px)] flex flex-col">
          <div className="flex-1 flex flex-col items-center px-6 pt-6">
            {/* Success illustration */}
            <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="absolute" style={{
                  width: 200 - i * 40, height: 200 - i * 40, borderRadius: 999,
                  boxShadow: `inset 0 0 0 1px rgba(52,199,89,${0.08 + i * 0.06})`,
                }} />
              ))}
              <div className="relative flex items-center justify-center" style={{
                width: 116, height: 116, borderRadius: 999,
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(28px) saturate(160%)",
                boxShadow: "0 30px 60px -20px rgba(52,199,89,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.7)",
              }}>
                <div className="flex items-center justify-center" style={{
                  width: 78, height: 78, borderRadius: 999,
                  background: "linear-gradient(160deg, #4CD964 0%, #1FA84A 100%)",
                  boxShadow: "0 20px 40px -12px rgba(52,199,89,0.6), inset 0 -6px 12px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.35)",
                }}>
                  <Check size={38} color="#fff" strokeWidth={3.4} />
                </div>
              </div>
              {/* Sparkles */}
              {[{ top: 20, left: 30 }, { top: 40, right: 22 }, { bottom: 25, left: 18 }, { bottom: 40, right: 30 }].map((p, i) => (
                <div key={i} className="absolute" style={{
                  ...p, width: 4, height: 4, borderRadius: 999,
                  background: "#34C759", boxShadow: "0 0 8px 2px rgba(52,199,89,0.6)",
                }} />
              ))}
            </div>

            <h1 className="mt-6 text-center" style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Order Confirmed</h1>
            <p className="mt-2 text-center max-w-[300px]" style={{ fontSize: 14, color: "#666", lineHeight: 1.55, letterSpacing: -0.1 }}>
              Thank you for shopping with Trends. Your order has been placed and is being prepared for shipment.
            </p>

            <div className="w-full mt-6 p-4" style={{
              borderRadius: 22, background: "#fff",
              boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
            }}>
              {[
                ["Order Number", "#TRD-482917"],
                ["Estimated Delivery", "Tuesday, September 24"],
                ["Shipping Method", "Express Delivery"],
                ["Payment", "Apple Pay"],
              ].map(([k, v], i) => (
                <div key={k} className="flex items-center justify-between" style={{ padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid rgba(17,17,17,0.05)" }}>
                  <span style={{ fontSize: 12.5, color: "#666" }}>{k}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="w-full mt-3 flex items-center gap-3 p-3.5" style={{
              borderRadius: 18, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)",
              boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)",
            }}>
              <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(15,98,254,0.10)" }}>
                <Package size={15} color="#0F62FE" />
              </div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                We'll notify you as your order moves from processing to delivery.
              </div>
            </div>
          </div>

          <div className="px-5 pb-8 space-y-2.5">
            <Link to="/orders" className="flex items-center justify-center w-full"
              style={{ height: 56, borderRadius: 22, background: "#0F62FE", color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: -0.2, boxShadow: "0 16px 30px -10px rgba(15,98,254,0.55)" }}>
              Track Order
            </Link>
            <Link to="/home" className="flex items-center justify-center w-full"
              style={{ height: 52, borderRadius: 20, background: "#fff", color: "#111", fontSize: 14, fontWeight: 700, boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 10px 24px -14px rgba(17,17,17,0.18), inset 0 0 0 1px rgba(17,17,17,0.06)" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}
