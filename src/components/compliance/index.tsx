/**
 * Compliance surfaces.
 *
 * The FDA disclaimer is a component, not a string. So is the warning set. Both read from
 * `content/compliance.json`, so a counsel-driven wording change lands everywhere at once —
 * footer, product page, FAQ sidebar and checkout — with no chance of one copy drifting.
 */

import { compliance, dosesAreFinal, doseDisclaimer } from "@/lib/content";
import { IconAlert } from "@/components/Icon";

import styles from "./Compliance.module.css";

/**
 * Renders in the footer of every page and adjacent to every structure/function claim.
 * `withPreLaunch` adds the preliminary-formula line while doses are still targets.
 */
export function FdaDisclaimer({
  withPreLaunch = false,
  onPlum = false,
  size = "legal",
  className,
}: {
  withPreLaunch?: boolean;
  onPlum?: boolean;
  /** "legal" is the footer footnote; "body" is the sidebar card on the FAQ. */
  size?: "legal" | "body";
  className?: string;
}) {
  const text =
    withPreLaunch && !dosesAreFinal
      ? `${compliance.fdaDisclaimer} ${compliance.preLaunchDisclaimer}`
      : compliance.fdaDisclaimer;

  return (
    <p
      className={[
        styles.disclaimer,
        size === "body" ? styles["disclaimer--body"] : "",
        onPlum ? styles["disclaimer--onPlum"] : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {text}
    </p>
  );
}

/**
 * Doses carry their target flag. While `product.dosesAreFinal` is false this renders
 * wherever a dose appears; flipping that boolean removes every caveat sitewide.
 */
export function DoseDisclaimer({
  prefix,
  onPlum = false,
  className,
}: {
  prefix?: string;
  onPlum?: boolean;
  className?: string;
}) {
  if (dosesAreFinal) return null;

  return (
    <p
      className={[
        styles.doseDisclaimer,
        onPlum ? styles["doseDisclaimer--onPlum"] : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {prefix ? `${prefix} ` : null}
      {doseDisclaimer}
    </p>
  );
}

/** The complete warning set, one source, used verbatim wherever warnings are required. */
export function WarningSet({
  heading = "Before you start",
  compact = false,
  className,
}: {
  heading?: string;
  compact?: boolean;
  className?: string;
}) {
  // The heading is the identity of the block, so it also gives the block its id — two
  // warning sets on one page would be two different headings.
  const headingId = `lu-warnings-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section
      className={[styles.warnings, compact ? styles["warnings--compact"] : "", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className={styles.warnings__heading}>
        <IconAlert size={14} strokeWidth={1.6} />
        {heading}
      </h2>
      <ul className={styles.warnings__list}>
        {compliance.warningSet.map((warning) => (
          <li key={warning} className={styles.warnings__item}>
            {warning}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Marks a surface that has not yet cleared regulatory counsel. The Supplement Facts panel
 * in the designs is a layout draft; it must say so until the manufacturer's panel lands.
 */
export function DraftFlag({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.draftFlag}>
      <IconAlert size={13} strokeWidth={1.6} />
      {children}
    </p>
  );
}
