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
 * Signups that exist but do not live in this database.
 *
 * The list was opened before this site had a store behind it, and those people are held
 * elsewhere. They are real, they are ahead of anyone signing up here, and the count has to
 * include them or the progress card understates the list.
 *
 * ── This is not a decoration, and it used to be ─────────────────────────────────────────
 * The default was 417 with a comment saying it "keeps the progress card honest-looking" —
 * a number chosen from the design references to avoid showing an empty bar. On a site
 * whose entire position is that it publishes real numbers, that was the one invented
 * figure, and it was the one being used to create urgency. It is now the count of a real
 * held list, set explicitly through the environment.
 *
 * The default is 0 rather than a number: if nobody configures this, the site shows what
 * the database actually holds, which is the only safe way for it to be wrong.
 */
export function seedCount(): number {
  const raw = process.env.WAITLIST_SEED_COUNT;
  if (raw === undefined) return 0;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * The place a person is told they hold.
 *
 * The store ranks its own rows from 1. The progress card counts those rows plus the held
 * list. If the place ignored the held list, the two would contradict each other inside a
 * single viewport — "place 4" beside "130 of 500 taken" — and the confirmation card sets
 * the place in the display serif at 54px, so that contradiction would be the most legible
 * thing on the page. One list, one arithmetic.
 */
export function publishedPlace(rank: number): number {
  return rank + seedCount();
}

/**
 * Whether a place is inside the Founding 500.
 *
 * Measured against the published place, not the database rank, because the held list is
 * ahead in the queue and occupies those places. It means the Founding 500 fills sooner by
 * exactly the size of the held list — which is what "they are already on the list" means.
 */
export function isFoundingPlace(place: number): boolean {
  return place <= FOUNDING_TOTAL;
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
