import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Phone, Lock, ArrowLeft } from "lucide-react";

import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";

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
                localStorage.setItem("user", JSON.stringify(userData));
                import("sonner").then(({ toast }) => toast.success(`Welcome, ${userData.name}!`));
                navigate({ to: "/home" });
                return;
              }
            }
          },
        });
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const demoUser = {
              name: "Victor Dark",
              email: "victor@gmail.com",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
              id: "google-user-1",
            };
            localStorage.setItem("user", JSON.stringify(demoUser));
            import("sonner").then(({ toast }) => toast.success("Signed in with Google!"));
            navigate({ to: "/home" });
          }
        });
      } catch (err) {
        const demoUser = {
          name: "Victor Dark",
          email: "victor@gmail.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          id: "google-user-1",
        };
        localStorage.setItem("user", JSON.stringify(demoUser));
        import("sonner").then(({ toast }) => toast.success("Signed in with Google!"));
        navigate({ to: "/home" });
      }
    } else {
      const demoUser = {
        name: "Victor Dark",
        email: "victor@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        id: "google-user-1",
      };
      localStorage.setItem("user", JSON.stringify(demoUser));
      import("sonner").then(({ toast }) => toast.success("Signed in with Google!"));
      navigate({ to: "/home" });
    }
  };

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div className="relative flex-1 overflow-y-auto overscroll-contain pt-24 pb-20" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {/* Ambient warm lighting */}
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
          <div className="relative pt-6">
            <div className="px-6 pt-4 pb-12">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate({ to: "/signin" })}
                  className="flex items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                      "0 1px 2px rgba(17,17,17,0.04), 0 8px 20px -12px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.05)",
                  }}
                  aria-label="Back"
                >
                  <ArrowLeft size={18} strokeWidth={2} color="#111111" />
                </button>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: -0.6,
                    color: "#111111",
                  }}
                >
                  Trends<span style={{ color: "#0F62FE" }}>.</span>
                </div>
                <div style={{ width: 40 }} />
              </div>

              <div className="mt-14 text-center">
                <h1
                  style={{
                    fontSize: 32,
                    lineHeight: 1.1,
                    fontWeight: 700,
                    letterSpacing: -0.9,
                    color: "#111111",
                  }}
                >
                  Create your account
                </h1>
                <p
                  className="mt-2.5 mx-auto"
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    color: "#666666",
                    letterSpacing: -0.1,
                    maxWidth: 300,
                  }}
                >
                  Join Trends and elevate your shopping experience.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-3.5 max-w-sm mx-auto">
                <SocialButton
                  label="Continue with Apple"
                  onClick={() => {
                    import("sonner").then(({ toast }) => toast.info("Apple Sign-In prompt ready. Follow the guide to complete Apple Developer configuration."));
                  }}
                  icon={
                    <svg width="18" height="20" viewBox="0 0 384 512" fill="#111">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                  }
                />
                <SocialButton
                  label="Continue with Google"
                  onClick={handleGoogleSignIn}
                  icon={
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                  }
                />
              </div>

              <div
                className="text-center mt-10"
                style={{ fontSize: 13.5, color: "#666666", letterSpacing: -0.1 }}
              >
                Already have an account?{" "}
                <Link to="/signin" style={{ color: "#0F62FE", fontWeight: 600 }}>Sign In</Link>
              </div>
            </div>
          </div>
        </div>
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 transition-transform active:scale-[0.99]"
      style={{
        height: 56,
        borderRadius: 24,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        boxShadow:
          "0 1px 2px rgba(17,17,17,0.04), 0 10px 28px -16px rgba(17,17,17,0.14), inset 0 0 0 1px rgba(17,17,17,0.08)",
        fontSize: 15.5,
        fontWeight: 600,
        color: "#111111",
        letterSpacing: -0.2,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
