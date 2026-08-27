import Link from "next/link";

import { Band } from "@/components/Band";
import { DoseDisclaimer } from "@/components/compliance";
import { dosedIngredients, dosesAreFinal, formatDose, product } from "@/lib/content";

import styles from "./DoseStrip.module.css";

/**
 * The five dosed ingredients, published at full strength on a plum band.
 *
 * Every dose carries its unit — a dose written without its unit is on the never-publish
 * list — and the target-dose caveat sits underneath for as long as `dosesAreFinal` is false.
 */
export function DoseStrip() {
  const ratioLine = `Inositol ratio ${product.inositolRatio}.`;

  return (
    <Band tone="plum" labelledBy="dose-strip-title">
      <div className={`lu-container ${styles.strip}`}>
        <div className={styles.head}>
          <h2 id="dose-strip-title" className={styles.title}>
            What&rsquo;s in one serving
          </h2>
          <p className={styles.meta}>Target doses · published week 1</p>
        </div>

        <dl className={styles.grid}>
          {dosedIngredients.map((ingredient) => (
            <div key={ingredient.name} className={styles.cell}>
              <dt className={styles.cell__name}>{ingredient.name}</dt>
              <dd className={styles.cell__dose}>{formatDose(ingredient)}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.foot}>
          {dosesAreFinal ? (
            <p className={styles.foot__note}>{ratioLine}</p>
          ) : (
            <DoseDisclaimer onPlum prefix={ratioLine} />
          )}
          <Link href="/crave-balance" className={styles.foot__link}>
            See the full label
          </Link>
        </div>
      </div>
    </Band>
  );
}
