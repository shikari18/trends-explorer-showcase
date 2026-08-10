import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Phone, Lock, ArrowLeft, X } from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";
import { syncUserVendorAccount } from "@/lib/vendor";

export const Route = createFileRoute("/signup")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Trends — Create your account" },
      { name: "description", content: "Sign up for Trends and elevate your shopping experience." },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  function parseJwt(token: string) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1016880306656-vit95sbsvf2ptld2u14m9d4gr9tv056t.apps.googleusercontent.com";
    
    // First try Google OAuth2 Token Client (opens real Google OAuth popup window)
    if (typeof window !== "undefined" && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                if (profile?.email) {
                  const userData = {
                    name: profile.name || profile.given_name || profile.email.split("@")[0],
                    email: profile.email,
                    avatar: profile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.email)}`,
                    id: profile.sub || `g-${Date.now()}`,
                  };
                  syncUserVendorAccount(userData.email);
                  localStorage.setItem("user", JSON.stringify(userData));
                  import("sonner").then(({ toast }) => toast.success(`Welcome to Trends, ${userData.name}!`));
                  navigate({ to: "/home" });
                  return;
                }
              } catch (err) {
                console.error("Failed fetching Google user info:", err);
              }
            }
          },
        });
        client.requestAccessToken();
        return;
      } catch (e) {
        console.error("Token client error:", e);
      }
    }

    // Try standard Google One Tap ID prompt if token client is unavailable
    if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response?.credential) {
              const userObj = parseJwt(response.credential);
              if (userObj) {
                const userData = {
                  name: userObj.name || userObj.email.split("@")[0],
                  email: userObj.email,
                  avatar: userObj.picture,
                  id: userObj.sub,
                };
                syncUserVendorAccount(userData.email);
                localStorage.setItem("user", JSON.stringify(userData));
                import("sonner").then(({ toast }) => toast.success(`Welcome to Trends, ${userData.name}!`));
                navigate({ to: "/home" });
                return;
              }
            }
          },
        });
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowGoogleModal(true);
          }
        });
        return;
      } catch (err) {
        console.error("Google One Tap error:", err);
      }
    }

    // Open Google Account Modal if popup is blocked or script hasn't loaded
    setShowGoogleModal(true);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim() || !googleEmail.includes("@")) {
      import("sonner").then(({ toast }) => toast.error("Please enter a valid Google email address."));
      return;
    }
    const name = googleName.trim() || googleEmail.split("@")[0];
    const userData = {
      name: name,
      email: googleEmail.trim().toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(googleEmail.trim())}`,
      id: `google-${Date.now()}`,
    };
    syncUserVendorAccount(userData.email);
    localStorage.setItem("user", JSON.stringify(userData));
    import("sonner").then(({ toast }) => toast.success(`Account created for ${userData.name}!`));
    setShowGoogleModal(false);
    navigate({ to: "/home" });
  };

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain pt-24 pb-20" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {/* Ambient background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: 360,
              background:
                "radial-gradient(80% 100% at 50% 0%, rgba(255, 236, 210, 0.4) 0%, rgba(255,255,255,0) 60%), radial-gradient(80% 100% at 50% 0%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          {/* Content */}
          <div className="relative pt-4">
            <div className="px-6 pt-4 pb-12">
              {/* Top Bar */}
              <div className="flex items-center justify-between">
                <Link
                  to="/signin"
                  className="flex items-center justify-center transition-colors hover:bg-gray-100"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: "#F7F7F5",
                    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
                  }}
                >
                  <ArrowLeft size={18} color="#111111" />
                </Link>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: -0.6,
                    color: "#111111",
                  }}
                >
                  Trends<span style={{ color: "#0F62FE" }}>.</span>
                </div>
                <div style={{ width: 40 }} />
              </div>

              {/* Header */}
              <div className="mt-10 text-center">
                <h1
                  style={{
                    fontSize: 32,
                    lineHeight: 1.05,
                    fontWeight: 700,
                    letterSpacing: -1,
                    color: "#111111",
                  }}
                >
                  Create Account
                </h1>
                <p
                  className="mt-3 mx-auto"
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    color: "#666666",
                    letterSpacing: -0.1,
                    maxWidth: 300,
                  }}
                >
                  Sign up to discover curated fashion, tech, and lifestyle items.
                </p>
              </div>

              {/* Social Signup */}
              <div className="mt-10 flex flex-col gap-3.5 max-w-sm mx-auto">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 transition-transform active:scale-[0.99]"
                  style={{
                    height: 56,
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
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Terms note */}
              <div
                className="text-center mt-10 max-w-xs mx-auto"
                style={{ fontSize: 12, lineHeight: 1.5, color: "#8A8A8A" }}
              >
                By creating an account, you agree to Trends’ Terms of Service and Privacy Policy.
              </div>

              {/* Footer */}
              <div
                className="text-center mt-6"
                style={{ fontSize: 13.5, color: "#666666", letterSpacing: -0.1 }}
              >
                Already have an account?{" "}
                <Link to="/signin" style={{ color: "#0F62FE", fontWeight: 600 }}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Google Account Modal (Allows user to sign up with THEIR real account) */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Sign in with Google</h3>
                    <p className="text-xs text-gray-500">Enter your Google account</p>
                  </div>
                </div>
                <button onClick={() => setShowGoogleModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Google Email</label>
                  <input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ama Mensah"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}
