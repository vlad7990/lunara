import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { WarningSet } from "@/components/compliance";
import { IconCalendar, IconClock, IconSpark } from "@/components/Icon";
import { SparkDivider } from "@/components/Ornament";
import { FormulaMark } from "@/components/product/formulaMarks";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { getCatalogueProduct } from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import styles from "./cycle.module.css";

import packCycle from "@public/assets/pack-cycle.png";

export const metadata: Metadata = {
  title: "Cycle Ritual",
  description:
    "Lady's mantle, magnesium bisglycinate, ginger and vitamin B6, for menstrual comfort and the days around it. Every milligram published.",
};

const STEPS = [
  { icon: IconCalendar, text: "Three capsules, once a day, with water." },
  { icon: IconClock, text: "With a meal. Most people take them in the evening." },
  {
    icon: IconSpark,
    text: "Every day of the cycle, not only the difficult ones. Magnesium and B6 are consistency ingredients.",
  },
];

export default async function CycleRitualPage() {
  const mode = await resolveSiteMode();
  const cycle = getCatalogueProduct("cycle-ritual");
  if (!cycle) notFound();

  return (
    <div className={styles.page}>
      {/* --------------------------------------------------------- hero */}
      <section className={`lu-container ${styles.hero}`}>
        <div className={styles.figure}>
          <Image
            src={packCycle}
            alt={`${cycle.name} bottle and carton`}
            className={styles.image}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 520px"
          />
        </div>

        <div className={styles.buy}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{cycle.name}</h1>
            <p className={styles.spec}>
              {cycle.subtitle} · {cycle.unit} · {cycle.servings} days
            </p>
          </div>

          <p className={styles.intro}>{cycle.lede}</p>

          {cycle.benefits ? (
            <section className={styles.benefits} aria-labelledby="cycle-benefits">
              <h2 id="cycle-benefits" className={styles.benefits__label}>
                What it is for
              </h2>
              <ul className={styles.benefits__list}>
                {cycle.benefits.map((benefit) => (
                  <li key={benefit} className={styles.benefits__item}>
                    <IconSpark size={13} strokeWidth={1.5} className={styles.benefits__icon} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {mode === "store" ? null : (
            <>
              <div className={styles.notSale}>
                <p className={styles.notSale__label}>Not on sale yet</p>
                <h2 className={styles.notSale__title}>
                  This page exists so you can read the label before we can sell it to you.
                </h2>
                <p className={styles.notSale__body}>
                  {cycle.name} follows {" "}
                  {getCatalogueProduct("crave-balance")?.name} into production. Everyone on the
                  list hears first.
                </p>
              </div>

              <WaitlistForm
                submitLabel="Notify me"
                showMicrocopy={false}
                className={styles.notify}
              />
            </>
          )}
        </div>
      </section>

      {/* ---------------------------------------------- formula breakdown */}
      <section className="lu-band" aria-labelledby="cycle-formula">
        <div className={`lu-container ${styles.formula}`}>
          <div className={styles.formula__head}>
            <h2 id="cycle-formula" className={styles.formula__title}>
              How the formula works
            </h2>
            <p className={styles.formula__dek}>
              Four ingredients, each at a dose you can check against the literature.
            </p>
          </div>

          <div className={styles.formula__grid}>
            {cycle.ingredients?.map((ingredient) => (
              <article key={ingredient.name} className={styles.cell}>
                <span className={styles.cell__mark}>
                  <FormulaMark name={ingredient.name} size={26} />
                </span>
                <h3 className={styles.cell__name}>{ingredient.name}</h3>
                <p className={styles.cell__dose}>
                  {ingredient.dose} {ingredient.unit}
                  {ingredient.qualifier ? (
                    <span className={styles.cell__qualifier}> · {ingredient.qualifier}</span>
                  ) : null}
                </p>
                <SparkDivider align="start" className={styles.cell__rule} />
                <p className={styles.cell__body}>{ingredient.long}</p>
                {ingredient.evidenceNote ? (
                  <p className={styles.cell__evidence}>{ingredient.evidenceNote}</p>
                ) : null}
              </article>
            ))}
          </div>

          {cycle.footnote ? <p className={styles.formula__foot}>{cycle.footnote}</p> : null}
        </div>
      </section>

      {/* ------------------------------------------------------ how to use */}
      <div className={`lu-container ${styles.use}`}>
        <section className={styles.use__col} aria-labelledby="cycle-how">
          <h2 id="cycle-how" className="lu-h3">
            How to use
          </h2>
          <ol className={styles.steps}>
            {STEPS.map((step) => (
              <li key={step.text} className={styles.step}>
                <step.icon size={34} strokeWidth={1.5} className={styles.step__icon} />
                <p className={styles.step__text}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className={styles.use__col}>
          {/* The same component, and the same source, as Crave Balance and checkout. */}
          <WarningSet compact />
        </div>
      </div>
    </div>
  );
}
