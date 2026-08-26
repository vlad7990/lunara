/**
 * Form state for the waitlist signup.
 *
 * This lives outside `actions.ts` because a `"use server"` module may only export async
 * functions — a type and a constant have to be imported from somewhere else.
 */

export interface WaitlistFormState {
  status: "idle" | "success" | "error";
  message: string;
  position?: number;
  referralCode?: string;
  founding?: boolean;
}

export const initialWaitlistState: WaitlistFormState = { status: "idle", message: "" };
