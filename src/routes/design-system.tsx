import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Home, Search, Heart, ShoppingBag, User, Bell, Sparkles, Camera, Mic, MapPin, Package, CreditCard, HelpCircle, Settings } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";

export const Route = createFileRoute("/design-system")({
  component: DS,
  head: () => ({ meta: [{ title: "Trends — Design System" }] }),
});

const COLORS = [
  ["Primary BG","#FFFFFF"],["Secondary BG","#F7F7F5"],["Primary Text","#111111"],
  ["Secondary Text","#666666"],["Accent","#0F62FE"],["Success","#34C759"],["Error","#FF453A"],
];
const SPACING = [4,8,12,16,20,24,32,40,48,64];
const RADII = [12,16,20,24,32];
const SHADOWS = [
  ["XS","0 1px 2px rgba(17,17,17,0.06)"],
  ["Small","0 4px 10px -4px rgba(17,17,17,0.10)"],
  ["Medium","0 12px 28px -14px rgba(17,17,17,0.18)"],
  ["Large","0 24px 48px -18px rgba(17,17,17,0.22)"],
  ["Floating","0 30px 60px -20px rgba(17,17,17,0.28)"],
  ["Glass","0 20px 40px -18px rgba(17,17,17,0.15), inset 0 0 0 1px rgba(255,255,255,0.6)"],
];

