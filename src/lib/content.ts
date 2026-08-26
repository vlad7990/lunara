/**
 * The single import point for every piece of copy, dose, price, warning and lab result.
 *
 * Nothing in `src/components` or `src/app` may retype a value that lives in `content/*.json`.
 * If a string is a claim, a number, a dose or a warning, it comes from here.
 */

import articlesJson from "@content/articles.json";
import complianceJson from "@content/compliance.json";
import faqJson from "@content/faq.json";
import lotsJson from "@content/lots.json";
import productJson from "@content/product.json";
import productsJson from "@content/products.json";
import siteJson from "@content/site.json";

/* ------------------------------------------------------------------ types */

export type SiteMode = "waitlist" | "store";

export interface NavLink {
  label: string;
  route: string;
}

export interface WaitlistTier {
  id: string;
  name: string;
  trigger: string;
  offer: string;
  benefits: string[];
}

export interface FooterGroup {
  heading: string;
  links: string[];
}

export interface Format {
  sku: string;
  name: string;
  price: number;
  foundingPrice?: number;
  listPrice?: number;
  perServing?: number;
  servings?: number;
  unit?: string;
  recyclable?: boolean;
  discountPct?: number;
  intervalDays?: number;
  saving?: number;
  note: string;
}

/** Each product owns one accent. They are never mixed inside a section. */
export type ProductAccent = "plum" | "wine" | "green";

export interface KeyDose {
  name: string;
  dose: string;
}

/**
 * The catalogue record. Crave Balance's full detail stays in `product.json` — this is the
 * shorter shape every product needs to appear on the home page and in navigation.
 */
export interface CatalogueProduct {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  accent: ProductAccent;
  format: string;
  unit: string;
  servings: number;
  servingSize: string;
  image: string;
  lede: string;
  /** Why this product is a powder, or a capsule. The format is a decision, not a default. */
  whyThisFormat: string;
  keyDoses: KeyDose[];
  ingredients?: {
    name: string;
    dose: number;
    unit: string;
    qualifier: string | null;
    short: string;
    long: string;
    evidenceNote?: string;
  }[];
  benefits?: string[];
  /** A caveat that must render wherever the product's claims do. */
  footnote?: string;
  dosesAreFinal: boolean;
}

export interface Ingredient {
  name: string;
  dose: number | string;
  unit: string | null;
  isTarget: boolean;
  short: string;
  long: string;
}

export interface Excluded {
  name: string;
  reason: string;
  article: string;
}

export interface SupplementFactsRow {
  name: string;
  amount: string;
  dv: string;
}

export interface Direction {
  step: number;
  title: string;
  detail: string;
}

export interface Article {
  number: string;
  slug: string;
  title: string;
  dek: string;
  week: number;
  published: boolean;
  isFeatured?: boolean;
  decision?: { considered: string; rejected: string; revisitIf: string };
  pullQuote?: string;
  bodyFile?: string;
}

export interface ChangeLogEntry {
  date: string;
  summary: string;
  relatedArticle?: string;
}

export interface FaqItem {
  q: string;
  a: string;
  link?: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  tone?: string;
  modeScoped?: boolean;
  items?: FaqItem[];
  waitlist?: FaqItem[];
  store?: FaqItem[];
}

export interface Assay {
  analyte: string;
  claim: string;
  result: string;
  method: string;
  status: string;
}

export interface HeavyMetal {
  analyte: string;
  spec: string;
  result: string;
}

export interface Microbial {
  test: string;
  spec: string;
  result: string;
}

export interface Lot {
  batch: string;
  status: string;
  statusLabel: string;
  manufacturedAt: string;
  bestBefore: string | null;
  units: number;
  facility?: string;
  lab?: string;
  allSpecsMet: boolean;
  pdfUrl?: string;
  publicNote?: string;
  assays?: Assay[];
  heavyMetals?: HeavyMetal[];
  microbials?: Microbial[];
}

/* ------------------------------------------------------------- accessors */

export const site = siteJson;
export const product = productJson;
export const compliance = complianceJson;

export const nav: NavLink[] = siteJson.nav;
export const footerGroups: FooterGroup[] = siteJson.footer;
export const waitlistTiers: WaitlistTier[] = siteJson.waitlist.tiers;
export const commerce = siteJson.commerce;

