import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AddToBag } from "@/components/bag/AddToBag";
import { Band } from "@/components/Band";
import { DropInSlot } from "@/components/DropInSlot";
import {
  commerce,
  dosedIngredients,
  formatDose,
  formatPrice,
  formats,
  getFormat,
  lots,
  product,
  scoopSize,
} from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import { ShopFilter } from "./ShopFilter";
import styles from "./shop.module.css";

import packPlum from "@public/assets/pack-plum.png";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "One formula in two formats, plus a subscription and a single bundle. The jar and the sticks contain the same powder at the same dose.",
};

/**
 * What we do not sell, and why.
 *
 * This section is doing positioning work — a four-item shop is the harder choice, not an
 * unfinished one — so it stays even though nothing on it is for sale.
 */
const NOT_SOLD = [
  {
    term: "No gummies",
    reason:
      "Three grams of inositol will not fit in a gummy. Anything that did would be a token dose in a sweet.",
  },
  {
    term: "No format for its own sake",
    reason:
      "The dose decides the format, not the marketing. Three grams of inositol is nine capsules, so Crave Balance is a powder. Cycle Ritual's whole serving is 725 mg, so it is three capsules. Neither is a range extension.",
  },
  {
    term: "No flavour or strength variants",
    reason:
      "One raspberry saffron, one capsule. A “night” or “extra strength” version of either would be differentiation invented in a meeting, not formulation.",
  },
  {
    term: "No merch or loyalty points",
    reason: "Points are a discount you have to work for. The subscription discount is simply applied.",
  },
  {
    term: "No sample sachets in your box",
    reason: "You bought one thing. We ship one thing.",
  },
];

