import {
  ElementMark,
  IconCrocus,
  IconGinger,
  IconInositol,
  IconMantle,
  IconWaves,
} from "@/components/Icon";

/**
 * Which mark the collateral sets beside which ingredient.
 *
 * Matched on the ingredient name from `content/*.json`, because that is the name the pack
 * prints too. Anything unrecognised gets no mark rather than a wrong one: a molecular
 * cluster beside the wrong compound is worse than a tidy blank, and a new ingredient should
 * fail visibly here rather than quietly borrow another one's symbol.
 */

const MARKS: Array<{ match: RegExp; render: (size: number) => React.ReactNode }> = [
  { match: /inositol/i, render: (s) => <IconInositol size={s} /> },
  { match: /theanine/i, render: (s) => <IconWaves size={s} /> },
  { match: /saffron|crocus/i, render: (s) => <IconCrocus size={s} /> },
  { match: /mantle|alchemilla/i, render: (s) => <IconMantle size={s} /> },
  { match: /ginger|zingiber/i, render: (s) => <IconGinger size={s} /> },
  { match: /chromium/i, render: (s) => <ElementMark symbol="Cr" size={s} /> },
  { match: /magnesium/i, render: (s) => <ElementMark symbol="Mg" size={s} /> },
  { match: /vitamin b6|b6|pyridox/i, render: (s) => <ElementMark symbol="B6" size={s} /> },
  { match: /ratio/i, render: (s) => <ElementMark symbol="40:1" size={s} /> },
];

export function FormulaMark({ name, size = 19 }: { name: string; size?: number }) {
  const mark = MARKS.find((m) => m.match.test(name));
  return mark ? <>{mark.render(size)}</> : null;
}
