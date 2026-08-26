import Link from "next/link";

import { BatchLookup } from "@/components/coa/BatchLookup";
import { IconDownload } from "@/components/Icon";
import { formatLotDate, lots, lotsNote, product, type Lot } from "@/lib/content";

import styles from "./lot.module.css";

/**
 * The pieces `/lot` and `/lot/:batch` share.
 *
 * Everything here is a server component with no client JavaScript at all. The batch code is
 * printed on physical packaging; if this page needed JavaScript it would be broken for
 * someone standing in their kitchen holding a pack.
 */

export function LotHead() {
  return (
    <section className={`lu-container ${styles.head}`}>
      <div className={styles.head__copy}>
        <p className="lu-label lu-label--wide">Certificates of analysis</p>
        <h1 className="lu-h1">
          Read the lab report for
          <br />
          <em>the powder in your hand.</em>
        </h1>
        <p className={styles.head__lede}>
          Not a sample from a good week — the specific lot you bought. The batch number is on the
          base of your jar and on the back of every stick pack.
        </p>
      </div>

      <div className={styles.head__lookup}>
        <BatchLookup
          label="Enter batch number"
          hint="Format CB-YYYY-MMDD. Reports stay online for the life of the product plus seven years."
        />
      </div>
    </section>
  );
}

export function LotRecord({ lot }: { lot: Lot }) {
  const held = lot.status === "held";

  const meta = [
    { label: "Manufactured", value: formatLotDate(lot.manufacturedAt) },
    { label: "Best before", value: formatLotDate(lot.bestBefore) },
    { label: "Lot size", value: `${lot.units.toLocaleString("en-US")} units` },
    { label: "Facility", value: lot.facility ?? "—" },
    { label: "Tested by", value: lot.lab ?? "—" },
  ];

  return (
    <section className={`lu-container ${styles.record}`} aria-labelledby="lot-batch">
      <div className={styles.record__inner}>
        <div className={styles.record__top}>
          <div>
            <p className={`lu-label lu-label--wide lu-label--onPlum ${styles.record__label}`}>
              Certificate of analysis
            </p>
            <h2 id="lot-batch" className={styles.record__batch}>
              Lot {lot.batch}
            </h2>
            <p className={styles.record__product}>
              {product.name} · {product.flavour.toLowerCase()} · {product.netWeight} /{" "}
              {product.servings} servings
            </p>
          </div>

          <div className={styles.record__status}>
            <p className={`${styles.chip} ${held ? styles["chip--held"] : ""}`}>
              <span className={styles.chip__dot} aria-hidden="true" />
              <span className={styles.chip__text}>
                {lot.allSpecsMet ? "All specifications met" : "Specification not met"}
                {held ? ` · ${lot.statusLabel}` : ""}
              </span>
            </p>

            {lot.pdfUrl ? (
              <a href={lot.pdfUrl} className={styles.record__pdf} download>
                <IconDownload size={14} strokeWidth={1.6} />
                Download signed PDF
              </a>
            ) : null}
          </div>
        </div>

        <dl className={styles.record__meta}>
          {meta.map((item) => (
            <div key={item.label}>
              <dt className={styles.record__metaLabel}>{item.label}</dt>
              <dd className={styles.record__metaValue}>{item.value}</dd>
            </div>
          ))}
        </dl>

        {/* A lot we held back is published with its reason, not quietly dropped. */}
        {lot.publicNote ? <p className={styles.record__note}>{lot.publicNote}</p> : null}
      </div>
    </section>
  );
}

export function AssayTable({ lot }: { lot: Lot }) {
  if (!lot.assays?.length) return null;

  return (
    <section className={`lu-container ${styles.assay}`} aria-labelledby="assay-title">
      <div className={styles.tableHead}>
        <h2 id="assay-title" className="lu-h3">
          Active ingredient assay
        </h2>
        <p className={styles.tableHead__aside}>Label claim vs. measured result, per serving</p>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Analyte</th>
              <th scope="col" className={styles.num}>
                Label claim
              </th>
              <th scope="col" className={styles.num}>
                Result
              </th>
              <th scope="col">Method</th>
              <th scope="col" className={styles.num}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {lot.assays.map((assay) => (
              <tr key={assay.analyte}>
                <th scope="row">{assay.analyte}</th>
                <td className={styles.num}>{assay.claim}</td>
                <td className={styles.num}>{assay.result}</td>
                <td className={styles.method}>{assay.method}</td>
                <td className={styles.pass}>{assay.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ContaminantTables({ lot }: { lot: Lot }) {
  if (!lot.heavyMetals?.length && !lot.microbials?.length) return null;

  return (
    <div className={`lu-container ${styles.pair}`}>
      {lot.heavyMetals?.length ? (
        <section aria-labelledby="metals-title">
          <h2 id="metals-title" className={`lu-h3 ${styles.pair__title}`}>
            Heavy metals
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Analyte</th>
                  <th scope="col" className={styles.num}>
                    Spec
                  </th>
                  <th scope="col" className={styles.num}>
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                {lot.heavyMetals.map((row) => (
                  <tr key={row.analyte}>
                    <th scope="row">{row.analyte}</th>
                    <td className={`${styles.num} ${styles.spec}`}>{row.spec}</td>
                    <td className={styles.num}>{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {lot.microbials?.length ? (
        <section aria-labelledby="microbio-title">
          <h2 id="microbio-title" className={`lu-h3 ${styles.pair__title}`}>
            Microbiology
          </h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Test</th>
                  <th scope="col" className={styles.num}>
                    Spec
                  </th>
                  <th scope="col" className={styles.num}>
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                {lot.microbials.map((row) => (
                  <tr key={row.test}>
                    <th scope="row">{row.test}</th>
                    <td className={`${styles.num} ${styles.spec}`}>{row.spec}</td>
                    <td className={styles.num}>{row.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Every lot ever made, including the one we held back. This list is never filtered to the
 * good lots — a transparency page that only shows those is an advertisement.
 */
export function AllLots() {
  const held = lots.find((lot) => lot.status === "held");

  return (
    <section className="lu-band" aria-labelledby="all-lots-title">
      <div className={`lu-container ${styles.allLots}`}>
        <div className={styles.tableHead}>
          <h2 id="all-lots-title" className="lu-h3">
            Every lot we have ever shipped
          </h2>
          <p className={styles.tableHead__aside}>Including the one we held back</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Lot</th>
                <th scope="col">Manufactured</th>
                <th scope="col">Best before</th>
                <th scope="col" className={styles.num}>
                  Units
                </th>
                <th scope="col">Status</th>
                <th scope="col" className={styles.num}>
                  Report
                </th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot.batch}>
                  <th scope="row" className={styles.allLots__batch}>
                    {lot.batch}
                  </th>
                  <td className={styles.spec}>{formatLotDate(lot.manufacturedAt)}</td>
                  <td className={styles.spec}>{formatLotDate(lot.bestBefore)}</td>
                  <td className={styles.num}>{lot.units.toLocaleString("en-US")}</td>
                  <td className={styles[`status--${lot.status}`]}>{lot.statusLabel}</td>
                  <td className={styles.allLots__open}>
                    <Link href={`/lot/${lot.batch}`}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {held?.publicNote ? <p className={styles.allLots__note}>{held.publicNote}</p> : null}
        <p className={styles.allLots__illustrative}>{lotsNote}</p>
      </div>
    </section>
  );
}