export default async function ShopPage() {
  const mode = await resolveSiteMode();
  const isStore = mode === "store";

  const jar = getFormat("CB-JAR-30");
  const sticks = getFormat("CB-STK-30");
  const subscription = getFormat("CB-JAR-SUB");
  const bundle = getFormat("CB-JAR-60");
  const currentLot = lots.find((lot) => lot.status === "shipping");

  /** Every dose, in one line, so the shop never implies a format changes the formula. */
  const doseLine = dosedIngredients.map(formatDose).join(" · ");

  const comparison = [
    {
      label: "Price",
      jar: formatPrice(jar.price, true),
      sticks: formatPrice(sticks.price, true),
    },
    {
      label: "Per serving",
      jar: formatPrice(jar.perServing!, true),
      sticks: formatPrice(sticks.perServing!, true),
    },
    { label: "Dose per serving", jar: "Identical", sticks: "Identical" },
    { label: "Measuring", jar: `${scoopSize} scoop included`, sticks: "Pre-measured" },
    { label: "Best for", jar: "Home, same time daily", sticks: "Bag, desk, travel" },
    {
      label: "Packaging",
      jar: "Glass, refill-ready",
      sticks: sticks.recyclable ? "Laminate film, recyclable" : "Laminate film, not yet recyclable",
    },
    { label: "Batch number", jar: "Base of the jar", sticks: "Back of every stick" },
  ];

  /** Waitlist: the price is published so you can decide before we ask. Nothing is charged. */
  const foundingChip = (founding: number) => (
    <p className={styles.foundingChip}>
      Founding 500 price <strong>{formatPrice(founding)}</strong> · nothing charged now
    </p>
  );

  const notifyCta = (
    <Link href="/join" className={`lu-btn ${styles.card__cta}`}>
      Notify me
    </Link>
  );

  const formatCards = (
    <>
      <article className={styles.card}>
        <div className={styles.card__figure}>
          <Image
            src={packPlum}
            alt={`${product.name} jar`}
            className={styles.card__image}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 608px"
          />
          <p className={styles.card__badge}>Most people start here</p>
        </div>
        <div className={styles.card__body}>
          <div className={styles.card__titleRow}>
            <h2 className={styles.card__name}>{jar.name}</h2>
            <p className={styles.card__price}>{formatPrice(jar.price)}</p>
          </div>
          <p className={styles.card__meta}>
            {jar.servings} servings · {product.netWeight} · {formatPrice(jar.perServing!)} per
            serving
          </p>
          <p className={styles.card__copy}>
            Glass jar with a {scoopSize} scoop inside. The everyday format — it lives next to the
            kettle and you never think about it.
          </p>
          <div className={styles.card__spacer} />
          {isStore ? (
            <AddToBag sku={jar.sku} className={`lu-btn ${styles.card__cta}`} />
          ) : (
            <div className={styles.card__actions}>
              {foundingChip(jar.foundingPrice!)}
              {notifyCta}
            </div>
          )}
        </div>
      </article>

      <article className={styles.card}>
        <div className={styles.card__slotFrame}>
          <DropInSlot
            caption="30-count carton with three sticks fanned"
            className={styles.card__slot}
          />
        </div>
        <div className={styles.card__body}>
          <div className={styles.card__titleRow}>
            <h2 className={styles.card__name}>{sticks.name}</h2>
            <p className={styles.card__price}>{formatPrice(sticks.price)}</p>
          </div>
          <p className={styles.card__meta}>
            {sticks.servings} sticks · 5 g each · {formatPrice(sticks.perServing!)} per serving
          </p>
          <p className={styles.card__copy}>
            Single-serve sachets in a 30-count carton. {sticks.note}
          </p>
          <div className={styles.card__spacer} />
          {isStore ? (
            <AddToBag sku={sticks.sku} className={`lu-btn ${styles.card__cta}`} />
          ) : (
            <div className={styles.card__actions}>
              {foundingChip(sticks.foundingPrice!)}
              {notifyCta}
            </div>
          )}
        </div>
      </article>
    </>
  );

  const bundleCards = (
    <>
      <article className={`${styles.offer} ${styles["offer--sub"]}`}>
        <div className={styles.offer__head}>
          <p className={styles.offer__kicker}>Subscription</p>
          <p className={styles.offer__saving}>Save {subscription.discountPct}%</p>
        </div>
        <h2 className={styles.offer__title}>
          The jar, every {commerce.subscription.intervalDays} days
        </h2>
        <p className={styles.offer__price}>
          <span className={styles.offer__priceValue}>{formatPrice(subscription.price)}</span>
          <span className={styles.offer__priceWas}>
            {formatPrice(subscription.listPrice!, true)}
          </span>
        </p>
        <p className={styles.offer__copy}>
          {subscription.note} A reminder email arrives{" "}
          {commerce.subscription.reminderDaysBefore} days before every charge with skip and
          cancel links in the first line.
        </p>
        <ul className={styles.offer__points}>
          <li>Skip, pause or change interval anytime</li>
          <li>One click to cancel — no call, no chat, no offer</li>
          <li>Price never changes without an email first</li>
        </ul>
        <div className={styles.card__spacer} />
        {isStore ? (
          <AddToBag
            sku={jar.sku}
            plan="sub"
            label="Subscribe"
            className={`lu-btn lu-btn--gold ${styles.card__cta}`}
          />
        ) : (
          <Link href="/join" className={`lu-btn lu-btn--gold ${styles.card__cta}`}>
            Join the list
          </Link>
        )}
      </article>

      <article className={`${styles.offer} ${styles["offer--bundle"]}`}>
        <div className={styles.offer__head}>
          <p className={styles.offer__kicker}>Bundle</p>
          <p className={styles.offer__saving}>Save {formatPrice(bundle.saving!)}</p>
        </div>
        <h2 className={styles.offer__title}>{bundle.name}</h2>
        <p className={styles.offer__price}>
          <span className={styles.offer__priceValue}>{formatPrice(bundle.price)}</span>
          <span className={styles.offer__priceWas}>{formatPrice(bundle.listPrice!)}</span>
        </p>
        <p className={styles.offer__copy}>
          The published trials on inositol run eight to twelve weeks. This is the shortest honest
          test of whether the formula does anything for you — so it is the only bundle we sell.
        </p>
        <ul className={styles.offer__points}>
          <li>Both jars from the same lot, same report</li>
          <li>{commerce.returnWindowDays}-day return still applies, opened</li>
          <li>Cheaper per serving than the subscription&rsquo;s first month</li>
        </ul>
        <div className={styles.card__spacer} />
        {isStore ? (
          <AddToBag sku={bundle.sku} className={`lu-btn ${styles.card__cta}`} />
        ) : (
          <div className={styles.card__actions}>{notifyCta}</div>
        )}
      </article>
    </>
  );

  return (
    <>
      <section className={`lu-container ${styles.head}`}>
        <div className={styles.head__copy}>
          <p className="lu-label lu-label--wide">Shop</p>
          <h1 className="lu-h1">
            One formula.
            <br />
            <em>Two ways to take it.</em>
          </h1>
          <p className={styles.head__lede}>
            There is no range here and there won&rsquo;t be one soon. The jar and the sticks
            contain the same powder at the same dose — you are choosing a format, not a strength.
          </p>
        </div>

        <div className={styles.sameCard}>
          <h2 className={styles.sameCard__label}>Same in every format</h2>
          <p className={styles.sameCard__body}>
            {doseLine} at {product.inositolRatio}.{" "}
            <Link href="/crave-balance">Read the full label.</Link>
          </p>
        </div>
      </section>

      <ShopFilter
        formatCards={formatCards}
        bundleCards={bundleCards}
        totalCount={formats.length}
      />

      {/* ------------------------------------------------------- comparison */}
      <Band labelledBy="compare-title">
        <div className={`lu-container ${styles.compare}`}>
          <div className={styles.compare__head}>
            <h2 id="compare-title" className="lu-h2">
              Jar or sticks
            </h2>
            <p className={styles.compare__aside}>
              Identical powder, identical dose. The only real question is where you take it.
            </p>
          </div>

          <div className={styles.compare__wrap}>
            <table className={styles.compare__table}>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="lu-sr-only">Attribute</span>
                  </th>
                  <th scope="col">Jar · {jar.servings} servings</th>
                  <th scope="col">Sticks · {sticks.servings} count</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.jar}</td>
                    <td>{row.sticks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.compare__note}>
            The stick film is a mono-material laminate we cannot yet claim as recyclable. We are
            saying so here rather than putting a green leaf on the carton, and we will change the
            film when a barrier that holds three grams of inositol dry becomes available at our
            volume.
          </p>
        </div>
      </Band>

      {/* --------------------------------------------- what we don't sell */}
      <section className={`lu-container ${styles.dontSell}`} aria-labelledby="dont-sell-title">
        <div className={styles.dontSell__copy}>
          <p className="lu-label lu-label--wide">The short catalogue is the point</p>
          <h2 id="dont-sell-title" className="lu-h2">
            What we don&rsquo;t sell, and why
          </h2>
          <p className={styles.dontSell__body}>
            A short shop looks like a company that hasn&rsquo;t got going yet. It is actually the
            harder choice: every additional SKU is a formula we would have to defend line by
            line, and a page like this one we would have to write honestly.
          </p>
        </div>

        <dl className={styles.dontSell__list}>
          {NOT_SOLD.map((item) => (
            <div key={item.term} className={styles.dontSell__row}>
              <dt className={styles.dontSell__term}>{item.term}</dt>
              <dd className={styles.dontSell__def}>{item.reason}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------------------------------------------------- COA band */}
      <section className={`lu-container ${styles.coaBand}`} aria-labelledby="shop-coa-title">
        <div className={styles.coaBand__inner}>
          <div>
            <p className={`lu-label lu-label--wide lu-label--onPlum ${styles.coaBand__label}`}>
              Before you buy
            </p>
            <h2 id="shop-coa-title" className={styles.coaBand__title}>
              Read the lab report for the lot you&rsquo;d receive
            </h2>
            <p className={styles.coaBand__body}>
              Current stock ships from lot {currentLot?.batch}. Identity, potency, heavy metals
              and microbials, published unedited.
            </p>
          </div>
          <Link
            href={`/lot/${currentLot?.batch}`}
            className={`lu-btn lu-btn--gold ${styles.coaBand__cta}`}
          >
            Open lot {currentLot?.batch}
          </Link>
        </div>
      </section>
    </>
  );
}
