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
  return <div style={{ height: 12 }} />;
}

export function HomeIndicator() {
  return null;
}
