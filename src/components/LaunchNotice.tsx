import { daysUntilLaunch, formatLaunchDate } from "@/lib/content";

import styles from "./LaunchNotice.module.css";

/**
 * When the product arrives, said in one sentence, in one place.
 *
 * ── Why the date and the count, and not "60 days" ───────────────────────────
 * "Launching in 60 days" is true for one day and wrong every day after it. It
 * is the same class of fact as a retyped dose: a countable thing typed by hand,
 * which drifts the moment nobody is looking. The date lives in `site.json`, the
 * count is derived from it, and both are rendered together so a reader can
 * check one against the other — which is the habit this site applies to every
 * other number it publishes.
 *
 * Server-rendered from a dynamic route, so the count is recomputed per request
 * rather than frozen at build time.
 *
 * ── Why it does not shout ───────────────────────────────────────────────────
 * This is the closest thing on the site to a scarcity device, and it is next to
 * a progress bar that is already a scarcity device. It states a date. There is
 * no ticking clock, no hours and minutes, no colour change as it nears — the
 * brand publishes numbers and reasons, and a countdown that animates is neither.
 */
export function LaunchNotice({ tone = "light" }: { tone?: "light" | "onPlum" }) {
  const days = daysUntilLaunch();

  return (
    <p className={`${styles.notice} ${tone === "onPlum" ? styles["notice--onPlum"] : ""}`}>
      <span className={styles.notice__label}>Shipping from</span>{" "}
      <span className={styles.notice__date}>{formatLaunchDate()}</span>
      {days > 0 ? (
        <>
          {" · "}
          <span className={styles.notice__days}>{days}</span> days from today. Nothing is for
          sale until then, and the list is how you hear first.
        </>
      ) : (
        <>{" · "}The first production run has landed.</>
      )}
    </p>
  );
}
