/**
 * Trends — legal document content.
 *
 * Every policy that is referenced from the sign-up / sign-in screens lives here
 * so that the copy is versioned in one place and rendered by
 * `src/components/legal/LegalPage.tsx` and `src/routes/legal.$slug.tsx`.
 *
 * Editing rules:
 *  - Never change an existing `slug` (it is a public URL).
 *  - Bump `version` and `updated` whenever the wording changes materially.
 *  - Keep `id` on each section stable: the in-page table of contents anchors to it.
 */

export type LegalSection = {
  /** Stable anchor id (used by the table of contents / scroll-to links). */
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  note?: string;
};

export type LegalDoc = {
  slug: string;
  title: string;
  /** Short label used on chips and in the related-document lists. */
  short: string;
  /** One-line description shown on the Legal Center hub. */
  summary: string;
  /** Who / what the document governs. */
  appliesTo: string;
  effective: string;
  updated: string;
  version: string;
  readMinutes: number;
  sections: LegalSection[];
};

const EFFECTIVE = "12 September 2026";
const UPDATED = "12 September 2026";
const VERSION = "1.0";

export const LEGAL_CONTACT = {
  brand: "Trends",
  legalEmail: "legal@trendsshop.com",
  privacyEmail: "privacy@trendsshop.com",
  supportEmail: "support@trendsshop.com",
  vendorsEmail: "vendors@trendsshop.com",
  country: "Republic of Ghana",
  jurisdictionNote:
    "Trends is operated from Accra, Ghana. Ghanaian law governs these documents unless a mandatory consumer-protection rule in your country of residence gives you stronger rights.",
};

