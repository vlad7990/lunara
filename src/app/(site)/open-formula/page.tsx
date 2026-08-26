import type { Metadata } from "next";

import { OpenFormulaHead, SeriesIndex } from "./OpenFormulaParts";

export const metadata: Metadata = {
  title: "Open formula",
  description:
    "Every formulation decision behind Crave Balance, written down and dated — including the ones we rejected.",
};

/**
 * The series index.
 *
 * The design shows the index and the current article on one page. We ship them as separate
 * routes so each piece has its own URL to link, cite and share; opening the index sends you
 * to the featured article, which is where the design's `#article` anchor pointed.
 */
export default function OpenFormulaIndexPage() {
  return (
    <>
      <OpenFormulaHead />
      <SeriesIndex />
    </>
  );
}
