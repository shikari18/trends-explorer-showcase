import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Check } from "lucide-react";

export const Route = createFileRoute("/signin")({
  component: SignIn,
  head: () => ({
    meta: [
      { title: "Trends — Sign in to your account" },
      {
        name: "description",
        content:
          "Welcome back to Trends. Sign in to continue shopping premium products from your favorite brands.",
      },
    ],
  }),
});

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

  return (
    <main
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: "#FFFFFF",
        fontFamily,
        color: "#111111",
      }}
    >
          {/* Ambient warm lighting */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: 320,
              background:
                "radial-gradient(80% 100% at 50% 0%, rgba(255, 236, 210, 0.4) 0%, rgba(255,255,255,0) 60%), radial-gradient(80% 100% at 50% 0%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          {/* Content */}
          <div className="relative">

            <div className="px-6 pt-3 pb-8">
              {/* Logo mark */}
              <div className="flex justify-center pt-2">
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: -0.8,
                    color: "#111111",
                    lineHeight: 1,
                  }}
                >
                  Trends<span style={{ color: "#0F62FE" }}>.</span>
                </div>
              </div>

              {/* Welcome */}
              <div className="mt-10">
                <h1
                  style={{
                    fontSize: 32,
                    lineHeight: 1.05,
                    fontWeight: 700,
                    letterSpacing: -1,
                    color: "#111111",
                  }}
                >
                  Welcome Back
                </h1>
                <p
                  className="mt-2.5"
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    color: "#666666",
                    letterSpacing: -0.1,
                    maxWidth: 320,
                  }}
                >
                  Sign in to continue shopping premium products from your favorite brands.
                </p>
              </div>

              {/* Social auth */}
              <div className="mt-7 flex flex-col gap-2.5">
                <button
                  className="w-full flex items-center justify-center gap-3 transition-transform active:scale-[0.99]"
                  style={{
                    height: 54,
                    borderRadius: 24,
                    background: "#111111",
                    color: "#FFFFFF",
                    fontSize: 15.5,
                    fontWeight: 600,
                    letterSpacing: -0.2,
                    boxShadow:
                      "0 12px 28px -12px rgba(17,17,17,0.35), 0 4px 10px -4px rgba(17,17,17,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <svg width="18" height="20" viewBox="0 0 384 512" fill="#FFF">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>

                <button
                  className="w-full flex items-center justify-center gap-3 transition-transform active:scale-[0.99]"
                  style={{
                    height: 54,
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "0 1px 2px rgba(17,17,17,0.04), 0 10px 28px -16px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)",
                    fontSize: 15.5,
                    fontWeight: 600,
                    color: "#111111",
                    letterSpacing: -0.2,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div style={{ height: 1, flex: 1, background: "rgba(17,17,17,0.08)" }} />
                <span style={{ fontSize: 12, color: "#8A8A8A", letterSpacing: 0.2 }}>
                  or continue with email
                </span>
                <div style={{ height: 1, flex: 1, background: "rgba(17,17,17,0.08)" }} />
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-3">
                <div>
                  <label
                    className="block ml-1 mb-1.5"
                    style={{ fontSize: 12.5, fontWeight: 500, color: "#666666", letterSpacing: -0.1 }}
                  >
                    Email Address
                  </label>
                  <div
                    className="flex items-center gap-3 px-4"
                    style={{
                      height: 54,
                      borderRadius: 20,
                      background: "rgba(247,247,245,0.85)",
                      backdropFilter: "blur(14px)",
                      boxShadow:
                        "inset 0 0 0 1px rgba(17,17,17,0.05), 0 1px 2px rgba(17,17,17,0.02)",
                    }}
                  >
                    <Mail size={18} strokeWidth={2} color="#8A8A8A" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none"
                      style={{ fontSize: 15.5, color: "#111111", letterSpacing: -0.2 }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block ml-1 mb-1.5"
                    style={{ fontSize: 12.5, fontWeight: 500, color: "#666666", letterSpacing: -0.1 }}
                  >
                    Password
                  </label>
                  <div
                    className="flex items-center gap-3 px-4"
                    style={{
                      height: 54,
                      borderRadius: 20,
                      background: "rgba(247,247,245,0.85)",
                      backdropFilter: "blur(14px)",
                      boxShadow:
                        "inset 0 0 0 1px rgba(17,17,17,0.05), 0 1px 2px rgba(17,17,17,0.02)",
                    }}
                  >
                    <Lock size={18} strokeWidth={2} color="#8A8A8A" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent outline-none"
                      style={{ fontSize: 15.5, color: "#111111", letterSpacing: -0.2 }}
                    />
                    <button
                      onClick={() => setShowPassword((s) => !s)}
                      className="flex items-center justify-center"
                      style={{ width: 32, height: 32, borderRadius: 999 }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff size={18} strokeWidth={2} color="#8A8A8A" />
                      ) : (
                        <Eye size={18} strokeWidth={2} color="#8A8A8A" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick options */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setRemember((r) => !r)}
                  className="flex items-center gap-2"
                  style={{ fontSize: 13.5, color: "#111111", letterSpacing: -0.1 }}
                >
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: remember ? "#0F62FE" : "rgba(255,255,255,0.9)",
                      boxShadow: remember
                        ? "0 4px 10px -4px rgba(15,98,254,0.4)"
                        : "inset 0 0 0 1px rgba(17,17,17,0.15)",
                      transition: "all 180ms ease",
                    }}
                  >
                    {remember && <Check size={13} strokeWidth={3} color="#FFF" />}
                  </span>
                  <span style={{ fontWeight: 500 }}>Remember Me</span>
                </button>
                <button
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#0F62FE",
                    letterSpacing: -0.1,
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => navigate({ to: "/home" })}
                className="w-full flex items-center justify-center transition-transform active:scale-[0.98] mt-6"
                style={{
                  height: 56,
                  borderRadius: 26,
                  background: "#0F62FE",
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: -0.2,
                  boxShadow:
                    "0 14px 32px -8px rgba(15,98,254,0.45), 0 4px 10px -4px rgba(15,98,254,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                Sign In
              </button>

              {/* Security card */}
              <div
                className="mt-6 flex items-start gap-3 p-4"
                style={{
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 10px 30px -14px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.04)",
                }}
              >
                <div
                  className="flex items-center justify-center flex-none"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: "rgba(15,98,254,0.08)",
                  }}
                >
                  <ShieldCheck size={18} strokeWidth={2} color="#0F62FE" />
                </div>
                <div className="flex-1">
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#111111",
                      letterSpacing: -0.1,
                    }}
                  >
                    Secure Sign-In
                  </div>
                  <div
                    className="mt-0.5"
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.4,
                      color: "#666666",
                      letterSpacing: -0.05,
                    }}
                  >
                    Your account is protected with end-to-end encryption and biometric
                    authentication.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="text-center mt-6"
                style={{ fontSize: 13.5, color: "#666666", letterSpacing: -0.1 }}
              >
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "#0F62FE", fontWeight: 600 }}>
                  Sign Up
                </Link>
              </div>

              <div className="flex justify-center mt-8">
                <div style={{ width: 134, height: 5, borderRadius: 3, background: "#111111" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
