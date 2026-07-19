import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Moon, Bell, Languages, Globe, ShieldCheck, ScanFace, DollarSign, Sparkles, Database, Info } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";

export const Route = createFileRoute("/settings")({
  component: Settings,
  head: () => ({ meta: [{ title: "Trends — Settings" }] }),
});

function Settings() {
  const [dark, setDark] = useState(false);
  const [push, setPush] = useState(true);
  const [face, setFace] = useState(true);
  const [ai, setAi] = useState(true);
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="flex items-center justify-between px-5 pt-4">
              <Link to="/profile" aria-label="Back" className="flex items-center justify-center" style={circle()}><ChevronLeft size={18} color="#111" /></Link>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111", letterSpacing: -0.3 }}>Settings</div>
              <div style={{ width: 40 }} />
            </div>

            <div className="px-6 mt-4">
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Settings</h1>
            </div>

            {/* Profile summary */}
            <div className="mx-5 mt-5 p-4 flex items-center gap-4"
              style={{ borderRadius: 22, background: "#fff",
                boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>
              <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 999, background: "linear-gradient(135deg, #0F62FE, #61B0FF)", color: "#fff", fontSize: 20, fontWeight: 700 }}>V</div>
              <div className="flex-1">
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Victor Mensah</div>
                <div style={{ fontSize: 12, color: "#666" }}>Premium Member</div>
              </div>
              <ChevronRight size={16} color="#8A8A8A" />
            </div>

            <GroupLabel>Appearance</GroupLabel>
            <Group>
              <Toggle icon={<Moon size={15} />} label="Dark Mode" value={dark} onChange={setDark} last />
            </Group>

            <GroupLabel>Notifications</GroupLabel>
            <Group>
              <Toggle icon={<Bell size={15} />} label="Push Notifications" value={push} onChange={setPush} last />
            </Group>

            <GroupLabel>General</GroupLabel>
            <Group>
              <Row icon={<Languages size={15} />} label="Language" value="English" />
              <Row icon={<Globe size={15} />} label="Region" value="Ghana" last />
            </Group>

            <GroupLabel>Privacy & Security</GroupLabel>
            <Group>
              <Row icon={<ShieldCheck size={15} />} label="Face ID & Passcode" />
              <Toggle icon={<ScanFace size={15} />} label="Biometric Authentication" value={face} onChange={setFace} last />
            </Group>

            <GroupLabel>Shopping</GroupLabel>
            <Group>
              <Row icon={<DollarSign size={15} />} label="Currency" value="USD ($)" />
              <Toggle icon={<Sparkles size={15} />} label="AI Recommendations" value={ai} onChange={setAi} last />
            </Group>

            <GroupLabel>Data</GroupLabel>
            <Group>
              <Row icon={<Database size={15} />} label="Manage Personal Data" />
              <Row icon={<Info size={15} />} label="Version" value="Trends 1.0.0" last />
            </Group>

            <div className="mt-6 text-center" style={{ fontSize: 11, color: "#8A8A8A" }}>
              Privacy Policy · Terms of Service · v1.0.0
            </div>
          </div>
        </div>
        <BottomNav active="profile" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-7 mt-6 mb-2" style={{ fontSize: 11, fontWeight: 700, color: "#8A8A8A", letterSpacing: 1.2, textTransform: "uppercase" }}>{children}</div>;
}
function Group({ children }: { children: React.ReactNode }) {
  return <div className="mx-5 overflow-hidden" style={{ borderRadius: 22, background: "#fff",
    boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)" }}>{children}</div>;
}
function Row({ icon, label, value, last }: { icon: React.ReactNode; label: string; value?: string; last?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4" style={{ height: 52, borderBottom: last ? "none" : "1px solid rgba(17,17,17,0.05)" }}>
      <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 10, background: "#F7F7F5", color: "#111" }}>{icon}</div>
      <div className="flex-1" style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{label}</div>
      {value && <div style={{ fontSize: 12.5, color: "#8A8A8A" }}>{value}</div>}
      <ChevronRight size={14} color="#8A8A8A" />
    </div>
  );
}
function Toggle({ icon, label, value, onChange, last }: { icon: React.ReactNode; label: string; value: boolean; onChange: (v:boolean)=>void; last?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4" style={{ height: 52, borderBottom: last ? "none" : "1px solid rgba(17,17,17,0.05)" }}>
      <div className="flex items-center justify-center" style={{ width: 30, height: 30, borderRadius: 10, background: "#F7F7F5", color: "#111" }}>{icon}</div>
      <div className="flex-1" style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{label}</div>
      <button onClick={() => onChange(!value)} aria-label={label}
        style={{ width: 51, height: 31, borderRadius: 999, background: value ? "#34C759" : "#e5e5ea", position: "relative", transition: "background 0.2s" }}>
        <span style={{ position: "absolute", top: 2, left: value ? 22 : 2, width: 27, height: 27, borderRadius: 999, background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
      </button>
    </div>
  );
}

function circle() {
  return { width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -8px rgba(17,17,17,0.15)" } as const;
}