import Image from "next/image";
import Link from "next/link";

import { Band } from "@/components/Band";
import { BatchLookup } from "@/components/coa/BatchLookup";
import { IconDocumentCheck, IconSpark } from "@/components/Icon";
import { ProductSection } from "@/components/product/ProductSection";
import { FoundingProgress } from "@/components/waitlist/FoundingProgress";
import { articles, catalogue, changeLog, formatLotDate, site } from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import styles from "./home.module.css";

/**
 * The brand home.
 *
 * Its job is the range and the reason to trust it. The waitlist conversion page lives at
 * `/join`, where the only decision on offer is whether to sign up.
 */

/**
 * What we publish, in the order each one costs us something.
 *
 * These carried 01-04 above the headings. The numerals only counted: each heading already
 * names its own promise, and the hairline between columns does the separating. Four
 * commitments read as commitments; a numbered list reads as a list.
 */
const PROMISES = [
  {
    title: "Every milligram, named",
    body: "On the pack, on the site, and in the first email. No blends, ever, in either formula.",
  },
  {
    title: "A report for every lot",
    body: "Third-party tested and published unedited, at a URL printed on the box. Including lots we chose not to sell.",
  },
  {
    title: "A dated change log",
    body: "If a dose moves you read it here first, with a date, before it reaches a pack.",
  },
  {
    title: "No body talk",
    body: "No before-and-afters, no weight or calorie numbers, no suggestion that your body needs correcting.",
  },
];

