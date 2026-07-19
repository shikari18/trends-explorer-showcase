import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame, PHONE_FONT, HomeIndicator } from "@/components/phone/PhoneFrame";

export const Route = createFileRoute("/")({
  component: Splash,
  head: () => ({
    meta: [
      { title: "Trends — Premium shopping, elevated" },
      {
        name: "description",
        content:
          "Trends is the premium e-commerce platform for curated products from the world's most exclusive brands.",
      },
    ],
  }),
});

function Splash() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"in" | "shimmer" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("shimmer"), 500);
    const t2 = setTimeout(() => setPhase("hold"), 1500);
    const t3 = setTimeout(() => setPhase("out"), 2800);
    const t4 = setTimeout(() => navigate({ to: "/language" }), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [navigate]);

  const logoVisible = phase !== "in";
  const fading = phase === "out";

  return (
    <PhoneFrame>
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          background: "#FFFFFF",
          fontFamily: PHONE_FONT,
          opacity: fading ? 0 : 1,
          transition: "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >

        {/* Ambient radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 45% at 50% 50%, rgba(255, 236, 210, 0.55) 0%, rgba(255,255,255,0) 70%), radial-gradient(80% 60% at 50% 50%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)",
            opacity: logoVisible ? 1 : 0.4,
            transition: "opacity 1200ms ease-out",
          }}
        />

        {/* Subtle vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 100% at 50% 50%, rgba(255,255,255,0) 55%, rgba(17,17,17,0.05) 100%)",
          }}
        />

        {/* Logo */}
        <div
          className="relative flex flex-col items-center"
          style={{
            opacity: logoVisible ? 1 : 0,
            transform: `scale(${logoVisible ? 1 : 0.92})`,
            transition:
              "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="relative overflow-hidden">
            <div
              style={{
                fontFamily: PHONE_FONT,
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: -1.6,
                color: "#111111",
                lineHeight: 1,
              }}
            >
              Trends<span style={{ color: "#0F62FE" }}>.</span>
            </div>
            {/* shimmer sweep */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0"
              style={{
                width: "60%",
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.85) 55%, rgba(255,255,255,0) 100%)",
                mixBlendMode: "overlay",
                left: phase === "shimmer" || phase === "hold" || phase === "out" ? "120%" : "-60%",
                transition: "left 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        </div>

        <HomeIndicator />
      </div>
    </PhoneFrame>
  );
}
