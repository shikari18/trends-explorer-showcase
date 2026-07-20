import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Package, Heart, MapPin, CreditCard, Bell, Settings, HelpCircle, LogOut, Sparkles, Gift, Zap, Shirt, Palette } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Trends — Profile" }] }),
});

function Profile() {
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="px-6 pt-4">
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Profile</h1>
            </div>

            {/* Card */}
            <div className="px-5 mt-5">
              <div className="p-4 flex items-center gap-4"
                style={{
                  borderRadius: 24,
                  background: "linear-gradient(180deg, rgba(15,98,254,0.05) 0%, #fff 100%)",
                  boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}>
                <div className="flex items-center justify-center"
                  style={{ width: 62, height: 62, borderRadius: 999, background: "linear-gradient(135deg, #0F62FE, #61B0FF)", color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: -0.4, boxShadow: "0 12px 24px -10px rgba(15,98,254,0.5)" }}>
                  V
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>Victor Mensah</div>
                  <div className="mt-0.5 truncate" style={{ fontSize: 12.5, color: "#666" }}>victor@trends.app · Member since 2024</div>
                </div>
                <button style={{ height: 34, padding: "0 14px", borderRadius: 999, background: "#111", color: "#fff", fontSize: 12.5, fontWeight: 600 }}>Edit</button>
              </div>
            </div>

            {/* Group 1 */}
            <MenuGroup>
              <MenuItem to="/orders" icon={<Package size={16} color="#0F62FE" />} label="Orders" hint="3 active" />
              <MenuItem to="/wishlist" icon={<Heart size={16} color="#0F62FE" />} label="Wishlist" hint="24 items" />
              <MenuItem icon={<MapPin size={16} color="#0F62FE" />} label="Addresses" hint="2 saved" />
              <MenuItem icon={<CreditCard size={16} color="#0F62FE" />} label="Payment methods" hint="Visa · Apple Pay" last />
            </MenuGroup>

            {/* Trends experiences */}
            <MenuGroup>
              <MenuItem to="/ai-assistant" icon={<Sparkles size={16} color="#0F62FE" />} label="Trends AI" hint="Assistant" />
              <MenuItem to="/ai-outfit" icon={<Shirt size={16} color="#0F62FE" />} label="AI Outfit Builder" hint="New" />
              <MenuItem to="/drops" icon={<Zap size={16} color="#0F62FE" />} label="Exclusive Drops" />
              <MenuItem to="/referral" icon={<Gift size={16} color="#0F62FE" />} label="Refer & Earn" hint="₵20" />
              <MenuItem to="/brand/saint-laurent" icon={<Sparkles size={16} color="#111" />} label="Brand Stores" last />
            </MenuGroup>

            {/* Group 2 */}
            <MenuGroup>
              <MenuItem to="/notifications" icon={<Bell size={16} color="#111" />} label="Notifications" hint="3 new" />
              <MenuItem to="/settings" icon={<Settings size={16} color="#111" />} label="Settings" />
              <MenuItem to="/support" icon={<HelpCircle size={16} color="#111" />} label="Help & Support" />
              <MenuItem to="/design-system" icon={<Palette size={16} color="#111" />} label="Design System" last />
            </MenuGroup>

            <div className="px-5 mt-4">
              <button className="w-full flex items-center justify-center gap-2"
                style={{ height: 52, borderRadius: 20, background: "#fff", color: "#FF3B30", fontSize: 14, fontWeight: 700, boxShadow: "inset 0 0 0 1px rgba(255,59,48,0.15)" }}>
                <LogOut size={15} /> Sign out
              </button>
              <div className="mt-4 text-center" style={{ fontSize: 11, color: "#8A8A8A" }}>Trends v1.0 · Made with care</div>
            </div>
          </div>
        </div>
        <BottomNav active="profile" />
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function MenuGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 mt-4">
      <div className="overflow-hidden"
        style={{
          borderRadius: 22, background: "#fff",
          boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.04)",
        }}>
        {children}
      </div>
    </div>
  );
}
function MenuItem({ to, icon, label, hint, last }: { to?: string; icon: React.ReactNode; label: string; hint?: string; last?: boolean }) {
  const content = (
    <div className="flex items-center gap-3 px-4" style={{ height: 56, borderBottom: last ? "none" : "1px solid rgba(17,17,17,0.05)" }}>
      <div className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 10, background: "#F7F7F5" }}>{icon}</div>
      <div className="flex-1" style={{ fontSize: 14, fontWeight: 600, color: "#111", letterSpacing: -0.2 }}>{label}</div>
      {hint && <div style={{ fontSize: 12, color: "#8A8A8A" }}>{hint}</div>}
      <ChevronRight size={15} color="#8A8A8A" />
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : <div>{content}</div>;
}