export default async function HomePage() {
  const mode = await resolveSiteMode();
  // The hero shows the range, so it reads the same catalogue the sections below do.
  const [lead, second] = catalogue;

  // Only published pieces exist as pages. Newest first, so the home page never has to be
  // edited when the next piece goes up. Deliberately not featured-first: pulling 04 to the
  // front of 01 and 02 reads as a broken sort rather than as an editor's choice.
  const publishedArticles = articles.filter((a) => a.published);
  const featuredArticles = [...publishedArticles]
    .sort((a, b) => Number(b.number) - Number(a.number))
    .slice(0, 3);

  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className={`lu-container ${styles.hero}`}>
        <div className={styles.hero__copy}>
          <p className="lu-pill">
            <IconSpark size={13} strokeWidth={1.6} className={styles.hero__spark} />
            <span className={styles.hero__eyebrow}>Open formula</span>
          </p>

          <h1 className={`lu-h1 ${styles.hero__title}`}>
            Two formulas.
            <br />
            <em>Every milligram published.</em>
          </h1>

          <p className={styles.hero__lede}>
            No proprietary blends, no undisclosed complexes, and a lab report for every lot at a
            URL printed on the box.
          </p>

          <div className={styles.hero__actions}>
            <Link href={mode === "store" ? "/shop" : "/join"} className="lu-btn">
              {mode === "store" ? "Shop the range" : site.navAction.waitlist.label}
            </Link>
            <Link href="#formulas" className={styles.hero__secondary}>
              See both formulas
            </Link>
          </div>
        </div>

        <div className={styles.hero__packs}>
          <div className={`${styles.hero__pack} ${styles["hero__pack--front"]}`}>
            <Image
              src={lead.image}
              alt={`${lead.name} pack`}
              className={styles.hero__packImage}
              fill
              priority
              sizes="(max-width: 900px) 50vw, 230px"
            />
          </div>
          <div className={`${styles.hero__pack} ${styles["hero__pack--back"]}`}>
            <Image
              src={second.image}
              alt={`${second.name} pack`}
              className={styles.hero__packImage}
              fill
              sizes="(max-width: 900px) 50vw, 230px"
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- one per product */}
      <div id="formulas">
        {catalogue.map((entry, index) => (
          <ProductSection key={entry.id} product={entry} index={index} mode={mode} />
        ))}
      </div>

      {/* --------------------------------------------------- what we publish */}
      <Band tone="plum" labelledBy="publish-title">
        <div className={`lu-container ${styles.publish}`}>
          <div className={styles.publish__head}>
            <h2 id="publish-title" className={styles.publish__title}>
              Most of this category is built on not telling you.
            </h2>
            <p className={styles.publish__lede}>
              Proprietary blends exist so you cannot check the dose. We started from the
              opposite end: print everything, then live with it.
            </p>
          </div>

          <ol className={styles.publish__grid}>
            {PROMISES.map((promise) => (
              <li key={promise.title} className={styles.promise}>
                <h3 className={styles.promise__title}>{promise.title}</h3>
                <p className={styles.promise__body}>{promise.body}</p>
              </li>
            ))}
          </ol>

          <div className={styles.publish__foot}>
            <Link href="/open-formula" className={styles.publish__link}>
              Read the open formula series
            </Link>
            <Link href="/about" className={styles.publish__link}>
              About LUNARA
            </Link>
          </div>
        </div>
      </Band>

      {/* ---------------------------------------------------- open formula reads
          The band above links to the series without showing any of it. These are the
          decisions themselves, so the reader can judge the reasoning rather than the
          claim that reasoning exists. */}
      <section className={`lu-container ${styles.reads}`} aria-labelledby="reads-title">
        <div className={styles.reads__head}>
          <h2 id="reads-title" className={styles.reads__title}>
            The decisions, written down
          </h2>
          <Link href="/open-formula" className={styles.reads__all}>
            All {publishedArticles.length} pieces
          </Link>
        </div>

        <ul className={styles.reads__grid}>
          {featuredArticles.map((piece) => (
            <li key={piece.slug} className={styles.read}>
              <Link href={`/open-formula/${piece.slug}`} className={styles.read__link}>
                <span className={styles.read__number}>{piece.number}</span>
                <h3 className={styles.read__title}>{piece.title}</h3>
                <p className={styles.read__dek}>{piece.dek}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------- the change log
          The band above promises a dated change log. This is it, immediately after,
          because a promise a reader has to take on trust is the thing this brand is
          arguing against. */}
      <section className={`lu-container ${styles.log}`} aria-labelledby="log-title">
        <div className={styles.log__head}>
          <p className="lu-label lu-label--wide">The change log</p>
          <h2 id="log-title" className={styles.log__title}>
            Every dose that moved, with the date it moved.
          </h2>
          <p className={styles.log__lede}>
            Formulation decisions are published when they are made, not summarised after
            launch. This is the whole log, including the entry that made a dose smaller.
          </p>
        </div>

        <ol className={styles.log__list}>
          {changeLog.map((entry) => {
            const piece = entry.relatedArticle
              ? articles.find((a) => a.slug === entry.relatedArticle && a.published)
              : undefined;

            return (
              <li key={entry.date} className={styles.log__entry}>
                <time dateTime={entry.date} className={styles.log__date}>
                  {formatLotDate(entry.date)}
                </time>
                <p className={styles.log__summary}>
                  {entry.summary}
                  {piece ? (
                    <>
                      {" "}
                      <Link href={`/open-formula/${piece.slug}`} className={styles.log__link}>
                        Read the reasoning
                      </Link>
                    </>
                  ) : null}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ------------------------------------------------------ proof and ask */}
      <div className={`lu-container ${styles.close}`}>
        <section className={styles.coa} aria-labelledby="coa-title">
          <div className={styles.coa__top}>
            <IconDocumentCheck size={40} className={styles.coa__icon} />
            <div>
              <h2 id="coa-title" className={styles.coa__title}>
                A lab report for every lot, at a URL printed on the box
              </h2>
              <p className={styles.coa__body}>
                Identity, potency, heavy metals, microbials. For the powder in your hand, not a
                sample from a good week.
              </p>
            </div>
          </div>
          <BatchLookup />
        </section>

        <section className={styles.join} aria-labelledby="join-title">
          <h2 id="join-title" className={styles.join__title}>
            {mode === "store"
              ? "One formula in two formats, and one in capsules."
              : "The formulas are public. Nothing is for sale yet."}
          </h2>
          <p className={styles.join__body}>
            {mode === "store"
              ? "Free US shipping over $50, and a sixty-day return on an opened jar."
              : "The Founding 500 get 30% off and 48 hours before general access. Nothing is charged now."}
          </p>

          {/* The count is the reason to act now, so it shows the count rather than
              describing it. Store mode has nothing to count. */}
          {mode === "store" ? null : <FoundingProgress className={styles.join__progress} />}

          <Link
            href={mode === "store" ? "/shop" : "/join"}
            className={`lu-btn ${styles.join__cta}`}
          >
            {mode === "store" ? "Shop the range" : site.navAction.waitlist.label}
          </Link>
        </section>
      </div>
    </>
  );
}
