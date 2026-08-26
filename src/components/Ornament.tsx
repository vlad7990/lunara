import { IconDiamond } from "@/components/Icon";

import styles from "./Ornament.module.css";

/**
 * The two decorative devices the printed collateral uses, and nothing else.
 *
 * Both are purely visual and carry no information, so both are `aria-hidden` and neither is
 * reachable. They are also both flat line art: the collateral sets its botanicals as soft
 * blurred shadows, which the site cannot reproduce, because `compliance.json` puts
 * "Gradients, textures, drop shadows" on the never-publish list and CLAUDE.md keeps
 * elevation for genuinely floating surfaces. The line art is the part of that language that
 * is actually printed on the packs, so it is the part the site can carry.
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
