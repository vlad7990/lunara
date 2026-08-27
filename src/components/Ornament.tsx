import { IconDiamond } from "@/components/Icon";

import styles from "./Ornament.module.css";

/**
 * The two decorative devices the printed collateral uses, and nothing else.
 *
 * Both are purely visual and carry no information, so both are `aria-hidden` and neither is
 * reachable. Both are flat line art, because that is what the pack prints: a rule with a
 * mark on it, in one weight, at one size. The soft cast layer is a separate thing entirely
 * and lives in `SectionArt` — a shadow on the page rather than a mark on the pack. Do not
 * blur these to match it; a printed rule that fades at the ends is a rule, and a printed
 * rule that is soft all over is a smudge.
 */

/**
 * Rule, spark, rule. Sits under a section subtitle, the way the pack sets it under the
 * product name. Never between two body paragraphs, where a plain hairline is the honest mark.
 */
export function SparkDivider({
  align = "center",
  onPlum = false,
  className,
}: {
  align?: "center" | "start";
  onPlum?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        styles.divider,
        align === "start" ? styles["divider--start"] : "",
        onPlum ? styles["divider--onPlum"] : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={styles.divider__rule} />
      <IconDiamond size={11} className={styles.divider__spark} />
      <span className={styles.divider__rule} />
    </div>
  );
}
