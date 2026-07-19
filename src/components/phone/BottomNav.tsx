import { Link } from "@tanstack/react-router";
import { Home as HomeIcon, Search, Heart, LayoutGrid, ShoppingBag, User } from "lucide-react";

export type Tab = "home" | "search" | "wishlist" | "collections" | "cart" | "profile";

const ITEMS: { key: Tab; to: string; icon: typeof HomeIcon }[] = [
  { key: "home", to: "/home", icon: HomeIcon },
  { key: "search", to: "/search", icon: Search },
  { key: "wishlist", to: "/wishlist", icon: Heart },
  { key: "collections", to: "/collections", icon: LayoutGrid },
  { key: "cart", to: "/cart", icon: ShoppingBag },
  { key: "profile", to: "/profile", icon: User },
];

export function BottomNav({ active }: { active: Tab; variant?: string }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0"
        style={{
          bottom: 0,
          height: 130,
          background:
            "linear-gradient(to top, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 22 }}>
        <div
          className="flex items-center"
          style={{
            height: 60,
            padding: "0 8px",
            gap: 2,
            borderRadius: 999,
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(24px) saturate(160%)",
            boxShadow:
              "0 20px 40px -18px rgba(17,17,17,0.25), 0 6px 18px -10px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(255,255,255,0.6)",
          }}
        >
          {ITEMS.map(({ key, to, icon: Icon }) => {
            const isActive = key === active;
            return (
              <Link
                key={key}
                to={to}
                className="flex items-center justify-center transition-all"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: isActive ? "rgba(15,98,254,0.10)" : "transparent",
                }}
                aria-label={key}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.4 : 2}
                  color={isActive ? "#0F62FE" : "#8A8A8A"}
                  {...(key === "wishlist" && isActive ? { fill: "#0F62FE" } : {})}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
