import { waitlistTiers } from "@/lib/content";
import { getWaitlistProgress } from "@/lib/waitlist";

import styles from "./Waitlist.module.css";

/**
 * The Founding 500 progress card.
 *
 * The count comes from the server on every request. The bar carries the only gradient in
 * the design — two stops of gold, and nowhere else.
 */
export async function FoundingProgress({ className }: { className?: string }) {
  const { taken, total, remaining, barPct, foundingFull } = await getWaitlistProgress();
  const founding = waitlistTiers[0];
  const early = waitlistTiers[1];

  return (
    <div className={[styles.progress, className].filter(Boolean).join(" ")}>
      <div className={styles.progress__head}>
        <span className={styles.progress__label}>{founding.name}</span>
        <span className={styles.progress__count}>
          <strong>{taken}</strong> of {total} places taken
        </span>
      </div>

      <div
        className={styles.progress__track}
        role="progressbar"
        aria-valuenow={taken}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${founding.name} places taken`}
      >
        <div className={styles.progress__bar} style={{ width: barPct }} />
      </div>

      <p className={styles.progress__foot}>
        {foundingFull
          ? `The ${founding.name} is full. New signups join the ${early.name.toLowerCase()} at ${early.offer}.`
          : `${remaining} left before the list moves to ${early.offer}.`}
      </p>
    </div>
  );
}
