"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";

import { site } from "@/lib/content";

import { joinWaitlist } from "./actions";
import { MembershipCard } from "./MembershipCard";
import { initialWaitlistState } from "./state";
import styles from "./Waitlist.module.css";

/**
 * One field, one button, no quiz.
 *
 * A quiz suppresses conversion and implies a personalisation the product cannot deliver.
 * Client validation is email format only; the server checks the same thing again.
 */

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={`lu-btn ${styles.button}`} disabled={pending}>
      {pending ? "Saving" : label}
    </button>
  );
}

export function WaitlistForm({
  id,
  submitLabel = site.waitlist.form.submitLabel,
  variant = "inline",
  onPlum = false,
  showMicrocopy = true,
  referredBy,
  className,
}: {
  id?: string;
  submitLabel?: string;
  variant?: "inline" | "stacked";
  onPlum?: boolean;
  showMicrocopy?: boolean;
  /** The referrer's code, from a `?ref=` link. Three confirmed referrals promote them. */
  referredBy?: string;
  className?: string;
}) {
  const [state, formAction] = useActionState(joinWaitlist, initialWaitlistState);
  const fieldId = useId();

  /*
   * On success the form is replaced, not appended to.
   *
   * It used to stay on screen — empty field, live "Claim a place" button — with the
   * confirmation added underneath in the same slot and at the same size as the error
   * message. That reads as "nothing happened, try again", which is the opposite of what
   * did happen, and it invited a second submit.
   */
  if (state.status === "success" && state.position && state.referralCode) {
    return (
      <div role="status" aria-live="polite" className={className}>
        <MembershipCard
          announce
          membership={{
            position: state.position,
            referralCode: state.referralCode,
            founding: state.founding ?? false,
          }}
          message={state.message}
        />
      </div>
    );
  }

  return (
    <form
      id={id}
      action={formAction}
      noValidate
      className={[
        styles.form,
        variant === "stacked" ? styles["form--stacked"] : "",
        onPlum ? styles["form--onPlum"] : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {referredBy ? <input type="hidden" name="ref" value={referredBy} /> : null}

      <div className={styles.row}>
        <label htmlFor={fieldId} className="lu-sr-only">
          Email address
        </label>
        <input
          id={fieldId}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@email.com"
          className={`lu-field ${styles.field}`}
          aria-describedby={state.status === "idle" ? undefined : `${fieldId}-status`}
          aria-invalid={state.status === "error" || undefined}
        />
        <SubmitButton label={submitLabel} />
      </div>

      <div id={`${fieldId}-status`} role="status" aria-live="polite">
        {state.status === "error" ? <p className={styles.error}>{state.message}</p> : null}
      </div>

      {showMicrocopy ? <p className={styles.microcopy}>{site.waitlist.form.microcopy}</p> : null}
    </form>
  );
}
