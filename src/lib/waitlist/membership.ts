import "server-only";

import { cookies } from "next/headers";

/**
 * The visitor's own place on the list, remembered.
 *
 * ── Why this exists ─────────────────────────────────────────────────────────
 * The position and referral code used to be shown exactly once, in the response
 * to the signup, and destroyed by the next page load. Three of the four
 * Founding 500 benefits — the position, the founding badge, the referral
 * unlock — were delivered only through that one render. No mail provider is
 * wired yet, so nothing arrived by email either, and there was no route
 * anywhere on the site to look any of it up again. Someone who joined and
 * closed the tab had, in practice, been given nothing.
 *
 * A cookie is the honest minimum: it costs no account, no password and no
 * second email, and it survives the refresh that used to wipe the screen.
 *
 * ── Why it is read on the server ────────────────────────────────────────────
 * Same reason the mode flag is: a panel that appears, then vanishes, then
 * reappears is worse than one that was never there. `/join` renders the
 * remembered card in its first paint or renders the form, never both.
 *
 * This is not authentication and must never be treated as it. It proves
 * nothing; it only saves the visitor from re-reading a number they were shown
 * once. Anything that grants a discount has to verify against the store.
 */

export const MEMBER_COOKIE = "lunara.member";

export interface Membership {
  position: number;
  referralCode: string;
  founding: boolean;
}

/** `position.code.founding` — compact, and legible in devtools. */
function encode(m: Membership): string {
  return `${m.position}.${m.referralCode}.${m.founding ? "1" : "0"}`;
}

function decode(raw: string | undefined): Membership | null {
  if (!raw) return null;
  const [position, referralCode, founding] = raw.split(".");

  const parsed = Number.parseInt(position ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  // The code is generated from a fixed alphabet; anything else is a tampered or
  // stale cookie and is treated as no cookie at all.
  if (!referralCode || !/^[A-Z0-9]{4,12}$/.test(referralCode)) return null;

  return { position: parsed, referralCode, founding: founding === "1" };
}

export async function readMembership(): Promise<Membership | null> {
  return decode((await cookies()).get(MEMBER_COOKIE)?.value);
}

export async function rememberMembership(m: Membership): Promise<void> {
  (await cookies()).set(MEMBER_COOKIE, encode(m), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
