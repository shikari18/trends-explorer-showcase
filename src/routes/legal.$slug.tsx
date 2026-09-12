import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LegalDocumentView, LegalNotFoundView } from "@/components/legal/LegalPage";
import { getLegalDoc } from "@/lib/legalDocs";

export const Route = createFileRoute("/legal/$slug")({
  component: LegalDocumentRoute,
  head: () => ({
    meta: [
      { title: "Trends — Legal & Policies" },
      {
        name: "description",
        content:
          "Read the Trends terms, privacy, cookie, returns, shipping, acceptable use, vendor and payment policies.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});

function LegalDocumentRoute() {
  const { slug } = Route.useParams();
  const doc = getLegalDoc(slug);

  // Keep the tab title in sync with the document being read (client-side).
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = doc ? `Trends — ${doc.title}` : "Trends — Legal";
    return () => {
      document.title = "Trends";
    };
  }, [doc]);

  if (!doc) return <LegalNotFoundView slug={slug} />;
  return <LegalDocumentView doc={doc} />;
}
