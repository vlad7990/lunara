"use client";

import { useEffect, useRef, useState } from "react";

import { waitlistTiers } from "@/lib/content";
import type { Membership } from "@/lib/waitlist/membership";

import styles from "./MembershipCard.module.css";

/**
 * What someone gets for joining, shown as the thing it actually is: a number.
 *
 * ── Why this is a card and not two paragraphs ───────────────────────────────
 * The confirmation used to render as body text appended below a form that was
 * still sitting there, empty field and live button, typographically identical
 * to the error state. It was the emotional summit of the entire waitlist
 * proposition rendered as a form hint.
 *
 * The brand sets numbers in Cormorant at display size — every dose, every
 * price, every lot code. A waitlist position is a number, and it is the only
 * one on the site that belongs to the reader, so it gets the same treatment as
 * a milligram. That is the whole idea here: the dose card, with the visitor's
 * place where the doses go.
 *
 * ── The referral link, not the referral code ────────────────────────────────
 * The code was printed bare. The mechanism is `/?ref=CODE`, and the two were
 * never joined, so the referral benefit the tier card advertises was not
 * operable from the interface at all. This shows the URL a person can actually
 * send, and gives them a control to copy it.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lunara.co";

/** The referral tier, read from content so its terms are never retyped here. */
const REFERRAL_TIER = waitlistTiers.find((tier) => tier.id === "referral");

export function MembershipCard({
  membership,
  message,
  /** True when this replaced a form the visitor just submitted, false when restored. */
  announce = false,
  className,
}: {
  membership: Membership;
  message?: string;
  announce?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const referralUrl = `${SITE_URL}/?ref=${membership.referralCode}`;
  /* The visible link drops the scheme — nobody reads "https://" and it costs the
     line the width it needs to stay on one row on a phone. The copied value keeps it. */
  const shown = referralUrl.replace(/^https?:\/\//, "");

  /*
    Move focus here on submit, so a keyboard or screen-reader user lands on the
    answer instead of being left on a form that has just been replaced. Not on
    restore: stealing focus during a page load is its own bug.
  */
  useEffect(() => {
    if (announce) ref.current?.focus();
  }, [announce]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
    } catch {
      /* Clipboard can be refused by permission or by an insecure context. The URL is
         on screen and selectable, so the fallback is simply to leave it alone rather
         than to claim a copy that did not happen. */
      setCopied(false);
    }
  }

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={[styles.card, className].filter(Boolean).join(" ")}
    >
      <p className={styles.card__head}>
        {membership.founding ? "You are in the Founding 500" : "You are on the list"}
      </p>

      <div className={styles.card__body}>
        <p className={styles.place}>
          <span className={styles.place__value}>{membership.position}</span>
          <span className={styles.place__label}>Your place</span>
        </p>

        {message ? <p className={styles.note}>{message}</p> : null}

        <div className={styles.referral}>
          <p className={styles.referral__label}>Your referral link</p>

          <div className={styles.referral__row}>
            <span className={styles.referral__url}>{shown}</span>
            <button type="button" onClick={copy} className={styles.referral__copy}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {REFERRAL_TIER ? (
            <p className={styles.referral__note}>
              {REFERRAL_TIER.trigger} · {REFERRAL_TIER.benefits[0]}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
