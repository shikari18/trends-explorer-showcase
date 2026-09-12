import { createFileRoute } from "@tanstack/react-router";
import { LegalHubView } from "@/components/legal/LegalPage";

export const Route = createFileRoute("/legal/")({
  component: LegalHubView,
  head: () => ({
    meta: [
      { title: "Trends — Legal Center" },
      {
        name: "description",
        content:
          "Every Trends policy in one place: Terms of Service, Privacy Policy, Cookie & Tracking Policy, Returns & Refunds, Shipping & Delivery, Acceptable Use, Vendor Agreement and Payments.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});
