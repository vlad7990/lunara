import "server-only";

import { cookies } from "next/headers";

/**
 * Cookie consent.
 *
 * Stored, never assumed. Analytics is fully declinable and nothing on the site depends on
 * it, so "Essential only" costs the visitor no function at all.
 *
 * The stored choice is read on the server so the banner does not appear-then-vanish for
 * someone who already answered.
 */

export const CONSENT_COOKIE = "lunara.consent";

export type ConsentChoice = "essential" | "all";

export async function readConsent(): Promise<ConsentChoice | null> {
  const value = (await cookies()).get(CONSENT_COOKIE)?.value;
  return value === "essential" || value === "all" ? value : null;
}

export async function writeConsent(choice: ConsentChoice): Promise<void> {
  (await cookies()).set(CONSENT_COOKIE, choice, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}
