"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";

import { catalogue, site } from "@/lib/content";

import { joinWaitlist } from "./actions";
import { MembershipCard } from "./MembershipCard";
import { initialWaitlistState } from "./state";
import styles from "./Waitlist.module.css";

/**
 * The signup, in two sizes.
 *
 * This was one email field, and the microcopy promised "one field, one button, no quiz".
 * It now asks for a name and which product on the path where somebody has decided, and
 * stays a single input everywhere else. The promise was published copy, so it changed with
 * the form rather than being quietly left to become false.
 *
 * It is still not a quiz: three fields, one of which is a select with a default, and no
 * question whose answer the product cannot act on. The name goes on the box insert the
 * Founding 500 tier already promises; the product answers whether Cycle Ritual gets made.
 *
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
  fields = "email",
  onPlum = false,
  showMicrocopy = true,
  referredBy,
  className,
}: {
  id?: string;
  submitLabel?: string;
  variant?: "inline" | "stacked";
  /**
   * `full` asks for a name and which product; `email` is the single input.
   *
   * Both write to the same list and the extra columns are nullable, so the two are not
   * different signups — they are the same signup asked for in different places. The
   * gating path on `/join` uses `full`, because that is where somebody has decided. The
   * article sidebars and product panels stay on `email`, because a capture placed inside
   * an argument converts on being frictionless, and three fields there would cost more
   * signups than the two extra columns are worth.
   */
  fields?: "email" | "full";
  onPlum?: boolean;
  showMicrocopy?: boolean;
  /** The referrer's code, from a `?ref=` link. Three confirmed referrals promote them. */
  referredBy?: string;
  className?: string;
}) {
  const [state, formAction] = useActionState(joinWaitlist, initialWaitlistState);
  const fieldId = useId();
  const form = site.waitlist.form;

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

      {fields === "full" ? (
        <div className={styles.details}>
          <div className={styles.detail}>
            <label htmlFor={`${fieldId}-name`} className={styles.detail__label}>
              {form.nameLabel}
            </label>
            <input
              id={`${fieldId}-name`}
              name="name"
              type="text"
              autoComplete="given-name"
              maxLength={80}
              className="lu-field"
              aria-describedby={`${fieldId}-nameHint`}
            />
            <p id={`${fieldId}-nameHint`} className={styles.detail__hint}>
              {form.nameHint}
            </p>
          </div>

          <div className={styles.detail}>
            <label htmlFor={`${fieldId}-product`} className={styles.detail__label}>
              {form.productLabel}
            </label>
            {/* Options come from the catalogue, so adding a third product adds a third
                option without anyone editing this file. */}
            <select
              id={`${fieldId}-product`}
              name="productInterest"
              defaultValue="both"
              className={`lu-field ${styles.detail__select}`}
            >
              {catalogue.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
              <option value="both">{form.bothLabel}</option>
            </select>
          </div>
        </div>
      ) : null}

      {/*
        Two shapes, because a visible label cannot live inside `.row`.
        `.row` is a flex line holding the field and the button side by side, so a label
        placed in it would sit beside the input rather than above it. In the full form the
        email joins the stacked fields above and the button takes its own line; in the
        compact form the label stays screen-reader-only and the line is unchanged.
      */}
      {fields === "full" ? (
        <>
          <div className={styles.detail}>
            <label htmlFor={fieldId} className={styles.detail__label}>
              Email address
            </label>
            <input
              id={fieldId}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              className="lu-field"
              aria-describedby={state.status === "idle" ? undefined : `${fieldId}-status`}
              aria-invalid={state.status === "error" || undefined}
            />
          </div>
          <SubmitButton label={submitLabel} />
        </>
      ) : (
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
      )}

      <div id={`${fieldId}-status`} role="status" aria-live="polite">
        {state.status === "error" ? <p className={styles.error}>{state.message}</p> : null}
      </div>

      {showMicrocopy ? <p className={styles.microcopy}>{site.waitlist.form.microcopy}</p> : null}
    </form>
  );
}
