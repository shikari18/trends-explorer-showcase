import type { ReactNode } from "react";

export const PHONE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <main
      className="min-h-screen w-full flex items-stretch justify-center"
      style={{
        background: "#FFFFFF",
        fontFamily: PHONE_FONT,
        color: "#111111",
      }}
    >
      <div
        className="relative w-full flex flex-col"
        style={{ background: "#FFFFFF", minHeight: "100svh", height: "100svh", overflow: "hidden" }}
      >
        {children}
      </div>
    </main>
  );
}

export function StatusBar() {
  return (
    <div
      className="w-full shrink-0 select-none pointer-events-none"
      style={{
        height: "max(env(safe-area-inset-top, 0px), 16px)",
        minHeight: "max(env(safe-area-inset-top, 0px), 16px)",
      }}
    />
  );
}

export function HomeIndicator() {
  return null;
}
