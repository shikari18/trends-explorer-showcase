import { useMemo, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Clock,
  FileText,
  LifeBuoy,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { PhoneFrame, StatusBar, HomeIndicator, PHONE_FONT } from "@/components/phone/PhoneFrame";
import { legalDocIcon } from "@/components/legal/legalIcons";
import {
  LEGAL_CONTACT,
  LEGAL_DOCS,
  getOtherLegalDocs,
  type LegalDoc,
  type LegalSection,
} from "@/lib/legalDocs";

/* ------------------------------------------------------------------ */
/* Shared styles                                                      */
/* ------------------------------------------------------------------ */

const CARD_SHADOW =
  "0 1px 2px rgba(17,17,17,0.04), 0 16px 34px -22px rgba(17,17,17,0.18), inset 0 0 0 1px rgba(17,17,17,0.05)";

const bodyText: React.CSSProperties = {
  fontSize: 13.5,
  lineHeight: 1.68,
  color: "#4A4A4A",
  letterSpacing: -0.05,
};

const inlineLink: React.CSSProperties = {
  color: "#0F62FE",
  fontWeight: 600,
  textDecoration: "underline",
  textDecorationColor: "rgba(15,98,254,0.35)",
  textUnderlineOffset: 2,
};

function circle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: "#F7F7F5",
    boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.06)",
    ...extra,
  };
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                              */
/* ------------------------------------------------------------------ */

/** Renders a paragraph and turns trailing "→ /legal/x" cross-references into links. */
function Paragraph({ text }: { text: string }) {
  const match = text.match(/^(.*?)\s*→\s*\/legal\/([a-z-]+)\s*$/);
  if (match) {
    const slug = match[2];
    const target = LEGAL_DOCS.find((d) => d.slug === slug);
    return (
      <p style={bodyText}>
        {match[1]}{" "}
        <Link to="/legal/$slug" params={{ slug }} style={inlineLink}>
          {target ? target.short : "Read the policy"}
        </Link>
      </p>
    );
  }
  return <p style={bodyText}>{text}</p>;
}

function SectionBlock({
  doc,
  section,
  index,
}: {
  doc: LegalDoc;
  section: LegalSection;
  index: number;
}) {
  return (
    <section id={section.id} style={{ scrollMarginTop: 16 }} className="mt-8">
      <h2
        style={{
          fontSize: 16.5,
          fontWeight: 700,
          color: "#111111",
          letterSpacing: -0.4,
          lineHeight: 1.3,
        }}
      >
        {section.heading}
      </h2>

      {section.paragraphs?.map((p, i) => (
        <div key={i} className={i === 0 ? "mt-2.5" : "mt-3"}>
          <Paragraph text={p} />
        </div>
      ))}

      {section.bullets && (
        <ul className="mt-3 space-y-2.5">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "#0F62FE",
                  marginTop: 7,
                  flexShrink: 0,
                  opacity: 0.85,
                }}
              />
              <span style={bodyText}>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        <div
          className="mt-3.5 overflow-x-auto"
          style={{ borderRadius: 16, WebkitOverflowScrolling: "touch" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 460 }}>
            <thead>
              <tr>
                {section.table.headers.map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      color: "#8A8A8A",
                      background: "#F7F7F5",
                      padding: "10px 12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#FFFFFF" : "#FBFAF8" }}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        color: ci === 0 ? "#111111" : "#555555",
                        fontWeight: ci === 0 ? 600 : 400,
                        padding: "10px 12px",
                        verticalAlign: "top",
                        borderTop: "1px solid rgba(17,17,17,0.05)",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.note && (
        <div
          className="mt-3.5 flex items-start gap-2.5"
          style={{
            borderRadius: 14,
            background: "rgba(15,98,254,0.05)",
            padding: "12px 13px",
            boxShadow: "inset 0 0 0 1px rgba(15,98,254,0.12)",
          }}
        >
          <AlertTriangle size={14} color="#0F62FE" style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ ...bodyText, color: "#33415C", fontSize: 12.5 }}>{section.note}</span>
        </div>
      )}

      <span className="sr-only">{`End of section ${index + 1} of ${doc.title}`}</span>
    </section>
  );
}

