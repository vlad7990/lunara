import { lots } from "@/lib/content";

import styles from "./BatchLookup.module.css";

/**
 * Look up a lot by the batch code printed on the pack.
 *
 * This is a plain GET form. `/lot` normalises the value server-side and redirects to
 * `/lot/:batch`, so the whole path works with JavaScript disabled.
 */
export function BatchLookup({
  label = "Look up a batch",
  hint,
  onPlum = false,
  buttonLabel = "Look up",
  className,
}: {
  label?: string;
  hint?: string;
  onPlum?: boolean;
  buttonLabel?: string;
  className?: string;
}) {
  const example = lots[0]?.batch ?? "CB-YYYY-MMDD";

  return (
    <form
      action="/lot"
      method="get"
      className={[styles.lookup, onPlum ? styles["lookup--onPlum"] : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <label htmlFor="lu-batch" className={styles.label}>
        {label}
      </label>
      <div className={styles.row}>
        <input
          id="lu-batch"
          name="batch"
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          placeholder={example}
          pattern="[A-Za-z]{2}-\d{4}-\d{4}"
          title="Batch codes look like CB-2026-0412"
          className={`lu-field lu-field--sm ${styles.field}`}
        />
        <button type="submit" className={`lu-btn lu-btn--sm ${styles.submit}`}>
          {buttonLabel}
        </button>
      </div>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </form>
  );
}
