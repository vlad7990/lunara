import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Band } from "@/components/Band";
import { BatchLookup } from "@/components/coa/BatchLookup";
import { LaunchNotice } from "@/components/LaunchNotice";
import { WarningSet } from "@/components/compliance";
import { DropInSlot } from "@/components/DropInSlot";
import { IconCalendar, IconClock, IconGlass, IconShieldCheck } from "@/components/Icon";
import { SparkDivider } from "@/components/Ornament";
import { BuyPanel } from "@/components/product/BuyPanel";
import { FormulaMark } from "@/components/product/formulaMarks";
import { SupplementFacts } from "@/components/product/SupplementFacts";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { MAX_QTY, formatCents, unitCentsFor } from "@/lib/bag";
import {
  commerce,
  directions,
  dosedIngredients,
  excluded,
  formatDose,
  formatPrice,
  getFormat,
  product,
  spellCount,
  spellCountCapital,
} from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import styles from "./product.module.css";

import packGreen from "@public/assets/pack-green.png";
import packPlum from "@public/assets/pack-plum.png";

export const metadata: Metadata = {
  title: product.name,
  description: `A ${product.inositolRatio} inositol base with L-theanine, chromium and standardized saffron extract. Every milligram is printed on the front of the pack and on this page.`,
};

/** Step icons, in the order the directions are published. */
const STEP_ICONS = [IconGlass, IconClock, IconCalendar];

const STEP_WORDS = ["Step one", "Step two", "Step three"];

/**
 * The rationale label counts the dosed ingredients, and only those: the grid's last cell is
 * about what was left out, which is a decision rather than an ingredient. Derived, because
 * the label used to read "six" — counting the inositol ratio row, which is a fact about the
 * formula and has no dose of its own.
 */
const RATIONALE_LABEL = `${spellCountCapital(dosedIngredients.length)} ingredients, ${spellCount(dosedIngredients.length)} reasons`;

/** The commitments in the "what we publish" card. */
const COMMITMENTS = [
  "Full dose disclosure, no blends",
  "Per-lot COA at a printed URL",
  "Every formulation decision, in public",
  "Change log if a dose moves",
];

