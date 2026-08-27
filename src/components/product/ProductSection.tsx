import { Fragment } from "react";

import Image from "next/image";
import Link from "next/link";

import { IconFlask } from "@/components/Icon";
import { SparkDivider } from "@/components/Ornament";
import { SectionArt } from "@/components/SectionArt";
import { splitDose, type CatalogueProduct, type SiteMode } from "@/lib/content";

import { FormulaMark } from "./formulaMarks";

import styles from "./ProductSection.module.css";

/**
 * A product, told the way the printed collateral tells it: the pack, the dose card, and the
 * reason it is the format it is.
 *
 * The accent comes from the product record, so adding a third product means adding a record,
 * not editing this component.
 */
export function ProductSection({
  product,
  index,
  mode,
}: {
  product: CatalogueProduct;
  /** Drives which side the pack sits on, and whether the section is tinted. */
  index: number;
  mode: SiteMode;
}) {
  const reversed = index % 2 === 1;

  return (
    <section
      className={[
        styles.section,
        styles[`section--${product.accent}`],
        reversed ? styles["section--tinted"] : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={`product-${product.id}`}
    >
      {/* Light through leaves, cast across the ground the packs were shot on. */}
      <SectionArt position={reversed ? "bottom-left" : "top-right"} />

      <div
        className={`lu-container ${styles.grid} ${reversed ? styles["grid--reversed"] : ""}`}
      >
        <div className={styles.figure}>
          <Image
            src={product.image}
            alt={`${product.name} pack`}
            className={styles.image}
            fill
            sizes="(max-width: 900px) 100vw, 520px"
          />
        </div>

        <div className={styles.copy}>
          <p className={styles.format}>
            {product.format} · {product.unit}
          </p>

          <h2 id={`product-${product.id}`} className={styles.name}>
            {product.name}
          </h2>
          <p className={styles.subtitle}>{product.subtitle}</p>

          {/* The pack sets this mark under the product subtitle. So does this. */}
          <SparkDivider align="start" className={styles.divider} />

          <p className={styles.lede}>{product.lede}</p>

          <div className={styles.doses}>
            <p className={styles.doses__head}>
              What&rsquo;s in {product.servingSize.toLowerCase()}
            </p>
            <dl className={styles.doses__list}>
              {product.keyDoses.map((dose) => {
                // Number and unit are separate cells so the digits keep their own column;
                // right-aligning "200 mcg" as one run pushes its figures off the others.
                const { amount, unit } = splitDose(dose.dose);
                return (
                  <Fragment key={dose.name}>
                    <dt className={styles.doses__name}>
                      <span className={styles.doses__mark} aria-hidden="true">
                        <FormulaMark name={dose.name} size={18} />
                      </span>
                      {dose.name}
                    </dt>
                    <dd className={styles.doses__value}>
                      <span className={styles.doses__amount}>{amount}</span>
                      {/* Real space, not a grid gap, so the row still reads "200 mcg". */}
                      {unit ? <span className={styles.doses__unit}>{` ${unit}`}</span> : null}
                    </dd>
                  </Fragment>
                );
              })}
            </dl>
          </div>

          {/* Target doses, or a limited-evidence ingredient, are said out loud here. */}
          {!product.dosesAreFinal ? (
            <p className={styles.footnote}>
              Target doses. Final values confirm on raw-material selection, and we publish the
              change if they move.
            </p>
          ) : null}
          {product.footnote ? <p className={styles.footnote}>{product.footnote}</p> : null}

          <div className={styles.why}>
            <IconFlask size={18} className={styles.why__icon} />
            <p className={styles.why__text}>{product.whyThisFormat}</p>
          </div>

          <div className={styles.actions}>
            <Link href={`/${product.slug}`} className={`lu-btn ${styles.cta}`}>
              {mode === "store" ? `Shop ${product.name}` : `Read the label`}
            </Link>
            <Link href="/open-formula" className={styles.secondary}>
              Why it&rsquo;s made this way
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
