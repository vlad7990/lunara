# LUNARA site — project instructions

You are building the LUNARA marketing site and store. Read `README.md` first for the full
specification, then keep these rules in context for every change.

## What the files in this folder are

`pages/*.dc.html` are **design references**, not production code. They are HTML prototypes
that show intended layout, copy, colour and behaviour. Do not copy them into the app or
serve them. Recreate them in this repo's framework using its own patterns.

Authoritative sources, in priority order:

1. `content/*.json` — copy, doses, prices, lab data, FAQ, compliance strings. **Never retype
   a dose, price or warning by hand.** Import it.
2. `tokens.css` — every colour, font and spacing value. No hex codes in components.
3. `pages/*.dc.html` — layout and visual reference only.
4. `README.md` — the reasoning, and everything the other three cannot express.

## Non-negotiables

**One flag runs the whole site.** `SITE_MODE = "waitlist" | "store"`, resolved server-side
per request. Waitlist is the default. It changes only the commerce surfaces (nav action,
announcement bar, home block 3, product buy panel, `/bag`, shop CTAs, FAQ ordering group).
Everything else is byte-identical across modes. Never resolve it client-side — the commerce
surfaces must not flash. The Preview chips in the design files are a design affordance;
do not ship them.

**Tabular numerals everywhere.** `font-variant-numeric: tabular-nums` on `body`. The doses
and the prices are the product; misaligned digits are a bug.

**The FDA disclaimer is a component, not a string.** It appears in every footer and adjacent
to every structure/function claim. Same for the warning set — one component, one source
(`content/compliance.json`), used by the product page, FAQ and checkout.

**`/lot/:batch` must render server-side without JavaScript.** That URL is printed on physical
packaging. If it depends on JS it is broken for someone standing in their kitchen.

**Supplement Facts is a semantic `<table>`**, never an image. Screen readers must reach the
numbers. Same for every dose table.

**Doses carry their unit and their target flag.** `content/product.json` has
`dosesAreFinal: false`; while that is false, render `doseDisclaimer` wherever doses appear.
Flipping one boolean should remove every "target dose" caveat sitewide.

**No claim that is not in the approved-claims list.** See `content/compliance.json`
→ `claimsRule` and `neverPublish`. If you are about to write new marketing copy about what
the product does, stop and flag it instead.

## Visual rules that are easy to get wrong

- **One radius scale, applied everywhere.** Panels and cards `14px`
  (`--lu-radius-card`), badges and small controls `6px` (`--lu-radius-chip`), fields and
  buttons `4px` (`--lu-radius-field`), pills `999px`. Matched to the printed product
  collateral, which rounds its cards at 14-18px. Mixing scales is the one thing that always
  reads as broken, so there is exactly one documented exception: the Supplement Facts panel
  stays square, because it reproduces a printed regulatory artifact rather than a card.
- **No shadows on content.** Elevation is only for genuinely floating surfaces (cookie bar,
  modals). Cards sit flat on the page with a 1px hairline.
- **No gradients** except the two-stop gold on the waitlist progress bar.
- **Surfaces are warm.** The page sits in the same cream-blush family as the product
  photography (`--lu-chalk`, `--lu-chalk-alt`, `--lu-blush`), not the cooler original chalk.
- **One accent per product, never mixed inside a section.** Crave Balance is plum
  (`--lu-plum`), its alternative colourway forest green (`--lu-green`), Cycle Ritual is
  burgundy (`--lu-wine`). A Cycle Ritual section does not borrow Crave's plum.
- **Uppercase micro-labels** are 10–11px, `letter-spacing: 0.16–0.24em`, weight 600–700,
  in `--lu-gold-deep` on light or `--lu-gold` on plum. They are structural, not decorative.
- **Display serif for numbers.** Doses and prices are Cormorant Garamond; labels are
  Inter Tight. This inversion is the brand's signature — do not normalise it.
- **Dotted rules between dose rows**, solid hairlines everywhere else.
- **Wordmark tracking is fixed** at `0.42em` (nav/footer) and `0.46em` (pack/dose card).
  Never re-space it by eye and never set it in a font other than Cormorant Garamond 300/400.

## Tone of voice

Declarative, specific, unhurried. We publish numbers and reasons; we never promise a feeling
or a timeline. Sentence case everywhere except the wordmark and micro-labels. No exclamation
marks, no emoji, no "unlock/supercharge/journey". When the honest answer is "ask your doctor",
that is the answer.

## Accessibility

Target WCAG 2.2 AA. Keyboard reachable throughout, labelled fields, dose tables as tables.
The accessibility statement in `pages/LUNARA-Legal.dc.html` publishes known gaps rather than
claiming conformance — keep that habit and update the list as you fix them.

## Before you call anything done

- Both modes render every route without a layout shift.
- `/lot/CB-2026-0412` works with JavaScript disabled.
- No hard-coded dose, price, warning or disclaimer string anywhere in components.
- No hex code outside `tokens.css`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
