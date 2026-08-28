import Link from "next/link";

import { compliance, formatLotDate, site, spellCount } from "@/lib/content";
import { LAST_UPDATED, policies, type Policy } from "@/lib/legal";

import styles from "./Legal.module.css";

/**
 * One policy, one route.
 *
 * The design shows them all on a single page behind a sticky index. Shipping them separately
 * gives each policy a URL that a compliance link or a consent record can point at, and the
 * index becomes the cross-link between them.
 */

/**
 * The standing counsel note counts the policies it is waiting on. `{policyCount}` is
 * substituted here rather than typed into `compliance.json`, so adding a seventh policy
 * cannot leave the notice claiming six.
 */
const BLOCKING_NOTE = compliance.blocking[1].replace("{policyCount}", spellCount(policies.length));
/** Renders a paragraph, turning the `{email}` placeholder into a real mailto link. */
function Paragraph({ text }: { text: string }) {
  const parts = text.split("{email}");
  if (parts.length === 1) return <p>{text}</p>;

  return (
    <p>
      {parts[0]}
      <a href={`mailto:${site.brand.email}`}>{site.brand.email}</a>
      {parts[1]}
    </p>
  );
}

export function PolicyPage({ policy }: { policy: Policy }) {
  return (
    <>
      <section className={`lu-container ${styles.head}`}>
        <div className={styles.head__copy}>
          <p className="lu-label lu-label--wide">Policies</p>
          <h1 className={`lu-h1 ${styles.head__title}`}>The small print, written to be read</h1>
          <p className={styles.head__lede}>
            Plain-language summaries of each policy, with the operative terms below them. Last
            updated {formatLotDate(LAST_UPDATED)}.
          </p>
        </div>
      </section>

      <div className={`lu-container ${styles.layout}`}>
        <nav className={styles.index} aria-label="Policies">
          {policies.map((entry) => (
            <Link
              key={entry.slug}
              href={`/${entry.slug}`}
              className={styles.index__link}
              aria-current={entry.slug === policy.slug ? "page" : undefined}
            >
              {entry.name}
            </Link>
          ))}
        </nav>

        <div className={styles.body}>
          <article
            className={policy.tone === "caution" ? styles["policy--caution"] : undefined}
          >
            <p className={styles.policy__kicker}>
              {policy.number} · {policy.name}
            </p>
            <h2 className={styles.policy__title}>{policy.title}</h2>

            <p className={styles.summary}>{policy.summary}</p>

            {/* The FDA statement is quoted from `compliance.json`, never retyped. */}
            {policy.slug === "fda-disclaimer" ? (
              <div className={styles.statement}>
                <p className={styles.statement__quote}>{compliance.fdaDisclaimer}</p>
                <div className={styles.paragraphs}>
                  {policy.paragraphs.map((paragraph) => (
                    <Paragraph key={paragraph} text={paragraph} />
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.paragraphs}>
                {policy.paragraphs.map((paragraph) => (
                  <Paragraph key={paragraph} text={paragraph} />
                ))}
              </div>
            )}

            {policy.cards ? (
              <div className={styles.cards} id="your-privacy-choices">
                {policy.cards.map((card) => (
                  <section key={card.label} id={card.id} className={styles.card}>
                    <h3 className={styles.card__label}>{card.label}</h3>
                    <p className={styles.card__body}>{card.body}</p>
                  </section>
                ))}
              </div>
            ) : null}
          </article>

          {/* Standing note. It comes down when counsel signs the policies off. */}
          <aside className={styles.notice}>
            <h2 className={styles.notice__label}>Not yet reviewed by counsel</h2>
            <p className={styles.notice__body}>
              {BLOCKING_NOTE} Everything on this page is design copy written to show
              tone, length and structure. It is not legal advice and it is not launch-ready.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
