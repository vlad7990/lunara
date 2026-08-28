import type { Metadata } from "next";
import Image from "next/image";

import { Band } from "@/components/Band";

import { articles, product, spellCountCapital } from "@/lib/content";

import styles from "./about.module.css";

import packGreen from "@public/assets/pack-green.png";

export const metadata: Metadata = {
  title: "About",
  description:
    "Proprietary blends exist so you can’t check the dose. We started from the opposite end: print everything, then live with it.",
};

/** The four promises, in the order they cost us something. */
const PROMISES = [
  {
    title: "Every milligram, in public",
    body: "Named on the pack, on the site, and in the first email you receive. No blends, ever — not even one.",
  },
  {
    title: "A report for every lot",
    body: "Third-party tested, published unedited at a URL printed on the box — including the lots we decided not to sell.",
  },
  {
    title: "A dated change log",
    body: "If a dose moves, you read it here first. No quiet reformulation between production runs.",
  },
  {
    title: "No body talk",
    body: "No before-and-afters, no weight or calorie numbers, no suggestion that your body needs correcting.",
  },
];

/** The year-one plan, published so it can be held to its dates. */
const PLAN = [
  {
    when: "Weeks 1–4",
    title: "Formula published, identity locked",
    body: "Dose card out in week one. Wordmark, palette and pack artwork signed off by week four.",
  },
  {
    when: "Weeks 5–8",
    title: "The open formula series",
    /* The plan counts the whole series, not just the live pieces: it describes what we
       committed to write, and the weeks are how long it takes. */
    body: `One decision published a week. ${spellCountCapital(articles.length)} articles, each a credibility deposit rather than a promotion.`,
  },
  {
    when: "Weeks 9–12",
    title: "Faces, then launch",
    body: "Fifteen to twenty-five health-literate creators, contracted to the approved-claims list. Founding 500 first, 48 hours ahead.",
  },
  {
    when: "Year two",
    title: "The finished-product trial",
    body: "Not the ingredient literature — this exact formula, in this exact dose. The only real moat available to us.",
    future: true,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className={`lu-container ${styles.hero}`}>
        <div className={styles.hero__copy}>
          <p className="lu-label lu-label--wide">About</p>
          <h1 className={`lu-h1 ${styles.hero__title}`}>
            Most of this category
            <br />
            is built on <em>not telling you.</em>
          </h1>
          <p className={styles.hero__dek}>
            Proprietary blends exist so you can&rsquo;t check the dose. Underdosed actives exist so
            the label can name an ingredient without paying for it. We started from the opposite
            end: print everything, then live with it.
          </p>
        </div>

        <Image
          src={packGreen}
          alt={`${product.name} pack`}
          className={styles.hero__pack}
          width={440}
          height={560}
          priority
          sizes="(max-width: 900px) 100vw, 440px"
        />
      </section>

      {/* ------------------------------------------------- four promises */}
      <Band tone="plum" labelledBy="promises-title">
        <div className={`lu-container ${styles.promises}`}>
          <div className={styles.promises__head}>
            <p className="lu-label lu-label--wide lu-label--onPlum">What we committed to</p>
            <h2 id="promises-title" className={styles.promises__title}>
              Four promises, in the order they cost us something.
            </h2>
          </div>

          <ol className={styles.promises__grid}>
            {PROMISES.map((promise) => (
              <li key={promise.title} className={styles.promise}>
                <h3 className={styles.promise__title}>{promise.title}</h3>
                <p className={styles.promise__body}>{promise.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      {/* --------------------------------------------------------- essay */}
      <div className={`lu-container ${styles.essay}`}>
        <section className={styles.essay__column} aria-labelledby="why-craving">
          <h2 id="why-craving" className="lu-h2">
            Why a craving product, and not another metabolic stack
          </h2>
          <p className={styles.essay__body}>
            Because the 3pm walk to the kitchen is not a nutrition problem. It arrives after a
            difficult meeting, not after a small lunch, and treating it as appetite alone is why so
            much of this category feels like it was written about someone else&rsquo;s day.
          </p>
          <p className={styles.essay__body}>
            So the formula has two halves. Inositol and chromium for the metabolic side — dosed at
            the levels in the literature, at the ratio the trials use. Theanine and saffron for the
            part that isn&rsquo;t hunger. Nothing bolted on to make the label longer.
          </p>
          <p className={styles.essay__body}>
            It is one product. We would rather have one we can defend line by line than a range we
            can only defend in aggregate.
          </p>
        </section>

        <section className={styles.essay__column} aria-labelledby="honest-read">
          <h2 id="honest-read" className="lu-h2">
            The honest read on our own position
          </h2>
          <p className={styles.essay__body}>
            Our differentiation right now is transparency and taste. Both are real. Both are
            copyable within two quarters by a well-funded competitor who likes our look. The
            formula is not a moat and the design is not a moat.
          </p>
          <p className={styles.essay__body}>
            What is durable is being the brand that published everything first, and therefore gets
            to say so — plus the finished-product trial we are funding for the second year. That
            claim has a shelf life, which is exactly why we are spending it now rather than saving
            it.
          </p>
          <blockquote className={styles.pullQuote}>
            If someone copies the open formula, the category gets better and we have to find a new
            reason to be chosen. That is a fair trade.
          </blockquote>
        </section>
      </div>

      {/* ------------------------------------------------- year-one plan */}
      <section className={`lu-container ${styles.plan}`} aria-labelledby="plan-title">
        <div className="lu-sectionHead">
          <h2 id="plan-title" className="lu-h3">
            How the first year is planned
          </h2>
          <p className="lu-sectionHead__aside">Published so you can hold us to the dates</p>
        </div>

        <ol className={styles.plan__grid}>
          {PLAN.map((phase) => (
            <li
              key={phase.when}
              className={`${styles.phase} ${phase.future ? styles["phase--future"] : ""}`}
            >
              <p className={styles.phase__when}>{phase.when}</p>
              <h3 className={styles.phase__title}>{phase.title}</h3>
              <p className={styles.phase__body}>{phase.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
