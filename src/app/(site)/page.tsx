import Image from "next/image";
import Link from "next/link";

import { BatchLookup } from "@/components/coa/BatchLookup";
import { IconDocumentCheck, IconSpark } from "@/components/Icon";
import { ProductSection } from "@/components/product/ProductSection";
import { catalogue, site } from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import styles from "./home.module.css";

/**
 * The brand home.
 *
 * Its job is the range and the reason to trust it. The waitlist conversion page lives at
 * `/join`, where the only decision on offer is whether to sign up.
 */

/** What we publish, in the order each one costs us something. */
const PROMISES = [
  {
    number: "01",
    title: "Every milligram, named",
    body: "On the pack, on the site, and in the first email. No blends, ever, in either formula.",
  },
  {
    number: "02",
    title: "A report for every lot",
    body: "Third-party tested and published unedited, at a URL printed on the box. Including lots we chose not to sell.",
  },
  {
    number: "03",
    title: "A dated change log",
    body: "If a dose moves you read it here first, with a date, before it reaches a pack.",
  },
  {
    number: "04",
    title: "No body talk",
    body: "No before-and-afters, no weight or calorie numbers, no suggestion that your body needs correcting.",
  },
];

export default async function HomePage() {
  const mode = await resolveSiteMode();
  // The hero shows the range, so it reads the same catalogue the sections below do.
  const [lead, second] = catalogue;

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
      <section className="lu-band lu-band--plum" aria-labelledby="publish-title">
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
              <li key={promise.number} className={styles.promise}>
                <p className={styles.promise__number}>{promise.number}</p>
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