export default async function ProductPage() {
  const mode = await resolveSiteMode();
  const isStore = mode === "store";

  const jar = getFormat("CB-JAR-30");

  return (
    <>
      {/* -------------------------------------------------------- PDP hero */}
      <section className={`lu-container ${styles.hero}`}>
        <div className={styles.gallery}>
          <div className={styles.gallery__hero}>
            <Image
              src={packGreen}
              alt={`${product.name} pack`}
              className={styles.gallery__heroImage}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 560px"
            />
          </div>

          <div className={styles.gallery__thumbs}>
            <div className={styles.gallery__thumb}>
              <Image
                src={packPlum}
                alt="Plum colourway"
                className={styles.gallery__thumbImage}
                fill
                sizes="140px"
              />
            </div>
            <DropInSlot caption="stick macro" className={styles.gallery__slot} />
            <DropInSlot caption="powder in water" className={styles.gallery__slot} />
            <DropInSlot caption="hands / kitchen" className={styles.gallery__slot} />
          </div>
        </div>

        <div className={styles.buy}>
          <div className={styles.buy__titleBlock}>
            <p className="lu-label lu-label--wide">{product.subtitle}</p>
            <h1 className={styles.buy__title}>{product.name}</h1>
            <p className={styles.buy__spec}>
              {product.flavour} · {product.servings} servings · {product.netWeight}
            </p>
          </div>

          <p className={styles.buy__intro}>
            A {product.inositolRatio} inositol base with L-theanine, chromium and standardized
            saffron extract. One scoop in water, once a day, with food. Every milligram is printed
            on the front of the pack and on this page.
          </p>

          {isStore ? (
            <BuyPanel
              sku={jar.sku}
              subCents={unitCentsFor(jar, "sub")}
              onceCents={unitCentsFor(jar, "once")}
              listPrice={formatPrice(jar.price)}
              subPrice={formatCents(unitCentsFor(jar, "sub"))}
              oncePrice={formatCents(unitCentsFor(jar, "once"))}
              perServing={formatPrice(jar.perServing!)}
              foundingPrice={formatPrice(jar.foundingPrice!)}
              intervalDays={commerce.subscription.intervalDays}
              discountPct={commerce.subscription.discountPct}
              servings={jar.servings!}
              maxQty={MAX_QTY}
              terms={`Free US shipping over ${formatPrice(
                commerce.shippingFreeOver,
              )} · ${commerce.returnWindowDays}-day return on an opened jar · ships in ${
                commerce.dispatchDays
              }`}
            />
          ) : (
            <div className={styles.notify}>
              <div className={styles.notSale}>
                <p className={`lu-label lu-label--wide lu-label--onPlum ${styles.notSale__label}`}>
                  Not on sale yet
                </p>
                <h2 className={styles.notSale__title}>
                  This page exists so you can read the label before we can sell it to you.
                </h2>
                <p className={styles.notSale__body}>
                  Manufacturing lead time is twelve to twenty weeks. When the first run lands, the
                  Founding 500 get 48 hours before anyone else.
                </p>

                <LaunchNotice tone="onPlum" />
              </div>

              <WaitlistForm
                submitLabel="Notify me"
                showMicrocopy={false}
                className={styles.notify__form}
              />
              <p className={styles.notify__price}>
                Founding price will be {formatPrice(jar.foundingPrice!)}. Nothing is charged now.
              </p>
            </div>
          )}

          <section className={styles.publish} aria-labelledby="publish-title">
            <div className={styles.publish__head}>
              <IconShieldCheck size={18} className={styles.publish__icon} />
              <h2 id="publish-title" className={styles.publish__label}>
                What we publish
              </h2>
            </div>
            <ul className={styles.publish__grid}>
              {COMMITMENTS.map((commitment) => (
                <li key={commitment}>{commitment}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      {/* --------------------------------- Supplement Facts + how to use */}
      <Band>
        <div className={`lu-container ${styles.label}`}>
          <SupplementFacts />

          <div className={styles.howTo}>
            <h2 className="lu-h3">How to use</h2>

            <ol className={styles.steps}>
              {directions.map((direction, index) => {
                const Icon = STEP_ICONS[index] ?? IconCalendar;
                return (
                  <li key={direction.step} className={styles.step}>
                    <Icon size={34} strokeWidth={1.5} className={styles.step__icon} />
                    <div>
                      <p className={styles.step__label}>{STEP_WORDS[index] ?? `Step ${direction.step}`}</p>
                      <p className={styles.step__text}>
                        {direction.title}. {direction.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* One warning set, one source. This is the same component the FAQ sidebar
                and checkout use. */}
            <WarningSet compact />
          </div>
        </div>
      </Band>

      {/* --------------------------------------------- ingredient rationale */}
      <section className={`lu-container ${styles.rationale}`} aria-labelledby="rationale-title">
        <div className={styles.rationale__head}>
          <p className={`lu-label lu-label--wide ${styles.rationale__label}`}>
            {RATIONALE_LABEL}
          </p>
          <h2 id="rationale-title" className={styles.rationale__title}>
            Nothing here is decoration
          </h2>
          <p className={styles.rationale__dek}>
            If an ingredient couldn&rsquo;t earn a paragraph, it didn&rsquo;t make the pack.
          </p>
        </div>

        <div className={styles.rationale__grid}>
          {dosedIngredients.map((ingredient) => (
            <article key={ingredient.name} className={styles.cell}>
              <span className={styles.cell__mark}>
                <FormulaMark name={ingredient.name} size={26} />
              </span>
              <div className={styles.cell__head}>
                <h3 className={styles.cell__name}>{ingredient.name}</h3>
                <p className={styles.cell__dose}>{formatDose(ingredient)}</p>
              </div>
              <SparkDivider align="start" className={styles.cell__rule} />
              <p className={styles.cell__body}>{ingredient.long}</p>
            </article>
          ))}

          <article className={`${styles.cell} ${styles["cell--absent"]}`}>
            {/* No ingredient, so no mark: this reserves the height one would take, so the
                heading lines up with the card beside it. */}
            <span
              className={`${styles.cell__mark} ${styles["cell__mark--empty"]}`}
              aria-hidden="true"
            />
            <h3 className={styles.cell__name}>And what isn&rsquo;t here</h3>
            <p className={styles.cell__body}>
              {excluded.map((item) => `No ${item.name.toLowerCase()}.`).join(" ")} No
              &ldquo;metabolic complex&rdquo; hiding a 40&nbsp;mg dose. Each of those is a
              published decision, not an omission.
            </p>
            <Link href="/open-formula" className="lu-moreLink">
              Read the open formula series
            </Link>
          </article>
        </div>
      </section>

      {/* ---------------------------------------------------------- COA band */}
      <section className={`lu-container ${styles.coa}`} aria-labelledby="product-coa-title">
        <div className={styles.coa__inner}>
          <div>
            <p className={`lu-label lu-label--wide lu-label--onPlum ${styles.coa__label}`}>
              Certificate of analysis
            </p>
            <h2 id="product-coa-title" className={styles.coa__title}>
              Read the lab report for the powder in your hand
            </h2>
            <p className={styles.coa__body}>
              Every lot is tested for identity, potency, heavy metals and microbials. The batch
              number is printed on the base of your jar and on the back of every stick pack.
            </p>
          </div>
          <BatchLookup label="Enter batch number" onPlum />
        </div>
      </section>
    </>
  );
}
