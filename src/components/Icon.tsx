/**
 * Icons are hand-authored outline SVG: `fill: none`, `currentColor`, round caps and joins,
 * stroke-width 1.4–1.8. No filled, duotone, gradient or isometric sets, and no emoji.
 *
 * Every icon here is decorative — it sits next to a label that already says the thing —
 * so they are `aria-hidden` and carry no accessible name.
 */

import type { CSSProperties, ReactNode } from "react";

export interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

function Svg({
  size = 18,
  strokeWidth = 1.6,
  className,
  style,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Four-point star. The "open formula" mark. */
export function IconSpark(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.5v19M2.5 12h19M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </Svg>
  );
}

/**
 * The filled four-point star the collateral sets between two hairlines, under a product
 * name. Solid rather than stroked, because at ornament size a stroked star reads as an
 * asterisk. Concave edges, so it is the printed diamond and not a plus sign.
 */
export function IconDiamond({ size = 12, className, style }: Omit<IconProps, "strokeWidth">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 1.5c.8 5.4 3.6 8.6 10.5 10.5C15.6 13.9 12.8 17.1 12 22.5c-.8-5.4-3.6-8.6-10.5-10.5C8.4 10.1 11.2 6.9 12 1.5z" />
    </svg>
  );
}

export function IconBag(props: IconProps) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <path d="M6 2 4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4z" />
      <path d="M4 6h16" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  );
}

/** Document with a check — the certificate of analysis mark. */
export function IconDocumentCheck(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 14l2 2 4-4" />
    </Svg>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3v12" />
      <path d="M7 11l5 5 5-5" />
      <path d="M4 20h16" />
    </Svg>
  );
}

/** Glass of water — step one of the directions. */
export function IconGlass(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <path d="M5 3h14l-1.6 17.2a2 2 0 0 1-2 1.8H8.6a2 2 0 0 1-2-1.8z" />
      <path d="M5.9 10h12.2" />
    </Svg>
  );
}

/** Sun at its height — step two, with a meal, early afternoon. */
export function IconSun(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </Svg>
  );
}

/** Calendar — step three, daily without gaps. */
export function IconCalendar(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </Svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 7.4v5.4" />
      <path d="M12 16.4h.01" />
    </Svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10.8" cy="10.8" r="7.3" />
      <path d="M16.2 16.2 21 21" />
    </Svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </Svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <Svg strokeWidth={1.6} {...props}>
      <path d="M5 12h14" />
    </Svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Svg strokeWidth={1.6} {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconFlask(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <path d="M10 3v6.2L4.6 18.4A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.7-3.1L14 9.2V3" />
      <path d="M8.6 3h6.8" />
      <path d="M7.6 14.6h8.8" />
    </Svg>
  );
}

/** Shield with a check — "what we publish". */
export function IconShieldCheck(props: IconProps) {
  return (
    <Svg strokeWidth={1.7} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  );
}

/** Clock — step two, once a day with a meal. */
export function IconClock(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <circle cx="12" cy="12" r="7.8" />
      <path d="M12 7.8v4.8l3.6 1.8" />
    </Svg>
  );
}

/** Lady's mantle — the scalloped leaf on the Cycle Ritual pack. */
export function IconMantle(props: IconProps) {
  return (
    <Svg strokeWidth={1.4} {...props}>
      <path d="M12 21v-6.4" />
      <path d="M12 14.6c-3.4 0-5.6-2-5.6-4.6 0-1 .5-1.9 1.3-2.4-.3-1.1.1-2.3 1-3 .9.7 1.3 1.9 1 3 .8.5 1.3 1.4 1.3 2.4" />
      <path d="M12 14.6c3.4 0 5.6-2 5.6-4.6 0-1-.5-1.9-1.3-2.4.3-1.1-.1-2.3-1-3-.9.7-1.3 1.9-1 3-.8.5-1.3 1.4-1.3 2.4" />
      <path d="M9.2 18.2c-1.6 0-2.6-1-2.6-2.2M14.8 18.2c1.6 0 2.6-1 2.6-2.2" />
    </Svg>
  );
}

