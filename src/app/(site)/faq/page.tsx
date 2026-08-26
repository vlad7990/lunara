import type { Metadata } from "next";
import Link from "next/link";

import { FdaDisclaimer, WarningSet } from "@/components/compliance";
import { faqGroups, faqItemsFor, site } from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "The questions we actually get, including the ones with answers you may not want. When the honest answer is “ask your doctor”, that is the answer.",
};

/**
 * The anchor text for an answer that carries a `link`, keyed by where it points.
 *
 * Some answers already contain the phrase ("…is on its certificate of analysis."), in which
 * case the link wraps that phrase in place. Where they don't, the label is appended as its
 * own sentence — which is how the design references render each of these.
 */
const LINK_LABELS: Record<string, string> = {
  "/open-formula": "The reasoning is written out in full.",
  "/lot": "certificate of analysis",
};

/** Renders an answer, linking the anchor phrase in place or appending it. */
function Answer({ text, href }: { text: string; href?: string }) {
  if (!href) return <>{text}</>;

  const label = LINK_LABELS[href] ?? "Read more.";
  const at = text.indexOf(label);

  if (at === -1) {
    return (
      <>
        {text} <Link href={href}>{label}</Link>
      </>
    );
  }

  return (
    <>
      {text.slice(0, at)}
      <Link href={href}>{label}</Link>
      {text.slice(at + label.length)}
    </>
  );
}

export default async function FaqPage() {
  const mode = await resolveSiteMode();

  return (
    <>
      <section className={`lu-container ${styles.head}`}>
        <div className={styles.head__copy}>
          <p className="lu-label lu-label--wide">Questions</p>
          <h1 className="lu-h1">The ones we actually get</h1>
          <p className={styles.head__lede}>
            Including the ones with answers you may not want. If something isn&rsquo;t here, write
            to <a href={`mailto:${site.brand.email}`}>{site.brand.email}</a> and we will add it.
          </p>
        </div>
      </section>

      <div className={`lu-container ${styles.layout}`}>
        <div className={styles.groups}>
          {faqGroups.map((group) => {
            const items = faqItemsFor(group, mode);
            if (items.length === 0) return null;

            return (
              <section
                key={group.id}
                className={group.tone === "caution" ? styles["group--caution"] : undefined}
                aria-labelledby={`faq-${group.id}`}
              >
                <h2 id={`faq-${group.id}`} className={styles.group__heading}>
                  {group.title}
                </h2>
                <dl className={styles.group__list}>
                  {items.map((item) => (
                    <div key={item.q} className={styles.item}>
                      <dt className={styles.item__q}>{item.q}</dt>
                      <dd className={styles.item__a}>
                        <Answer text={item.a} href={item.link} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>

        <aside className={styles.sidebar}>
          {/* Same component, same source, as the product page and checkout. */}
          <WarningSet heading="Full warning set" />

          <section className={styles.sideCard} aria-labelledby="faq-fda">
            <h2 id="faq-fda" className={styles.sideCard__label}>
              FDA disclaimer
            </h2>
            <FdaDisclaimer size="body" />
          </section>

          <section className={styles.contact} aria-labelledby="faq-contact">
            <h2 id="faq-contact" className={styles.contact__title}>
              Still unanswered?
            </h2>
            <p className={styles.contact__body}>
              A person reads this address, and we publish the good questions here.
            </p>
            <p className={styles.contact__email}>
              <a href={`mailto:${site.brand.email}`}>{site.brand.email}</a>
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
