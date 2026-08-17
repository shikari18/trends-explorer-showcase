import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Package, Heart, MapPin, CreditCard, Bell, Settings, HelpCircle, LogOut, Sparkles, Gift, Zap, Shirt, Palette, CheckCircle2, Store, ShieldCheck, PackagePlus, User } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import { useEffect, useState } from "react";
import { VendorVerificationModal } from "@/components/vendor/VendorVerificationModal";
import { VendorAddProductModal } from "@/components/vendor/VendorAddProductModal";
import { getVendorProfile, isVendorVerified, VendorProfile } from "@/lib/vendor";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "Trends — Profile" }] }),
});

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; email?: string; avatar?: string } | null>(null);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const refreshVendorState = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      if (saved) {
        try { setUser(JSON.parse(saved)); } catch { setUser(null); }
      }
      setVendorProfile(getVendorProfile());
    }
  };

  useEffect(() => {
    refreshVendorState();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    import("sonner").then(({ toast }) => toast.success("Signed out successfully"));
    navigate({ to: "/signin" });
  };

  const handleVendorCardClick = () => {
    if (!user) {
      import("sonner").then(({ toast }) => toast.error("Please sign in with Google first to become a vendor."));
      navigate({ to: "/signin" });
      return;
    }
    if (vendorProfile?.verified) {
      setShowAddProductModal(true);
    } else {
      setShowVerifyModal(true);
    }
  };

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          <div className="pb-32">
            <div className="px-6 pt-12 flex items-center justify-between">
              <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", letterSpacing: -0.9 }}>Profile</h1>
              {!user && (
                <Link to="/signin" className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold shadow-md">
                  Sign In
                </Link>
              )}
            </div>

            {/* Profile Header Card */}
            <div className="px-5 mt-5">
              <div className="p-4 flex items-center gap-4"
                style={{
                  borderRadius: 24,
                  background: "linear-gradient(180deg, rgba(15,98,254,0.05) 0%, #fff 100%)",
                  boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 14px 30px -18px rgba(17,17,17,0.16), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}>
                <div className="flex items-center justify-center shrink-0 overflow-hidden"
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: 999,
                    background: user ? "linear-gradient(135deg, #0F62FE, #61B0FF)" : "#F3F4F6",
                    color: user ? "#fff" : "#6B7280",
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: -0.4,
                    boxShadow: user ? "0 12px 24px -10px rgba(15,98,254,0.5)" : "none",
                    border: user ? "none" : "1px solid #E5E7EB"
                  }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover" />
                  ) : user ? (
                    (user.name?.[0] || user.email?.[0] || "U").toUpperCase()
                  ) : (
                    <User size={28} className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5" style={{ fontSize: 18, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>
                    <span className="truncate">{user?.name || (user?.email ? user.email.split("@")[0] : "Guest Shopper")}</span>
                    {vendorProfile?.verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-600 text-white shrink-0" />
                    )}
                  </div>
                  <div className="mt-0.5 truncate" style={{ fontSize: 12.5, color: "#666" }}>
                    {vendorProfile?.verified ? (
                      <span className="text-blue-600 font-semibold flex items-center gap-1">
                        <Store size={12} /> {vendorProfile.storeName}
                      </span>
                    ) : (
                      user?.email || "Sign in to manage orders & wishlist"
                    )}
                  </div>
                </div>
                {user ? (
                  <Link to="/settings" style={{ height: 34, padding: "0 14px", borderRadius: 999, background: "#111", color: "#fff", fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center" }}>Edit</Link>
                ) : (
                  <Link to="/signin" style={{ height: 34, padding: "0 14px", borderRadius: 999, background: "#0F62FE", color: "#fff", fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center" }}>Join</Link>
                )}
              </div>
            </div>

            {/* Become a Vendor Card */}
            <div className="mx-5 mt-4 p-5 rounded-3xl relative overflow-hidden text-white shadow-xl"
              style={{
                background: vendorProfile?.verified 
                  ? "linear-gradient(135deg, #0F62FE 0%, #1E40AF 100%)" 
                  : "linear-gradient(135deg, #111111 0%, #2A2A2A 100%)",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-1.5">
                      {vendorProfile?.verified ? "Verified Vendor Portal" : "Become a Vendor"}
                      {vendorProfile?.verified && <CheckCircle2 className="w-4 h-4 text-white fill-white text-blue-600" />}
                    </h3>
                    <p className="text-xs text-white/70">
                      {vendorProfile?.verified ? vendorProfile.storeName : "Sell your products online to thousands of shoppers"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                <p className="text-xs text-white/80 max-w-[200px]">
                  {vendorProfile?.verified ? "Upload products & manage listings" : "Requires Ghana Card & Facial Photo check for anti-scam security"}
                </p>
                <button
                  onClick={handleVendorCardClick}
                  className="px-4 py-2.5 rounded-full bg-white text-gray-900 text-xs font-bold shadow-md hover:bg-gray-100 transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
                >
                  {vendorProfile?.verified ? (
                    <>
                      <PackagePlus size={14} className="text-blue-600" /> Add Product
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} className="text-blue-600" /> Get Verified
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Group 1 */}
            <MenuGroup>
              <MenuItem to="/orders" icon={<Package size={16} color="#0F62FE" />} label="Orders" hint="View history" />
              <MenuItem to="/wishlist" icon={<Heart size={16} color="#0F62FE" />} label="Wishlist" hint="Saved items" />
              <MenuItem icon={<MapPin size={16} color="#0F62FE" />} label="Addresses" hint="Saved locations" />
              <MenuItem icon={<CreditCard size={16} color="#0F62FE" />} label="Payment methods" hint="Cards & Paystack" last />
            </MenuGroup>

            {/* Trends experiences */}
            <MenuGroup>
              <MenuItem to="/ai-outfit" icon={<Sparkles size={16} color="#0F62FE" />} label="AI Stylist" hint="Try on outfits" />
              <MenuItem to="/drops" icon={<Zap size={16} color="#0F62FE" />} label="Limited Drops" hint="Exclusive access" />
              <MenuItem to="/referral" icon={<Gift size={16} color="#0F62FE" />} label="Refer & Earn" hint="Get ₵50 credit" />
              <MenuItem to="/ar" icon={<Shirt size={16} color="#0F62FE" />} label="3D & AR Studio" last />
            </MenuGroup>

            <MenuGroup>
              <MenuItem to="/notifications" icon={<Bell size={16} color="#111" />} label="Notifications" />
              <MenuItem to="/settings" icon={<Settings size={16} color="#111" />} label="Settings" />
              <MenuItem to="/support" icon={<HelpCircle size={16} color="#111" />} label="Help & Support" />
              <MenuItem to="/design-system" icon={<Palette size={16} color="#111" />} label="Design System" last />
            </MenuGroup>

            <div className="px-5 mt-4">
              {user ? (
                <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2"
                  style={{ height: 52, borderRadius: 20, background: "#fff", color: "#FF3B30", fontSize: 14, fontWeight: 700, boxShadow: "inset 0 0 0 1px rgba(255,59,48,0.15)" }}>
                  <LogOut size={15} /> Sign out
                </button>
              ) : (
                <Link to="/signin" className="w-full flex items-center justify-center gap-2"
                  style={{ height: 52, borderRadius: 20, background: "#111", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                  Sign in to your account
                </Link>
              )}
              <div className="mt-4 text-center" style={{ fontSize: 11, color: "#8A8A8A" }}>Trends v1.0 · Elevated Shopping</div>
            </div>
          </div>
        </div>

        {/* Vendor Verification Modal */}
        <VendorVerificationModal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          onSuccess={refreshVendorState}
          userEmail={user?.email || "vendor@trends.com"}
          userName={user?.name || "Shopper"}
        />

        {/* Vendor Add Product Modal */}
        {user && vendorProfile && (
          <VendorAddProductModal
            isOpen={showAddProductModal}
            onClose={() => setShowAddProductModal(false)}
            onSuccess={refreshVendorState}
            vendorName={vendorProfile.storeName || user.name || "Vendor"}
            vendorId={vendorProfile.vendorId || "v-1"}
          />
        )}

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
