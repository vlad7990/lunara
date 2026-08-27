import { defineConfig } from "@neon/config/v1";

/**
 * Branch policy for the local-development database.
 *
 * ── What this file is for ───────────────────────────────────────────────────
 * Nine test signups once landed in the real waitlist, because local development
 * pointed at the production database and nothing stopped it. The fix was to
 * give local dev a database of its own; this file is what stops that fix from
 * depending on one person having run the right commands once. A branch created
 * from here comes up already sized and already scheduled to expire.
 *
 * ── What it deliberately does not declare ───────────────────────────────────
 * No `auth`, no `dataApi`, no preview services. This project stores exactly one
 * table on Neon — the waitlist — and reaches it through `@neondatabase/serverless`
 * with a connection string. Declaring a service here provisions it on every
 * branch, so listing things "in case" would create infrastructure nobody uses
 * and inject environment variables nothing reads.
 *
 * ── It does not describe production ─────────────────────────────────────────
 * Production is provisioned through the Vercel Marketplace and lives in a
 * Vercel-managed Neon account, which a personal `neon auth` login cannot see or
 * reconcile. `neon deploy` from this repository therefore only ever touches the
 * local-dev project pinned in `.neon`. That separation is the point, and it is
 * also why `protected: true` is absent below: the branch worth protecting is not
 * one this config can reach.
 *
 * ── A caveat worth knowing before you trust the TTL ─────────────────────────
 * The policy below runs when a branch is *created*, and only then. Neon CLI
 * 4.8.0 — the version this was written against — creates branches with
 * `neon branches create`, which does not evaluate this closure: a branch made
 * that way came back with the right compute but no expiry at all. `neon config
 * plan` reads the file correctly and `neon deploy` reconciles the pinned
 * branch, but neither retro-fits a TTL onto a branch that already exists,
 * because the closure deliberately returns `{}` for those.
 *
 * So until the CLI's `checkout` creates branches through this policy, treat the
 * TTL as documentation of intent and set it explicitly when it matters:
 *
 *     neon branches create --name dev-thing
 *     neon branches set-expiration dev-thing --expires-at <ISO-8601 timestamp>
 *
 * The default-branch guard is verified and does work: `neon config plan`
 * reports "No changes" against `main`, which is the half that protects the
 * database somebody is actually using.
 */
export default defineConfig({
  branch: (branch) => {
    /*
      The default branch is left exactly as it is.

      For the local-dev project that is `main`, the branch `.env.local` points at
      — the one with the waitlist schema on it. Returning tuning here would let a
      `neon deploy` resize or expire the database somebody is actively working
      against, which is the opposite of what this file is for.
    */
    if (branch.isDefault) return {};

    /*
      A branch that does not exist yet is being created right now, by
      `neon checkout <name>`. This is the only moment the policy applies: Neon
      evaluates the closure pre-create, so TTL and compute land with the branch
      rather than being reconciled onto it afterwards.

      `ttl: "7d"` because these are scratch databases for a feature or a test,
      and an un-expiring scratch database is just a database. Seven days is long
      enough to survive a week's work and short enough that forgetting about one
      costs nothing. The ceiling Neon allows is 30 days.

      Both compute limits pin to 0.25 CU — the floor. This database serves a
      single developer running a single Next.js dev server against one table;
      there is nothing here that benefits from headroom, and the free plan has a
      shared compute budget that scratch branches should not be spending.

      `suspendTimeout` is not set on purpose. Idle-suspend control is a paid-plan
      setting, and this org is on the free plan, where scale-to-zero already
      happens on Neon's own schedule. Declaring it here would fail at deploy
      rather than being quietly ignored.
    */
    if (!branch.exists) {
      return {
        ttl: "7d",
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25,
          },
        },
      };
    }

    /*
      An existing non-default branch keeps whatever it already has. Checking one
      out does not reconcile policy onto it, and a `neon deploy` should not
      silently reset a branch somebody has deliberately tuned or extended.
    */
    return {};
  },
});