function RelatedDocs({ slug }: { slug: string }) {
  const others = useMemo(() => getOtherLegalDocs(slug), [slug]);
  return (
    <div className="mt-10">
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#8A8A8A",
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        Other legal documents
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2.5">
        {others.map((doc) => {
          const Icon = legalDocIcon(doc.slug);
          return (
            <Link
              key={doc.slug}
              to="/legal/$slug"
              params={{ slug: doc.slug }}
              className="flex items-center gap-3 transition-transform active:scale-[0.99]"
              style={{
                borderRadius: 16,
                background: "#FFFFFF",
                padding: "12px 13px",
                boxShadow: CARD_SHADOW,
              }}
            >
              <span
                className="flex items-center justify-center"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 11,
                  background: "rgba(15,98,254,0.09)",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color="#0F62FE" />
              </span>
              <span className="flex-1" style={{ fontSize: 13, fontWeight: 650, color: "#111111" }}>
                {doc.short}
              </span>
              <ChevronRight size={16} color="#B4B4B4" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ContactCard({ title = "Questions or complaints" }: { title?: string }) {
  return (
    <div
      className="mt-10"
      style={{
        borderRadius: 22,
        background: "linear-gradient(135deg, rgba(15,98,254,0.07) 0%, #FFFFFF 100%)",
        padding: 18,
        boxShadow: CARD_SHADOW,
      }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex items-center justify-center"
          style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(15,98,254,0.12)" }}
        >
          <LifeBuoy size={16} color="#0F62FE" />
        </span>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: "#111111", letterSpacing: -0.3 }}>
          {title}
        </span>
      </div>
      <p className="mt-2.5" style={bodyText}>
        We answer most legal and privacy questions within 3 business days, and support questions the
        same day.
      </p>
      <div className="mt-3.5 space-y-2">
        <ContactRow label="Legal" value={LEGAL_CONTACT.legalEmail} />
        <ContactRow label="Privacy" value={LEGAL_CONTACT.privacyEmail} />
        <ContactRow label="Support" value={LEGAL_CONTACT.supportEmail} />
        <ContactRow label="Vendors" value={LEGAL_CONTACT.vendorsEmail} />
      </div>
      <Link
        to="/support"
        className="mt-4 flex items-center justify-between"
        style={{ borderRadius: 14, background: "#111111", padding: "12px 14px" }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>Open in-app support</span>
        <ChevronRight size={16} color="#FFFFFF" />
      </Link>
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <a
      href={`mailto:${value}`}
      className="flex items-center gap-2.5"
      style={{
        borderRadius: 12,
        background: "rgba(255,255,255,0.85)",
        padding: "9px 11px",
        boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)",
      }}
    >
      <Mail size={14} color="#0F62FE" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: "#8A8A8A", minWidth: 58 }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#111111", letterSpacing: -0.1 }}>
        {value}
      </span>
    </a>
  );
}

function TopBar({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4">
      <button
        onClick={onBack}
        aria-label="Go back"
        className="flex items-center justify-center"
        style={circle()}
      >
        <ArrowLeft size={18} color="#111111" />
      </button>
      <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111111", letterSpacing: -0.3 }}>
        {label}
      </div>
      <div style={{ width: 40, height: 40 }} />
    </div>
  );
}

function useGoBack(fallback: "/legal" | "/signup" | "/" = "/legal") {
  const router = useRouter();
  return () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      router.navigate({ to: fallback });
    }
  };
}

/* ------------------------------------------------------------------ */
/* Document page (/legal/$slug)                                       */
/* ------------------------------------------------------------------ */

export function LegalDocumentView({ doc }: { doc: LegalDoc }) {
  const goBack = useGoBack();
  const [openToc, setOpenToc] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpenToc(false);
  };

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div
          className="relative flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <TopBar onBack={goBack} label="Legal" />

          <div className="px-5 pt-4 pb-28">
            {/* Header */}
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: 26,
                background: "#FFFFFF",
                padding: 20,
                boxShadow: CARD_SHADOW,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: -50,
                  right: -40,
                  width: 150,
                  height: 150,
                  borderRadius: 999,
                  background: "radial-gradient(circle, rgba(15,98,254,0.16), transparent 70%)",
                }}
              />
              <div className="relative flex items-center gap-2">
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: 1.1,
                    textTransform: "uppercase",
                    color: "#0F62FE",
                    background: "rgba(15,98,254,0.09)",
                    borderRadius: 999,
                    padding: "4px 9px",
                  }}
                >
                  Trends Legal
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: "#8A8A8A" }}>
                  Version {doc.version}
                </span>
              </div>
              <h1
                className="relative mt-3"
                style={{
                  fontSize: 26,
                  lineHeight: 1.1,
                  fontWeight: 700,
                  letterSpacing: -0.9,
                  color: "#111111",
                }}
              >
                {doc.title}
              </h1>
              <p
                className="relative mt-2.5"
                style={{ fontSize: 13.5, lineHeight: 1.55, color: "#666666", letterSpacing: -0.1 }}
              >
                {doc.summary}
              </p>

              <div className="relative mt-4 flex flex-wrap items-center gap-2">
                <MetaChip icon={<Clock size={11} />} text={`Updated ${doc.updated}`} />
                <MetaChip icon={<FileText size={11} />} text={`Effective ${doc.effective}`} />
                <MetaChip icon={<Clock size={11} />} text={`~${doc.readMinutes} min read`} />
              </div>

              <p
                className="relative mt-3.5"
                style={{ fontSize: 12, lineHeight: 1.5, color: "#8A8A8A" }}
              >
                Applies to: {doc.appliesTo}
              </p>
            </div>

            {/* Table of contents */}
            <div
              className="mt-4"
              style={{
                borderRadius: 22,
                background: "#F9F9F7",
                padding: 16,
                boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)",
              }}
            >
              <button
                onClick={() => setOpenToc((v) => !v)}
                className="w-full flex items-center justify-between"
                aria-expanded={openToc}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#8A8A8A",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  On this page · {doc.sections.length} sections
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0F62FE" }}>
                  {openToc ? "Hide" : "Show"}
                </span>
              </button>
              {openToc && (
                <div className="mt-3 space-y-1.5">
                  {doc.sections.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className="w-full flex items-start gap-2.5 text-left"
                      style={{
                        borderRadius: 10,
                        padding: "7px 8px",
                        background: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#0F62FE",
                          minWidth: 16,
                          paddingTop: 1,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{
                          fontSize: 12.5,
                          lineHeight: 1.4,
                          color: "#333333",
                          fontWeight: 600,
                        }}
                      >
                        {s.heading.replace(/^\d+\.\s*/, "")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sections */}
            <div className="mt-1">
              {doc.sections.map((section, i) => (
                <SectionBlock key={section.id} doc={doc} section={section} index={i} />
              ))}
            </div>

            <ContactCard />
            <RelatedDocs slug={doc.slug} />

            {/* Footer */}
            <div className="mt-8 text-center" style={bodyText}>
              <p style={{ fontSize: 11.5, color: "#9A9A9A", lineHeight: 1.6 }}>
                {LEGAL_CONTACT.jurisdictionNote}
              </p>
              <Link
                to="/legal"
                className="inline-flex items-center gap-1.5 mt-3"
                style={{ fontSize: 12.5, fontWeight: 700, color: "#0F62FE" }}
              >
                Open the Legal Center <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

function MetaChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span
      className="flex items-center gap-1.5"
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#555555",
        background: "#F7F7F5",
        borderRadius: 999,
        padding: "5px 10px",
        boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)",
      }}
    >
      {icon}
      {text}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Legal Center hub (/legal)                                          */
/* ------------------------------------------------------------------ */

export function LegalHubView() {
  const goBack = useGoBack("/signup");

  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div
          className="relative flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <TopBar onBack={goBack} label="Legal Center" />

          <div className="px-5 pt-4 pb-28">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: 26,
                background:
                  "linear-gradient(135deg, rgba(15,98,254,0.09) 0%, rgba(255,255,255,0.95) 100%)",
                padding: 20,
                boxShadow: CARD_SHADOW,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  bottom: -40,
                  right: -40,
                  width: 150,
                  height: 150,
                  borderRadius: 999,
                  background: "radial-gradient(circle, rgba(52,199,89,0.16), transparent 70%)",
                }}
              />
              <h1
                className="relative"
                style={{ fontSize: 27, fontWeight: 700, letterSpacing: -0.9, color: "#111111" }}
              >
                Legal Center
              </h1>
              <p
                className="relative mt-2"
                style={{ fontSize: 13.5, lineHeight: 1.55, color: "#555555" }}
              >
                Every policy that governs your Trends account, in one place. Version{" "}
                {LEGAL_DOCS[0]?.version} · updated {LEGAL_DOCS[0]?.updated}.
              </p>
              <p
                className="relative mt-3"
                style={{ fontSize: 11.5, lineHeight: 1.55, color: "#8A8A8A" }}
              >
                {LEGAL_CONTACT.jurisdictionNote}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              {LEGAL_DOCS.map((doc) => {
                const Icon = legalDocIcon(doc.slug);
                return (
                  <Link
                    key={doc.slug}
                    to="/legal/$slug"
                    params={{ slug: doc.slug }}
                    className="flex items-start gap-3 transition-transform active:scale-[0.99]"
                    style={{
                      borderRadius: 20,
                      background: "#FFFFFF",
                      padding: 15,
                      boxShadow: CARD_SHADOW,
                    }}
                  >
                    <span
                      className="flex items-center justify-center"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        background: "rgba(15,98,254,0.09)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={17} color="#0F62FE" />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#111111",
                            letterSpacing: -0.25,
                          }}
                        >
                          {doc.title}
                        </span>
                      </span>
                      <span
                        className="block mt-1"
                        style={{ fontSize: 12.5, lineHeight: 1.5, color: "#666666" }}
                      >
                        {doc.summary}
                      </span>
                      <span className="block mt-1.5" style={{ fontSize: 11, color: "#9A9A9A" }}>
                        v{doc.version} · updated {doc.updated} · ~{doc.readMinutes} min
                      </span>
                    </span>
                    <ChevronRight
                      size={16}
                      color="#B4B4B4"
                      style={{ marginTop: 10, flexShrink: 0 }}
                    />
                  </Link>
                );
              })}
            </div>

            <ContactCard title="Can't find what you need?" />
          </div>
        </div>
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Not-found fallback for an unknown :slug                            */
/* ------------------------------------------------------------------ */

