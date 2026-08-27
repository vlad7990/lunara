import Link from "next/link";

import { DropInSlot } from "@/components/DropInSlot";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import {
  articles,
  changeLog,
  formatLotDate,
  formatPrice,
  getFormat,
  product,
  type Article,
  type SiteMode,
} from "@/lib/content";

import styles from "./openFormula.module.css";

/** The page head and the rule we hold ourselves to. Identical on the index and an article. */
export function OpenFormulaHead() {
  return (
    <section className={`lu-container ${styles.head}`}>
      <div className={styles.head__copy}>
        <p className="lu-label lu-label--wide">Open formula</p>
        <h1 className={`lu-h1 ${styles.head__title}`}>
          Every decision behind the label,
          <br />
          <em>written down and dated.</em>
        </h1>
        <p className={styles.head__dek}>
          Most brands in this category can&rsquo;t publish their formula, because a proprietary
          blend is the point. We can, so we do — and we publish the rejections too.
        </p>
      </div>

      <div className={styles.ruleCard}>
        <h2 className={styles.ruleCard__label}>The rule we hold ourselves to</h2>
        <p className={styles.ruleCard__body}>
          If a dose changes, the change appears here with a date before it appears on a pack. No
          quiet reformulations between production runs.
        </p>
      </div>
    </section>
  );
}

/**
 * The six-card index. The piece currently open is a plum card; unpublished pieces show the
 * week they land rather than pretending to be ready.
 */
export function SeriesIndex({ currentSlug }: { currentSlug?: string }) {
  return (
    <section className={`lu-container ${styles.index}`} aria-label="The open formula series">
      <div className={styles.index__grid}>
        {articles.map((article) => {
          const current = article.slug === currentSlug;

          const body = (
            <>
              <div className={styles.entry__head}>
                <span className={styles.entry__number}>{article.number}</span>
                <span className={styles.entry__week}>
                  {current ? "Reading now" : `Week ${article.week}`}
                </span>
              </div>
              <h2 className={styles.entry__title}>{article.title}</h2>
              <p className={styles.entry__dek}>{article.dek}</p>
            </>
          );

          /*
           * An unpublished piece is not a link.
           *
           * It used to be one, pointing at `/open-formula` — so clicking "Why there's no
           * caffeine" silently reloaded the page you were already on. A control that
           * accepts a click and does nothing visible is worse than no control: the reader
           * concludes the site is broken rather than that the piece is not out yet. The
           * "Week 7" label is the honest affordance, so let it be the only one.
           */
          if (!article.published) {
            return (
              <div key={article.slug} className={`${styles.entry} ${styles["entry--pending"]}`}>
                {body}
              </div>
            );
          }

          return (
            <Link
              key={article.slug}
              href={`/open-formula/${article.slug}`}
              className={`${styles.entry} ${current ? styles["entry--current"] : ""}`}
              aria-current={current ? "page" : undefined}
            >
              {body}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** Considered / Rejected / Revisit if — a real table, so the rows are readable in order. */
export function DecisionLog({ decision }: { decision: NonNullable<Article["decision"]> }) {
  const rows = [
    { label: "Considered", value: decision.considered },
    { label: "Rejected", value: decision.rejected },
    { label: "Revisit if", value: decision.revisitIf },
  ];

  return (
    <section className={styles.decision} aria-labelledby="decision-title">
      <h2 id="decision-title" className={styles.decision__head}>
        Formulation decision · logged
      </h2>
      <table className={styles.decision__table}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function ChangeLog() {
  return (
    <section className={styles.changeLog} aria-labelledby="change-log-title">
      <h2 id="change-log-title" className={styles.changeLog__label}>
        Change log
      </h2>
      <ol className={styles.changeLog__list}>
        {changeLog.map((entry) => (
          <li key={entry.date} className={styles.changeLog__entry}>
            <p className={styles.changeLog__date}>{formatLotDate(entry.date)}</p>
            <p className={styles.changeLog__summary}>
              {entry.summary}
              {entry.relatedArticle ? (
                <>
                  {" "}
                  <Link href={`/open-formula/${entry.relatedArticle}`}>Read it</Link>.
                </>
              ) : null}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** The sticky sidebar: mode-dependent CTA, then the change log, then a drop-in slot. */
export function ArticleSidebar({ mode }: { mode: SiteMode }) {
  const jar = getFormat("CB-JAR-30");
  const subscription = getFormat("CB-JAR-SUB");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sideCta}>
        {mode === "store" ? (
          <>
            <h2 className={styles.sideCta__title}>The formula in this article</h2>
            <p className={styles.sideCta__body}>
              {product.name} · {jar.servings} servings · {formatPrice(jar.price)}, or{" "}
              {formatPrice(subscription.price)} on subscription.
            </p>
            <Link href="/crave-balance" className={`lu-btn ${styles.sideCta__btn}`}>
              Shop {product.name}
            </Link>
          </>
        ) : (
          <>
            <h2 className={styles.sideCta__title}>Get the next one by email</h2>
            <p className={styles.sideCta__body}>
              One formulation post a week until launch. Founding 500 still open.
            </p>
            <WaitlistForm variant="stacked" showMicrocopy={false} />
          </>
        )}
      </div>

      <ChangeLog />

      <DropInSlot caption="saffron texture" className={styles.sideSlot} />
    </aside>
  );
}