export const catalogue: CatalogueProduct[] = productsJson.products as CatalogueProduct[];

export function getCatalogueProduct(slug: string): CatalogueProduct | undefined {
  return catalogue.find((entry) => entry.slug === slug);
}

export const formats: Format[] = productJson.formats;
export const ingredients: Ingredient[] = productJson.ingredients;
export const excluded: Excluded[] = productJson.excluded;
export const supplementFacts = productJson.supplementFacts;
export const directions: Direction[] = productJson.directions;

export const articles: Article[] = articlesJson.series;
export const changeLog: ChangeLogEntry[] = articlesJson.changeLog;

export const faqGroups: FaqGroup[] = faqJson.groups;

export const lots: Lot[] = lotsJson.lots;
export const lotsNote: string = lotsJson.note;

/* --------------------------------------------------------------- helpers */

export function getFormat(sku: string): Format {
  const format = formats.find((f) => f.sku === sku);
  if (!format) throw new Error(`Unknown SKU: ${sku}`);
  return format;
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/** Batch codes are printed on packaging and typed by hand. Normalise before matching. */
export function normaliseBatch(input: string): string {
  return input.trim().toUpperCase();
}

export function getLot(batch: string): Lot | undefined {
  const wanted = normaliseBatch(batch);
  return lots.find((l) => l.batch === wanted);
}

/**
 * The dose disclaimer renders wherever a dose appears, for as long as
 * `product.dosesAreFinal` is false. Flipping that one boolean clears it sitewide.
 */
/**
 * Lot dates read "12 Apr 2026" everywhere they appear — on the record and in the table.
 * Formatted from the ISO date in a fixed locale and time zone so the server and the client
 * cannot disagree about which day it is.
 */
export function formatLotDate(iso: string | null): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export const dosesAreFinal: boolean = productJson.dosesAreFinal;
export const doseDisclaimer: string = productJson.doseDisclaimer;

/** Doses carry their unit. A dose without its unit is on the never-publish list. */
export function formatDose(ingredient: Ingredient): string {
  return ingredient.unit ? `${ingredient.dose.toLocaleString("en-US")} ${ingredient.unit}` : String(ingredient.dose);
}

/**
 * Prices are set in the display serif; they are never rounded away from their cents.
 * `exact` forces two decimals — used where prices sit in a column and have to line up.
 */
export function formatPrice(value: number, exact = false): string {
  return !exact && Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

/** "1 scoop (5 g)" → "5 g". The scoop size is quoted on its own on the shop card. */
export const scoopSize: string =
  productJson.servingSize.match(/\(([^)]+)\)/)?.[1] ?? productJson.servingSize;

/** The five dosed ingredients — the ratio row is a fact about the formula, not a dose. */
export const dosedIngredients: Ingredient[] = ingredients.filter((i) => i.unit !== null);

/**
 * Announcement copy is keyed `mode:route`, with `any:route` covering both modes.
 *
 * Nested routes inherit their parent's line — `/lot/CB-2026-0412` reads the `/lot` copy,
 * `/checkout` reads `/bag` — and anything unkeyed falls back to the home line so no page
 * ever ships with an empty bar.
 */
export function announcementFor(mode: SiteMode, pathname: string): string {
  const announcements = siteJson.announcements as Record<string, string>;
  const lookup = (route: string) =>
    announcements[`${mode}:${route}`] ?? announcements[`any:${route}`];

  const route = pathname === "/checkout" ? "/bag" : pathname;
  const segments = route.split("/").filter(Boolean);

  for (let depth = segments.length; depth > 0; depth -= 1) {
    const candidate = `/${segments.slice(0, depth).join("/")}`;
    const found = lookup(candidate);
    if (found) return found;
  }

  return lookup("/")!;
}

/** FAQ groups flatten differently per mode; the ordering group is mode-scoped. */
export function faqItemsFor(group: FaqGroup, mode: SiteMode): FaqItem[] {
  if (!group.modeScoped) return group.items ?? [];
  return (mode === "store" ? group.store : group.waitlist) ?? [];
}
