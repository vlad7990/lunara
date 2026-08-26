"use server";

import { revalidatePath } from "next/cache";

import { site } from "@/lib/content";
import { isValidEmail, waitlist } from "@/lib/waitlist";

import type { WaitlistFormState } from "./state";

export async function joinWaitlist(
  _prev: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  const email = String(formData.get("email") ?? "");
  const referredBy = String(formData.get("ref") ?? "") || undefined;

  // Client validation is email format only. This is the server's version of that check.
  if (!isValidEmail(email)) {
    return { status: "error", message: "That does not look like an email address." };
  }

  try {
    const { entry, created } = await waitlist.signup(email, referredBy);
    revalidatePath("/", "layout");

    return {
      status: "success",
      message: created
        ? site.waitlist.form.success
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
