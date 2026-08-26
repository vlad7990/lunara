"use client";

import { useState, useTransition } from "react";

import type { ConsentChoice } from "@/lib/consent";

import { setConsent } from "./actions";
import styles from "./Shell.module.css";

/**
 * The only floating surface on the site, and one of the two places elevation is allowed.
 *
 * It renders only when no choice has been stored — the server checks the cookie before this
 * mounts, so it never appears-then-vanishes for someone who already answered. Declining
 * costs no function.
 */
export function CookieBar() {
  const [dismissed, setDismissed] = useState(false);
  const [, startTransition] = useTransition();

  if (dismissed) return null;

  const choose = (choice: ConsentChoice) => {
    setDismissed(true);
    startTransition(() => {
      void setConsent(choice);
    });
  };

  return (
    <aside className={styles.cookies} aria-label="Cookie choices">
      <p className={styles.cookies__text}>
        We use cookies for basic analytics and, if you allow it, for advertising measurement.
        You can decline both and the site works exactly the same.
      </p>
      <div className={styles.cookies__actions}>
        <button
          type="button"
          onClick={() => choose("essential")}
          className={`lu-btn lu-btn--outlineOnPlum ${styles.cookies__btn}`}
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => choose("all")}
          className={`lu-btn lu-btn--gold ${styles.cookies__btn}`}
        >
          Accept all
        </button>
      </div>
    </aside>
  );
}
