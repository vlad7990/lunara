import "server-only";

import { randomBytes } from "node:crypto";

import { neon } from "@neondatabase/serverless";

import { site } from "@/lib/content";

import type { SignupResult, WaitlistEntry, WaitlistStore } from "./types";

/**
 * Neon Postgres store.
 *
 * The database does the work the development file store had to fake by hand: ordering comes
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
  unsubscribed_at: string | Date | null;
  /** Added after the list opened, so null on every entry that predates the fuller form. */
  name: string | null;
  product_interest: string | null;
  /** Present on every read: how many entries exist at or before this one. */
  rank?: number;
}

/**
 * The place we show someone is their rank, not the raw identity value.
 *
 * Entries are never deleted, so a row's rank is as permanent as its identity — but the
 * identity can run ahead of the count if Postgres ever discards a number, and "place 501"
 * shown to the 480th person on the list would be a lie about their founding status.
 */
const RANK = "(SELECT count(*)::int FROM waitlist_entry x WHERE x.position <= e.position)";

function toEntry(row: Row): WaitlistEntry {
  return {
    email: row.email,
    position: row.rank ?? row.position,
    referralCode: row.referral_code,
    createdAt: new Date(row.created_at).toISOString(),
    confirmedReferrals: row.confirmed_referrals,
    founding: row.founding,
    unsubscribedAt: row.unsubscribed_at ? new Date(row.unsubscribed_at).toISOString() : null,
    ...(row.name ? { name: row.name } : {}),
    ...(row.product_interest ? { productInterest: row.product_interest } : {}),
  };
}

/**
 * The columns this version writes, added if they are not already there.
 *
 * There is no migration runner in this project and the table was created by hand, so the
 * schema change ships with the code that needs it. `IF NOT EXISTS` makes it idempotent and
 * the promise is memoised, so this costs one statement per process rather than one per
 * signup. Both columns are nullable because every entry that predates the fuller form has
 * neither, and that is not a defect to be backfilled — it is what those people gave us.
 *
 * If the role cannot run DDL this throws, and it should: a signup that silently drops the
 * name is worse than one that fails loudly while somebody is watching the deploy.
 */
let schemaReady: Promise<void> | undefined;

/** Short, unambiguous, no vowels — a referral code gets read aloud and retyped. */
function makeReferralCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(randomBytes(6), (byte) => alphabet[byte % alphabet.length]).join("");
}

const normalise = (email: string) => email.trim().toLowerCase();

export function createNeonWaitlistStore(connectionString: string): WaitlistStore {
  const sql = neon(connectionString);

  /** See the note above `schemaReady`. Closes over this connection's `sql`. */
  const ensureSchema = (): Promise<void> =>
    (schemaReady ??= (async () => {
      await sql`ALTER TABLE waitlist_entry ADD COLUMN IF NOT EXISTS name text`;
      await sql`ALTER TABLE waitlist_entry ADD COLUMN IF NOT EXISTS product_interest text`;
    })());

  return {
    async count() {
      const rows = (await sql`SELECT count(*)::int AS n FROM waitlist_entry`) as { n: number }[];
      return rows[0]?.n ?? 0;
    },

    async findByEmail(email) {
      const rows = (await sql`
        SELECT e.*, ${sql.unsafe(RANK)} AS rank
          FROM waitlist_entry e
         WHERE lower(e.email) = ${normalise(email)}
      `) as Row[];
      return rows[0] ? toEntry(rows[0]) : null;
    },

    async unsubscribe(email) {
      // Idempotent, and silent on an unknown address: confirming which addresses we hold
      // to anyone who can type one would leak the list.
      await sql`
        UPDATE waitlist_entry
           SET unsubscribed_at = now()
         WHERE lower(email) = ${normalise(email)}
           AND unsubscribed_at IS NULL
      `;
    },

    async signup(email, referredBy, details): Promise<SignupResult> {
      const address = normalise(email);
      const foundingTotal = site.waitlist.foundingTotal;

      // The insert below names columns this deployment may be the first to need.
      await ensureSchema();

      // Look first. An identity column advances even when ON CONFLICT DO NOTHING discards
      // the row, so going straight to INSERT would burn a number on every repeat signup
      // and push later places further and further above the real count.
      const found = (await sql`
        SELECT e.*, ${sql.unsafe(RANK)} AS rank
          FROM waitlist_entry e
         WHERE lower(e.email) = ${address}
      `) as Row[];

      if (found.length > 0) {
        return { entry: toEntry(found[0]), created: false };
      }

      // ON CONFLICT still guards the race between the lookup above and this insert.
      const inserted = (await sql`
        INSERT INTO waitlist_entry (email, referral_code, name, product_interest)
        VALUES (
          ${address},
          ${makeReferralCode()},
          ${details?.name?.trim() || null},
          ${details?.productInterest || null}
        )
        ON CONFLICT (lower(email)) DO NOTHING
        RETURNING *
      `) as Row[];

      if (inserted.length === 0) {
        const raced = (await sql`
          SELECT e.*, ${sql.unsafe(RANK)} AS rank
            FROM waitlist_entry e
           WHERE lower(e.email) = ${address}
        `) as Row[];
        return { entry: toEntry(raced[0]), created: false };
      }

      const row = inserted[0];

      // "First 500 signups" means the first 500 people, so founding is decided by how many
      // entries exist at or before this one — not by the raw identity value, which can run
      // ahead of the count if a number is ever discarded.
      const ranked = (await sql`
        SELECT count(*)::int AS rank
          FROM waitlist_entry
         WHERE position <= ${row.position}
      `) as { rank: number }[];
      const rank = ranked[0]?.rank ?? row.position;
      row.rank = rank;

      if (rank <= foundingTotal && !row.founding) {
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
