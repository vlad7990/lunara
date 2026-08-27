# LUNARA

The LUNARA marketing site and store, built from the design handoff in
`design_handoff_lunara_site`. Next.js App Router, TypeScript, CSS Modules.

Read `CLAUDE.md` before changing anything — it holds the rules that must stay true.

## Running it

```bash
npm install
cp .env.example .env.local
npm run dev
```

`npm run build` · `npm run typecheck` · `npm run lint`

## The one flag

`SITE_MODE` is `waitlist` (default) or `store`, resolved **server-side on every request** in
`src/lib/mode.ts`. It changes only the commerce surfaces — nav action, announcement bar, home
block 3, product buy panel, `/bag`, shop CTAs and the FAQ ordering group. Everything else is
byte-identical across modes.

It is never resolved in the client: a commerce surface that flashes the wrong state is the
bug this flag exists to prevent.

To see both modes on one deployment, `/preview/store` and `/preview/waitlist` set an override
cookie. That route 404s in production unless `LUNARA_ALLOW_MODE_PREVIEW=1`.

## Where things live

```
content/                 authoritative copy, doses, prices, lab data, compliance strings
  *.json                 never retype a value from here — import it
  articles/*.md          the open formula series bodies
src/
  app/
    layout.tsx           announcement bar → sticky nav → children → cookie bar
    (site)/              every page with the full footer
      page.tsx           the brand home: hero, a section per product, proof, ask
      join/              the waitlist conversion page, one job only
    (commerce)/          bag and checkout, condensed footer
    preview/[mode]/      staging-only mode switch
  components/
    compliance/          FDA disclaimer, warning set, dose disclaimer, draft flag
    coa/                 batch lookup (JS-free GET form)
    product/             dose strip, Supplement Facts, buy panel
    waitlist/            signup form, Founding 500 progress
    bag/                 add to bag, line mutations
    shell/               nav, footer, announcement bar, cookie bar
    legal/               one policy, rendered per route
  lib/
    content.ts           the single import point for content/*.json
    mode.ts              SITE_MODE resolution
    bag.ts               cookie-backed bag, money in cents
    waitlist/            storage adapter — Neon Postgres, file store in dev
    legal.ts             the six policies (design copy, not counsel-reviewed)
  styles/tokens.css      every colour, size and spacing value on the site
  emails/                the welcome email and its palette
```

`content/products.json` is the catalogue: one record per product, and what the home page
iterates over. Adding a third product is a record plus a page, not a component change.

## Rules the code enforces

- **No hex code outside `tokens.css`.** Components use `var(--lu-*)`.
- **No hard-coded dose, price, warning or disclaimer.** They come from `content/*.json`
  through `src/lib/content.ts`.
- **`font-variant-numeric: tabular-nums` on `body`.** Misaligned digits are a bug.
- **`/lot/:batch` renders server-side with no JavaScript.** That URL is printed on the box.
  The lookup form is a plain GET to `/lot`, which normalises the code and redirects.
- **Supplement Facts is a semantic `<table>`.** So is every dose and lab table.
- **Doses carry their unit and their target flag.** While `product.dosesAreFinal` is `false`,
  `<DoseDisclaimer>` renders wherever a dose appears. Flipping that boolean clears every
  "target dose" caveat sitewide.
- **One radius scale.** Cards 14px, chips 6px, fields and buttons 4px, pills full. Matched
  to the printed collateral. The Supplement Facts panel is the one documented square
  exception. No shadows on content; elevation is for the cookie bar only.
- **One accent per product.** Crave Balance plum, Cycle Ritual burgundy. A product section
  sets `--accent` once and everything inside reads it, so accents never mix.
- **Analytics is opt-in, not opt-out.** `<Analytics>` renders in the root layout only for a
  stored consent of `all`. No choice yet, or "Essential only", and the script never reaches
  the browser. The privacy policy says analytics can be declined without losing any
  functionality and the cookie bar says declining costs no function — an unconditional
  `<Analytics>` would make both untrue. Consent is resolved server-side, so it never flashes.

## State

| State | Where | Notes |
|---|---|---|
| `siteMode` | request | Server-resolved, read-only in the client |
| waitlist signup | `src/lib/waitlist` | Position, referral code, founding flag |
| `bag` | `lunara.bag` cookie | Server-read, so the nav count never lags |
| `plan`, `qty` | product buy panel | Client state; the price the server honours is recomputed |
| `ackChecked` | checkout | Gates the pay button |
| `cookieConsent` | `lunara.consent` cookie | Read server-side; the banner never flashes |
| `shopFilter` | shop | Client-only, no URL change |

## Storage

The waitlist is one of three writes on the site. `src/lib/waitlist/index.ts` picks a store:

- **Neon Postgres** whenever `DATABASE_URL` is set — which is any Vercel deployment, since
  the Marketplace integration provides it. Apply `src/lib/waitlist/schema.sql` once; it is
  idempotent, so re-running it is how migrations land.
- **A local JSON file** under `.data/` otherwise. Fine for `next dev`; it writes to disk, so
  it cannot run on a read-only serverless filesystem.

## Email

Built and ready; **no provider is wired**. Resend can only send from a domain we own, and
`lunara.co` is not on the account.

