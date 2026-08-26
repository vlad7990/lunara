"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";

import { site } from "@/lib/content";

import { joinWaitlist } from "./actions";
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
        {state.status === "success" ? (
          <>
            <p className={styles.confirmation}>{state.message}</p>
            <p className={styles.position}>
              <span>
                Your place: <strong>{state.position}</strong>
                {state.founding ? " — inside the Founding 500" : ""}
              </span>
              <span>
                Referral code: <strong>{state.referralCode}</strong>
              </span>
            </p>
          </>
        ) : null}
        {state.status === "error" ? <p className={styles.error}>{state.message}</p> : null}
      </div>

      {showMicrocopy ? <p className={styles.microcopy}>{site.waitlist.form.microcopy}</p> : null}
    </form>
  );
}
