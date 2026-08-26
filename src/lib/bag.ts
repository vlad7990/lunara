import "server-only";

import { cookies } from "next/headers";

import { commerce, formats, getFormat, type Format } from "./content";

/**
 * The bag.
 *
 * It lives in a cookie so the nav count and the `/bag` page render server-side on the first
 * paint — a bag count that appears a beat after the page is the same class of bug as a
 * commerce surface flashing the wrong mode.
 *
 * Money is held in cents. Floating-point dollars drift, and the prices are the product.
 */

export const BAG_COOKIE = "lunara.bag";

/** Subscribe every 30 days, or buy it once. */
export type Plan = "sub" | "once";

export interface BagLine {
  sku: string;
  plan: Plan;
  qty: number;
}

export interface PricedLine extends BagLine {
  format: Format;
  /** Cents, per unit, after any subscription discount. */
  unitCents: number;
  /** Cents, per unit, before the subscription discount. */
  listCents: number;
  lineCents: number;
  savingCents: number;
}

export interface BagTotals {
  lines: PricedLine[];
  count: number;
  subtotalCents: number;
  savingCents: number;
  shippingCents: number;
  totalCents: number;
  freeShipping: boolean;
}

export const MAX_QTY = 9;

const toCents = (dollars: number) => Math.round(dollars * 100);

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** The subscription discount applies to any format that can be taken on a schedule. */
export function unitCentsFor(format: Format, plan: Plan): number {
  const list = toCents(format.listPrice ?? format.price);
  if (plan === "once") return toCents(format.price);
  const pct = commerce.subscription.discountPct;
  return Math.round(list * (1 - pct / 100));
}

export function listCentsFor(format: Format): number {
  return toCents(format.listPrice ?? format.price);
}

/** Bundles are a one-off test of the formula; they are not offered on subscription. */
export function supportsSubscription(sku: string): boolean {
  return sku === "CB-JAR-30" || sku === "CB-STK-30" || sku === "CB-JAR-SUB";
}

export function planLabel(plan: Plan): string {
  return plan === "sub"
    ? `Subscribe · every ${commerce.subscription.intervalDays} days`
    : "One-time purchase";
}

export function otherPlanLabel(plan: Plan): string {
  return plan === "sub" ? "one-time" : "subscription";
}

/* ------------------------------------------------------------ persistence */

function parse(raw: string | undefined): BagLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line): line is BagLine => {
        if (typeof line !== "object" || line === null) return false;
        const candidate = line as Partial<BagLine>;
        return (
          typeof candidate.sku === "string" &&
          formats.some((f) => f.sku === candidate.sku) &&
          (candidate.plan === "sub" || candidate.plan === "once") &&
          typeof candidate.qty === "number"
        );
      })
      .map((line) => ({
        sku: line.sku,
        plan: supportsSubscription(line.sku) ? line.plan : "once",
        qty: Math.min(Math.max(Math.trunc(line.qty), 1), MAX_QTY),
      }));
  } catch {
    // A malformed cookie is an empty bag, never an error page.
    return [];
  }
}

export async function readBag(): Promise<BagLine[]> {
  return parse((await cookies()).get(BAG_COOKIE)?.value);
}

export async function writeBag(lines: BagLine[]): Promise<void> {
  const store = await cookies();
  if (lines.length === 0) {
    store.delete(BAG_COOKIE);
    return;
  }
  store.set(BAG_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/* ----------------------------------------------------------------- totals */

export function priceBag(lines: BagLine[]): BagTotals {
  const priced: PricedLine[] = lines.map((line) => {
    const format = getFormat(line.sku);
    const unitCents = unitCentsFor(format, line.plan);
    const listCents = listCentsFor(format);
    return {
      ...line,
      format,
      unitCents,
      listCents,
      lineCents: unitCents * line.qty,
      savingCents: (listCents - unitCents) * line.qty,
    };
  });

  const subtotalCents = priced.reduce((sum, line) => sum + line.lineCents, 0);
  const savingCents = priced.reduce((sum, line) => sum + line.savingCents, 0);
  const count = priced.reduce((sum, line) => sum + line.qty, 0);

  const freeShipping = subtotalCents >= toCents(commerce.shippingFreeOver);
  const shippingCents = priced.length === 0 || freeShipping ? 0 : toCents(commerce.flatShipping);

  return {
    lines: priced,
    count,
    subtotalCents,
    savingCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    freeShipping,
  };
}

export async function getBagTotals(): Promise<BagTotals> {
  return priceBag(await readBag());
}

/** The nav count. Zero in waitlist mode, because nothing can be added to a bag. */
export async function getBagCount(): Promise<number> {
  return (await readBag()).reduce((sum, line) => sum + line.qty, 0);
}
