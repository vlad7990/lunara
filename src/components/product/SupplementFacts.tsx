import { splitDose, supplementFacts } from "@/lib/content";

import styles from "./SupplementFacts.module.css";

/**
 * Supplement Facts.
 *
 * Every value comes from `product.json`. Nothing here is typed by hand, because this panel
 * is the label — if a number on it is wrong, the pack is wrong.
 *
 * It renders as a real `<table>` with row headers, so assistive technology reaches the
 * numbers. It is marked as a draft until the manufacturer's panel clears counsel.
 */
export function SupplementFacts() {
  return (
    <section aria-labelledby="facts-title">
      <div className={styles.head}>
        <h2 id="facts-title" className="lu-h3">
          Supplement Facts
        </h2>
        <p className={styles.draft}>Draft · pending counsel review</p>
      </div>

      <div className={styles.panel}>
        <p className={styles.serving}>
          Serving Size {supplementFacts.servingSize}
          <br />
          Servings Per Container {supplementFacts.servingsPerContainer}
        </p>
        <hr className={styles.bar} />

        <table className={styles.table}>
          <caption className="lu-sr-only">
            Amount per serving and percent Daily Value for each ingredient in{" "}
            {supplementFacts.servingSize}.
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="lu-sr-only">Ingredient</span>
              </th>
              <th scope="col">
                Amount
                <br />
                Per Serving
              </th>
              <th scope="col">
                %&nbsp;Daily
                <br />
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {supplementFacts.rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                {/* One cell still, so the panel keeps the column count a printed panel has.
                    The split is inside it, to hold the figures in one column: "200 mcg"
                    right-aligned as a single run sits its digits left of every "mg" row. */}
                <td>
                  {(() => {
                    const { amount, unit } = splitDose(row.amount);
                    return (
                      <span className={styles.amount}>
                        <span className={styles.amount__value}>{amount}</span>
                        {/* The separating space is a real character, not a grid gap, so the
                            cell still reads "200 mcg" to a screen reader. */}
                        {unit ? (
                          <span className={styles.amount__unit}>{` ${unit}`}</span>
                        ) : null}
                      </span>
                    );
                  })()}
                </td>
                <td>{row.dv}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={styles.footnote}>
          {supplementFacts.footnote}
          <br />
          Other ingredients: {supplementFacts.otherIngredients}
        </p>
      </div>

      <p className={styles.status}>{supplementFacts.status}</p>
    </section>
  );
}
