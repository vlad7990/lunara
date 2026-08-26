"use server";

import { revalidatePath } from "next/cache";

import { writeConsent, type ConsentChoice } from "@/lib/consent";

/** Store the visitor's cookie choice. Consent is recorded, never assumed. */
export async function setConsent(choice: ConsentChoice) {
  await writeConsent(choice);
  revalidatePath("/", "layout");
}
