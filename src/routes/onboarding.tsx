import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import bagImage from "@/assets/onboarding-bag.jpg";
import curatedImage from "@/assets/home-curated.jpg";
import luxuryImage from "@/assets/col-luxury.jpg";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Trends — Discover premium products" },
      { name: "description", content: "Explore curated collections from the world's most exclusive brands." },
    ],
  }),
});

const SLIDES = [
  {
    image: bagImage,
    alt: "Cream leather handbag on a white marble pedestal",
    title: "Discover premium\nproducts",
    body: "Explore curated collections from the world's most exclusive brands.",
  },
  {
    image: curatedImage,
    alt: "Curated editorial styling",
    title: "Curated just\nfor you",
    body: "Personal recommendations powered by Trends AI, tuned to your taste.",
  },
  {
    image: luxuryImage,
    alt: "Luxury lifestyle imagery",
    title: "Shop the world's\nfinest",
    body: "From daily essentials to iconic pieces — delivered with care.",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const next = () => {
    if (isLast) navigate({ to: "/home" });
    else setIndex((i) => i + 1);
  };

  return (
    <main
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: "#FFFFFF", fontFamily, color: "#111111" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 8%, rgba(255, 236, 210, 0.35) 0%, rgba(255,255,255,0) 60%), radial-gradient(60% 40% at 90% 100%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div className="relative flex justify-end px-6 pt-4">
        <button
          onClick={() => navigate({ to: "/home" })}
          style={{
            fontSize: 14.5,
            fontWeight: 500,
            color: "#666666",
            letterSpacing: -0.1,
            padding: "6px 10px",
          }}
        >
          Skip
        </button>
      </div>

      <div className="relative px-6 mt-3">
        <div
          key={index}
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "1 / 1.05",
            borderRadius: 28,
            background: "#F7F7F5",
            boxShadow:
              "0 30px 60px -30px rgba(17,17,17,0.18), 0 10px 24px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
            animation: "fadeSlide 320ms ease",
          }}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative px-8 mt-8">
        <h1
          style={{
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: -0.9,
            color: "#111111",
            whiteSpace: "pre-line",
          }}
        >
          {slide.title}
        </h1>
        <p
          className="mt-3"
          style={{
            fontSize: 15,
            lineHeight: 1.5,
            color: "#666666",
            letterSpacing: -0.1,
            maxWidth: 320,
          }}
        >
          {slide.body}
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === index ? 22 : 6,
                height: 6,
                borderRadius: 999,
                background: i === index ? "#0F62FE" : "rgba(17,17,17,0.15)",
                transition: "width 260ms ease, background 260ms ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label={isLast ? "Get started" : "Next"}
          className="flex items-center justify-center transition-transform active:scale-[0.96]"
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 12px 30px -10px rgba(17,17,17,0.18), 0 4px 10px -4px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.06)",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "#0F62FE",
              boxShadow:
                "0 6px 16px -4px rgba(15,98,254,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            <ArrowRight size={20} strokeWidth={2.4} color="#fff" />
          </div>
        </button>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}
