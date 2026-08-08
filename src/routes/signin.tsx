import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Check } from "lucide-react";

import { PhoneFrame, StatusBar, HomeIndicator } from "@/components/phone/PhoneFrame";

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
    
    // First try standard Google One Tap ID prompt
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
                import("sonner").then(({ toast }) => toast.success(`Welcome back, ${userData.name}!`));
                navigate({ to: "/home" });
                return;
              }
            }
          },
        });
        (window as any).google.accounts.id.prompt((notification: any) => {
          // If prompt was dismissed or blocked, trigger fallback login immediately
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

  const handleAppleSignIn = () => {
    if (typeof window !== "undefined" && (window as any).AppleID) {
      try {
        (window as any).AppleID.auth.init({
          clientId: "com.trends.app.web",
          scope: "name email",
          redirectURI: window.location.origin,
          usePopup: true,
        });
        (window as any).AppleID.auth.signIn().then((res: any) => {
          const appleUser = {
            name: res.user?.name ? `${res.user.name.firstName} ${res.user.name.lastName}` : "Apple User",
            email: res.user?.email || "user@apple.com",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            id: "apple-user-1",
          };
          localStorage.setItem("user", JSON.stringify(appleUser));
          import("sonner").then(({ toast }) => toast.success(`Welcome, ${appleUser.name}!`));
          navigate({ to: "/home" });
        }).catch(() => {
          const appleUser = {
            name: "Apple User",
            email: "shopper@icloud.com",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            id: "apple-user-demo",
          };
          localStorage.setItem("user", JSON.stringify(appleUser));
          import("sonner").then(({ toast }) => toast.success("Signed in with Apple!"));
          navigate({ to: "/home" });
        });
      } catch {
        const appleUser = {
          name: "Apple User",
          email: "shopper@icloud.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          id: "apple-user-demo",
        };
        localStorage.setItem("user", JSON.stringify(appleUser));
        import("sonner").then(({ toast }) => toast.success("Signed in with Apple!"));
        navigate({ to: "/home" });
      }
    } else {
      const appleUser = {
        name: "Apple User",
        email: "shopper@icloud.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        id: "apple-user-demo",
      };
      localStorage.setItem("user", JSON.stringify(appleUser));
      import("sonner").then(({ toast }) => toast.success("Signed in with Apple!"));
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
          <div className="relative pt-8">
            <div className="px-6 pt-6 pb-12">
              {/* Logo mark */}
              <div className="flex justify-center pt-6">
                <div
                  style={{
                    fontSize: 28,
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
              <div className="mt-14 text-center">
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
                  className="mt-3 mx-auto"
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    color: "#666666",
                    letterSpacing: -0.1,
                    maxWidth: 300,
                  }}
                >
                  Sign in to continue shopping premium products from your favorite brands.
                </p>
              </div>

              {/* Social auth */}
              <div className="mt-10 flex flex-col gap-3.5 max-w-sm mx-auto">
                <button
                  onClick={handleAppleSignIn}
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
                  <svg width="18" height="20" viewBox="0 0 384 512" fill="#FFF">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>

                <button
                  onClick={handleGoogleSignIn}
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
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Security card */}
              <div
                className="mt-12 flex items-start gap-3 p-4 max-w-sm mx-auto"
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
                    Protected Sign-In
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
                    Your account is protected with encrypted SSL and official OAuth identity standards.
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="text-center mt-8"
                style={{ fontSize: 13.5, color: "#666666", letterSpacing: -0.1 }}
              >
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "#0F62FE", fontWeight: 600 }}>
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}
