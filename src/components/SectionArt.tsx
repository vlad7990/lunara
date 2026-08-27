import styles from "./SectionArt.module.css";

/**
 * The dappled botanical shadow the collateral casts across its backgrounds.
 *
 * Built as filled silhouettes rather than outline drawing, then blurred. That is the whole
 * trick: a leaf shadow carries no detail, only shape and softness, so ellipses on a curved
 * stem read as foliage once blurred while a traced botanical does not. The earlier attempt
 * scaled up an outline icon and read as a stray glyph, because outlines survive scaling and
 * silhouettes survive blurring.
 *
 * Decorative and inert: aria-hidden, pointer-events none, and behind everything.
 */

/** One branch: a curved stem with leaves alternating along it. */
function Branch() {
  return (
    <g>
      <path
        d="M8 4C34 26 58 58 74 104"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="20" cy="16" rx="12" ry="6.4" transform="rotate(-28 20 16)" />
      <ellipse cx="34" cy="24" rx="13.5" ry="7" transform="rotate(34 34 24)" />
      <ellipse cx="40" cy="40" rx="11.5" ry="6" transform="rotate(-22 40 40)" />
      <ellipse cx="54" cy="52" rx="14" ry="7.4" transform="rotate(40 54 52)" />
      <ellipse cx="56" cy="70" rx="12" ry="6.2" transform="rotate(-18 56 70)" />
      <ellipse cx="70" cy="84" rx="13" ry="6.8" transform="rotate(46 70 84)" />
      <ellipse cx="70" cy="102" rx="10.5" ry="5.6" transform="rotate(-14 70 102)" />
    </g>
  );
}

export function SectionArt({
  position = "top-right",
  size = 460,
  className,
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Rendered edge length in px. Large: this is light through a window, not a motif. */
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
        {/* Three branches at different scales and angles, so the cast reads as a canopy
            rather than as one repeated stamp. */}
        <g transform="translate(6 -6) rotate(8 100 100)">
          <Branch />
        </g>
        <g transform="translate(96 10) rotate(58 100 100) scale(0.82)" opacity="0.85">
          <Branch />
        </g>
        <g transform="translate(30 84) rotate(-24 100 100) scale(0.66)" opacity="0.7">
          <Branch />
        </g>
      </svg>
    </span>
  );
}