export const LEGAL_DOCS: LegalDoc[] = [
  /* ------------------------------------------------------------------ */
  /* 1. Terms of Service                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: "terms",
    title: "Terms of Service",
    short: "Terms of Service",
    summary:
      "The master agreement between you and Trends: accounts, orders, pricing, delivery, liability and how disputes are resolved.",
    appliesTo: "Everyone who creates an account or places an order on Trends",
    effective: EFFECTIVE,
    updated: UPDATED,
    version: VERSION,
    readMinutes: 9,
    sections: [
      {
        id: "agreement",
        heading: "1. Agreement to these Terms",
        paragraphs: [
          'These Terms of Service (the "Terms") form a legally binding agreement between you and Trends ("Trends", "we", "us", "our") and govern your access to and use of the Trends mobile application, website, progressive web app and every related service, feature, content and transaction (together, the "Service").',
          'By tapping "Continue with Google", creating an account, browsing a catalogue, adding an item to your cart or placing an order you confirm that you have read, understood and accepted these Terms and every policy incorporated into them by reference. If you do not accept these Terms you must not use the Service.',
          "Electronic acceptance is valid and enforceable in Ghana under the Electronic Transactions Act, 2008 (Act 772). Our records of the version of these Terms displayed at the moment you tapped to accept are conclusive evidence of the Terms you agreed to.",
        ],
      },
      {
        id: "eligibility",
        heading: "2. Eligibility",
        bullets: [
          "You must be at least 18 years old to hold a Trends account, place an order or open a vendor storefront.",
          "If you are between 13 and 18 you may only use Trends through an account created and supervised by a parent or legal guardian who accepts these Terms on your behalf and remains responsible for every order placed.",
          "You must not use the Service if you have previously been suspended or removed by Trends, or if you are barred from receiving the Service under the laws of Ghana or any other applicable jurisdiction.",
          "You must be able to form a binding contract under Ghanaian law and must not be impersonating any person or entity.",
        ],
      },
      {
        id: "accounts",
        heading: "3. Your account and security",
        paragraphs: [
          "Trends uses Google OAuth to create and sign in to accounts. We never see or store your Google password. When you authorise Trends through Google we receive your name, email address and profile picture, and we use them to build your Trends profile.",
          "You are responsible for maintaining the confidentiality of the Google account you use to access Trends and for all activity that occurs under your Trends profile, including orders, wallet credits, coupons and vendor listings.",
        ],
        bullets: [
          "Keep your trends profile details accurate and up to date; a wrong email or delivery address can cause an order to fail and may not be refundable.",
          "Only one personal account per person. Duplicate, shared or automated accounts may be merged or closed.",
          "Tell us immediately at support@trendsshop.com if you suspect unauthorised access, a hijacked session, or a stolen device that is signed in to Trends.",
          "We may sign you out of all devices, require re-authentication, or temporarily freeze an account while we investigate suspicious activity.",
        ],
      },
      {
        id: "licence",
        heading: "4. Licence to use the Service",
        paragraphs: [
          "Subject to your compliance with these Terms we grant you a personal, non-exclusive, non-transferable, revocable and limited licence to install and use the Trends application on devices you own or control, and to access the Service for your own non-commercial shopping purposes.",
          "You may not copy, decompile, reverse engineer, scrape, frame, mirror, resell or systematically extract any part of the Service, its catalogue data, prices or images, or use automated tools to access the Service without our prior written consent.",
        ],
      },
      {
        id: "listings",
        heading: "5. Products, listings and availability",
        paragraphs: [
          "Trends is a curated marketplace. Some items are stocked and shipped by Trends, some are listed and fulfilled by independent Trends vendors, and some are sourced to order from international suppliers and delivered to you in Ghana.",
          "Product descriptions, dimensions, weights and colours are supplied to us by manufacturers, vendors and suppliers. We work to keep them accurate, but we do not warrant that every description, image or specification is free of error.",
        ],
        bullets: [
          "Colour and texture may vary between the photographs on the product page and the physical item because of manufacturing batches, lighting and the screen you are using.",
          "Sizes follow the size chart printed on the product page. Where a brand runs small or large we say so in the description.",
          "Stock counts refresh frequently. An item shown in stock may sell out before your order is confirmed; in that case clause 8 (order acceptance) applies.",
          "All items are offered subject to availability and to any purchase limits we apply per customer, per address or per promotion.",
        ],
      },
      {
        id: "pricing",
        heading: "6. Prices, fees, taxes and currency",
        paragraphs: [
          "All prices are displayed in Ghana Cedis (GHS) and include applicable Value Added Tax and statutory levies unless the product page states otherwise. Where an item is sourced internationally, the product page identifies any separately stated import, duty or clearing charge before you pay.",
          "We may change prices, delivery fees, commissions and promotional offers at any time. Changes never apply retroactively to an order that has already been accepted and paid for.",
        ],
        bullets: [
          "Obvious pricing errors (for example a GHS 12,000 device listed at GHS 12.00) do not bind us. We will cancel and refund such an order in full rather than fulfil it.",
          "Delivery fees are calculated from the destination, the delivery speed you select and the size or weight of the parcel, and are shown at checkout before payment.",
          "If a delivery attempt fails because of an incorrect address or an unavailable recipient, a re-delivery fee may apply.",
        ],
      },
      {
        id: "orders",
        heading: "7. Orders and payment",
        paragraphs: [
          "Payments are processed by Paystack, a licensed payment processor, using cards and Ghanaian mobile money wallets. Trends does not receive or store your full card number, CVV or mobile money PIN. Payment Terms are published separately and form part of these Terms.",
          "An order is an offer to buy. It is only accepted by Trends when we confirm dispatch (or, for a digital or instant-delivery item, when we confirm the order in-app). Until that moment we may decline or cancel an order.",
        ],
        bullets: [
          "You confirm that every payment method you use belongs to you or that you have the owner's express permission to use it.",
          "We may request additional verification (a matching name on the wallet or card, a government-issued ID, or a call-back) before releasing a high-value order.",
          "If a payment is reversed, charged back or flagged as fraudulent we may suspend the order, recover the goods and suspend the account.",
        ],
      },
      {
        id: "delivery",
        heading: "8. Delivery, risk and title",
        paragraphs: [
          'Delivery timelines quoted on the product page and at checkout are good-faith estimates and are not guaranteed dates. They begin from the moment payment is confirmed, not from the moment you tap "pay".',
          "Risk of loss or damage to the goods passes to you on delivery to the address you supplied. Title to the goods passes to you only once we have received payment in full. Where a parcel is lost in transit before delivery we will replace it or refund it in line with the Shipping & Delivery Policy.",
        ],
      },
      {
        id: "returns",
        heading: "9. Cancellation, returns and refunds",
        paragraphs: [
          "You may cancel an order free of charge at any time before it is dispatched. After dispatch the Returns & Refunds Policy applies, including the category-specific return windows, condition requirements and refund timelines.",
          "Where Ghanaian consumer law or the law of your country of residence grants you a longer or stronger cancellation right than these Terms, that right prevails over this clause to the extent of the conflict.",
        ],
      },
      {
        id: "promotions",
        heading: "10. Promotions, coupons, referrals and credits",
        bullets: [
          "Coupons, referral rewards, wallet credits and gift cards are personal to the account, non-transferable and have no cash value unless we state otherwise in writing.",
          "Each promotion is subject to the terms shown with it (minimum spend, eligible categories, expiry date, one use per customer).",
          "Credits may be reversed if the qualifying order is cancelled, returned or found to be fraudulent, or if the promotion was obtained through self-referral or duplicate accounts.",
          "We may modify, suspend or end a promotion at any time before an order using it has been accepted.",
        ],
      },
      {
        id: "vendors",
        heading: "11. Independent vendors",
        paragraphs: [
          "Vendors who sell on Trends are independent businesses, not agents or employees of Trends. Vendors are contractually required to meet our listing, pricing, dispatch, warranty and after-sales standards under the Vendor & Seller Agreement.",
          "Trends is the point of contact for your order and operates the returns process on the vendor's behalf, so you always deal with Trends support rather than tracking down an individual seller.",
        ],
      },
      {
        id: "user-content",
        heading: "12. Reviews and user content",
        paragraphs: [
          "When you post a review, rating, photo, comment, wishlist or other content you grant Trends a worldwide, royalty-free, transferable, sub-licensable licence to use, reproduce, display and adapt that content for operating the Service and for marketing, including on social media and in paid advertising.",
        ],
        bullets: [
          "Only post reviews of products you have actually purchased through Trends.",
          "No defamatory, obscene, misleading, discriminatory or unlawful content, and no content that infringes someone else's copyright, trademark or privacy.",
          "Do not post promotional links, competitor advertising or personal data belonging to another person.",
          "We may remove content and, for repeat or serious breaches, suspend review privileges or the account.",
        ],
      },
      {
        id: "ip",
        heading: "13. Intellectual property",
        paragraphs: [
          "The Service, including the Trends name, the Trends logo, all interface designs, source code, photographs we commissioned, illustrations, copy and catalogue compilations, is owned by Trends or its licensors and is protected by Ghanaian and international intellectual-property laws.",
          "Third-party brand names, logos and product photography belong to their respective owners and are used to identify the goods being sold. Nothing in these Terms grants you any right to use our trademarks without our prior written permission.",
        ],
      },
      {
        id: "third-party",
        heading: "14. Third-party services and links",
        paragraphs: [
          "The Service integrates third-party functionality, including Google sign-in, Paystack payments, mobile-money wallets, mapping and delivery partners, and analytics providers. Your use of those services is also governed by their own terms and privacy notices, which we do not control.",
          "We are not responsible for the content, availability, security or practices of external websites and services that we link to.",
        ],
      },
      {
        id: "termination",
        heading: "15. Suspension and termination",
        paragraphs: [
          "You may close your Trends account at any time from the Profile screen or by emailing support@trendsshop.com. Closing an account does not cancel orders already in transit and does not remove data we must retain for tax, accounting, fraud-prevention or regulatory reasons.",
          "We may suspend, restrict or terminate your access immediately and without notice if you materially breach these Terms, engage in fraud or abuse, repeatedly breach a policy, create risk to other users, or if we are required to do so by law or by a regulator.",
        ],
      },
      {
        id: "liability",
        heading: "16. Disclaimers and limitation of liability",
        paragraphs: [
          'The Service is provided on an "as available" basis. To the maximum extent permitted by law we disclaim all implied warranties of merchantability, fitness for a particular purpose, accuracy and non-infringement. Nothing in these Terms limits the statutory rights you enjoy as a consumer in Ghana, including rights relating to goods that are defective, not as described or unfit for purpose.',
          "To the maximum extent permitted by law, Trends is not liable for indirect, incidental, special, punitive or consequential losses, loss of profit, loss of data, or loss of goodwill. Our total aggregate liability arising from or relating to the Service is limited to the amount you paid Trends for the order giving rise to the claim.",
        ],
      },
      {
        id: "indemnity",
        heading: "17. Indemnity",
        paragraphs: [
          "You agree to indemnify and hold harmless Trends, its officers, employees, agents, vendors and partners from any claim, loss, liability, damage, cost or expense (including reasonable legal fees) arising from your breach of these Terms, your misuse of the Service, your user content, or your violation of any law or third-party right.",
        ],
      },
      {
        id: "disputes",
        heading: "18. Governing law and dispute resolution",
        paragraphs: [
          "These Terms are governed by the laws of the Republic of Ghana. The courts of Ghana have jurisdiction, without prejudice to any mandatory consumer-protection right you have to bring proceedings in your own country of residence.",
        ],
        bullets: [
          "Step 1 — Contact support: email support@trendsshop.com with your order number and a description of the problem. Most issues are resolved within 3 business days.",
          "Step 2 — Formal complaint: if the issue is unresolved after 14 days, escalate to legal@trendsshop.com. We will acknowledge within 5 business days and aim to conclude the review within 30 days.",
          "Step 3 — Mediation or court: if the formal complaint is not resolved, either party may refer the dispute to mediation in Accra or to the competent courts of Ghana.",
        ],
      },
      {
        id: "changes",
        heading: "19. Changes to these Terms",
        paragraphs: [
          'We may update these Terms to reflect changes in the Service, in technology, or in the law. The version number and the "last updated" date at the top of this document always identify the current edition.',
          "For material changes we will give at least 14 days' notice in-app or by email before the new version takes effect. Orders placed before the effective date are governed by the version in force when the order was accepted.",
        ],
      },
      {
        id: "contact",
        heading: "20. Contact us",
        paragraphs: [
          "Trends is operated from Accra, Republic of Ghana. Legal notices, complaints and questions about these Terms should be sent to legal@trendsshop.com. Customer-service questions should go to support@trendsshop.com and are normally answered within 3 business days.",
          "This document is version " + VERSION + " and was last updated on " + UPDATED + ".",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 2. Privacy Policy                                                  */
  /* ------------------------------------------------------------------ */
  {
    slug: "privacy",
    title: "Privacy Policy",
    short: "Privacy Policy",
    summary:
      "What personal data Trends collects, why we collect it, who we share it with and the rights you can exercise over it.",
    appliesTo: "Account holders, shoppers, vendors and site visitors",
    effective: EFFECTIVE,
    updated: UPDATED,
    version: VERSION,
    readMinutes: 9,
    sections: [
      {
        id: "overview",
        heading: "1. Overview and scope",
        paragraphs: [
          "This Privacy Policy explains how Trends collects, uses, stores, shares and protects personal data when you use the Trends app, website and progressive web app, contact our support team, or shop with a Trends vendor.",
          "Trends is the data controller for the processing described below. We process personal data in accordance with the Data Protection Act, 2012 (Act 843) of Ghana and, where it applies to you, with the EU/UK General Data Protection Regulation. This policy should be read together with our Cookie & Tracking Policy.",
        ],
      },
      {
        id: "controller",
        heading: "2. Data controller and how to reach us",
        paragraphs: [
          "Trends, Accra, Republic of Ghana, is the entity responsible for your personal data. Our privacy contact is privacy@trendsshop.com. General support requests go to support@trendsshop.com.",
          "If you are unsatisfied with our response you may complain to the Data Protection Commission of Ghana, which supervises compliance with Act 843, or to the supervisory authority in your country of residence if you are in the EU/UK.",
        ],
      },
      {
        id: "data-we-collect",
        heading: "3. Personal data we collect",
        paragraphs: [
          "We collect only the data we need to run a marketplace: to open your account, take payment, deliver your parcel, prevent fraud, support you after the sale and comply with Ghanaian law.",
        ],
        table: {
          headers: ["Category", "Examples", "Collected when"],
          rows: [
            [
              "Identity",
              "Full name, profile picture, Google account identifier",
              "You sign up or sign in with Google",
            ],
            [
              "Contact",
              "Email address, phone number, delivery address, saved addresses",
              "Account creation, checkout, support requests",
            ],
            [
              "Transaction",
              "Orders, cart contents, wishlist, payment status, refunds, wallet credits",
              "You browse, order, return or refund",
            ],
            [
              "Payment",
              "Payment method type, last four digits, wallet number, transaction reference — never your PIN or full card number",
              "You pay with card or mobile money",
            ],
            [
              "Vendor / merchant",
              "Ghana Card (NIA) number and image, business name, business documents, payout details, TIN",
              "You apply to become a vendor",
            ],
            [
              "Device and technical",
              "Device model, operating system, app version, language, IP address, crash logs",
              "Automatically while you use the app",
            ],
            [
              "Usage",
              "Pages viewed, products searched, search terms, items added to cart, taps and session length",
              "Automatically while you use the app",
            ],
            [
              "Location",
              "Approximate location derived from IP; precise location only if you grant permission for delivery",
              "Delivery, or with your consent",
            ],
            [
              "Support",
              "Chats, emails, call notes, photos or evidence you send us",
              "You contact support or open a dispute",
            ],
          ],
        },
      },
      {
        id: "how-we-collect",
        heading: "4. How we collect personal data",
        bullets: [
          "Directly from you — when you sign in with Google, complete your profile, place an order, apply as a vendor, write a review, contact support or take part in a promotion.",
          "Automatically — through the app and website using cookies, local storage, the service worker cache and similar technologies that record technical and usage data (see the Cookie & Tracking Policy).",
          "From third parties — Paystack and mobile-money providers return payment status and partly masked payment details; Google returns your basic profile; delivery partners return tracking and proof-of-delivery events; fraud-prevention and analytics providers return risk and attribution signals.",
          "From vendors — a vendor may upload information about an order they are fulfilling, which can include your name, phone number and delivery details.",
        ],
      },
      {
        id: "why",
        heading: "5. Why we use your data and our lawful bases",
        paragraphs: [
          "Under Act 843 and, where applicable, the GDPR, we must have a lawful basis for each processing activity. The table below sets out our purposes and the basis we rely on.",
        ],
        table: {
          headers: ["Purpose", "Lawful basis"],
          rows: [
            [
              "Creating and securing your account, authenticating sign-in",
              "Performance of a contract",
            ],
            ["Processing orders, deliveries, returns and refunds", "Performance of a contract"],
            [
              "Taking payment and reconciling transactions",
              "Performance of a contract; legal obligation",
            ],
            [
              "Vendor onboarding, Ghana Card verification and payouts",
              "Performance of a contract; legal obligation; legitimate interest (fraud prevention)",
            ],
            [
              "Customer support and dispute handling",
              "Performance of a contract; legitimate interest",
            ],
            [
              "Fraud detection, account-abuse prevention and security of the Service",
              "Legitimate interest; legal obligation",
            ],
            [
              'Personalised recommendations, "For You" feeds and search ranking',
              "Consent where required; legitimate interest in improving the Service",
            ],
            [
              "Push notifications, order updates and service messages",
              "Performance of a contract; consent for marketing",
            ],
            ["Marketing emails, SMS and promotions", "Consent (withdrawable at any time)"],
            [
              "Analytics, product improvement and crash diagnostics",
              "Legitimate interest; consent for non-essential cookies",
            ],
            ["Tax, accounting, audit and record-keeping", "Legal obligation"],
            [
              "Establishing, exercising or defending legal claims",
              "Legitimate interest; legal obligation",
            ],
          ],
        },
      },
      {
        id: "cookies-ref",
        heading: "6. Cookies and similar technologies",
        paragraphs: [
          "We use cookies, local storage, IndexedDB and a service-worker cache to keep you signed in, remember your cart, store your offline catalogue and measure how the app is used. Strictly necessary storage is set without consent because the Service cannot function without it; everything else is only set with your consent and can be withdrawn at any time.",
          "Cookie & Tracking Policy → /legal/cookies",
        ],
      },
      {
        id: "sharing",
        heading: "7. Who we share personal data with",
        paragraphs: [
          "We never sell your personal data. We share it only with the processors and partners needed to run the Service, and only to the extent required.",
        ],
        bullets: [
          "Payment processors — Paystack (card, bank and mobile-money processing, refunds, chargeback handling).",
          "Delivery and logistics partners — couriers, dispatch riders and pickup stations holding the parcel and delivery address.",
          "Vendors — the minimum order details needed to pack and dispatch the item you bought (name, phone number, delivery area).",
          "Suppliers and sourcing agents — where an item is sourced to order, the order details needed to purchase and ship it.",
          "Cloud, hosting and communications providers — infrastructure, storage, error monitoring, email and SMS delivery.",
          "Analytics and advertising partners — aggregated or device-level data through the cookies you consented to.",
          "Identity and fraud-prevention services — where required for vendor verification or payment-risk checks.",
          "Professional advisers — auditors, insurers and lawyers under duties of confidentiality.",
          "Authorities — where we are legally required to disclose, or where disclosure is necessary to investigate fraud, protect our rights, or protect the safety of any person.",
        ],
        note: "Where a processor handles data on our behalf, it is contractually bound to act only on our instructions, to apply appropriate security, and to delete or return the data when the engagement ends.",
      },
      {
        id: "transfers",
        heading: "8. International transfers",
        paragraphs: [
          "Some of our service providers store data outside Ghana, including in the European Economic Area and the United States. Where personal data leaves Ghana we ensure an appropriate safeguard is in place — an adequacy finding, standard contractual clauses, or your explicit consent — as required by Act 843.",
        ],
      },
      {
        id: "retention",
        heading: "9. How long we keep your data",
        table: {
          headers: ["Data", "Retention period"],
          rows: [
            ["Account profile (name, email, picture)", "Life of the account, then 12 months"],
            [
              "Order, invoice and payment records",
              "6 years from the end of the financial year (tax and accounting rules)",
            ],
            [
              "Vendor verification records (Ghana Card, business documents)",
              "Life of the vendor relationship, then 6 years",
            ],
            ["Support conversations and dispute files", "3 years from the last interaction"],
            ["Marketing consent records", "Until consent is withdrawn, plus 3 years as proof"],
            ["Analytics and device identifiers", "Up to 26 months, then aggregated or deleted"],
            ["Security and fraud-prevention logs", "12 months"],
            [
              "Service-worker and catalogue cache on your device",
              "Until you clear the app cache or uninstall",
            ],
          ],
        },
      },
      {
        id: "security",
        heading: "10. How we protect your data",
        bullets: [
          "TLS encryption in transit and encryption at rest for stored records.",
          "Google OAuth sign-in, so Trends never holds your Google password.",
          "Paystack processes payments, so your full card number and mobile-money PIN never touch our servers.",
          "Role-based internal access controls: only staff who need a record to do their job can open it.",
          "Monitoring, logging and periodic access reviews, with suspicious activity alerted on.",
          "Vendor access limited to the order data needed to fulfil a specific purchase.",
        ],
        note: "No system is perfectly secure. If a breach occurs that is likely to result in a risk to your rights, we will notify you and the Data Protection Commission without undue delay, as required by Act 843.",
      },
      {
        id: "rights",
        heading: "11. Your rights",
        paragraphs: [
          "Under the Data Protection Act, 2012 (Act 843) — and under the GDPR if it applies to you — you have the following rights over your personal data:",
        ],
        bullets: [
          "Access — request a copy of the personal data we hold about you.",
          "Rectification — correct inaccurate or incomplete data (you can edit most profile fields yourself, or email us).",
          "Erasure — ask us to delete data we no longer have a lawful reason to keep.",
          "Objection — object to processing based on legitimate interests, including profiling for direct marketing.",
          "Restriction — ask us to pause processing while a dispute about accuracy or lawfulness is resolved.",
          "Portability — receive the data you gave us in a structured, machine-readable format.",
          "Withdraw consent — for marketing, cookies and location at any time, without affecting processing already carried out.",
          "Complain — to the Data Protection Commission of Ghana, or to your local supervisory authority in the EU/UK.",
        ],
        note: "To exercise a right, email privacy@trendsshop.com. We respond within 30 days and may ask you to verify your identity first. Requests are free, but we may charge a reasonable fee for manifestly unfounded or repetitive requests. Some data cannot be deleted while we must retain it for tax, accounting, fraud-prevention or legal reasons — we will tell you when that applies.",
      },
      {
        id: "children",
        heading: "12. Children's privacy",
        paragraphs: [
          "Trends is not directed at children under 13 and we do not knowingly collect their personal data. Accounts for users between 13 and 18 must be created and supervised by a parent or guardian who accepts our Terms. If you believe a child has given us personal data without the required consent, contact privacy@trendsshop.com and we will delete it.",
        ],
      },
      {
        id: "marketing",
        heading: "13. Marketing and your choices",
        bullets: [
          "Essential service messages (order confirmations, dispatch notices, refund updates, security alerts) are sent as part of the contract and cannot be switched off while you hold an account.",
          "Marketing and recommendation messages are only sent with your consent and every message carries a one-tap unsubscribe.",
          "You can turn off push notifications, disable location access and clear the app cache from your device settings at any time.",
          "Personalised advertising can be limited by withdrawing cookie consent in the Cookie & Tracking Policy.",
        ],
      },
      {
        id: "changes",
        heading: "14. Changes to this policy",
        paragraphs: [
          'We will update this policy when our processing, our providers or the law change. The version number and the "last updated" date at the top always identify the current edition. For material changes we will give notice in-app or by email before the new version takes effect.',
          "This document is version " + VERSION + " and was last updated on " + UPDATED + ".",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 3. Cookie & Tracking Policy                                        */
  /* ------------------------------------------------------------------ */
  {
    slug: "cookies",
    title: "Cookie & Tracking Policy",
    short: "Cookie Policy",
    summary:
      "The cookies, local storage and device caches Trends uses, what each one does and how to switch them off.",
    appliesTo: "Everyone who opens the Trends app, website or progressive web app",
    effective: EFFECTIVE,
    updated: UPDATED,
    version: VERSION,
    readMinutes: 6,
    sections: [
      {
        id: "what",
        heading: "1. What cookies and similar technologies are",
        paragraphs: [
          "Cookies are small text files that a website or app stores on your device. Trends also uses local storage, session storage, IndexedDB and a service-worker cache. Together these technologies let the Service remember who you are, keep your cart in place, work offline and measure how the product is used.",
          'For simplicity this policy uses "cookies" to cover all of these technologies. Cookies are either session cookies (deleted when you close the app) or persistent cookies (kept for a defined period set out in the tables below).',
        ],
      },
      {
        id: "categories",
        heading: "2. Categories of cookies we use",
        table: {
          headers: ["Category", "Purpose", "Consent"],
          rows: [
            [
              "Strictly necessary",
              "Sign-in session, account token, CSRF protection, security, load balancing, keeping your cart and wishlist intact",
              "Not required — the app cannot work without these",
            ],
            [
              "Functional",
              "Remembering language, currency, recently viewed items, saved delivery address and interface preferences",
              "Consent required where they go beyond the core service",
            ],
            [
              "Performance & analytics",
              "Anonymous and aggregate measurement of page views, searches, funnels, crashes and load times so we can improve the product",
              "Consent required",
            ],
            [
              "Advertising & measurement",
              "Measuring the performance of our own campaigns and limiting how often you see the same promotion",
              "Consent required",
            ],
          ],
        },
      },
      {
        id: "detail",
        heading: "3. What we actually store",
        table: {
          headers: ["Name / key", "Type", "What it does", "Retention"],
          rows: [
            [
              "trends_session",
              "Cookie",
              "Keeps you signed in after Google authentication",
              "Session or up to 30 days",
            ],
            [
              "trends_user",
              "Local storage",
              "Caches your name, email and avatar so the app opens instantly",
              "Until sign-out or cache clear",
            ],
            [
              "trends_cart",
              "Local storage",
              "Preserves your cart between visits and across guest checkout",
              "Until checkout or cache clear",
            ],
            [
              "trends_wishlist",
              "Local storage",
              "Preserves saved items before they sync to your account",
              "Until cache clear",
            ],
            [
              "trends_recent",
              "Local storage",
              "Recently viewed products used for recommendations",
              "Up to 12 months",
            ],
            [
              "trends_consent",
              "Local storage",
              "Records the cookie choices you made and when",
              "24 months",
            ],
            [
              "catalogue cache",
              "Service worker / IndexedDB",
              "Stores product data so browsing works on weak or offline connections",
              "Refreshed on each sync",
            ],
            [
              "_ga / _gid style IDs",
              "Cookie",
              "Aggregate analytics identifiers set only after you consent",
              "Up to 26 months",
            ],
            [
              "payment intent",
              "Session storage",
              "Short-lived reference used by Paystack while a payment is confirmed",
              "Deleted when checkout ends",
            ],
          ],
        },
        note: "We never place your full card number, mobile-money PIN or government ID in a cookie, local storage entry or cache.",
      },
      {
        id: "third-party",
        heading: "4. Third-party cookies",
        paragraphs: [
          "Some cookies are set by partners rather than by Trends. These are only loaded after you consent to the relevant category and are governed by the partner's own privacy notice:",
        ],
        bullets: [
          "Google — sign-in, reCAPTCHA and security signals.",
          "Paystack — fraud screening and payment-session integrity during checkout.",
          "Analytics providers — aggregate usage and funnel measurement.",
          "Advertising partners — campaign attribution and frequency capping.",
          "Delivery tracking widgets — last-mile status on the order screen.",
        ],
      },
      {
        id: "pwa",
        heading: "5. Offline storage and the installable app (PWA)",
        paragraphs: [
          "Trends can be installed to your home screen. When it runs in this mode a service worker caches the interface, images and last-synced catalogue on your device so the app opens quickly and keeps working on a weak connection. Clearing the app cache or uninstalling the app removes this data and forces a fresh sync the next time you connect.",
        ],
      },
      {
        id: "manage",
        heading: "6. How to control or delete cookies",
        bullets: [
          "In-app: withdraw advertising and analytics consent from the privacy controls on the Profile screen; consent is applied to future sessions.",
          "Chrome on Android: ⋮ menu → Settings → Site settings → Cookies and site data, where you can block third-party cookies or clear stored data for this site.",
          "iOS Safari: Settings → Safari → Advanced → Website Data, or Settings → Safari → Prevent Cross-Site Tracking.",
          'Desktop browsers: use the cookie and site-data settings for your browser, plus the "clear browsing data" option.',
          "App data: on Android, Settings → Apps → Trends → Storage → Clear cache; on iOS, delete and reinstall the app.",
        ],
        note: "Blocking strictly necessary cookies or clearing local storage signs you out, empties your saved cart and forces the catalogue to re-download. Some parts of the Service may then stop working.",
      },
      {
        id: "dnt",
        heading: "7. Do Not Track and Global Privacy Control",
        paragraphs: [
          'There is still no common industry standard for how a browser\'s "Do Not Track" signal should be honoured. Trends treats a Global Privacy Control (GPC) browser signal as a valid objection to advertising and analytics cookies, and applies it automatically.',
        ],
      },
      {
        id: "updates",
        heading: "8. Changes and contact",
        paragraphs: [
          'We will update this policy when the cookies we use change. The version number and "last updated" date at the top identify the current edition. Questions about cookies or tracking can be sent to privacy@trendsshop.com.',
          "This document is version " + VERSION + " and was last updated on " + UPDATED + ".",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 4. Returns & Refunds                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "refunds",
    title: "Returns & Refunds Policy",
    short: "Returns & Refunds",
    summary:
      "Return windows, condition requirements, how to start a return, and how long MoMo, card and wallet refunds take.",
    appliesTo: "Shoppers who bought an item on Trends",
    effective: EFFECTIVE,
    updated: UPDATED,
    version: VERSION,
    readMinutes: 7,
    sections: [
      {
        id: "promise",
        heading: "1. Our promise",
        paragraphs: [
          "If something you bought on Trends is not right, you can return it. Where an item arrives damaged, defective, or different from what you ordered, Trends makes it right — a replacement, a repair, or a full refund to your original payment method, including the delivery fee you paid.",
          "Nothing in this policy reduces the statutory rights you have as a consumer in Ghana. Where the law gives you a longer or stronger right than this policy, the law prevails.",
        ],
      },
      {
        id: "windows",
        heading: "2. Return windows",
        table: {
          headers: ["Category", "Change-of-mind window", "Faulty / wrong item"],
          rows: [
            [
              "Fashion, footwear, bags, accessories",
              "7 days from delivery",
              "14 days, no time limit for a hidden defect",
            ],
            [
              "Electronics, phones, accessories",
              "7 days from delivery (sealed or unopened where hygiene or activation rules apply)",
              "14 days, plus the manufacturer warranty where supplied",
            ],
            ["Home, kitchen and lifestyle", "7 days from delivery", "14 days"],
            [
              "Beauty, skincare, haircare, cosmetics",
              "Not returnable once opened, for hygiene reasons",
              "14 days where the seal is intact",
            ],
            [
              "Underwear, swimwear, earrings, face masks",
              "Not returnable, for hygiene reasons",
              "14 days if sealed and unworn",
            ],
            [
              "Perishables, food and consumables",
              "Not returnable",
              "Report within 24 hours of delivery",
            ],
            [
              "Final-sale, clearance and giveaway items",
              "Not returnable — flagged clearly on the product page",
              "14 days",
            ],
            [
              "Sourced-to-order imports",
              "Not returnable once the supplier has purchased, unless defective",
              "14 days",
            ],
          ],
        },
        note: 'Items marked "Final Sale" are sold with a reduced price in exchange for a no-returns rule. That restriction is always shown on the product page and again at checkout before you pay.',
      },
      {
        id: "eligible",
        heading: "3. Condition requirements",
        bullets: [
          "Unused and unworn, with no odour, stains, marks or damage caused after delivery.",
          "Original tags, security label, seals and hygiene stickers still attached and intact.",
          "Returned in the original packaging, with the box unsealed or resealed cleanly — not defaced with tape or writing.",
          "All accessories, cables, manuals, free gifts and parts that came in the box.",
          "Electronics must have no personal data left on them; erase your data and sign out of your accounts before returning a device.",
        ],
      },
      {
        id: "how",
        heading: "4. How to start a return",
        paragraphs: [
          "Open the app and go to Orders → select the order → Report a problem → choose a reason and upload photos where relevant. You will receive a return reference immediately. You can also start a return by emailing support@trendsshop.com with your order number.",
        ],
        bullets: [
          "Step 1 — Submit the request in-app or by email within the window shown in section 2.",
          "Step 2 — Wait for approval. We review requests within 1 business day and tell you whether to post the item, drop it at a pickup station, or wait for a rider collection.",
          "Step 3 — Hand over the parcel. Keep the drop-off receipt or the collection reference we send you.",
          "Step 4 — Inspection. Once the item reaches us we inspect it within 3 business days against the condition requirements in section 3.",
          "Step 5 — Refund or replacement issued. You receive a notification the moment it is processed.",
        ],
      },
      {
        id: "costs",
        heading: "5. Who pays the return shipping",
        bullets: [
          "Trends pays — the item is faulty, damaged, counterfeit, or not what you ordered, or we sent the wrong item or size.",
          "You pay — change of mind, wrong size selected, wrong colour selected, or an address error on your side.",
          "Shared — where a vendor supplied a materially different size chart or the item was misdescribed, we cover the cost and recover it from the vendor.",
        ],
      },
      {
        id: "refund-methods",
        heading: "6. Refund methods and timelines",
        table: {
          headers: ["Payment method", "Refund route", "Time to reach you"],
          rows: [
            [
              "Mobile money (MTN, Telecel/Vodafone, AirtelTigo)",
              "Reversed to the same wallet number",
              "1–5 business days after processing",
            ],
            [
              "Card via Paystack",
              "Reversed to the same card",
              "5–10 business days, depending on your bank",
            ],
            [
              "Trends wallet credit",
              "Credit applied to your Trends account",
              "Within 24 hours — usable immediately",
            ],
            [
              "Cash on delivery",
              "Mobile money or bank transfer to the number you nominate",
              "2–5 business days",
            ],
            [
              "Promotional credit used on the order",
              "Re-credited as promotional credit, not cash",
              "Within 24 hours",
            ],
          ],
        },
        note: "Refunds are always issued to the original payment method or to your Trends wallet, never to a third party's account. Delivery fees are refunded when the return is caused by us or by a vendor, and are not refunded for change-of-mind returns. The refund period starts when our inspection is complete, not when you submit the request.",
      },
      {
        id: "exchanges",
        heading: "7. Exchanges",
        paragraphs: [
          'For a different size, colour or variant of the same product we run an exchange rather than a refund where stock allows. Submit the return as normal and select "Exchange" as the resolution. If the replacement costs more you pay the difference; if it costs less we refund the difference to your wallet. If the item you want is out of stock you may take a full refund instead.',
        ],
      },
      {
        id: "defective",
        heading: "8. Damaged, defective or counterfeit items",
        paragraphs: [
          "Report damaged or defective items within 24 hours of delivery, with photos or a short video of the item, the packaging and the waybill. Do not attempt a repair or a third-party fix first — that may void the manufacturer warranty. Where an item is confirmed counterfeit we refund in full, cover the return shipping and remove the listing from the marketplace.",
        ],
      },
      {
        id: "failed-delivery",
        heading: "9. Failed deliveries and uncollected orders",
        bullets: [
          "If no one is available to receive a parcel, the courier will attempt redelivery, usually up to two further times.",
          "If the parcel is returned to us because you were unreachable, a re-delivery fee may be charged.",
          "If you no longer want the order after a failed delivery we refund the item value minus the original outbound delivery fee.",
          "Goods held at a pickup station for longer than 7 days may be returned to stock and treated as an uncollected order.",
        ],
      },
      {
        id: "vendor-orders",
        heading: "10. Vendor-fulfilled orders",
        paragraphs: [
          "Returns for vendor-fulfilled items follow this same policy. Trends coordinates the return and refunds you directly, then settles the cost with the vendor under the Vendor & Seller Agreement. You never have to negotiate a refund with an individual seller yourself.",
        ],
      },
      {
        id: "chargebacks",
        heading: "11. Chargebacks",
        paragraphs: [
          "Please contact support@trendsshop.com before raising a chargeback with your bank or wallet provider — most issues are resolved faster through our returns process. If a chargeback is raised while a return is open, we supply the delivery evidence and communication history to Paystack. Accounts with unexplained or repeated chargebacks may lose access to pay-on-delivery and wallet-credit features.",
        ],
      },
      {
        id: "contact",
        heading: "12. Contact",
        paragraphs: [
          "Returns, refunds and warranty questions: support@trendsshop.com. Include your order number and the return reference so we can find your case immediately. Most enquiries are answered within 1 business day.",
          "This document is version " + VERSION + " and was last updated on " + UPDATED + ".",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 5. Shipping & Delivery                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "shipping",
    title: "Shipping & Delivery Policy",
    short: "Shipping & Delivery",
    summary:
      "Where Trends delivers, how fast, what it costs, how to track a parcel and who pays import duties.",
    appliesTo: "Every order delivered inside Ghana",
    effective: EFFECTIVE,
    updated: UPDATED,
    version: VERSION,
    readMinutes: 6,
    sections: [
      {
        id: "coverage",
        heading: "1. Where we deliver",
        paragraphs: [
          "Trends delivers across Ghana. Coverage is densest in Greater Accra, where same-day and next-day options are available, and extends to regional and district capitals and to most peri-urban areas through our courier and pickup-station network.",
        ],
        bullets: [
          "Greater Accra — Accra, Tema, Madina, Ashaiman, Adenta, Kasoa and surrounding districts.",
          "Regional capitals — Kumasi, Takoradi, Cape Coast, Tamale, Koforidua, Sunyani, Ho, Techiman and Wa.",
          "Other districts — served through the nearest pickup station where door-to-door delivery is unavailable.",
          "International sourcing — items sourced abroad for you are cleared into Ghana and delivered to your address.",
        ],
      },
      {
        id: "options",
        heading: "2. Delivery options and timelines",
        table: {
          headers: ["Option", "Where", "Estimated timeline"],
          rows: [
            [
              "Same-day express",
              "Selected Greater Accra zones, ordered before 11:00",
              "Same day by 20:00",
            ],
            ["Next-day delivery", "Greater Accra", "1 business day"],
            [
              "Standard regional",
              "Kumasi, Takoradi, Cape Coast, Tamale and other regional capitals",
              "2–4 business days",
            ],
            ["Outlying districts", "Areas served by pickup stations", "3–6 business days"],
            [
              "Sourced-to-order import",
              "Nationwide, ordered from international suppliers",
              "7–21 business days, plus customs clearing time",
            ],
            [
              "Pickup station",
              "Nationwide where available",
              "Ready for collection within 24 hours of arrival; hold for 7 days",
            ],
          ],
        },
        note: 'Timelines are estimates, not guaranteed delivery dates. They start when payment is confirmed and the order is dispatched — not when you tap "pay". Public holidays, heavy rain, fuel shortages and courier backlogs can add delays, and we will notify you when they do.',
      },
      {
        id: "fees",
        heading: "3. Delivery fees and free delivery",
        bullets: [
          "Fees are calculated from your delivery zone, the speed you select and the size or weight of the parcel, and are shown at checkout before payment.",
          "Free delivery applies to qualifying orders above the threshold advertised in-app at the time of your order; the threshold can change and does not apply to oversize items or to same-day express.",
          "Remote-area, oversize and heavy-item surcharges — where they apply — are displayed on the product page before you add the item to your cart.",
          "If you split an order into multiple parcels you may pay a delivery fee for each parcel.",
        ],
      },
      {
        id: "processing",
        heading: "4. Order processing and cut-off times",
        paragraphs: [
          "Orders are processed Monday to Saturday, excluding public holidays. The daily cut-off for same-day and next-day dispatch is 11:00 Ghana time; orders placed after the cut-off are processed the following business day. Payment must be confirmed — not merely initiated — before the processing clock starts.",
          "Sourced-to-order items are purchased from the supplier only after your payment is confirmed, which is why their timelines are longer and why they cannot be cancelled once the supplier has been paid.",
        ],
      },
      {
        id: "tracking",
        heading: "5. Tracking your order",
        paragraphs: [
          "Every order has a status timeline in Orders inside the app: Confirmed → Packed → Dispatched → Out for delivery → Delivered. Once dispatched you also receive the courier name, a tracking reference and, where the courier supports it, live rider location. Push notifications are sent at each status change when notifications are enabled.",
        ],
      },
      {
        id: "attempts",
        heading: "6. Delivery attempts and failed delivery",
        bullets: [
          "Please make sure someone can receive the parcel at the address and phone number you gave us, and keep the phone reachable on the delivery day.",
          "Couriers normally attempt delivery up to three times. After that the parcel returns to us and a re-delivery fee may apply.",
          "If an order cannot be delivered because the address was wrong or incomplete, we may need to charge the re-delivery fee or refund the item value minus the outbound delivery fee.",
          "If you collect from a pickup station, bring the collection code and a matching ID. Parcels not collected within 7 days are returned to stock.",
        ],
      },
      {
        id: "customs",
        heading: "7. Customs, duties and import charges",
        paragraphs: [
          "For sourced-to-order items arriving from abroad, import duty, VAT, levies and clearing charges payable in Ghana are calculated at checkout and collected by Trends, so there is no surprise bill at your door. Where a shipment attracts an unexpected statutory charge that we could not reasonably have estimated, we will contact you for approval before clearing it.",
          "Goods must be declared accurately. Trends will not under-declare the value of a shipment or mark it as a gift.",
        ],
      },
      {
        id: "lost",
        heading: "8. Lost, damaged or missing items",
        paragraphs: [
          "Goods remain our responsibility until they are delivered to you. If a parcel is lost in transit we replace it or refund it in full, and we handle the courier claim ourselves. If a parcel arrives visibly damaged, note the damage on the courier's delivery sheet where possible and photograph the parcel before opening it, then report the issue within 24 hours with the photos attached.",
          "If your order arrives with an item missing, tell us within 48 hours of delivery so the warehouse can reconcile the dispatch record.",
        ],
      },
      {
        id: "address",
        heading: "9. Address accuracy and delivery notes",
        paragraphs: [
          "You are responsible for the accuracy of the delivery address, landmark, phone number and recipient name you supply. Use the landmark and additional-notes fields for directions that a rider can follow — gate colour, shop name, nearest junction — especially in areas without formal street addressing.",
          "You can change the delivery address or the recipient only before dispatch. After dispatch, address changes depend on the courier and may attract a fee.",
        ],
      },
      {
        id: "contact",
        heading: "10. Contact",
        paragraphs: [
          "Delivery questions and live order issues: support@trendsshop.com, or open the order in the app and tap Help with this order. Most delivery enquiries are answered the same business day.",
          "This document is version " + VERSION + " and was last updated on " + UPDATED + ".",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 6. Acceptable Use Policy                                           */
  /* ------------------------------------------------------------------ */
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    short: "Acceptable Use",
    summary:
      "The conduct, content and product rules that keep the marketplace safe, and what happens when they are broken.",
    appliesTo: "All users, reviewers and vendors on Trends",
    effective: EFFECTIVE,
    updated: UPDATED,
    version: VERSION,
    readMinutes: 5,
    sections: [
      {
        id: "purpose",
        heading: "1. Purpose",
        paragraphs: [
          "Trends works because buyers, reviewers and vendors trust each other. This Acceptable Use Policy sets out what you may not do on the platform and forms part of our Terms of Service. It applies to everything you do on Trends — listing, ordering, reviewing, messaging, uploading images and interacting with support.",
        ],
      },
      {
        id: "prohibited-conduct",
        heading: "2. Prohibited conduct",
        bullets: [
          "Breaking any law of Ghana or of the country you are shopping from, including consumer-protection, tax, customs and intellectual-property law.",
          "Fraud, deception, identity theft, impersonating another person or business, or claiming an affiliation you do not have.",
          "Manipulating prices, promotions, ratings or reviews — including incentivised, family, vendor-written or AI-fabricated reviews.",
          "Using a stolen payment method, a payment method you are not authorised to use, or a wallet registered to somebody else.",
          "Scraping, crawling, bulk-downloading or reselling catalogue data, images or prices, or using bots and automation against the Service.",
          "Attempting to breach security: probing for vulnerabilities, injecting code, attacking our infrastructure, or bypassing rate limits, access controls or geofencing.",
          "Harassing, threatening or abusing other users, vendors or staff, including using racist, xenophobic, sexist, tribal, religiously inflammatory or otherwise discriminatory language.",
          "Circumventing a suspension, ban or verification requirement through a new Google account, a new phone number or a third party's identity.",
          "Generating fake orders, fake returns, empty-parcel claims or repetitive refund requests to obtain goods or credit.",
          "Sharing another person's personal data on the platform without their permission.",
        ],
      },
      {
        id: "prohibited-items",
        heading: "3. Prohibited and restricted items",
        paragraphs: [
          "The following may never be listed, sold or purchased through Trends, whether by a vendor or by a shopper sourcing through the Service.",
        ],
        table: {
          headers: ["Category", "Examples"],
          rows: [
            [
              "Counterfeit and stolen goods",
              "Replica designer goods, unauthorised logo items, goods with removed serial numbers, any item you do not lawfully own",
            ],
            [
              "Weapons and dangerous items",
              "Firearms, ammunition, explosives, imitation firearms, switchblades, knuckle dusters, bulk tear gas",
            ],
            [
              "Drugs and controlled substances",
              "Illegal narcotics, unapproved prescription medicines, mislabelled supplements",
            ],
            [
              "Alcohol and tobacco to minors",
              "Any age-restricted sale to a person under the legal age",
            ],
            [
              "Adult material",
              "Pornography, sexual services, items intended for sexual contact with a minor in any form",
            ],
            [
              "Hazardous and regulated materials",
              "Radioactive material, toxic chemicals, flammable gases and liquids, industrial acids, mercury",
            ],
            [
              "Live animals and protected wildlife",
              "Live animals and birds, bushmeat, ivory, pangolin scales, skins or parts of protected species",
            ],
            ["Human remains and human tissue", "Blood, organs, bodily fluids, biological samples"],
            [
              "Stolen data and credentials",
              "Customer databases, hacked accounts, card data, SIM-swap tools",
            ],
            [
              "Financial and legal instruments",
              "Counterfeit currency, forged IDs and certificates, forged Ghana Card or academic documents",
            ],
            [
              "Recalled and unsafe goods",
              "Products recalled by an authority or banned for sale in Ghana",
            ],
            [
              "Gambling and betting products",
              "Physical lottery equipment; digital gambling is not sold on Trends",
            ],
          ],
        },
        note: "Restricted items that may be listed only with verifiable authorisation — including licensed pharmaceuticals, medical devices, agrochemicals, pressure cylinders and batteries — require documentation from the vendor before the listing goes live.",
      },
      {
        id: "content-standards",
        heading: "4. Reviews and content standards",
        bullets: [
          "Reviews must describe a genuine purchase experience through Trends. Verified-purchase badges are only applied to confirmed orders.",
          "Photographs must be your own, must show the item actually received, and must not include people's faces without their consent or any private information.",
          "No promotional links, competitor advertising, referral spam or off-platform contact details in reviews, listings or messages.",
          "Do not post content you do not own the rights to, or that infringes copyright, trademark, design rights or personal privacy.",
          "Keep listings and messages accurate and lawful; product claims, health claims and safety claims must be verifiable and must not mislead.",
        ],
      },
      {
        id: "security",
        heading: "5. Security, fraud and abuse",
        bullets: [
          "Do not share your account, your Google credentials or your mobile-money PIN with anyone, and never ask another user for theirs.",
          "Report suspicious behaviour — a vendor asking you to pay outside Trends, an unusually low price, a request to share a one-time code — to support@trendsshop.com immediately.",
          "Paying outside the platform removes your refund protection and may lead to account suspension.",
          "We monitor for card testing, account takeovers, coupon abuse, multi-accounting and fake vendor storefronts, and cooperate with law enforcement and Paystack on suspected fraud.",
        ],
      },
      {
        id: "enforcement",
        heading: "6. Enforcement",
        paragraphs: [
          "When this policy is broken we take the least intrusive action that keeps the marketplace safe. Depending on the severity of the breach, that may mean removing content, cancelling an order, applying a warning, restricting features such as pay-on-delivery or reviews, withholding payouts pending investigation, or suspending or terminating the account.",
          "Serious breaches — fraud, counterfeit goods, security attacks, threats to personal safety or illegal sales — result in immediate suspension and may be reported to the police or to the relevant regulator.",
        ],
        bullets: [
          "You can appeal an enforcement decision by emailing support@trendsshop.com within 30 days.",
          "We will explain the decision and review any evidence you provide.",
          "Repeat offenders may lose access to the Service permanently.",
        ],
      },
      {
        id: "reporting",
        heading: "7. Reporting a violation",
        paragraphs: [
          'Report a listing, a review or a user that breaches this policy using "Report" on the relevant screen or by emailing support@trendsshop.com with a link, screenshot and short description. Rights holders can send takedown notices to legal@trendsshop.com; we act on properly substantiated notices and notify the affected listing holder.',
          "This document is version " + VERSION + " and was last updated on " + UPDATED + ".",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 7. Vendor & Seller Agreement                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "vendor-agreement",
    title: "Vendor & Seller Agreement",
    short: "Vendor Agreement",
    summary:
      "What it takes to sell on Trends: verification, listing standards, commission, payouts, dispatch SLAs and vendor obligations.",
    appliesTo: "Businesses and individuals selling through a Trends storefront",
    effective: EFFECTIVE,
    updated: UPDATED,
    version: VERSION,
    readMinutes: 8,
    sections: [
      {
        id: "programme",
        heading: "1. The vendor programme",
        paragraphs: [
          "Trends vendors are independent businesses that list and fulfil products inside the Trends marketplace under their own name and on their own account. Nothing in this agreement creates a partnership, agency, franchise or employment relationship, and a vendor has no authority to bind Trends or to make promises on our behalf.",
          "By applying to sell on Trends, and each time you list or fulfil an order, you accept this Vendor & Seller Agreement together with the Terms of Service, the Acceptable Use Policy, the Shipping & Delivery Policy and the Returns & Refunds Policy.",
        ],
      },
      {
        id: "onboarding",
        heading: "2. Becoming a vendor (verification)",
        paragraphs: [
          "Every vendor goes through identity and business verification before a listing can go live. We are required to know who we are paying and to prevent fraudulent storefronts.",
        ],
        table: {
          headers: ["Requirement", "What you provide"],
          rows: [
            [
              "Identity",
              "Ghana Card (NIA) number plus a clear photo of the front and back, and a selfie for liveness matching",
            ],
            ["Contact", "Verified phone number and email address"],
            [
              "Business",
              "Registered business name or sole-trader details; certificate of incorporation or business registration where applicable",
            ],
            ["Tax", "TIN or GRA registration details where the business is registered"],
            ["Payout", "Mobile-money wallet or bank account in the vendor's own legal name"],
            [
              "Product authority",
              "Brand authorisation, distributor invoices or compliance certificates for restricted categories",
            ],
            ["Address", "Pickup or dispatch address, with location pin, used by our riders"],
          ],
        },
        note: "Payout accounts must be in the vendor's own legal name. We do not pay third-party accounts, and we may re-verify a vendor at any time or after a change in ownership.",
      },
      {
        id: "listings",
        heading: "3. Listing standards and accuracy",
        bullets: [
          "Every listing must show the real product name, brand, material, dimensions, weight, colour and size chart. No misleading titles, keyword stuffing or false brand claims.",
          "Photographs must be your own or properly licensed, must show the actual product you will ship, and must not include watermarks, competitor logos or misleading props.",
          "Use the correct category so buyers can find the item, and one product per listing.",
          "State the real dispatch time, stock level, warranty and any condition (new, refurbished, open box, ex-display).",
          "Do not list the same item multiple times, do not list items you cannot supply, and remove out-of-stock listings promptly.",
          "Restricted categories need the authorisation documents in section 2 before the listing can be approved.",
        ],
      },
      {
        id: "pricing",
        heading: "4. Pricing, commission and fees",
        paragraphs: [
          "Vendors set their own prices within the range Trends publishes for the category. The price a customer sees must include every cost the customer will pay, apart from the delivery fee that Trends calculates at checkout.",
        ],
        bullets: [
          "Trends charges a commission on each completed sale, quoted as a percentage of the item total when you are onboarded and shown in your vendor dashboard. It may be revised on 30 days' notice.",
          "Commission is calculated after any discount that Trends funds, and is not charged on the delivery fee.",
          "Where Trends funds a promotion, an advertising placement or a coupon, the cost is shared as set out in the campaign terms before you join the campaign.",
          "Payment-processing fees charged by Paystack are deducted at cost.",
          "Vendors are responsible for their own income tax, VAT and other taxes arising from sales on Trends.",
        ],
      },
      {
        id: "payouts",
        heading: "5. Payouts and settlement",
        bullets: [
          "Payouts are released to the verified wallet or bank account every 7 days for delivered orders, after the dispute window has closed.",
          "Funds from an order under investigation, a chargeback or a return request in progress are held until the case is resolved.",
          "New vendors may have payouts held for 14 days after their first three orders as a fraud-control measure.",
          "Trends may set off amounts a vendor owes — refunds paid to customers, penalties, chargeback costs, unreturned goods — against future payouts.",
          "Vendors must keep their payout details current; failed transfers caused by incorrect details may be held until corrected.",
        ],
      },
      {
        id: "fulfilment",
        heading: "6. Fulfilment, dispatch and packaging",
        bullets: [
          "Dispatch within the time shown on the listing — 24 hours for stocked items, and never later than 2 business days unless the listing states a longer sourcing time.",
          "Pack the item properly for transit, using protective packaging appropriate to the item, and include only what the customer ordered.",
          "Include the Trends packing slip and the correct waybill, and seal the parcel so it cannot be opened without leaving a mark.",
          "Report stock-outs to vendor support before the customer's order is affected rather than after dispatch is due.",
          "Cancel-rate, late-dispatch and damage-rate thresholds are published in the vendor dashboard; persistent failure may lead to listing limits or removal.",
        ],
      },
      {
        id: "restricted",
        heading: "7. Restricted and prohibited products",
        paragraphs: [
          "Vendors must comply with the Acceptable Use Policy, including the list of prohibited and restricted items. You may not list counterfeits, unauthorised replicas, recalled goods or any item that is illegal to sell in Ghana. You must be able to prove the source of any branded stock on request — a distributor invoice or brand authorisation letter is required for well-known brands.",
        ],
      },
      {
        id: "after-sales",
        heading: "8. Returns, warranties and after-sales obligations",
        bullets: [
          "Accept returns that Trends approves under the Returns & Refunds Policy within the published windows.",
          "Bear the cost of returns where the item was faulty, misdescribed or wrongly sent.",
          "Honour manufacturer and vendor warranties you advertise, including repair or replacement.",
          "Respond to Trends vendor-support queries about an order within 24 hours.",
          "Refunds approved by Trends for the customer are settled from your payout balance, or invoiced if the balance is insufficient.",
        ],
      },
      {
        id: "compliance",
        heading: "9. Licences, taxes and regulatory compliance",
        paragraphs: [
          "Vendors are responsible for holding any licence, permit or registration required to sell their products — business operating permit, GRA registration, FDA registration for food, drugs and cosmetics, Energy Commission authorisation for certain electrical goods, and any category-specific approval. Vendors must provide a valid VAT invoice where required and must comply with the Data Protection Act, 2012 (Act 843) when handling customer data.",
        ],
      },
      {
        id: "customer-data",
        heading: "10. Customer data and confidentiality",
        paragraphs: [
          "You receive customer data only to fulfil a specific order. You must not use it for your own marketing, add it to your own database, sell it, share it with third parties or keep it after the order and any return window have closed. You must protect it with appropriate security and report any suspected breach to Trends within 24 hours.",
          "Vendors must not divert Trends customers to their own or another platform, whether in a listing, a packing slip or a message.",
        ],
      },
      {
        id: "ip-vendor",
        heading: "11. Intellectual property",
        paragraphs: [
          "You confirm that you own or are licensed to use every image, description and trademark you upload, and you indemnify Trends against claims arising from your listings. You grant Trends a non-exclusive, royalty-free, worldwide licence to display, resize and promote your listing content for operating and marketing the marketplace.",
        ],
      },
      {
        id: "performance",
        heading: "12. Ratings, suspension and termination",
        paragraphs: [
          "Vendor performance is measured on dispatch time, cancellation rate, damage and claim rate, customer rating and policy compliance. Sustained poor performance leads to a written improvement plan; failing that, to limits on listings, suspension or removal from the programme.",
          "Either party may end this agreement on 30 days' notice. Trends may suspend a vendor immediately for suspected fraud, counterfeit goods, safety risk, serious policy breach or regulatory requirement. Orders already placed and paid for must still be fulfilled or refunded, and outstanding payouts are settled after the dispute window closes.",
        ],
      },
      {
        id: "vendors-contact",
        heading: "13. Contact",
        paragraphs: [
          "Vendor onboarding, payouts and compliance: vendors@trendsshop.com. Commercial disputes: legal@trendsshop.com. This agreement is governed by the laws of the Republic of Ghana.",
          "This document is version " + VERSION + " and was last updated on " + UPDATED + ".",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 8. Payments & Pricing Policy                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "payments",
    title: "Payments & Pricing Policy",
    short: "Payments & Pricing",
    summary:
      "Accepted payment methods, currency and VAT, when you are charged, failed payments, wallet credits and chargebacks.",
    appliesTo: "Every purchase made on Trends",
    effective: EFFECTIVE,
    updated: UPDATED,
    version: VERSION,
    readMinutes: 6,
    sections: [
      {
        id: "overview",
        heading: "1. Overview",
        paragraphs: [
          "This policy explains how payments work on Trends, what we charge and when, and what happens if a payment fails or is disputed. It forms part of our Terms of Service.",
        ],
      },
      {
        id: "methods",
        heading: "2. Accepted payment methods",
        table: {
          headers: ["Method", "How it works", "Notes"],
          rows: [
            [
              "Mobile money — MTN MoMo",
              "Approve the payment prompt on your phone",
              "The wallet name must match the order name for high-value orders",
            ],
            [
              "Mobile money — Telecel (Vodafone) Cash",
              "Approve the prompt in your wallet app or by USSD",
              "Availability depends on the operator",
            ],
            [
              "Mobile money — AirtelTigo Money",
              "Approve the prompt in your wallet app or by USSD",
              "Availability depends on the operator",
            ],
            [
              "Debit / credit card",
              "Visa, Mastercard and other cards accepted by Paystack",
              "3-D Secure verification may be required by your bank",
            ],
            [
              "Bank transfer",
              "One-off transfer to the account shown at checkout",
              "Order is only processed once the transfer is confirmed",
            ],
            [
              "Trends wallet credit",
              "Applied automatically at checkout",
              "Earned from refunds and promotions; not withdrawable to cash",
            ],
            [
              "Cash on delivery",
              "Pay the rider on delivery",
              "Available only for eligible zones, order values and accounts with a clean history",
            ],
          ],
        },
        note: "All electronic payments are processed by Paystack, a PCI-DSS certified licensed payment processor. Trends does not receive or store your full card number, CVV, or mobile-money PIN. We store only a masked reference, the payment method type and the transaction status.",
      },
      {
        id: "currency",
        heading: "3. Currency, VAT and pricing",
        bullets: [
          "All prices are quoted and charged in Ghana Cedis (GHS).",
          "Prices include Value Added Tax and statutory levies unless the product page states otherwise.",
          "Delivery fees, where applicable, are shown separately at checkout before you pay, together with any import duties or clearing charges on sourced-to-order items.",
          "Prices can change at any time, but never retroactively for an order that has already been accepted and paid for.",
          "Obvious pricing errors do not bind us — we cancel and refund in full rather than fulfil such an order.",
        ],
      },
      {
        id: "authorization",
        heading: "4. Authorisation and holds",
        paragraphs: [
          "When you check out, your payment method is authorised for the order total. A card issuer may place a temporary hold on the funds while the payment is pending; that hold is released by your bank and is outside our control.",
          "For sourced-to-order items we authorise at checkout and capture payment once the supplier confirms the item is available. If the supplier cannot supply it, the authorisation is voided and you are not charged.",
        ],
      },
      {
        id: "charged",
        heading: "5. When you are charged",
        bullets: [
          "In-stock items: charged at checkout, when you approve the payment.",
          "Sourced-to-order items: charged when the supplier confirms availability, usually within 2 business days.",
          "Cash on delivery: charged when the rider hands you the parcel.",
          "Top-ups or wallet credit purchase: charged immediately.",
        ],
      },
      {
        id: "failed",
        heading: "6. Failed or declined payments",
        bullets: [
          "A declined payment means the order is not placed. Check your wallet balance or card limit and try again, or choose a different method.",
          "If your balance was debited but the order did not confirm, the amount is normally reversed automatically by the operator or bank.",
          "If a reversal has not arrived within 48 hours, contact support@trendsshop.com with the transaction reference from your wallet or bank SMS and we will trace it with Paystack.",
          "Repeated failed or reversed payments may temporarily restrict pay-on-delivery and wallet features on the account while we review it.",
        ],
      },
      {
        id: "refunds-payments",
        heading: "7. Refunds and reversals",
        paragraphs: [
          "Refunds are always sent to the original payment method or to your Trends wallet, never to a third party. Mobile-money refunds typically reach you within 1–5 business days; card refunds within 5–10 business days depending on your bank; wallet credits within 24 hours. The refund clock starts when a return is inspected and approved, not when you submit the request.",
        ],
      },
      {
        id: "credits",
        heading: "8. Wallet credit, coupons and promotional balances",
        bullets: [
          "Wallet credit is a promotional balance usable against future orders on Trends. It is not cash, is not transferable, and cannot be withdrawn or redeemed for money.",
          "Coupons and promotional balances have an expiry date and eligibility rules shown with the offer.",
          "Credit may be reversed if the qualifying order is cancelled, returned or found to be fraudulent, or if the offer was obtained through a duplicate account or self-referral.",
          "Where an order paid partly with promotional credit is refunded, the promotional portion is returned as credit and the paid portion is returned to the original payment method.",
        ],
      },
      {
        id: "fraud",
        heading: "9. Fraud prevention and verification",
        paragraphs: [
          "We screen transactions for fraud and may ask for additional verification before releasing an order — for example a matching name on the wallet or card, a government-issued ID, a call-back on the registered number, or a small refundable verification charge. This protects both you and other users of the marketplace.",
          "Trends cooperates with Paystack, mobile-money operators, banks and law enforcement on fraud investigations. Attempting to pay with a stolen or unauthorised payment method results in immediate account suspension and may be reported to the police.",
        ],
      },
      {
        id: "chargebacks",
        heading: "10. Chargebacks and disputes",
        paragraphs: [
          "Please contact support@trendsshop.com before raising a chargeback — our returns process is usually faster and does not affect your account. When a chargeback is raised we submit the order record, delivery evidence and communication history to the processor. If a chargeback is upheld against a vendor-fulfilled order, the amount is recovered from the vendor's payout.",
        ],
      },
      {
        id: "payments-contact",
        heading: "11. Contact",
        paragraphs: [
          "Payment, refund-tracing and billing questions: support@trendsshop.com with your order number and the transaction reference. Vendor payout questions: vendors@trendsshop.com.",
          "This document is version " + VERSION + " and was last updated on " + UPDATED + ".",
        ],
      },
    ],
  },
];

/**
 * Look a document up by slug. Returns `undefined` for unknown or empty slugs so
 * callers can render a "not found" state instead of throwing.
 */
export function getLegalDoc(slug?: string): LegalDoc | undefined {
  if (!slug) return undefined;
  const normalised = slug.trim().toLowerCase();
  return LEGAL_DOCS.find((doc) => doc.slug === normalised);
}

/** Every slug, in display order — handy for route validation and sitemaps. */
export const LEGAL_SLUGS = LEGAL_DOCS.map((doc) => doc.slug);

/** All documents except the one being viewed (for "related" lists). */
export function getOtherLegalDocs(slug?: string): LegalDoc[] {
  return LEGAL_DOCS.filter((doc) => doc.slug !== slug);
}
