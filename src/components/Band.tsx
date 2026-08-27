import type { ReactNode } from "react";

import styles from "./Band.module.css";

/**
 * A full-bleed band, torn out of the page rather than ruled off from it.
 *
 * ── Why a curve and not the hairline it replaces ────────────────────────────
 * Every band used to be bounded by a 1px straight border, top and bottom. That
 * is a table rule: it says "these rows are separate", which is true, and
 * nothing else. The collateral does not rule its grounds apart — it lays one
 * sheet of warm stock on another, and the eye reads the boundary from the torn
 * edge of the sheet.
 *
 * So the edge here is the band's *own ground*, drawn as a shallow irregular
 * deckle that bulges out into whatever sits beyond it. The boundary becomes a
 * shape rather than a line, which is the softening this needed, and it gets
 * there without a decorative wave laid *between* two sections — a wave is an
 * ornament that belongs to neither side, and it always reads as a template.
 * This belongs to the band, because it is made of the band.
 *
 * Amplitude is deliberately small: about 14px of rise and fall across 1440px,
 * in four lobes of unequal length. At that scale it reads as hand-torn paper
 * at arm's length and as nothing at all from further away, which is the
 * correct amount of attention for a boundary to ask for.
 *
 * ── The hairline still exists ───────────────────────────────────────────────
 * It just follows the tear now. It is a second path over the fill rather than
 * a stroke on it, because stroking a closed shape would outline all four sides
 * of the strip. `vector-effect="non-scaling-stroke"` keeps it at 1px: the
 * viewBox is stretched with `preserveAspectRatio="none"`, so a plain stroke
 * would be squashed to a fraction of a pixel on a phone and fattened on a
 * wide desktop.
 *
 * Both edges are decorative and inert — `aria-hidden`, pointer-transparent,
 * and outside the band's own box, so they never sit over content.
 */

/**
 * The tear, as one path.
 *
 * Four cubics of unequal span, so the undulation does not settle into a period
 * the eye can predict — a regular sine is a wave, an irregular one is a torn
 * edge. Authored bottom-up: `y = 18` is the band's true edge and the curve
 * rides above it.
 */
const TEAR =
  "M0 11 C 120 3 260 17 420 10 C 560 4 700 15 860 9 C 1000 4 1140 16 1280 10 C 1350 7 1400 5 1440 8";

/**
 * One torn edge.
 *
 * Exported because `Band` is not the only warm ground on the page — the tinted
 * product sections are the same sheet of stock and need the same edge. They
 * cannot be `Band`s, because they own an accent and a layout of their own, so
 * they take the edge and set `--lu-band-ground` / `--lu-band-line` themselves.
 */
export function BandEdge({ edge }: { edge: "top" | "bottom" }) {
  return (
    <span aria-hidden="true" className={`${styles.edge} ${styles[`edge--${edge}`]}`}>
      <svg
        viewBox="0 0 1440 18"
        preserveAspectRatio="none"
        className={styles.edge__svg}
        focusable="false"
      >
        {/* The sheet: the tear closed down to the band's edge, filled in its ground. */}
        <path d={`${TEAR} L1440 18 L0 18 Z`} className={styles.edge__fill} />
        {/* The same tear, drawn as the hairline the flat border used to be. */}
        <path
          d={TEAR}
          fill="none"
          className={styles.edge__line}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

export function Band({
  children,
  tone = "chalk",
  labelledBy,
  className,
}: {
  children: ReactNode;
  /** `plum` is the dark ground; it carries no hairline, only the tear. */
  tone?: "chalk" | "plum";
  labelledBy?: string;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={[
        "lu-band",
        tone === "plum" ? "lu-band--plum" : "",
        styles.band,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <BandEdge edge="top" />
      {children}
      <BandEdge edge="bottom" />
    </section>
  );
}
