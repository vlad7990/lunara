"use server";

import { isValidEmail, waitlist } from "@/lib/waitlist";

/**
 * Unsubscribe.
 *
 * Always reports success, whether or not the address was on the list. Telling someone
 * "that address isn't subscribed" would let anyone test addresses against the list.
 */
export async function unsubscribe(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  if (!isValidEmail(email)) return;

  try {
    await waitlist.unsubscribe(email);
  } catch (error) {
    console.error("[lunara] Unsubscribe failed:", error);
  }
}
