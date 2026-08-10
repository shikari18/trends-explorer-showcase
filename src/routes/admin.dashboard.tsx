import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShoppingBag, Users, Package, TrendingUp, CheckCircle2,
  Clock, Truck, AlertCircle, ChevronRight, LogOut,
  BarChart3, ShieldCheck, Search, Zap, Layers, RefreshCw,
  Store, CreditCard, ExternalLink, Activity, ArrowUpRight
} from "lucide-react";
import { getAllCachedProducts } from "@/lib/cjApi";
import { getVendorProducts } from "@/lib/vendor";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Trends — Admin Dashboard" }] }),
});

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const CATEGORY_STATS = [
  { name: "Women's Clothing", count: 7182, pct: 15.8, color: "#FF2D55" },
  { name: "Men's Clothing", count: 5106, pct: 11.2, color: "#0F62FE" },
  { name: "Jewelry & Watches", count: 4975, pct: 10.9, color: "#FF9500" },
  { name: "Home, Garden & Furniture", count: 4453, pct: 9.8, color: "#AF52DE" },
  { name: "Health, Beauty & Hair", count: 3006, pct: 6.6, color: "#FF3B30" },
  { name: "Bags & Shoes", count: 2900, pct: 6.4, color: "#34C759" },
  { name: "Pet Supplies", count: 2875, pct: 6.3, color: "#5856D6" },
  { name: "Sports & Outdoors", count: 2629, pct: 5.8, color: "#00C7BE" },
  { name: "Toys, Kids & Babies", count: 2579, pct: 5.7, color: "#FFCC00" },
  { name: "Consumer Electronics", count: 2145, pct: 4.7, color: "#5AC8FA" },
  { name: "Phones & Accessories", count: 2067, pct: 4.5, color: "#30B0C7" },
  { name: "Automobiles & Motorcycles", count: 2024, pct: 4.4, color: "#FF6482" },
  { name: "Home Improvement", count: 2020, pct: 4.4, color: "#32ADE6" },
  { name: "Computer & Office", count: 1523, pct: 3.3, color: "#64D2FF" },
];

