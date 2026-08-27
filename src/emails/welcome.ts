import {
  compliance,
  dosedIngredients,
  formatDose,
  ingredients,
  product,
  site,
  waitlistTiers,
} from "@/lib/content";
import { FOUNDING_TOTAL } from "@/lib/waitlist";
import type { WaitlistEntry } from "@/lib/waitlist";

import { email as c, fontBody, fontDisplay } from "./palette";

/**
 * The welcome email — sent the moment someone joins the list.
 *
 * It is the promise the signup form makes: the whole formula, at the doses we are targeting,
 * before a jar has been filled. Every dose comes from `product.json` and the disclaimer from
 * `compliance.json`, exactly as on the site — an email that disagreed with the page about a
 * milligram would undo the entire point of publishing.
 *
 * Built as nested tables with inline styles, because that is what email clients render.
 */

export interface WelcomeEmail {
  subject: string;
  /** The preview line, shown after the subject in most inboxes. */
  preview: string;
  html: string;
  text: string;
}

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function doseRow(name: string, dose: string, last: boolean): string {
  const border = last ? "none" : `1px dotted ${c.hairlineStrong}`;
  return `
    <tr>
      <td style="padding:11px 0;border-bottom:${border};font-family:${fontBody};font-size:13px;letter-spacing:0.1em;text-transform:uppercase;color:${c.plumMid};font-weight:700;">${escape(name)}</td>
      <td align="right" style="padding:11px 0;border-bottom:${border};font-family:${fontDisplay};font-size:22px;color:${c.ink};">${escape(dose)}</td>
    </tr>`;
}