function DS() {
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-16">
            <div className="flex items-center justify-between px-5 pt-4">
              <Link to="/profile" aria-label="Back" className="flex items-center justify-center" style={circle()}><ChevronLeft size={18} color="#111" /></Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Design System</div>
              <div style={{ width: 40 }} />
            </div>

            <div className="px-6 mt-4">
              <div style={{ fontSize: 11, fontWeight: 700, color: "#0F62FE", letterSpacing: 1.4, textTransform: "uppercase" }}>Trends · v1.0</div>
              <h1 className="mt-1" style={{ fontSize: 36, fontWeight: 700, color: "#111", letterSpacing: -1 }}>The Language</h1>
              <p className="mt-2" style={{ fontSize: 13.5, color: "#666", lineHeight: 1.5 }}>Every component, token and rule that shapes the Trends interface.</p>
            </div>

            <Section title="Typography">
              <div className="p-5 space-y-4" style={cardStyle()}>
                <TypeRow size={44} weight={700} label="Display · 48">Display</TypeRow>
                <TypeRow size={30} weight={700} label="Heading 1 · 34">Heading One</TypeRow>
                <TypeRow size={24} weight={700} label="Heading 2 · 28">Heading Two</TypeRow>
                <TypeRow size={20} weight={600} label="Heading 3 · 22">Heading Three</TypeRow>
                <TypeRow size={15} weight={400} label="Body · 17">The quick brown fox</TypeRow>
                <TypeRow size={12} weight={400} label="Caption · 13">Caption text</TypeRow>
              </div>
            </Section>

            <Section title="Color">
              <div className="grid grid-cols-2 gap-3">
                {COLORS.map(([k,v]) => (
                  <div key={k} className="p-3" style={cardStyle()}>
                    <div style={{ height: 56, borderRadius: 14, background: v, boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)" }} />
                    <div className="mt-2" style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{k}</div>
                    <div style={{ fontSize: 11, color: "#666", fontFamily: "SF Mono, monospace" }}>{v}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Buttons">
              <div className="p-4 space-y-2.5" style={cardStyle()}>
                <button className="w-full" style={{ height: 48, borderRadius: 20, background: "#0F62FE", color: "#fff", fontSize: 14, fontWeight: 700, boxShadow: "0 12px 24px -10px rgba(15,98,254,0.55)" }}>Primary</button>
                <button className="w-full" style={{ height: 48, borderRadius: 20, background: "#fff", color: "#111", fontSize: 14, fontWeight: 700, boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.08), 0 8px 18px -10px rgba(17,17,17,0.15)" }}>Secondary</button>
                <button className="w-full" style={{ height: 48, borderRadius: 20, background: "transparent", color: "#0F62FE", fontSize: 14, fontWeight: 700 }}>Ghost</button>
                <button className="w-full" disabled style={{ height: 48, borderRadius: 20, background: "#F0F0EE", color: "#B0B0AC", fontSize: 14, fontWeight: 700 }}>Disabled</button>
              </div>
            </Section>

            <Section title="Inputs">
              <div className="p-4 space-y-2.5" style={cardStyle()}>
                <Input placeholder="Default" />
                <Input placeholder="Focused" focused />
                <Input placeholder="Filled" value="victor@trends.app" />
                <Input placeholder="Search anything…" icon />
              </div>
            </Section>

            <Section title="Chips & Toggles">
              <div className="p-4 flex flex-wrap gap-2" style={cardStyle()}>
                {["All","Bags","Shoes","New"].map((c,i)=>(
                  <div key={c} style={{ height: 32, padding: "0 14px", display: "inline-flex", alignItems: "center", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    color: i===0? "#fff":"#111", background: i===0? "#0F62FE":"rgba(255,255,255,0.9)", boxShadow: i===0? "0 8px 18px -8px rgba(15,98,254,0.5)":"inset 0 0 0 1px rgba(17,17,17,0.06)" }}>{c}</div>
                ))}
                <div style={{ width: 51, height: 31, borderRadius: 999, background: "#34C759", position: "relative" }}>
                  <span style={{ position: "absolute", top: 2, left: 22, width: 27, height: 27, borderRadius: 999, background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            </Section>

            <Section title="Icons">
              <div className="p-4 grid grid-cols-6 gap-3" style={cardStyle()}>
                {[Home,Search,Heart,ShoppingBag,User,Settings,Bell,Sparkles,Camera,Mic,MapPin,Package,CreditCard,HelpCircle].map((I,i)=>(
                  <div key={i} className="flex items-center justify-center" style={{ height: 44, borderRadius: 14, background: "#F7F7F5" }}>
                    <I size={17} color="#111" />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Spacing">
              <div className="p-4 flex items-end gap-2" style={cardStyle()}>
                {SPACING.map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1.5">
                    <div style={{ width: s, height: s, borderRadius: 4, background: "#0F62FE" }} />
                    <div style={{ fontSize: 9.5, color: "#666" }}>{s}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Corner Radius">
              <div className="p-4 flex gap-2 justify-between" style={cardStyle()}>
                {RADII.map((r) => (
                  <div key={r} className="flex flex-col items-center gap-1.5">
                    <div style={{ width: 44, height: 44, borderRadius: r, background: r===24?"#0F62FE":"#F7F7F5", boxShadow: r===24? "0 8px 18px -8px rgba(15,98,254,0.4)":"inset 0 0 0 1px rgba(17,17,17,0.06)" }} />
                    <div style={{ fontSize: 10, color: "#666" }}>{r}px</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Shadows">
              <div className="p-4 grid grid-cols-3 gap-3" style={cardStyle()}>
                {SHADOWS.map(([k,v]) => (
                  <div key={k} className="flex flex-col items-center gap-2">
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: "#fff", boxShadow: v as string }} />
                    <div style={{ fontSize: 10.5, color: "#666" }}>{k}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Principles">
              <div className="p-4 flex flex-wrap gap-2" style={cardStyle()}>
                {["Minimal","Elegant","Premium","Accessible","Consistent","Touch Friendly","Luxury","Apple Inspired"].map((p)=>(
                  <div key={p} style={{ height: 30, padding: "0 12px", display: "inline-flex", alignItems: "center", borderRadius: 999, fontSize: 11.5, fontWeight: 600, color: "#111", background: "#F7F7F5" }}>{p}</div>
                ))}
              </div>
            </Section>

            <div className="mt-8 text-center pb-6" style={{ fontSize: 11, color: "#8A8A8A", lineHeight: 1.6 }}>
              Trends Design System · Version 1.0<br />Designed with Apple Human Interface Guidelines.
            </div>
          </div>
        </div>
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 mt-6">
      <div className="px-1 mb-3" style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1.2, textTransform: "uppercase" }}>{title}</div>
      {children}
    </div>
  );
}
function TypeRow({ size, weight, label, children }: { size: number; weight: number; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div style={{ fontSize: size, fontWeight: weight, color: "#111", letterSpacing: -0.5, lineHeight: 1.1 }}>{children}</div>
      <div style={{ fontSize: 10.5, color: "#8A8A8A", whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
}
function Input({ placeholder, focused, value, icon }: { placeholder: string; focused?: boolean; value?: string; icon?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-4" style={{ height: 46, borderRadius: 16, background: "#F7F7F5", boxShadow: focused? "0 0 0 3px rgba(15,98,254,0.2), inset 0 0 0 1.5px #0F62FE" : "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
      {icon && <Search size={14} color="#8A8A8A" />}
      <div style={{ fontSize: 13.5, color: value? "#111": "#8A8A8A", fontWeight: value? 500: 400 }}>{value ?? placeholder}</div>
    </div>
  );
}
function cardStyle() {
  return { borderRadius: 22, background: "#fff",
    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" } as const;
}
function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}