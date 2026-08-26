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
```

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
- **Sharp corners.** `border-radius: 0` except form fields and primary buttons (3px) and
  pills (999px). No shadows on content; elevation is for the cookie bar only.

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
6. **Contrast.** The gold and muted micro-labels sit between 2.9:1 and 4.0:1 against their
   backgrounds, under the 4.5:1 WCAG AA wants at those sizes. Published as a known gap on
   `/accessibility` rather than silently changed.
7. **Article bodies** for pieces 01–03, which are marked published but have no markdown in
   `content/articles/`.