/** Ginger rhizome. */
export function IconGinger(props: IconProps) {
  return (
    <Svg strokeWidth={1.4} {...props}>
      <path d="M8.4 16.6c-1.9-.5-3-2-2.6-3.6.3-1.3 1.6-2 3-1.8-.6-1.6.1-3.3 1.6-3.9 1.4-.6 3 .1 3.7 1.5 1.1-1 2.7-1 3.7 0 1 1 1 2.7-.1 3.7 1.3.5 2 1.9 1.6 3.2-.5 1.5-2.2 2.3-3.8 1.7" />
      <path d="M15.5 17.4c0 1.6-1.6 2.8-3.5 2.8s-3.5-1.2-3.5-2.8" />
      <path d="M11 12.6h2M12 15.2h2.4" />
    </Svg>
  );
}

export function IconLeaf(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <path d="M20 4c0 9-5.4 14-12 14H4c0-9 5.4-14 12-14z" />
      <path d="M4 20c2.4-4.8 5.6-8 9.6-10" />
    </Svg>
  );
}

/* ------------------------------------------------------------------ formula marks
 *
 * The marks the printed collateral sets beside each ingredient: a molecular cluster for
 * the inositols, wave lines for theanine, a crocus for saffron. Same outline language as
 * everything above, so they sit in the set rather than beside it.
 */

/** Molecular cluster. The inositols, drawn the way the pack draws them. */
export function IconInositol(props: IconProps) {
  return (
    <Svg strokeWidth={1.4} {...props}>
      <circle cx="12" cy="6.4" r="1.7" />
      <circle cx="5.6" cy="10.4" r="1.7" />
      <circle cx="18.4" cy="10.4" r="1.7" />
      <circle cx="8.2" cy="17.4" r="1.7" />
      <circle cx="15.8" cy="17.4" r="1.7" />
      <path d="M10.6 7.4 7 9.4M13.4 7.4 17 9.4M6.4 12 7.6 15.8M17.6 12l-1.2 3.8M9.9 17.4h4.2" />
    </Svg>
  );
}

/** Three drawn-out waves. Theanine: calm without sedation. */
export function IconWaves(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <path d="M3 8.4c2.2-2.2 4.4-2.2 6.6 0s4.4 2.2 6.6 0 3.6-1.7 4.8-.6" />
      <path d="M3 13c2.2-2.2 4.4-2.2 6.6 0s4.4 2.2 6.6 0 3.6-1.7 4.8-.6" />
      <path d="M3 17.6c2.2-2.2 4.4-2.2 6.6 0s4.4 2.2 6.6 0 3.6-1.7 4.8-.6" />
    </Svg>
  );
}

/** Crocus sativus. Three stigmas above the petals, which is the part we buy. */
export function IconCrocus(props: IconProps) {
  return (
    <Svg strokeWidth={1.4} {...props}>
      <path d="M12 21v-6.2" />
      <path d="M12 14.8c-2.8 0-4.8-1.8-4.8-4.2 0-1.5.8-2.8 2-3.5" />
      <path d="M12 14.8c2.8 0 4.8-1.8 4.8-4.2 0-1.5-.8-2.8-2-3.5" />
      <path d="M12 14.8c0-3.4 0-6.2 0-8.6" />
      <path d="M12 8.6 9.4 3.4M12 8.6l2.6-5.2M12 8.2V3" />
      <path d="M8.6 18.4c-1.4-.2-2.4-1.1-2.6-2.3M15.4 18.4c1.4-.2 2.4-1.1 2.6-2.3" />
    </Svg>
  );
}

/**
 * A short symbol inside a hairline circle: Cr, Mg, B6, 40:1.
 *
 * The collateral sets these beside chromium, magnesium, B6 and the inositol ratio. They are
 * lettering rather than drawing, so they are real text in the display serif and not traced
 * paths: the glyphs stay crisp at any size and the mark scales with `size` like every icon.
 * Decorative, like the rest of the set, because the label beside it already says the name.
 */
export function ElementMark({
  symbol,
  size = 18,
  strokeWidth = 1.4,
  className,
  style,
}: IconProps & { symbol: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10.2" stroke="currentColor" strokeWidth={strokeWidth} />
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        stroke="none"
        fontFamily="var(--lu-font-display)"
        fontSize={symbol.length > 2 ? 8.6 : 11}
        letterSpacing="0.02em"
      >
        {symbol}
      </text>
    </svg>
  );
}
