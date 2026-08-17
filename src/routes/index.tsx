import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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

// Timeline (Total 1.5s):
//  0 – 250ms    : fade IN
//  250 – 1150ms : fully visible
//  1150 – 1500ms: fade OUT
//  1500ms (1.5s): navigate to destination

function Splash() {
  const navigate = useNavigate();
  // "in" = invisible, "show" = visible, "out" = fading out
  const [vis, setVis] = useState(false);
  const [out, setOut] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to guarantee the first render with opacity:0
    // has been painted before we flip to opacity:1
    const raf = requestAnimationFrame(() => {
      setTimeout(() => setVis(true), 30);
    });
    const t1 = setTimeout(() => setOut(true), 1150);
    const t2 = setTimeout(() => {
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (savedUser) {
        navigate({ to: "/home" });
      } else {
        navigate({ to: "/onboarding" });
      }
    }, 1500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [navigate]);

  const opacity = out ? 0 : vis ? 1 : 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transition: out
          ? "opacity 350ms ease-in-out"
          : "opacity 300ms ease-out",
      }}
    >
      <img
        src="/image.png"
        alt="Trends"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
        draggable={false}
      />
    </div>
  );
}
