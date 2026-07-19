import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLogin,
  head: () => ({ meta: [{ title: "Trends — Admin" }] }),
});

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (password === "obed123") {
      navigate({ to: "/admin/dashboard" });
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "#FFFFFF",
        fontFamily: FONT,
        color: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(15,98,254,0.07) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "#0F62FE",
              boxShadow: "0 12px 30px -8px rgba(15,98,254,0.45)",
              marginBottom: 16,
            }}
          >
            <ShieldCheck size={28} color="#fff" strokeWidth={2.2} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.8 }}>
            Trends<span style={{ color: "#0F62FE" }}>.</span> Admin
          </div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 6 }}>
            Enter your password to continue
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            borderRadius: 28,
            background: "#fff",
            boxShadow:
              "0 2px 4px rgba(17,17,17,0.04), 0 20px 50px -20px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)",
            padding: 24,
            animation: shake ? "shake 0.4s ease" : undefined,
          }}
        >
          <label style={{ fontSize: 12, fontWeight: 600, color: "#8A8A8A", letterSpacing: 0.3, textTransform: "uppercase" }}>
            Password
          </label>
          <div
            className="flex items-center gap-2 mt-2 px-4"
            style={{
              height: 52,
              borderRadius: 16,
              background: "#F7F7F5",
              boxShadow: error
                ? "inset 0 0 0 1.5px rgba(255,59,48,0.6)"
                : "inset 0 0 0 1.5px rgba(17,17,17,0.07)",
              transition: "box-shadow 200ms",
            }}
          >
            <Lock size={16} color={error ? "#FF3B30" : "#8A8A8A"} />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="••••••••"
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: 15, color: "#111", letterSpacing: show ? -0.2 : 4 }}
            />
            <button onClick={() => setShow(!show)} style={{ color: "#8A8A8A" }}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && (
            <div style={{ fontSize: 12, color: "#FF3B30", marginTop: 8, fontWeight: 500 }}>
              Incorrect password. Try again.
            </div>
          )}

          <button
            onClick={submit}
            className="w-full flex items-center justify-center mt-5"
            style={{
              height: 52,
              borderRadius: 16,
              background: "#0F62FE",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: -0.2,
              boxShadow: "0 12px 24px -8px rgba(15,98,254,0.45)",
            }}
          >
            Access Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </main>
  );
}