`src/lib/email/index.ts` selects a mailer. Without `RESEND_API_KEY` and `EMAIL_FROM` it
returns one that reports `configured: false` and sends nothing — and the signup confirmation
reads that flag, so it does not promise an inbox it cannot deliver to. Set both and the
Resend adapter takes over with no code change.

To turn it on:

```bash
vercel integration add resend/resend-email --plan free \
  -m domain=<a domain you own> -m region=us-east-1
# add the SPF/DKIM records Resend returns, then:
vercel env add EMAIL_FROM production        # e.g. LUNARA <hello@lunara.co>
vercel env add NEXT_PUBLIC_SITE_URL production
```

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Set by the integration |
| `EMAIL_FROM` | The From header, e.g. `LUNARA <hello@lunara.co>` |
| `NEXT_PUBLIC_SITE_URL` | Absolute origin for links inside emails; falls back to the Vercel URL |

The welcome email lives in `src/emails/welcome.ts` — table-based HTML with a plain-text
alternative, doses read from `product.json` and the disclaimer from `compliance.json`, so it
can never disagree with the site about a milligram. Read it at
`/preview/email/welcome` (`?format=text`, `?founding=0`, `?place=501` for the other states);
that route is dev-gated like `/preview/[mode]`.

Unsubscribe is live already, because the email links to it: `/unsubscribe` for humans
(a GET never unsubscribes anyone — mail scanners follow those links), and `/api/unsubscribe`
for the RFC 8058 one-click POST that Gmail and Yahoo require of bulk senders.

Colours in emails are inline literals in `src/emails/palette.ts` — email clients cannot
resolve CSS custom properties. That file is the only place the token values are duplicated;
keep it in step with `tokens.css`.

## Outstanding before launch

1. **Supplement Facts panel** from the contract manufacturer, cleared by regulatory counsel.
   The panel on `/crave-balance` is a layout draft and says so.
2. **All six policies** drafted or reviewed by counsel. The copy in `src/lib/legal.ts` is
   design copy and each page carries a standing note saying so.
3. **Approved-claims list** wired as the source for every product-page string.
4. **Photography.** Every unshot frame is a `<DropInSlot>` holding its final aspect ratio.
5. **Payments.** Store mode has a working bag and a gated checkout; no processor is wired.
   Also **a sending domain** — without one nobody on the list can be emailed.
6. **Cycle Ritual commerce.** It has a catalogue record and a product page, but no SKU,
   price or Supplement Facts panel yet, so it does not appear in `/shop`.
7. **The doses themselves.** `product.dosesAreFinal` is `false` and stays that way until the
   numbers are confirmed. Note that the **product infographics disagree with
   `content/product.json`**: the images show myo-inositol as 2,000–4,000 mg, D-chiro as
   50–100 mg and saffron as pending raw-material selection, where `product.json` publishes
   fixed values of 3,000 mg, 75 mg and 28 mg.

   The change log dates both sides — myo-inositol was fixed at 3,000 mg on 2026-02-28 "down
   from a 4,000 mg option", and saffron was set at 28 mg on 2026-03-12 — so `product.json`
   reads as the later decision and the infographics as the thinking it replaced. That has
   **not** been confirmed, and nothing has been changed either way. `product.json` remains
   the single source the site renders from. Resolve this before `dosesAreFinal` is flipped,
   because flipping it removes the caveat from the dose strip, the Supplement Facts draft,
   the open-formula articles and the welcome email at once.

   Read directly off `public/assets/infographic-crave-plum.jpg`, which sharpens the picture
   without settling it:

   - **Two of six values are not in conflict at all.** L-theanine (200 mg) and chromium
     picolinate (200 mcg) are identical on both sides. Only the two inositols and saffron
     differ, and all three differ in the same direction — range or pending, to fixed.
   - **The artwork labels itself.** Its footer reads "Предварительная формула" —
     *preliminary formula* — and its saffron line reads "доза после выбора сырья", *dose
     after raw-material selection*, which is the same policy `doseDisclaimer` states. It is
     not asserting rival final doses; it is the pre-decision state, self-described.
   - **D-chiro is the actual gap.** Myo (2026-02-28) and saffron (2026-03-12) are both dated
     in the published change log. The move from 50–100 mg to 75 mg is not, so it is the one
     value with no dated decision behind it. The 40:1 ratio does not corroborate it either
     way: 2,000/50 and 4,000/100 are both 40:1, and so is 3,000/75.

   **Two separate exposures on those files, neither reviewed.** They are not referenced from
   `src/` or `content/` and nothing on the site renders them — but they sit in `public/`, so
   they are served: `/assets/infographic-crave-plum.jpg` returns 200 in production. That
   means (a) doses which contradict what the site publishes are fetchable and indexable, on
   a brand whose whole position is that every milligram is published, and (b) the artwork
   carries Russian structure/function claims — "Поддерживает передачу инсулинового сигнала",
   "Поддерживает эмоциональное благополучие" and others — which are almost certainly not on
   the approved-claims list, since that list is reviewed in English. `claimsRule` admits no
   exception for a translation. Review both before any of this artwork is used for print,
   social or a creator brief, and before it is linked from anywhere on the site.
