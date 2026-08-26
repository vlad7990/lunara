/**
 * The six policies.
 *
 * ⚠ Everything here is DESIGN COPY. It is correct in tone, length and structure, and it has
 * not been reviewed by counsel. All six need drafting or review before launch — see
 * `content/compliance.json → blocking`.
 *
 * Each policy ships as its own route so it has its own URL for compliance links and consent
 * records. The design shows them on one page with a sticky index; that index is preserved as
 * cross-links between the routes.
 */

export interface PolicyCard {
  id?: string;
  label: string;
  body: string;
}

export interface Policy {
  slug: string;
  number: string;
  /** The name in the index and the nav — matches the footer link labels. */
  name: string;
  title: string;
  /** The plain-language summary, in the gold-bordered card. */
  summary: string;
  /** `{email}` is substituted with the contact address from `site.json` at render. */
  paragraphs: string[];
  cards?: PolicyCard[];
  /** The caution-accented section: the FDA disclaimer is not a policy we chose. */
  tone?: "caution";
}

export const LAST_UPDATED = "2026-04-12";

export const policies: Policy[] = [
  {
    slug: "terms",
    number: "01",
    name: "Terms of sale",
    title: "What you're agreeing to",
    summary:
      "In short: you must be 18 or older to buy. We sell a dietary supplement, not a medicine. Prices are in US dollars and we ship to US addresses only at launch. If we get something wrong, we fix it or refund it.",
    paragraphs: [
      "By placing an order you confirm that you are at least 18 years of age, that you are not pregnant or nursing, and that you have read the warnings shown at checkout and on the product label.",
      "Product descriptions, doses and photography are provided in good faith. Doses labelled as targets during the pre-launch period are not final and may change; changes are published with a date in the open formula change log before they reach a pack.",
      "We may limit or cancel quantities per person or per order, and we may refuse an order at our discretion. Where we cancel, we refund in full to the original payment method.",
      "Nothing in these terms excludes liability that cannot lawfully be excluded. These terms are governed by the laws of the State of Delaware.",
    ],
  },
  {
    slug: "privacy",
    number: "02",
    name: "Privacy & CCPA",
    title: "What we collect, and what we don't",
    summary:
      "In short: your email if you join the list, your address if you order, and basic analytics. We do not collect health information, we do not sell personal information, and you can delete everything with one email.",
    paragraphs: [
      "We collect only what an order or a mailing list requires: name, email, shipping address, and payment confirmation (handled by our processor — we never store card numbers). Analytics are aggregate and can be declined without losing any functionality.",
      "We do not ask for, infer, or store health conditions, diagnoses, weight, or body measurements. We do not build audience segments on inferred health status, and we do not upload customer lists to advertising platforms for health-based targeting.",
      "California residents have the right to know, delete, and correct personal information, and to opt out of sale or sharing. We do not sell or share personal information, so the opt-out is already the default — the control is on this page for the record.",
    ],
    cards: [
      {
        id: "right-to-know",
        label: "Right to know",
        body: "Request a copy of everything we hold on you.",
      },
      {
        id: "right-to-delete",
        label: "Right to delete",
        body: "One email; we confirm within 30 days.",
      },
      {
        id: "do-not-sell-or-share",
        label: "Do not sell or share",
        body: "Already the default. Toggle it here anyway.",
      },
    ],
  },
  {
    slug: "shipping",
    number: "03",
    name: "Shipping & returns",
    title: "Sixty days, opened",
    summary:
      "In short: free US shipping over $50, dispatch in 1–2 business days. Return an opened jar within 60 days for a full refund — we would rather have the feedback than the sale.",
    paragraphs: [
      "Orders placed before 2pm ET on a business day dispatch the same or next working day. Standard delivery is 3–5 business days; we do not currently ship outside the United States.",
      "To return, email us with your order number. We will send a prepaid label and refund the product price in full once the parcel is scanned — you do not need to send back an unopened jar to qualify, and we do not ask you to justify the return.",
      "Damaged or missing parcels: tell us within 14 days of the delivery date and we replace, no photographs required.",
    ],
  },
  {
    slug: "subscriptions",
    number: "04",
    name: "Subscriptions",
    title: "One click to leave",
    summary:
      "In short: recurring every 30 days at 15% off. Skip, pause, change interval or cancel from a link in any email — no phone call, no chat window, no retention offer.",
    paragraphs: [
      "We email a reminder three days before every charge, with the amount and the date, and with skip and cancel links in the first line of the message rather than the footer.",
      "Cancellation takes effect immediately and applies to any charge not yet processed. If a renewal has already shipped when you cancel, the 60-day return applies to it as normal.",
      "We will never change a subscription price without emailing you first and giving you a full cycle to decide.",
    ],
  },
  {
    slug: "accessibility",
    number: "05",
    name: "Accessibility",
    title: "Our commitment, and where we currently fall short",
    summary:
      "In short: we target WCAG 2.2 AA. We publish the gaps we know about rather than claiming full conformance.",
    paragraphs: [
      "All content is keyboard navigable, form fields are labelled, and dose tables are marked up as tables rather than as images — the numbers are the product, so they must be readable by a screen reader.",
      "Known gaps as of this update: the uppercase micro-labels and the gold link colour sit between 2.9:1 and 4.0:1 against their backgrounds, below the 4.5:1 that WCAG AA asks for at those sizes; the certificate-of-analysis PDFs are not yet tagged for screen readers; and the ingredient icons carry decorative alt text where a longer description would help. All three are scheduled.",
      "If anything on this site blocks you, email {email} and we will fix it and tell you when it is fixed.",
    ],
  },
  {
    slug: "fda-disclaimer",
    number: "06",
    name: "FDA disclaimer",
    title: "Required sitewide",
    tone: "caution",
    summary:
      "In short: this is the statement the FDA requires on a dietary supplement making structure/function claims. It appears in the footer of every page and beside every claim.",
    paragraphs: [
      "This text appears in the footer of every page, adjacent to every structure/function claim, and on the product label. Any claim we publish must appear on the approved-claims list, which is reviewed by regulatory counsel. A 21 CFR 101.93 claim notification is filed within 30 days of first sale.",
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return policies.find((policy) => policy.slug === slug);
}