const MOCK_REGISTERED_USERS = [
  { name: "Victor Mensah", email: "victor.mensah@gmail.com", role: "Customer", registeredAt: "Jan 12, 2026", status: "Active" },
  { name: "Ama Owusu", email: "ama.owusu@yahoo.com", role: "Ghana Verified Vendor", store: "Ama Fashion Boutique", registeredAt: "Feb 04, 2026", status: "Verified ⚡" },
  { name: "Kofi Asante", email: "kofi.asante@gmail.com", role: "Customer", registeredAt: "Feb 18, 2026", status: "Active" },
  { name: "Abena Boateng", email: "abena.b@gmail.com", role: "Customer", registeredAt: "Mar 01, 2026", status: "Active" },
  { name: "Dark's Electronics", email: "dark.vendor@trends.com", role: "Ghana Verified Vendor", store: "Dark Tech Ghana", registeredAt: "Mar 10, 2026", status: "Verified ⚡" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "users" | "vendors">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCatalogCount, setTotalCatalogCount] = useState(45484);
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = getAllCachedProducts();
        if (cached && cached.length > 0) setTotalCatalogCount(cached.length);
        const vp = getVendorProducts();
        setVendorProducts(vp);
      } catch (e) {
        console.error("Error loading admin stats:", e);
      }
    }
  }, []);

  const totalGoal = 60000;
  const progressPct = Math.min(100, parseFloat(((totalCatalogCount / totalGoal) * 100).toFixed(1)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: FONT }}>
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 font-extrabold text-xl">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white">Trends Admin Portal</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold tracking-wider uppercase border border-blue-500/30">
                  Live Control
                </span>
              </div>
              <p className="text-xs text-slate-400">Ghana E-Commerce & Sourcing Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={13} /> View Live Storefront
            </Link>
            <button
              onClick={() => navigate({ to: "/home" })}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
            { id: "catalog", label: `Catalog (${totalCatalogCount.toLocaleString()})`, icon: Package },
            { id: "users", label: "User Accounts (4,920)", icon: Users },
            { id: "vendors", label: `Ghana Vendors (${vendorProducts.length})`, icon: Store },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Total Store Catalog</span>
                  <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Package size={18} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {totalCatalogCount.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Activity size={13} className="text-emerald-400 animate-pulse" /> Sourcing actively expanding
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Registered Users</span>
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Users size={18} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">4,920</div>
                <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <ArrowUpRight size={13} /> +24% growth this month
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Ghana Verified Vendors</span>
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Store size={18} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">{Math.max(2, vendorProducts.length)}</div>
                <div className="mt-2 text-xs text-amber-400 font-medium flex items-center gap-1">
                  <Zap size={13} className="fill-amber-400" /> 1-2 Day Express Delivery Guaranteed
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">Catalog Progress</span>
                  <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight">{progressPct}%</div>
                <div className="mt-2 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            {/* Catalog Sourcing Progress Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-800/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                  <RefreshCw size={12} className="animate-spin text-blue-400" /> Live Parallel Catalog Fetcher Active
                </div>
                <h2 className="text-xl font-extrabold text-white">Sourcing Target: 60,000 Products</h2>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  The automated sourcing daemon fetches products continuously across tech, apparel, home decor, and accessories. Throttling is applied to Women's Clothing to balance category quotas.
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shrink-0 text-center min-w-[200px]">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Catalog</div>
                <div className="text-2xl font-black text-white mt-1">{totalCatalogCount.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1">Goal: 60,000 Products</div>
              </div>
            </div>

            {/* Category Breakdown Table & Distribution */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Catalog Category Breakdown</h3>
                  <p className="text-xs text-slate-400">Distribution of products across 14 main sourcing categories</p>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  14 Sourcing Categories
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORY_STATS.map((cat) => (
                  <div key={cat.name} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-200">{cat.name}</span>
                      <span className="text-slate-400">{cat.count.toLocaleString()} items ({cat.pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cat.pct * 2.5}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Catalog Products Manager */}
        {activeTab === "catalog" && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Catalog Sourcing Inspector</h3>
                <p className="text-xs text-slate-400">Inspect fetched products stored across local cache and server API</p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-3 text-slate-500" size={15} />
                <input
                  type="text"
                  placeholder="Search catalog products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Sample Items Count</th>
                    <th className="py-3 px-4">Percentage Share</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
                  {CATEGORY_STATS.map((c) => (
                    <tr key={c.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                      <td className="py-3.5 px-4">{c.count.toLocaleString()} products</td>
                      <td className="py-3.5 px-4">{c.pct}%</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          Active Sourcing
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Users Accounts */}
        {activeTab === "users" && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Registered Account Directory</h3>
                <p className="text-xs text-slate-400">Total registered user accounts across Trends platform</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                4,920 Total Accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Account Type</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
                  {MOCK_REGISTERED_USERS.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                      <td className="py-3.5 px-4">{u.role}</td>
                      <td className="py-3.5 px-4">{u.registeredAt}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.status.includes("Verified")
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Ghana Verified Vendors */}
        {activeTab === "vendors" && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Ghana Verified Vendors Registry</h3>
                <p className="text-xs text-slate-400">Vendors verified with NIA Ghana Card & 1-2 Day Express Delivery agreement</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                1-2 Day Express Verified
              </span>
            </div>

            {vendorProducts.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
                <Store size={32} className="text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Ghana Vendor Products Uploaded Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Vendors can register via Profile page by submitting Ghana Card NIA details and agreeing to 1–2 day express delivery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorProducts.map((vp: any) => (
                  <div key={vp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                    <img src={vp.images?.[0] || vp.img} alt={vp.title} className="w-16 h-16 object-cover rounded-xl border border-slate-800" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{vp.title}</h4>
                      <p className="text-xs text-slate-400">Store: {vp.vendorName}</p>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5">₵{(vp.price * 15).toLocaleString()} GHS</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full mt-1 border border-amber-500/20">
                        ⚡ 1-2 Day Express
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
