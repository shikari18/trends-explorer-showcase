import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import bagImage from "@/assets/onboarding-bag.jpg";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Trends — Discover premium products" },
      { name: "description", content: "Explore curated collections from the world's most exclusive brands." },
    ],
  }),
});

function Onboarding() {
  const navigate = useNavigate();
  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(1200px 800px at 50% -10%, #F2F1EE 0%, #FAFAF8 40%, #F7F7F5 100%)",
        fontFamily,
        color: "#111111",
      }}
    >
      <div
        className="relative"
        style={{
          width: 393,
          height: 852,
          borderRadius: 55,
          padding: 12,
          background: "linear-gradient(145deg, #1a1a1c 0%, #0a0a0c 50%, #1a1a1c 100%)",
          boxShadow:
            "0 60px 120px -30px rgba(20, 20, 30, 0.35), 0 30px 60px -20px rgba(20, 20, 30, 0.25), inset 0 0 0 1.5px rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="relative overflow-hidden w-full h-full"
          style={{ borderRadius: 44, background: "#FFFFFF" }}
        >
          {/* subtle warm lighting */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 60% at 50% 8%, rgba(255, 236, 210, 0.35) 0%, rgba(255,255,255,0) 60%), radial-gradient(60% 40% at 90% 100%, rgba(15,98,254,0.05) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          {/* Top right Skip */}
          <div className="relative flex justify-end px-6 pt-2">
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

          {/* Hero image card */}
          <div className="relative px-6 mt-3">
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "1 / 1.05",
                borderRadius: 28,
                background: "#F7F7F5",
                boxShadow:
                  "0 30px 60px -30px rgba(17,17,17,0.18), 0 10px 24px -12px rgba(17,17,17,0.10), inset 0 0 0 1px rgba(17,17,17,0.03)",
              }}
            >
              <img
                src={bagImage}
                alt="Cream leather handbag on a white marble pedestal"
                width={1024}
                height={1280}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="relative px-8 mt-8">
            <h1
              style={{
                fontSize: 30,
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: -0.9,
                color: "#111111",
              }}
            >
              Discover premium
              <br />products
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
              Explore curated collections from the world's most exclusive brands.
            </p>
          </div>

          {/* Bottom row */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-6 flex items-center justify-between">
            {/* dots */}
            <div className="flex items-center gap-2">
              <span style={{ width: 22, height: 6, borderRadius: 999, background: "#0F62FE" }} />
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "rgba(17,17,17,0.15)" }} />
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "rgba(17,17,17,0.15)" }} />
            </div>

            {/* circular next button */}
            <button
              onClick={() => navigate({ to: "/home" })}
              aria-label="Next"
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

          {/* home indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
            <div style={{ width: 134, height: 5, borderRadius: 3, background: "#111111" }} />
          </div>
        </div>
      </div>
    </main>
  );
}
