import { createFileRoute, useNavigate } from "@tanstack/react-router";

// Reset auth on sign out
let _authed = false;
export function resetAdminAuth() { _authed = false; }
import { useState } from "react";
import {
  ShoppingBag, Users, Package, TrendingUp, CheckCircle,
  Clock, Truck, AlertCircle, ChevronRight, LogOut,
  BarChart2, ShieldCheck, Search,
} from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Trends — Admin Dashboard" }] }),
});

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

const STATS = [
  { label: "Total Orders",   value: "1,284",  icon: ShoppingBag, color: "#0F62FE", bg: "rgba(15,98,254,0.10)" },
  { label: "Total Users",    value: "4,920",  icon: Users,       color: "#34C759", bg: "rgba(52,199,89,0.10)" },
  { label: "Products",       value: "312",    icon: Package,     color: "#FF9500", bg: "rgba(255,149,0,0.10)"  },
  { label: "Revenue",        value: "₵2.4M",  icon: TrendingUp,  color: "#AF52DE", bg: "rgba(175,82,222,0.10)" },
];

const ORDERS = [
  { id: "TRD-482917", customer: "Victor Mensah",   item: "Luxury Leather Tote",  amount: "₵2,450", status: "Delivered",  tone: "#34C759" },
  { id: "TRD-482643", customer: "Ama Owusu",       item: "Watch Ultra 3",         amount: "₵899",   status: "Shipped",    tone: "#0F62FE" },
  { id: "TRD-481998", customer: "Kofi Asante",     item: "WH-1000XM6",            amount: "₵449",   status: "Processing", tone: "#FF9500" },
  { id: "TRD-481776", customer: "Abena Boateng",   item: "Air Max Runner",        amount: "₵180",   status: "Delivered",  tone: "#34C759" },
  { id: "TRD-481512", customer: "Kwame Frimpong",  item: "Cashmere Jacket",       amount: "₵1,290", status: "Cancelled",  tone: "#FF3B30" },
  { id: "TRD-481103", customer: "Efua Mensah",     item: "Ceramic Vase",          amount: "₵95",    status: "Delivered",  tone: "#34C759" },
];

const PRODUCTS = [
  { name: "Luxury Leather Tote",   brand: "Saint Laurent",  price: "₵2,450", stock: 8,  sold: 142 },
  { name: "Watch Ultra 3",         brand: "Apple",           price: "₵899",   stock: 23, sold: 98  },
  { name: "WH-1000XM6",            brand: "Sony",            price: "₵449",   stock: 41, sold: 76  },
  { name: "Air Max Runner",        brand: "Nike",            price: "₵180",   stock: 65, sold: 210 },
  { name: "Cashmere Jacket",       brand: "Tom Ford",        price: "₵1,290", stock: 5,  sold: 33  },
];

const USERS = [
  { name: "Victor Mensah",   email: "victor@email.com",  orders: 12, spent: "₵8,240",  joined: "Jan 2026" },
  { name: "Ama Owusu",       email: "ama@email.com",     orders: 7,  spent: "₵3,190",  joined: "Feb 2026" },
  { name: "Kofi Asante",     email: "kofi@email.com",    orders: 4,  spent: "₵1,820",  joined: "Mar 2026" },
  { name: "Abena Boateng",   email: "abena@email.com",   orders: 19, spent: "₵11,500", joined: "Jan 2026" },
  { name: "Kwame Frimpong",  email: "kwame@email.com",   orders: 2,  spent: "₵540",    joined: "Apr 2026" },
];

const STATUS_COUNTS = [
  { label: "Delivered",  count: 842, icon: CheckCircle, color: "#34C759" },
  { label: "Shipped",    count: 203, icon: Truck,       color: "#0F62FE" },
  { label: "Processing", count: 174, icon: Clock,       color: "#FF9500" },
  { label: "Cancelled",  count: 65,  icon: AlertCircle, color: "#FF3B30" },
];