export function LegalNotFoundView({ slug }: { slug: string }) {
  const goBack = useGoBack();
  return (
    <PhoneFrame>
      <>
        <StatusBar />
        <div
          className="relative flex-1 overflow-y-auto overscroll-contain pb-24"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <TopBar onBack={goBack} label="Legal" />
          <div className="px-5 pt-4">
            <div
              style={{
                borderRadius: 24,
                background: "#FFFFFF",
                padding: 20,
                boxShadow: CARD_SHADOW,
              }}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert size={18} color="#0F62FE" />
                <h1
                  style={{ fontSize: 19, fontWeight: 700, color: "#111111", letterSpacing: -0.5 }}
                >
                  Document not found
                </h1>
              </div>
              <p className="mt-2.5" style={bodyText}>
                We could not find a policy called{" "}
                <span style={{ fontFamily: PHONE_FONT, fontWeight: 700, color: "#111111" }}>
                  {slug}
                </span>
                . It may have been renamed or withdrawn. Every current document is listed in the
                Legal Center.
              </p>
              <Link
                to="/legal"
                className="mt-4 flex items-center justify-between"
                style={{ borderRadius: 14, background: "#111111", padding: "12px 14px" }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
                  Open the Legal Center
                </span>
                <ChevronRight size={16} color="#FFFFFF" />
              </Link>
            </div>
            <RelatedDocs slug={slug} />
          </div>
        </div>
        <HomeIndicator />
      </>
    </PhoneFrame>
  );
}
