"use server";

import { revalidatePath } from "next/cache";

import { renderWelcomeEmail } from "@/emails/welcome";
import { mailer, siteUrl } from "@/lib/email";
import { site } from "@/lib/content";
import { isValidEmail, waitlist, type WaitlistEntry } from "@/lib/waitlist";
import { rememberMembership } from "@/lib/waitlist/membership";

import type { WaitlistFormState } from "./state";

/**
 * Sends the welcome email.
 *
 * Never allowed to fail the signup: the entry is already saved, and a bounced provider is
 * our problem, not something to show someone who just gave us their address.
 */
async function sendWelcome(entry: WaitlistEntry): Promise<void> {
  if (!mailer.configured) return;

  try {
    const origin = siteUrl();
    const email = renderWelcomeEmail({ entry, siteUrl: origin });

    const result = await mailer.send({
      to: entry.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      // One-click endpoint, not the page: mail clients POST to this from their own UI.
      unsubscribeUrl: `${origin}/api/unsubscribe?email=${encodeURIComponent(entry.email)}`,
    });

    if (!result.sent) {
      console.error(`[lunara] Welcome email not sent to ${entry.email}: ${result.reason}`);
    }
  } catch (error) {
    console.error("[lunara] Welcome email threw:", error);
  }
}

export async function joinWaitlist(
  _prev: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  const email = String(formData.get("email") ?? "");
  const referredBy = String(formData.get("ref") ?? "") || undefined;

  // Client validation is email format only. This is the server's version of that check.
  // An empty field is named as empty: telling someone who typed nothing that what they
  // typed "does not look like an email address" describes a mistake they did not make.
  if (email.trim() === "") {
    return { status: "error", message: "Enter your email address to claim a place." };
  }
  if (!isValidEmail(email)) {
    return { status: "error", message: "That does not look like an email address." };
  }

  try {
    const { entry, created } = await waitlist.signup(email, referredBy);

    if (created) await sendWelcome(entry);

    /* Remember the place before revalidating, so a refresh — or a return visit weeks
       later — restores the card instead of showing an empty form to somebody who has
       already joined. No provider is wired, so this cookie is currently the only record
       the visitor keeps. */
    await rememberMembership({
      position: entry.position,
      referralCode: entry.referralCode,
      founding: entry.founding,
    });

    revalidatePath("/", "layout");

    return {
      status: "success",
      // `site.json` promises the Dose Card by email. Until a provider is wired we say what
      // is actually true instead — the place is on screen, and the email follows later.
      message: created
        ? mailer.configured
          ? site.waitlist.form.success
          : "You're on the list. Your place and referral code are below — keep them."
        : "You were already on the list — here is your place.",
      position: entry.position,
      referralCode: entry.referralCode,
      founding: entry.founding,
    };
  } catch {
    return {
      status: "error",
      message: `We could not save that. Email ${site.brand.email} and we will add you by hand.`,
    };
  }
}
