import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { normaliseBatch } from "@/lib/content";

import { AllLots, LotHead } from "./LotSections";

export const metadata: Metadata = {
  title: "Batch COAs",
  description:
    "A lab report for every lot, published unedited, at the URL printed on your pack. Identity, potency, heavy metals and microbials.",
};

/**
 * The lookup index.
 *
 * The lookup form is a plain GET to this route. We normalise the batch code here — trim and
 * uppercase, exactly as the design specifies — and redirect to `/lot/:batch`. No JavaScript
 * is involved in any part of that path.
 */
export default async function LotIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  const { batch } = await searchParams;

  if (batch && batch.trim()) {
    redirect(`/lot/${encodeURIComponent(normaliseBatch(batch))}`);
  }

  return (
    <>
      <LotHead />
      <AllLots />
    </>
  );
}