const TABS = ["Overview", "Orders", "Products", "Users"] as const;
type Tab = typeof TABS[number];

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "#F7F7F5",
        fontFamily: FONT,
        color: "#111",
      }}
    >
      {/* Ambient */}
      <div
        aria-hidden
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(15,98,254,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(17,17,17,0.06)",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: "#0F62FE",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ShieldCheck size={16} color="#fff" strokeWidth={2.2} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.4 }}>
            Trends<span style={{ color: "#0F62FE" }}>.</span> Admin
          </div>
        </div>
        <button
          onClick={() => { _authed = false; navigate({ to: "/admin" }); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600, color: "#FF3B30",
            padding: "6px 12px", borderRadius: 999,
            background: "rgba(255,59,48,0.08)",
          }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 80px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.7 }}>
            Good morning, Obed 👋
          </div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            Here's what's happening with your store today.
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex", gap: 8, overflowX: "auto",
            scrollbarWidth: "none", marginBottom: 24,
          }}
        >
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flexShrink: 0,
                  height: 36, padding: "0 16px", borderRadius: 999,
                  fontSize: 13, fontWeight: 600, letterSpacing: -0.2,
                  color: active ? "#fff" : "#111",
                  background: active ? "#0F62FE" : "rgba(255,255,255,0.9)",
                  boxShadow: active
                    ? "0 8px 18px -8px rgba(15,98,254,0.5)"
                    : "0 1px 2px rgba(17,17,17,0.04), inset 0 0 0 1px rgba(17,17,17,0.05)",
                  transition: "all 200ms",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW */}
        {tab === "Overview" && (
          <div>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {STATS.map((s) => (
                <div key={s.label} style={card()}>
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 14,
                      background: s.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <s.icon size={20} color={s.color} strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.6, color: "#111" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#8A8A8A", marginTop: 2, fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Status breakdown */}
            <div style={{ ...card(), marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, letterSpacing: -0.3 }}>
                <BarChart2 size={15} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                Order Status
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {STATUS_COUNTS.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: 14,
                      background: `${s.color}0F`,
                    }}
                  >
                    <s.icon size={16} color={s.color} strokeWidth={2} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#111", letterSpacing: -0.4 }}>
                        {s.count}
                      </div>
                      <div style={{ fontSize: 11, color: "#8A8A8A", fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div style={card()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>Recent Orders</div>
                <button onClick={() => setTab("Orders")} style={{ fontSize: 12.5, fontWeight: 700, color: "#0F62FE" }}>
                  See all →
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ORDERS.slice(0, 4).map((o) => (
                  <OrderRow key={o.id} o={o} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "Orders" && (
          <div>
            <SearchBar value={search} onChange={setSearch} placeholder="Search orders…" />
            <div style={{ ...card(), marginTop: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, letterSpacing: -0.3 }}>
                All Orders ({ORDERS.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {ORDERS.filter((o) =>
                  o.id.toLowerCase().includes(search.toLowerCase()) ||
                  o.customer.toLowerCase().includes(search.toLowerCase()) ||
                  o.item.toLowerCase().includes(search.toLowerCase())
                ).map((o) => (
                  <OrderRow key={o.id} o={o} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === "Products" && (
          <div>
            <SearchBar value={search} onChange={setSearch} placeholder="Search products…" />
            <div style={{ ...card(), marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>
                  All Products ({PRODUCTS.length})
                </div>
                <div
                  style={{
                    height: 28, padding: "0 12px", borderRadius: 999,
                    background: "#0F62FE", color: "#fff",
                    fontSize: 12, fontWeight: 700,
                    display: "flex", alignItems: "center",
                  }}
                >
                  + Add Product
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PRODUCTS.filter((p) =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.brand.toLowerCase().includes(search.toLowerCase())
                ).map((p) => (
                  <div
                    key={p.name}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", borderRadius: 16,
                      background: "#F7F7F5",
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: "rgba(15,98,254,0.08)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Package size={18} color="#0F62FE" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#8A8A8A", marginTop: 1 }}>{p.brand}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{p.price}</div>
                      <div style={{ fontSize: 11, color: "#8A8A8A", marginTop: 1 }}>
                        Stock: <span style={{ color: p.stock < 10 ? "#FF3B30" : "#34C759", fontWeight: 700 }}>{p.stock}</span>
                        &nbsp;·&nbsp;Sold: {p.sold}
                      </div>
                    </div>
                    <ChevronRight size={15} color="#8A8A8A" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === "Users" && (
          <div>
            <SearchBar value={search} onChange={setSearch} placeholder="Search users…" />
            <div style={{ ...card(), marginTop: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, letterSpacing: -0.3 }}>
                All Users ({USERS.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {USERS.filter((u) =>
                  u.name.toLowerCase().includes(search.toLowerCase()) ||
                  u.email.toLowerCase().includes(search.toLowerCase())
                ).map((u) => (
                  <div
                    key={u.email}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", borderRadius: 16,
                      background: "#F7F7F5",
                    }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 999,
                        background: "#0F62FE",
                        color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, flexShrink: 0,
                      }}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#8A8A8A", marginTop: 1 }}>{u.email}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{u.spent}</div>
                      <div style={{ fontSize: 11, color: "#8A8A8A", marginTop: 1 }}>
                        {u.orders} orders · {u.joined}
                      </div>
                    </div>
                    <ChevronRight size={15} color="#8A8A8A" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function OrderRow({ o }: { o: typeof ORDERS[number] }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px", borderRadius: 16,
        background: "#F7F7F5",
      }}
    >
      <div
        style={{
          width: 8, height: 8, borderRadius: 999,
          background: o.tone, flexShrink: 0,
          boxShadow: `0 0 0 3px ${o.tone}22`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111", letterSpacing: -0.2 }}>
          {o.customer}
        </div>
        <div style={{ fontSize: 11.5, color: "#8A8A8A", marginTop: 1 }}>
          #{o.id} · {o.item}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111" }}>{o.amount}</div>
        <div
          style={{
            fontSize: 10, fontWeight: 700, color: o.tone,
            letterSpacing: 0.3, textTransform: "uppercase", marginTop: 1,
          }}
        >
          {o.status}
        </div>
      </div>
      <ChevronRight size={15} color="#8A8A8A" />
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 10,
        height: 46, borderRadius: 14, padding: "0 14px",
        background: "#fff",
        boxShadow: "0 1px 2px rgba(17,17,17,0.04), inset 0 0 0 1px rgba(17,17,17,0.05)",
      }}
    >
      <Search size={16} color="#8A8A8A" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none"
        style={{ fontSize: 14, color: "#111" }}
      />
    </div>
  );
}

function card() {
  return {
    borderRadius: 22,
    background: "#fff",
    boxShadow:
      "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px -18px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.04)",
    padding: 18,
  } as React.CSSProperties;
}
