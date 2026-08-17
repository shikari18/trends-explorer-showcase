import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Moon, Bell, Languages, Globe, ShieldCheck, ScanFace, DollarSign, Sparkles, Database, Info, CheckCircle2, Store, PackagePlus, Trash2, ShoppingBag, PlusCircle, User } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { BottomNav } from "@/components/phone/BottomNav";
import { VendorVerificationModal } from "@/components/vendor/VendorVerificationModal";
import { VendorAddProductModal } from "@/components/vendor/VendorAddProductModal";
import { getVendorProfile, isVendorVerified, VendorProfile, getVendorProducts, deleteVendorProduct, VendorProduct } from "@/lib/vendor";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Trends — Settings" }] }),
});

function SettingsPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [push, setPush] = useState(true);
  const [face, setFace] = useState(true);
  const [ai, setAi] = useState(true);
  const [user, setUser] = useState<{ name?: string; email?: string; avatar?: string; isVendor?: boolean } | null>(null);

  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const refreshVendorState = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      if (saved) {
        try { setUser(JSON.parse(saved)); } catch { setUser(null); }
      }
      const vp = getVendorProfile();
      setVendorProfile(vp);
      setVendorProducts(getVendorProducts());
    }
  };

  useEffect(() => {
    refreshVendorState();
  }, []);

  const handleVendorCardClick = () => {
    if (!user) {
      import("sonner").then(({ toast }) => toast.error("Please sign in with Google to become a vendor."));
      navigate({ to: "/signin" });
      return;
    }

    if (vendorProfile?.verified) {
      setShowAddProductModal(true);
    } else {
      setShowVerifyModal(true);
    }
  };

  const handleDeleteProduct = (productId: string, title: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
      if (confirmed) {
        const updated = deleteVendorProduct(productId);
        setVendorProducts(updated);
        import("sonner").then(({ toast }) => toast.success(`"${title}" deleted successfully.`));
      }
    }
  };

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
              <div className="flex items-center justify-center shrink-0 overflow-hidden"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 999,
                  background: user ? "linear-gradient(135deg, #0F62FE, #61B0FF)" : "#F3F4F6",
                  color: user ? "#fff" : "#6B7280",
                  fontSize: 20,
                  fontWeight: 700,
                  border: user ? "none" : "1px solid #E5E7EB"
                }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover" />
                ) : user ? (
                  (user.name?.[0] || user.email?.[0] || "U").toUpperCase()
                ) : (
                  <User size={24} className="text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5" style={{ fontSize: 15, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>
                  <span className="truncate">{user?.name || (user?.email ? user.email.split("@")[0] : "Guest User")}</span>
                  {vendorProfile?.verified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-600 text-white shrink-0" />
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {vendorProfile?.verified ? (
                    <span className="text-blue-600 font-semibold">Verified Vendor • {vendorProfile.storeName}</span>
                  ) : user ? (
                    user.email || "Member"
                  ) : (
                    "Not signed in"
                  )}
                </div>
              </div>
              <ChevronRight size={16} color="#8A8A8A" />
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
                  {vendorProfile?.verified ? "Upload products & manage store listings" : "Requires Ghana Card & Facial Photo check for anti-scam security"}
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

            {/* My Store & Uploaded Products Section (Visible to Verified Vendors) */}
            {vendorProfile?.verified && (
              <div className="mx-5 mt-5">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-gray-900 tracking-tight">My Store Products</h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold">
                      {vendorProducts.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <PlusCircle size={14} /> Upload New
                  </button>
                </div>

                {vendorProducts.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white border border-gray-100 text-center shadow-sm">
                    <Store className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-800">No products uploaded yet</p>
                    <p className="text-[11px] text-gray-500 mt-1 mb-3">Click below to upload your first product to Trends!</p>
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700"
                    >
                      Upload Product Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vendorProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"}
                            alt={p.title}
                            className="w-14 h-14 object-cover rounded-xl border border-gray-100 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{p.title}</h4>
                            <p className="text-xs font-bold text-blue-600 mt-0.5">₵{p.price.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                              <span>📦 {p.category}</span>
                              <span>•</span>
                              <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          title="Delete Product"
                          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors shrink-0 flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
        <VendorVerificationModal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          onSuccess={refreshVendorState}
          userEmail={user?.email}
          userName={user?.name}
        />
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