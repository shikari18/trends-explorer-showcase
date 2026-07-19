import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Check } from "lucide-react";

export const Route = createFileRoute("/language")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Trends — Choose your language" },
      { name: "description", content: "Select your preferred language on Trends." },
    ],
  }),
});

const LANGUAGES = [
  { name: "English", native: "English", flag: "🇬🇧" },
  { name: "Spanish", native: "Español", flag: "🇪🇸" },
  { name: "French", native: "Français", flag: "🇫🇷" },
  { name: "German", native: "Deutsch", flag: "🇩🇪" },
  { name: "Italian", native: "Italiano", flag: "🇮🇹" },
  { name: "Portuguese", native: "Português", flag: "🇵🇹" },
  { name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { name: "Chinese", native: "中文", flag: "🇨🇳" },
  { name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { name: "Korean", native: "한국어", flag: "🇰🇷" },
];

function Index() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("English");
  const [query, setQuery] = useState("");

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.native.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "#FFFFFF",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: "#111111",
      }}
    >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: 260,
              background:
                "radial-gradient(80% 100% at 50% 0%, rgba(15,98,254,0.06) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          <div className="relative min-h-screen flex flex-col">

            <div className="px-6 pt-6">
              <h1 style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 700, letterSpacing: -0.9, color: "#111111", textAlign: "center" }}>
                Choose your language
              </h1>
              <p className="mt-2.5 mx-auto" style={{ fontSize: 14.5, lineHeight: 1.45, color: "#666666", letterSpacing: -0.1, maxWidth: 300, textAlign: "center" }}>
                Select your preferred language.
                <br />You can change it later.
              </p>
            </div>

            <div className="px-6 mt-6">
              <div className="flex items-center gap-2.5 px-4" style={{ height: 48, borderRadius: 24, background: "#F2F2F0" }}>
                <Search size={18} strokeWidth={2} color="#8A8A8A" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search language"
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 15, color: "#111111", letterSpacing: -0.1 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 mt-5 pb-40" style={{ scrollbarWidth: "none" }}>
              <div className="flex flex-col gap-2.5">
                {filtered.map((lang) => {
                  const isSelected = selected === lang.name;
                  return (
                    <button
                      key={lang.name}
                      onClick={() => setSelected(lang.name)}
                      className="flex items-center w-full text-left transition-all"
                      style={{
                        height: 68,
                        padding: "0 18px 0 14px",
                        borderRadius: 20,
                        background: isSelected ? "rgba(15, 98, 254, 0.06)" : "rgba(255,255,255,0.85)",
                        boxShadow: isSelected
                          ? "0 0 0 1.5px #0F62FE inset, 0 8px 24px -12px rgba(15,98,254,0.25)"
                          : "0 1px 2px rgba(17,17,17,0.04), 0 8px 24px -16px rgba(17,17,17,0.12), inset 0 0 0 1px rgba(17,17,17,0.04)",
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      <div className="flex items-center justify-center shrink-0" style={{ width: 40, height: 40, borderRadius: 14, background: "#F7F7F5", fontSize: 22, marginRight: 14 }}>
                        {lang.flag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#111111", letterSpacing: -0.2, lineHeight: 1.2 }}>{lang.name}</div>
                        <div style={{ fontSize: 13.5, color: "#8A8A8A", letterSpacing: -0.05, marginTop: 2 }}>{lang.native}</div>
                      </div>
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{
                          width: 24, height: 24, borderRadius: 999,
                          background: isSelected ? "#0F62FE" : "transparent",
                          border: isSelected ? "none" : "1.5px solid rgba(17,17,17,0.15)",
                          transition: "all 200ms ease",
                        }}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} color="#fff" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-6"
              style={{ background: "linear-gradient(to top, #ffffff 55%, rgba(255,255,255,0.85) 80%, rgba(255,255,255,0))" }}
            >
              <button
                onClick={() => navigate({ to: "/signup" })}
                className="w-full flex items-center justify-center transition-transform active:scale-[0.98]"
                style={{
                  height: 54, borderRadius: 27, background: "#0F62FE", color: "#FFFFFF",
                  fontSize: 16, fontWeight: 600, letterSpacing: -0.2,
                  boxShadow: "0 12px 30px -8px rgba(15,98,254,0.45), 0 4px 10px -4px rgba(15,98,254,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                Continue
              </button>
              <div className="flex justify-center mt-4">
                <div style={{ width: 134, height: 5, borderRadius: 3, background: "#111111" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
