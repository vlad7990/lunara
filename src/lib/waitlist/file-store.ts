import "server-only";

import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { site } from "@/lib/content";

import type { SignupResult, WaitlistEntry, WaitlistStore } from "./types";

/**
 * Development store. Entries are kept in a JSON file under `.data/`, which is gitignored.
 *
 * It is deliberately simple: this exists so the signup flow is real end to end while the
 * hosted database is being chosen. It writes to disk, so it will not work on a read-only
 * serverless filesystem — see `src/lib/waitlist/index.ts`.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

/** Serialises writes so two concurrent signups cannot claim the same position. */
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<WaitlistEntry[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WaitlistEntry[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(entries: WaitlistEntry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf8");
}

/** Short, unambiguous, no vowels — a referral code gets read aloud and retyped. */
function makeReferralCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

const normalise = (email: string) => email.trim().toLowerCase();

export const fileWaitlistStore: WaitlistStore = {
  async count() {
    return (await readAll()).length;
  },

  async findByEmail(email) {
    const wanted = normalise(email);
    return (await readAll()).find((entry) => entry.email === wanted) ?? null;
  },

  async unsubscribe(email) {
    return withLock(async () => {
      const entries = await readAll();
      const entry = entries.find((candidate) => candidate.email === normalise(email));
      // Silent on an unknown address: confirming which addresses we hold would leak the list.
      if (!entry || entry.unsubscribedAt) return;
      entry.unsubscribedAt = new Date().toISOString();
      await writeAll(entries);
    });
  },

  async signup(email, referredBy): Promise<SignupResult> {
    return withLock(async () => {
      const entries = await readAll();
      const wanted = normalise(email);

      const existing = entries.find((entry) => entry.email === wanted);
      if (existing) return { entry: existing, created: false };

      const position = entries.length + 1;
      const entry: WaitlistEntry = {
        email: wanted,
        position,
        referralCode: makeReferralCode(),
        createdAt: new Date().toISOString(),
        confirmedReferrals: 0,
        founding: position <= site.waitlist.foundingTotal,
        unsubscribedAt: null,
      };

      entries.push(entry);

      // Three confirmed referrals promote the referrer into the Founding 500 without
      // changing anyone else's position — their referrals keep their own place.
      if (referredBy) {
        const referrer = entries.find((candidate) => candidate.referralCode === referredBy);
        if (referrer && referrer.email !== entry.email) {
          referrer.confirmedReferrals += 1;
          if (referrer.confirmedReferrals >= 3) referrer.founding = true;
        }
      }

      await writeAll(entries);
      return { entry, created: true };
    });
  },
};
