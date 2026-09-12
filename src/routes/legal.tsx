import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout route for everything under /legal.
 * Each child route renders its own PhoneFrame shell, so this only passes through.
 */
export const Route = createFileRoute("/legal")({
  component: LegalLayout,
});

function LegalLayout() {
  return <Outlet />;
}
