import styles from "./SectionArt.module.css";

/**
 * The moon through one month, cast faintly across the page behind a product section.
 *
 * ── Why the moon and not the botanical ──────────────────────────────────────────────────
 * The packs print botanicals because a pack has to say what is in it — saffron crocus on
 * Crave Balance, lady's mantle on Cycle Ritual. Those are ingredient marks, and they are
 * already on the site as such (`formulaMarks`). Repeating them as wallpaper says the same
 * thing twice and says nothing the labels do not.
 *
 * The brand's own mark is the moon. It is the name, and for a product taken once a day for
 * twelve weeks — and for one built around the menstrual cycle — a lunar month is the unit
 * the whole thing is measured in. So the cast layer is the phases: new, waxing, full,
 * waning, new. Symmetric, which is also why it survives being mirrored into any corner.
 *
 * ── Why filled silhouettes ──────────────────────────────────────────────────────────────
 * Same reason as before: this is a shadow, and a shadow carries no detail, only shape and
 * softness. Moon phases are the ideal case for it — every phase is a solid region bounded
 * by two arcs, with no interior line work to lose. A traced outline at this size read as a
 * stray glyph; a disc does not.
 *
 * Decorative and inert: aria-hidden, pointer-events none, and behind everything.
 */

/** Every moon is the same moon, so every moon is the same size. */
const R = 16;

/**
 * One moon at a given illumination.
 *
 * The lit region is bounded by two arcs: the limb, which is always a half-circle of radius
 * `R`, and the terminator, which is a half-ellipse whose x-radius is `|k| · R`. That is the
 * real geometry — the terminator is the day/night line on a sphere, seen edge-on, so it
 * projects to an ellipse rather than to the arc of a smaller circle.
 *
 * `k` runs -1 (new) → 0 (half) → 1 (full). Its sign decides which way the terminator bows:
 * past half the moon is gibbous and it bows away from the limb, before half it is a
 * crescent and it bows back into the disc. That is the one flag between a convincing
 * crescent and a shape that reads as a bitten circle.
 */
function Moon({
  cx,
  cy,
  k,
  waning = false,
}: {
  cx: number;
  cy: number;
  k: number;
  /** Mirrors the phase, so the second half of the month lights the other limb. */
  waning?: boolean;
}) {
  // At exactly half, the terminator has no width and SVG draws the arc as the straight
  // line it should be. Nothing here special-cases it, because nothing needs to.
  const terminator = (Math.abs(k) * R).toFixed(2);
  const bows = k >= 0 ? 1 : 0;

  return (
    <path
      transform={`translate(${cx} ${cy})${waning ? " scale(-1 1)" : ""}`}
      d={`M0 ${-R}A${R} ${R} 0 0 1 0 ${R}A${terminator} ${R} 0 0 ${bows} 0 ${-R}Z`}
    />
  );
}

/**
 * One month: crescent, quarter, gibbous, full, and back again.
 *
 * ── Constant radius, and why it matters ─────────────────────────────────────────────────
 * The first version tapered the discs, largest at the full moon. It read as a scatter of
 * unrelated circles, and the reason is simple: the moon does not get bigger. Size is the
 * strongest signal in a row of shapes, so varying it says "these are seven objects" over
 * the top of everything else. Holding it fixed and changing only the phase says "this is
 * one object, seven times", which is the entire idea.
 *
 * ── The arc ─────────────────────────────────────────────────────────────────────────────
 * The points sit on a single curve rather than a straight strip, because an evenly spaced
 * row is a diagram of the phases and this site would only publish a diagram with labels on
 * it. Spacing runs a little wider than the diameter, so they stay separate discs under the
 * blur instead of merging into one bar.
 */
const MONTH: readonly { cx: number; cy: number; k: number; waning?: boolean }[] = [
  { cx: 20, cy: 178, k: -0.5 },
  { cx: 28, cy: 136, k: 0 },
  { cx: 44, cy: 101, k: 0.5 },
  { cx: 68, cy: 72, k: 1 },
  { cx: 99, cy: 48, k: 0.5, waning: true },
  { cx: 138, cy: 31, k: 0, waning: true },
  { cx: 184, cy: 20, k: -0.5, waning: true },
];

export function SectionArt({
  position = "top-right",
  size = 460,
  className,
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Rendered edge length in px. Large: this is a month across the page, not a motif. */
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={[styles.art, styles[`art--${position}`], className].filter(Boolean).join(" ")}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="currentColor"
        focusable="false"
      >
        {MONTH.map((moon) => (
          <Moon key={`${moon.cx}-${moon.cy}`} {...moon} />
        ))}
      </svg>
    </span>
  );
}
