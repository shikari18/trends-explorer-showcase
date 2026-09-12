import {
  Cookie,
  CreditCard,
  FileText,
  RefreshCcw,
  Scale,
  Shield,
  ShieldAlert,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";

/** Icon shown next to each legal document, keyed by document slug. */
const DOC_ICONS: Record<string, LucideIcon> = {
  terms: Scale,
  privacy: Shield,
  cookies: Cookie,
  refunds: RefreshCcw,
  shipping: Truck,
  "acceptable-use": ShieldAlert,
  "vendor-agreement": Store,
  payments: CreditCard,
};

/** Icon for a document slug, falling back to a generic document glyph. */
export function legalDocIcon(slug: string): LucideIcon {
  return DOC_ICONS[slug] ?? FileText;
}
