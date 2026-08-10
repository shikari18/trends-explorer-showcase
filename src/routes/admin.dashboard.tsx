import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShoppingBag, Users, Package, TrendingUp, CheckCircle2,
  Clock, Truck, AlertCircle, ChevronRight, LogOut,
  BarChart3, ShieldCheck, Search, Zap, Layers, RefreshCw,
  Store, CreditCard, ExternalLink, Activity, ArrowUpRight, UserCheck,
  LayoutDashboard, Grid, Shield, Sparkles, Filter, SlidersHorizontal, Check, Eye
} from "lucide-react";
import { getAllCachedProducts } from "@/lib/cjApi";
import { getVendorProducts, getAllRegisteredUsers, RegisteredUser, VendorProduct } from "@/lib/vendor";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Trends — Control Center Admin" }] }),
});

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const CATEGORY_STATS = [
  { name: "Women's Clothing", count: 7319, pct: 14.9, color: "#FF2D55", tag: "Apparel" },
  { name: "Men's Clothing", count: 5235, pct: 10.7, color: "#0F62FE", tag: "Apparel" },
  { name: "Jewelry & Watches", count: 5114, pct: 10.4, color: "#FF9500", tag: "Accessories" },
  { name: "Home, Garden & Furniture", count: 4738, pct: 9.7, color: "#AF52DE", tag: "Home" },
  { name: "Health, Beauty & Hair", count: 3300, pct: 6.7, color: "#FF3B30", tag: "Beauty" },
  { name: "Bags & Shoes", count: 3149, pct: 6.4, color: "#34C759", tag: "Fashion" },
  { name: "Pet Supplies", count: 3081, pct: 6.3, color: "#5856D6", tag: "Pets" },
  { name: "Sports & Outdoors", count: 2908, pct: 5.9, color: "#00C7BE", tag: "Sports" },
  { name: "Toys, Kids & Babies", count: 2887, pct: 5.9, color: "#FFCC00", tag: "Kids" },
  { name: "Home Improvement", count: 2426, pct: 4.9, color: "#32ADE6", tag: "Home" },
  { name: "Phones & Accessories", count: 2415, pct: 4.9, color: "#30B0C7", tag: "Electronics" },
  { name: "Automobiles & Motorcycles", count: 2395, pct: 4.9, color: "#FF6482", tag: "Automotive" },
  { name: "Consumer Electronics", count: 2341, pct: 4.8, color: "#5AC8FA", tag: "Electronics" },
  { name: "Computer & Office", count: 1773, pct: 3.6, color: "#64D2FF", tag: "Electronics" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<"overview" | "users" | "categories" | "vendors">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCatalogCount, setTotalCatalogCount] = useState(49081);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [userFilter, setUserFilter] = useState<"all" | "vendor" | "customer">("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = getAllCachedProducts();
        if (cached && cached.length > 0) setTotalCatalogCount(cached.length);
        const vp = getVendorProducts();
        setVendorProducts(vp);
        const users = getAllRegisteredUsers();
        setRegisteredUsers(users);
      } catch (e) {
        console.error("Error loading admin stats:", e);
      }
    }
  }, []);

  const totalGoal = 60000;
  const progressPct = Math.min(100, parseFloat(((totalCatalogCount / totalGoal) * 100).toFixed(1)));

  // Filter real users
  const filteredUsers = registeredUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (userFilter === "vendor") return matchesSearch && u.role.includes("Vendor");
    if (userFilter === "customer") return matchesSearch && !u.role.includes("Vendor");
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111111] flex flex-col md:flex-row" style={{ fontFamily: FONT }}>
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200/80 p-6 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F62FE] flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/30">
              T
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-[#111111]">
                Trends<span className="text-[#0F62FE]">.</span> Admin
              </div>
              <div className="text-[11px] text-gray-500 font-semibold">Store Control Center</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Executive Overview", icon: LayoutDashboard, badge: `${totalCatalogCount.toLocaleString()}` },
              { id: "users", label: "Real User Accounts", icon: Users, badge: `${registeredUsers.length}` },
              { id: "categories", label: "Category Distribution", icon: Grid, badge: "14" },
              { id: "vendors", label: "Ghana Express Vendors", icon: Store, badge: `${vendorProducts.length}` },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeNav === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveNav(nav.id as any)}
                  className={`w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-[#0F62FE] text-white shadow-md shadow-blue-600/25"
                      : "text-gray-600 hover:text-[#111111] hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} />
                    <span>{nav.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {nav.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="pt-6 border-t border-gray-200/80 space-y-3">
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <div className="text-[11px] font-bold text-blue-900">
              Live Sourcing Active
            </div>
          </div>

          <Link
            to="/home"
            className="w-full px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#111111] transition-colors flex items-center justify-center gap-2 border border-gray-200/80"
          >
            <ExternalLink size={14} /> Open Main Storefront
          </Link>
          <button
            onClick={() => navigate({ to: "/home" })}
            className="w-full px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={14} /> Exit Admin Session
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-[#111111] tracking-tight">
              {activeNav === "overview" && "Executive Store Dashboard"}
              {activeNav === "users" && "Registered Accounts & User Directory"}
              {activeNav === "categories" && "Sourcing Category Matrix"}
              {activeNav === "vendors" && "Ghana Express Local Vendor Registry"}
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Live system data synced across local cache, vendor registry, and store catalog.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search portal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-[#111111] placeholder-gray-400 focus:outline-none focus:border-blue-600 w-56"
              />
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 shrink-0">
              <ShieldCheck size={14} /> System Verified
            </div>
          </div>
        </div>

        {/* View 1: Executive Overview */}
        {activeNav === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Store Catalog</span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0F62FE] flex items-center justify-center font-bold">
                    <Package size={20} />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#111111] tracking-tight">
                  {totalCatalogCount.toLocaleString()}
                </div>
                <div className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Activity size={13} className="animate-pulse" /> Sourcing actively running
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Real User Accounts</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Users size={20} />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#111111] tracking-tight">
                  {registeredUsers.length}
                </div>
                <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <UserCheck size={13} /> {registeredUsers.length} live registered session(s)
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Local Ghana Vendors</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Store size={20} />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#111111] tracking-tight">
                  {vendorProducts.length}
                </div>
                <div className="mt-2 text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Zap size={13} className="fill-amber-600" /> 1-2 Day Express Delivery
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Goal (60K)</span>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Layers size={20} />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#111111] tracking-tight">
                  {progressPct}%
                </div>
                <div className="mt-2.5 w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            {/* Visual Live Sourcing Deck Banner */}
            <div className="p-7 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-3 relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30">
                  <RefreshCw size={12} className="animate-spin text-white" /> Parallel Sourcing Engine Active
                </div>
                <h2 className="text-2xl font-black tracking-tight">Continuous Catalog Target: 60,000 Items</h2>
                <p className="text-xs text-blue-100 leading-relaxed font-medium">
                  Products are dynamically populated into local cache across Electronics, Computers, Apparel, Home & Furniture, and Accessories with balanced quotas.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shrink-0 text-center min-w-[210px] relative z-10 shadow-lg">
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">Total Catalog Count</div>
                <div className="text-3xl font-black text-white mt-1">{totalCatalogCount.toLocaleString()}</div>
                <div className="text-xs font-bold text-emerald-300 mt-1">Goal: 60,000 Products</div>
              </div>
            </div>

            {/* Registered Users Quick Preview Module */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#111111]">Real Registered Accounts ({registeredUsers.length})</h3>
                  <p className="text-xs text-gray-500">Live accounts logged into Trends</p>
                </div>
                <button
                  onClick={() => setActiveNav("users")}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#0F62FE] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  View All Directory <ChevronRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredUsers.slice(0, 6).map((u, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center gap-3.5 hover:bg-white hover:shadow-md transition-all">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-2xl object-cover border border-gray-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-[#0F62FE] text-white flex items-center justify-center font-black text-sm shrink-0">
                        {u.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-[#111111] truncate">{u.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono truncate">{u.email}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          u.role.includes("Vendor") ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View 2: Real User Accounts Directory */}
        {activeNav === "users" && (
          <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#111111]">Real Registered Users Directory</h3>
                <p className="text-xs text-gray-500 font-medium">Dynamically populated accounts logged into Trends</p>
              </div>

              {/* User Filter Controls */}
              <div className="flex items-center gap-2">
                {[
                  { id: "all", label: `All (${registeredUsers.length})` },
                  { id: "vendor", label: "Ghana Vendors" },
                  { id: "customer", label: "Customers" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setUserFilter(f.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      userFilter === f.id
                        ? "bg-[#0F62FE] text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-10 text-center bg-gray-50 rounded-2xl border border-gray-200">
                <Users size={36} className="text-gray-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#111111]">No User Accounts Match Criteria</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  When users log in or register on the site, their profile will automatically show up here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((u, i) => (
                  <div key={i} className="p-5 rounded-3xl bg-gray-50/90 border border-gray-200/80 flex flex-col justify-between space-y-4 hover:bg-white hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3.5">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-[#0F62FE] text-white flex items-center justify-center font-black text-base shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                      )}
                      <div className="overflow-hidden flex-1">
                        <h4 className="font-extrabold text-sm text-[#111111] truncate">{u.name}</h4>
                        <p className="text-xs font-mono text-gray-500 truncate">{u.email}</p>
                        {u.storeName && (
                          <div className="text-xs font-bold text-blue-600 mt-0.5 truncate">
                            Store: {u.storeName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        u.role.includes("Vendor")
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {u.role}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {u.registeredAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 3: Category Distribution Matrix */}
        {activeNav === "categories" && (
          <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-extrabold text-[#111111]">14 Sourcing Categories Matrix</h3>
              <p className="text-xs text-gray-500 font-medium">Item volume and percentage share across all categories</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORY_STATS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((cat) => (
                <div key={cat.name} className="p-5 rounded-3xl bg-gray-50/90 border border-gray-200/80 space-y-3 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-gray-600 border border-gray-200">
                      {cat.tag}
                    </span>
                    <span className="text-xs font-bold text-gray-500">{cat.pct}%</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-[#111111]">{cat.name}</h4>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">{cat.count.toLocaleString()} products</p>
                  </div>

                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.pct * 2.5}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View 4: Ghana Verified Vendors */}
        {activeNav === "vendors" && (
          <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#111111]">Ghana Verified Local Vendors</h3>
                <p className="text-xs text-gray-500 font-medium">Ghana Card verified vendors with 1-2 Day Express Delivery agreement</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                1-2 Day Express Verified
              </span>
            </div>

            {vendorProducts.length === 0 ? (
              <div className="p-10 text-center bg-gray-50 rounded-2xl border border-gray-200">
                <Store size={36} className="text-gray-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#111111]">No Local Vendor Products Uploaded Yet</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Vendors can register on Profile page by submitting Ghana Card NIA details and listing products for 1–2 day express local delivery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendorProducts.map((vp: any) => (
                  <div key={vp.id} className="p-4 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-3 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-3.5">
                      <img src={vp.images?.[0] || vp.img} alt={vp.title} className="w-16 h-16 object-cover rounded-2xl border border-gray-200 shrink-0" />
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-extrabold text-[#111111] truncate">{vp.title}</h4>
                        <p className="text-[11px] text-gray-500 font-bold">Store: {vp.vendorName}</p>
                        <p className="text-xs font-black text-emerald-600 mt-0.5">₵{(vp.price * 15).toLocaleString()} GHS</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        ⚡ 1-2 Day Express
                      </span>
                      <Link to={`/product/${vp.id}`} className="text-xs font-bold text-[#0F62FE] hover:underline flex items-center gap-0.5">
                        Inspect <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
