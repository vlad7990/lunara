import type { Metadata } from "next";
import Link from "next/link";

import { IconBag } from "@/components/Icon";
import { getBagTotals } from "@/lib/bag";
import { product } from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import { BagLine, OrderSummary, ShippingNote, SummaryNotes } from "./BagParts";
import styles from "./bag.module.css";

export const metadata: Metadata = {
  title: "Bag",
  robots: { index: false },
};

export default async function BagPage() {
  const mode = await resolveSiteMode();

  /**
   * In waitlist mode the bag is an empty state, not a 404. Someone arriving here has
   * understood the site well enough to look for a way to buy — the answer is a reason, not
   * an error page.
   */
  if (mode !== "store") {
    return (
      <section className={`lu-container ${styles.empty}`}>
        <IconBag size={54} strokeWidth={1.2} className={styles.empty__icon} />
        <h1 className={styles.empty__title}>
          There is nothing to buy yet — <em>on purpose.</em>
        </h1>
        <p className={styles.empty__body}>
          The formula is published, the pack is designed, and the first production run is in the
          manufacturing queue. The Founding 500 get 48 hours before anyone else can add this to a
          bag.
        </p>
        <Link href="/join" className={`lu-btn ${styles.empty__cta}`}>
          Join the list
        </Link>
        <Link href="/crave-balance" className={styles.empty__secondary}>
          Read the label first
        </Link>
      </section>
    );
  }

  const totals = await getBagTotals();

  if (totals.lines.length === 0) {
    return (
      <section className={`lu-container ${styles.empty}`}>
        <IconBag size={54} strokeWidth={1.2} className={styles.empty__icon} />
        <h1 className={styles.empty__title}>Your bag is empty.</h1>
        <p className={styles.empty__body}>
          One formula, two formats. The jar and the sticks contain the same powder at the same
          dose.
        </p>
        <Link href="/shop" className={`lu-btn ${styles.empty__cta}`}>
          Shop {product.name}
        </Link>
      </section>
    );
  }

  return (
    <div className={`lu-container ${styles.page}`}>
      <h1 className={styles.title}>Your bag</h1>

      <div className={styles.layout}>
        <div className={styles.column}>
          <div className={styles.lines}>
            {totals.lines.map((line) => (
              <BagLine key={`${line.sku}-${line.plan}`} line={line} editable />
            ))}
          </div>
        </div>

        <div className={styles.summary}>
          <OrderSummary totals={totals} />
          <Link href="/checkout" className={`lu-btn ${styles.pay}`}>
            Continue to checkout
          </Link>
          <ShippingNote totals={totals} />
          <SummaryNotes />
        </div>
      </div>
    </div>
  );
}
