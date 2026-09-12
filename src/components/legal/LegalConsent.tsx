import { ChevronRight, FileText, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LEGAL_DOCS, LEGAL_CONTACT } from "@/lib/legalDocs";
import { legalDocIcon } from "@/components/legal/legalIcons";

const linkStyle: React.CSSProperties = {
  color: "#0F62FE",
  fontWeight: 600,
  textDecoration: "underline",
  textDecorationColor: "rgba(15,98,254,0.35)",
  textUnderlineOffset: 2,
};

const bodyStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.65,
  color: "#666666",
  letterSpacing: -0.05,
};

type LinkItem = { slug: string; label: string };

/** The core documents referenced inline in the consent sentence. */
const INLINE_LINKS: LinkItem[] = [
  { slug: "terms", label: "Terms of Service" },
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "cookies", label: "Cookie Policy" },
  { slug: "payments", label: "Payments & Pricing" },
  { slug: "refunds", label: "Returns & Refunds" },
];

function LegalLink({
  slug,
  label,
  onNavigate,
}: {
  slug: string;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Link to="/legal/$slug" params={{ slug }} style={linkStyle} onClick={onNavigate}>
      {label}
    </Link>
  );
}

function joinWithAnd(nodes: React.ReactNode[]) {
  return nodes.map((node, i) => (
    <span key={i}>
      {i > 0 && (i === nodes.length - 1 ? " and " : ", ")}
      {node}
    </span>
  ));
}

/**
 * Full consent card used on the sign-up screen.
 * Lists every policy with a tappable link, then a chip row to the Legal Center.
 */
export function LegalConsentCard() {
  return (
    <div
      className="mt-9 max-w-sm mx-auto"
      style={{
        borderRadius: 22,
        background: "#F9F9F7",
        padding: "16px 15px 15px",
        boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center"
          style={{ width: 26, height: 26, borderRadius: 9, background: "rgba(15,98,254,0.11)" }}
        >
          <ShieldCheck size={14} color="#0F62FE" />
        </span>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: 1.1,
            textTransform: "uppercase",
            color: "#8A8A8A",
          }}
        >
          Terms & Privacy
        </span>
      </div>

      <p className="mt-2.5" style={bodyStyle}>
        By creating a Trends account you confirm that you are 18 or older — or that a parent or
        guardian has agreed on your behalf — and you accept our{" "}
        {joinWithAnd(
          INLINE_LINKS.map((l) => <LegalLink key={l.slug} slug={l.slug} label={l.label} />),
        )}
        .
      </p>

      <div className="mt-3" style={{ height: 1, background: "rgba(17,17,17,0.06)" }} aria-hidden />

      <div className="mt-3 flex flex-wrap gap-2">
        {LEGAL_DOCS.map((doc) => {
          const Icon = legalDocIcon(doc.slug);
          return (
            <Link
              key={doc.slug}
              to="/legal/$slug"
              params={{ slug: doc.slug }}
              className="flex items-center gap-1.5 transition-transform active:scale-[0.97]"
              style={{
                height: 32,
                padding: "0 11px",
                borderRadius: 999,
                background: "#FFFFFF",
                boxShadow:
                  "inset 0 0 0 1px rgba(17,17,17,0.06), 0 6px 14px -12px rgba(17,17,17,0.35)",
              }}
            >
              <Icon size={12} color="#0F62FE" />
              <span
                style={{ fontSize: 11.5, fontWeight: 650, color: "#111111", letterSpacing: -0.1 }}
              >
                {doc.short}
              </span>
            </Link>
          );
        })}
      </div>

      <Link
        to="/legal"
        className="mt-3 flex items-center justify-between transition-transform active:scale-[0.99]"
        style={{
          borderRadius: 14,
          background: "#111111",
          padding: "11px 13px",
        }}
      >
        <span className="flex items-center gap-2">
          <FileText size={14} color="#FFFFFF" />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#FFFFFF" }}>
            Open the Legal Center
          </span>
        </span>
        <ChevronRight size={15} color="#FFFFFF" />
      </Link>

      <p className="mt-2.5" style={{ fontSize: 10.5, lineHeight: 1.55, color: "#9A9A9A" }}>
        Questions about these documents? Write to {LEGAL_CONTACT.legalEmail}.
      </p>
    </div>
  );
}

/**
 * Compact consent line for the Google sign-up modal and other tight spaces.
 * Tap any policy name to open its full page.
 */
export function LegalConsentInline({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: "#F9F9F7",
        padding: "11px 12px",
        boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)",
      }}
    >
      <p style={{ ...bodyStyle, fontSize: 11.5 }}>
        By continuing you agree to the{" "}
        <LegalLink slug="terms" label="Terms of Service" onNavigate={onNavigate} /> and the{" "}
        <LegalLink slug="privacy" label="Privacy Policy" onNavigate={onNavigate} />, and you accept
        the <LegalLink slug="cookies" label="Cookie Policy" onNavigate={onNavigate} />.
      </p>
      <Link
        to="/legal"
        onClick={onNavigate}
        className="mt-1.5 inline-flex items-center gap-1"
        style={{ fontSize: 11.5, fontWeight: 700, color: "#0F62FE" }}
      >
        View all policies <ChevronRight size={12} />
      </Link>
    </div>
  );
}
