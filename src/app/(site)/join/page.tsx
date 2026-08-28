import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Band } from "@/components/Band";
import { LaunchNotice } from "@/components/LaunchNotice";
import { BatchLookup } from "@/components/coa/BatchLookup";
import { DropInSlot } from "@/components/DropInSlot";
import { IconDocumentCheck, IconSpark } from "@/components/Icon";
import { DoseStrip } from "@/components/product/DoseStrip";
import { FoundingProgress } from "@/components/waitlist/FoundingProgress";
import { MembershipCard } from "@/components/waitlist/MembershipCard";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import {
  articles,
  commerce,
  formatPrice,
  getFormat,
  lots,
  product,
  publishedArticles,
  spellCountCapital,
  waitlistTiers,
} from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";
import { readMembership } from "@/lib/waitlist/membership";

import styles from "./join.module.css";

import packPlum from "@public/assets/pack-plum.png";

export const metadata: Metadata = {
  title: "Join the Founding 500",
  description:
    "The formula is published. The product isn't made yet. Join the list and watch it get built over twelve weeks.",
};

/**
 * The conversion page: one job, one form.
 *
 * It is deliberately not the home page. Ads and email land here, where the only decision on
 * offer is whether to join the list.
 */
export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const [mode, { ref }, membership] = await Promise.all([
    resolveSiteMode(),
    searchParams,
    readMembership(),
  ]);
  const isStore = mode === "store";

  // A referral link is `/?ref=CODE`. Three confirmed referrals promote the referrer into
  // the Founding 500 without changing anyone else's position.
  const referredBy = ref?.trim().toUpperCase() || undefined;

  const jar = getFormat("CB-JAR-30");
  const sticks = getFormat("CB-STK-30");
  const subscription = getFormat("CB-JAR-SUB");
  const currentLot = lots.find((lot) => lot.status === "shipping");

  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className={`lu-container ${styles.hero}`}>
        <div className={styles.hero__copy}>
          <p className="lu-pill">
            <IconSpark size={13} strokeWidth={1.6} className={styles.hero__spark} />
            <span className={styles.hero__eyebrow}>Open formula</span>
          </p>

          <h1 className="lu-h1">
            We published the formula
            <br />
            <em>before we made the product.</em>
          </h1>

          {isStore ? (
            <>
              <p className={styles.hero__lede}>
                It&rsquo;s made now — and the formula in the jar is the one we published in week
                one, unchanged. Every milligram on the front of the pack, and a lab report for
                your lot before it ships.
              </p>

              <div className={styles.hero__buy}>
                <Link href="/crave-balance" className="lu-btn">
                  Shop {product.name}
                </Link>
                <p className={styles.hero__price}>
                  <span className={styles.hero__priceValue}>{formatPrice(jar.price)}</span>
                  <span className={styles.hero__priceMeta}>
                    {formatPrice(jar.perServing!)} per serving · {jar.servings} servings
                  </span>
                </p>
              </div>

              <dl className={styles.facts}>
                <div>
                  <dt className={styles.facts__label}>In stock</dt>
                  <dd className={styles.facts__value}>Ships in {commerce.dispatchDays}</dd>
                </div>
                <div className={styles.facts__divider} aria-hidden="true" />
                <div>
                  <dt className={styles.facts__label}>Current lot</dt>
                  <dd className={styles.facts__value}>
                    <Link href={`/lot/${currentLot?.batch}`}>{currentLot?.batch}</Link>
                  </dd>
                </div>
                <div className={styles.facts__divider} aria-hidden="true" />
                <div>
                  <dt className={styles.facts__label}>Returns</dt>
                  <dd className={styles.facts__value}>
                    {commerce.returnWindowDays} days, opened
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <p className={styles.hero__lede}>
                Every milligram named. No proprietary blends, no undisclosed complexes. Join the
                list and watch the formula get built over twelve weeks — what we chose, what we
                rejected, and why.
              </p>

              <LaunchNotice />

              {/* Someone who has already joined gets their place back, not an empty
                  field. Resolved server-side so the card is in the first paint. */}
              {membership ? (
                <MembershipCard
                  membership={membership}
                  message="You are already on the list. This is your place — it does not move."
                />
              ) : (
                <WaitlistForm id="join" fields="full" referredBy={referredBy} />
              )}
              <FoundingProgress />
            </>
          )}
        </div>

        <Image
          src={packPlum}
          alt={`${product.name} jar, stick packs and carton`}
          className={styles.hero__pack}
          width={470}
          height={620}
          priority
          sizes="(max-width: 900px) 100vw, 470px"
        />
      </section>

      {/* -------------------------------------------------------- dose strip */}
      <DoseStrip />

      {/* ------------------------------------------- block 3: mode-dependent */}
      {isStore ? (
        <section className={`lu-container ${styles.formats}`} aria-labelledby="formats-title">
          <div className="lu-sectionHead">
            <h2 id="formats-title" className="lu-h2">
              One product. Two ways to take it.
            </h2>
            <Link href="/shop" className="lu-moreLink">
              All formats
            </Link>
          </div>

          <div className={styles.formats__grid}>
            <article className={styles.format}>
              <div className={styles.format__figure}>
                <Image
                  src={packPlum}
                  alt={jar.name}
                  className={styles.format__image}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
              <div className={styles.format__body}>
                <h3 className={styles.format__name}>{jar.name}</h3>
                <p className={styles.format__note}>
                  {jar.servings} servings, scoop included. {jar.note}
                </p>
                <div className={styles.format__foot}>
                  <span className={styles.format__price}>{formatPrice(jar.price)}</span>
                  <Link href="/crave-balance" className="lu-moreLink">
                    Add to bag
                  </Link>
                </div>
              </div>
            </article>

            <article className={styles.format}>
              <DropInSlot caption="stick pack carton" className={styles.format__slot} />
              <div className={styles.format__body}>
                <h3 className={styles.format__name}>{sticks.name}</h3>
                <p className={styles.format__note}>
                  {sticks.unit}. For the bag, the desk, the trip.
                </p>
                <div className={styles.format__foot}>
                  <span className={styles.format__price}>{formatPrice(sticks.price)}</span>
                  <Link href="/crave-balance" className="lu-moreLink">
                    Add to bag
                  </Link>
                </div>
              </div>
            </article>

            <article className={styles.subscribe}>
              <div className={styles.subscribe__top}>
                <p className="lu-label lu-label--wide lu-label--onPlum">Subscribe</p>
                <h3 className={styles.subscribe__title}>
                  Save {subscription.discountPct}%, and never think about it again
                </h3>
                <p className={styles.subscribe__body}>
                  Every {commerce.subscription.intervalDays} days.{" "}
                  {commerce.subscription.cancelPolicy}
                </p>
              </div>
              <p className={styles.subscribe__price}>
                <span className={styles.subscribe__priceValue}>
                  {formatPrice(subscription.price)}
                </span>
                <span className={styles.subscribe__priceMeta}>
                  per {subscription.intervalDays} days
                </span>
              </p>
            </article>
          </div>
        </section>
      ) : (
        <section className={`lu-container ${styles.tiers}`} aria-labelledby="tiers-title">
          <div className="lu-sectionHead">
            <h2 id="tiers-title" className="lu-h2">
              Where you land on the list
            </h2>
            <p className="lu-sectionHead__aside">Position is set the moment you sign up.</p>
          </div>

          <div className={styles.tiers__grid}>
            {waitlistTiers.map((tier) => (
              <article
                key={tier.id}
                className={[
                  styles.tier,
                  tier.id === "founding" ? styles["tier--founding"] : "",
                  tier.id === "referral" ? styles["tier--referral"] : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className={styles.tier__head}>
                  <h3 className={styles.tier__name}>{tier.name}</h3>
                  <p className={styles.tier__offer}>{tier.offer}</p>
                </div>
                <p className={styles.tier__trigger}>{tier.trigger}</p>
                <hr
                  className={tier.id === "referral" ? "lu-rule lu-rule--onPlum" : "lu-rule"}
                />
                <ul className={`lu-bullets ${styles.tier__benefits}`}>
                  {tier.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------- open formula series */}
      <Band labelledBy="series-title">
        <div className={`lu-container ${styles.series}`}>
          <div className="lu-sectionHead">
            <div>
              <p className="lu-label lu-label--wide" style={{ marginBottom: "10px" }}>
                The open formula series
              </p>
              {/* The grid below lists the whole series; this heading counts only what is
                  live, because it claims the decisions have been published. */}
              <h2 id="series-title" className="lu-h2">
                {`${spellCountCapital(publishedArticles.length)} decisions, published in full`}
              </h2>
            </div>
            <Link href="/open-formula" className="lu-moreLink">
              Read the series
            </Link>
          </div>

          <div className={styles.series__grid}>
            {articles.map((article) => (
              <Link
                key={article.slug}
                /* Unpublished pieces point at the index rather than at a page that
                   does not exist yet. The week they land is on the card. */
                href={article.published ? `/open-formula/${article.slug}` : "/open-formula"}
                className={styles.series__cell}
              >
                <p className={styles.series__number}>{article.number}</p>
                <p className={styles.series__title}>{article.title}</p>
                {article.published ? null : (
                  <p className={styles.series__pending}>Week {article.week}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </Band>

      {/* ------------------------------------------------------- COA promise */}
      <section className={`lu-container ${styles.coa}`} aria-labelledby="coa-title">
        <div className={styles.coa__card}>
          <div className={styles.coa__copy}>
            <IconDocumentCheck size={40} className={styles.coa__icon} />
            <div>
              <h2 id="coa-title" className={styles.coa__title}>
                A lab report for every lot, at a URL printed on the box
              </h2>
              <p className={styles.coa__body}>
                Identity, potency, heavy metals, microbials — for the powder in your hand, not a
                sample from a good week. Almost nobody in this category does it.
              </p>
            </div>
          </div>
          <BatchLookup />
        </div>
      </section>
    </>
  );
}