export function renderWelcomeEmail({
  entry,
  place,
  siteUrl,
}: {
  entry: WaitlistEntry;
  /** The published place, which includes the held list. Never `entry.position`. */
  place: number;
  siteUrl: string;
}): WelcomeEmail {
  const founding = waitlistTiers[0];
  const early = waitlistTiers[1];

  // The ratio row sits between the two inositols on the dose card, as on the pack.
  const ratio = ingredients.find((i) => i.unit === null);
  const rows: { name: string; dose: string }[] = [];
  for (const ingredient of dosedIngredients) {
    rows.push({ name: ingredient.name, dose: formatDose(ingredient) });
    if (ingredient.name === "D-chiro-inositol" && ratio) {
      rows.push({ name: ratio.name, dose: String(ratio.dose) });
    }
  }

  const tierLine = entry.founding
    ? `You&rsquo;re inside the ${escape(founding.name)} — ${escape(founding.offer)}, a permanent founding badge, and your name in the first box insert. Three referrals moves a friend in beside you.`
    : `The ${escape(founding.name)} is full, so you&rsquo;re on the ${escape(early.name.toLowerCase())} at ${escape(early.offer)}. Three confirmed referrals still moves you into the ${escape(founding.name)}, without changing anyone else&rsquo;s place.`;

  const referralUrl = `${siteUrl}/?ref=${entry.referralCode}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${escape(site.brand.name)}</title>
</head>
<body style="margin:0;padding:0;background:${c.chalkAlt};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Every milligram, before the product exists.</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.chalkAlt};">
<tr><td align="center" style="padding:24px 12px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${c.card};border:1px solid ${c.bodyBorder};font-variant-numeric:tabular-nums;">

  <tr>
    <td align="center" style="background:${c.plum};padding:34px;">
      <span style="font-family:${fontDisplay};font-size:22px;letter-spacing:0.46em;color:${c.gold};">${escape(site.brand.name)}</span>
    </td>
  </tr>

  <tr>
    <td style="padding:40px 44px 34px;">
      <h1 style="margin:0 0 18px;font-family:${fontDisplay};font-weight:400;font-size:38px;line-height:1.1;color:${c.ink};">You&rsquo;re on the list.</h1>
      <p style="margin:0 0 16px;font-family:${fontBody};font-size:16px;line-height:1.68;color:${c.body};">Most pre-launch emails would give you a discount code and go quiet for three months. Instead, here is the formula — the whole thing, at the doses we&rsquo;re targeting, before a single jar has been filled.</p>
      <p style="margin:0;font-family:${fontBody};font-size:16px;line-height:1.68;color:${c.body};">Screenshot it. If anything moves between now and launch, we will publish that too, with a date on it.</p>
    </td>
  </tr>

  <tr>
    <td style="padding:0 44px 34px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${c.goldBorder};background:${c.chalk};">
        <tr>
          <td style="padding:14px 22px;background:${c.goldWash};font-family:${fontBody};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${c.goldDeep};font-weight:700;">${escape(product.name)} · one serving</td>
        </tr>
        <tr>
          <td style="padding:6px 22px 14px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${rows.map((r, i) => doseRow(r.name, r.dose, i === rows.length - 1)).join("")}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:0 44px 34px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.goldTint};border:1px solid ${c.goldBorder};">
        <tr><td style="padding:22px 24px;">
          <p style="margin:0 0 8px;font-family:${fontBody};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${c.goldDeep};font-weight:700;">Your place</p>
          <p style="margin:0 0 8px;font-family:${fontDisplay};font-size:30px;color:${c.ink};">No. ${place} of ${FOUNDING_TOTAL}</p>
          <p style="margin:0;font-family:${fontBody};font-size:14px;line-height:1.55;color:${c.body2};">${tierLine}</p>
        </td></tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:0 44px 34px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.plum};">
        <tr><td align="center" style="padding:17px;">
          <a href="${siteUrl}/open-formula" style="font-family:${fontBody};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${c.cream2};font-weight:700;text-decoration:none;">Read why we published this</a>
        </td></tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:0 44px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${c.hairline};">
        <tr><td style="padding:18px 22px;">
          <p style="margin:0 0 5px;font-family:${fontBody};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${c.muted2};font-weight:700;">Your referral link</p>
          <p style="margin:0 0 6px;font-family:${fontBody};font-size:14px;line-height:1.5;color:${c.ink};"><a href="${referralUrl}" style="color:${c.goldDeep};">${escape(referralUrl)}</a></p>
          <p style="margin:0;font-family:${fontBody};font-size:13px;line-height:1.5;color:${c.muted};">Three confirmed referrals moves you into the ${escape(founding.name)}, regardless of your position in line. Your referrals keep their own place.</p>
        </td></tr>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:26px 44px 34px;background:${c.chalkAlt};border-top:1px solid ${c.borderAlt};">
      <p style="margin:0;font-family:${fontBody};font-size:11px;line-height:1.6;color:${c.muted2};">${escape(compliance.fdaDisclaimer)} ${escape(compliance.preLaunchDisclaimer)}</p>
      <p style="margin:10px 0 0;font-family:${fontBody};font-size:11px;line-height:1.6;color:${c.muted2};">${escape(site.brand.name)} · <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(entry.email)}" style="color:${c.muted2};">Unsubscribe</a> · <a href="${siteUrl}/privacy" style="color:${c.muted2};">Privacy</a> · <a href="${siteUrl}/privacy#your-privacy-choices" style="color:${c.muted2};">Your California privacy choices</a></p>
    </td>
  </tr>

</table>

</td></tr>
</table>
</body>
</html>`;

  const text = [
    `You're on the list.`,
    ``,
    `Most pre-launch emails would give you a discount code and go quiet for three months. Instead, here is the formula — the whole thing, at the doses we're targeting, before a single jar has been filled.`,
    ``,
    `${product.name} · one serving`,
    ...rows.map((r) => `  ${r.name}: ${r.dose}`),
    ``,
    `Your place: No. ${place} of ${FOUNDING_TOTAL}`,
    ``,
    `Your referral link: ${referralUrl}`,
    `Three confirmed referrals moves you into the ${founding.name}, regardless of your position in line.`,
    ``,
    `Read why we published this: ${siteUrl}/open-formula`,
    ``,
    compliance.fdaDisclaimer,
    compliance.preLaunchDisclaimer,
    ``,
    `Unsubscribe: ${siteUrl}/unsubscribe?email=${encodeURIComponent(entry.email)}`,
  ].join("\n");

  return {
    subject: "You're in. Here is the whole formula.",
    preview: "Every milligram, before the product exists.",
    html,
    text,
  };
}
