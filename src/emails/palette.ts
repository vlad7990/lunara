/**
 * The email palette.
 *
 * These are the same values as `src/styles/tokens.css` — and they are duplicated here on
 * purpose. Email clients do not resolve CSS custom properties, and most strip `<style>`
 * blocks entirely, so every colour in an email has to be an inline literal.
 *
 * This module is the one place that duplication is allowed to live. If a value changes in
 * `tokens.css`, change it here too; nothing else in `src/emails` may write a hex code.
 */

export const email = {
  plum: "#3E1C2A",
  plumMid: "#4A2233",

  gold: "#C9A75C",
  goldDeep: "#7D612D",
  goldWash: "#F3E9D6",
  goldBorder: "#E0CFA8",
  goldTint: "#FDF7EA",

  chalk: "#F7EFE4",
  chalkAlt: "#EFE6D8",
  card: "#FFFCF7",

  hairline: "#E7DCCB",
  hairlineStrong: "#DCCDB2",
  borderAlt: "#E0D4C0",
  /** The 1px border around the email body on the asset board. */
  bodyBorder: "#DED2C0",

  ink: "#2A2320",
  body: "#3C352F",
  body2: "#554C43",
  muted: "#6D6157",
  muted2: "#706456",

  cream: "#FBF3E4",
  cream2: "#F3E4CB",
} as const;

/**
 * Cormorant Garamond will not load in most email clients, so the display face falls back to
 * Georgia — the closest widely-installed serif, and the same fallback `tokens.css` declares.
 */
export const fontDisplay = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
export const fontBody = "'Inter Tight', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
