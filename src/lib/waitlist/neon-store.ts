import "server-only";

import { randomBytes } from "node:crypto";

import { neon } from "@neondatabase/serverless";

import { site } from "@/lib/content";

import type { SignupResult, WaitlistEntry, WaitlistStore } from "./types";

/**
 * Neon Postgres store.
 *
 * The database does the work the development file store had to fake by hand: positions come
 * from an identity column rather than a counted array, and the unique index on the email is
 * what makes a second signup return the original place instead of a new one.
 */

/** The Neon integration writes one of these; `DATABASE_URL` is its default name. */
export function neonConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.NEON_DATABASE_URL ??
    undefined
  );
}

interface Row {
  position: number;
  email: string;
  referral_code: string;
  created_at: string | Date;
  confirmed_referrals: number;
  founding: boolean;
}

function toEntry(row: Row): WaitlistEntry {
  return {
    email: row.email,
    position: row.position,
    referralCode: row.referral_code,
    createdAt: new Date(row.created_at).toISOString(),
    confirmedReferrals: row.confirmed_referrals,
    founding: row.founding,
  };
}

/** Short, unambiguous, no vowels — a referral code gets read aloud and retyped. */
function makeReferralCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(randomBytes(6), (byte) => alphabet[byte % alphabet.length]).join("");
}

const normalise = (email: string) => email.trim().toLowerCase();

export function createNeonWaitlistStore(connectionString: string): WaitlistStore {
  const sql = neon(connectionString);

  return {
    async count() {
      const rows = (await sql`SELECT count(*)::int AS n FROM waitlist_entry`) as { n: number }[];
      return rows[0]?.n ?? 0;
    },

    async findByEmail(email) {
      const rows = (await sql`
        SELECT * FROM waitlist_entry WHERE lower(email) = ${normalise(email)}
      `) as Row[];
      return rows[0] ? toEntry(rows[0]) : null;
    },

    async signup(email, referredBy): Promise<SignupResult> {
      const address = normalise(email);
      const foundingTotal = site.waitlist.foundingTotal;

      // ON CONFLICT DO NOTHING makes a repeat signup a no-op rather than a new place.
      const inserted = (await sql`
        INSERT INTO waitlist_entry (email, referral_code)
        VALUES (${address}, ${makeReferralCode()})
        ON CONFLICT (lower(email)) DO NOTHING
        RETURNING *
      `) as Row[];

      if (inserted.length === 0) {
        const existing = (await sql`
          SELECT * FROM waitlist_entry WHERE lower(email) = ${address}
        `) as Row[];
        return { entry: toEntry(existing[0]), created: false };
      }

      const row = inserted[0];

      // The first N places are founding by definition; the flag is set once, from the
      // position the sequence just handed out.
      if (row.position <= foundingTotal && !row.founding) {
        await sql`UPDATE waitlist_entry SET founding = TRUE WHERE position = ${row.position}`;
        row.founding = true;
      }

      // Three confirmed referrals promote the referrer into the Founding 500 without
      // changing anyone else's position — their referrals keep their own place.
      if (referredBy) {
        await sql`
          UPDATE waitlist_entry
             SET confirmed_referrals = confirmed_referrals + 1,
                 founding = (confirmed_referrals + 1 >= 3) OR founding
           WHERE referral_code = ${referredBy}
             AND position <> ${row.position}
        `;
      }

      return { entry: toEntry(row), created: true };
    },
  };
}
