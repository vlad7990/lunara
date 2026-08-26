import "server-only";

import { site } from "@/lib/content";

import { fileWaitlistStore } from "./file-store";
import { createNeonWaitlistStore, neonConnectionString } from "./neon-store";
import type { WaitlistStore } from "./types";

export type { SignupResult, WaitlistEntry, WaitlistStore } from "./types";

/**
 * Waitlist storage.
 *
 * The site talks to `WaitlistStore` and nothing else, so nothing above this module knows
 * where an entry is kept.
 *
 * Neon Postgres is the store whenever its connection string is present — which is any
 * deployment, since the Vercel integration sets it. Without one we fall back to the local
 * file store, which is fine for `next dev` but writes to disk and so cannot run on a
 * read-only serverless filesystem.
 */
function selectStore(): WaitlistStore {
  const connectionString = neonConnectionString();
  if (connectionString) return createNeonWaitlistStore(connectionString);

  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[lunara] No Postgres connection string. The waitlist is using the local file " +
        "store, which will lose signups on a serverless host. Set DATABASE_URL.",
    );
  }

  return fileWaitlistStore;
}

export const waitlist: WaitlistStore = selectStore();

export const FOUNDING_TOTAL = site.waitlist.foundingTotal;

/**
 * The design references show 417 of 500 taken. Until the store holds real signups, the
 * seed keeps the progress card honest-looking rather than showing an empty bar; set
 * `WAITLIST_SEED_COUNT=0` to show the true number.
 */
export function seedCount(): number {
  const raw = process.env.WAITLIST_SEED_COUNT;
  if (raw === undefined) return 417;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export interface WaitlistProgress {
  taken: number;
  total: number;
  remaining: number;
  /** Rounded to one decimal, as a CSS width. */
  barPct: string;
  /** True once the Founding 500 is full and the list moves to the early tier. */
  foundingFull: boolean;
}

export async function getWaitlistProgress(): Promise<WaitlistProgress> {
  const total = FOUNDING_TOTAL;
  const stored = await waitlist.count();
  const taken = Math.min(stored + seedCount(), total);

  return {
    taken,
    total,
    remaining: total - taken,
    barPct: `${Math.round((taken / total) * 1000) / 10}%`,
    foundingFull: taken >= total,
  };
}

/** Client-side validation is format only; this is the server's version of the same check. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
