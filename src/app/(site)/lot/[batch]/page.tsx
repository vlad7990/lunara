import type { Metadata } from "next";

import { IconSearch } from "@/components/Icon";
import { getLot, lots, normaliseBatch, product, site } from "@/lib/content";

import { AllLots, AssayTable, ContaminantTables, LotHead, LotRecord } from "../LotSections";
import styles from "../lot.module.css";

/**
 * `/lot/:batch` — the URL printed on the packaging.
 *
 * Server-rendered, no client JavaScript. Every known batch is pre-rendered; an unknown one
 * gets a "we cannot find that batch" page with an address to write to, never a generic 404,
 * because the person reading it is holding a physical pack.
 */

export function generateStaticParams() {
  return lots.map((lot) => ({ batch: lot.batch }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ batch: string }>;
}): Promise<Metadata> {
  const { batch } = await params;
  const lot = getLot(batch);

  return {
    title: lot ? `Lot ${lot.batch}` : `Lot ${normaliseBatch(batch)}`,
    description: lot
      ? `Certificate of analysis for ${product.name} lot ${lot.batch}: identity, potency, heavy metals and microbials.`
      : "We cannot find that batch number.",
    robots: lot ? undefined : { index: false },
  };
}

export default async function LotPage({ params }: { params: Promise<{ batch: string }> }) {
  const { batch } = await params;
  const lot = getLot(batch);

  if (!lot) {
    return (
      <>
        <LotHead />

        <section className={`lu-container ${styles.notFound}`} aria-labelledby="not-found-title">
          <div className={styles.notFound__inner}>
            <IconSearch size={34} strokeWidth={1.5} className={styles.notFound__icon} />
            <div>
              <h2 id="not-found-title" className={styles.notFound__title}>
                We cannot find batch {normaliseBatch(batch)}.
              </h2>
              <p className={styles.notFound__body}>
                Check the code against the base of your jar or the back of a stick pack — it looks
                like CB-YYYY-MMDD. If it matches what you are holding and this page still cannot
                find it, write to{" "}
                <a href={`mailto:${site.brand.email}`}>{site.brand.email}</a> with the code and we
                will send you the report directly. Every lot below is published in full.
              </p>
            </div>
          </div>
        </section>

        <AllLots />
      </>
    );
  }

  return (
    <>
      <LotHead />
      <LotRecord lot={lot} />
      <AssayTable lot={lot} />
      <ContaminantTables lot={lot} />
      <AllLots />
    </>
  );
}
