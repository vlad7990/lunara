import Image from "next/image";
import Link from "next/link";

import { updateBagLine } from "@/components/bag/actions";
import { IconDocumentCheck, IconMinus, IconPlus } from "@/components/Icon";
import {
  MAX_QTY,
  formatCents,
  otherPlanLabel,
  planLabel,
  supportsSubscription,
  type BagTotals,
  type PricedLine,
} from "@/lib/bag";
import { commerce, formatPrice, lots, product, scoopSize } from "@/lib/content";

import styles from "./bag.module.css";

import packPlum from "@public/assets/pack-plum.png";

/**
 * The bag's line items and order summary.
 *
 * Every control is a form posting to a server action, so quantity, plan switching and
 * removal all work before hydration and the totals are always the server's.
 */

function LineControl({
  line,
  intent,
  children,
  ...rest
}: {
  line: PricedLine;
  intent: "increment" | "decrement" | "remove" | "switchPlan";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <form action={updateBagLine}>
      <input type="hidden" name="sku" value={line.sku} />
      <input type="hidden" name="plan" value={line.plan} />
      <input type="hidden" name="intent" value={intent} />
      <button type="submit" {...rest}>
        {children}
      </button>
    </form>
  );
}

export function BagLine({ line, editable }: { line: PricedLine; editable: boolean }) {
  const shippingLot = lots.find((lot) => lot.status === "shipping");

  return (
    <article className={styles.line}>
      <div className={styles.line__inner}>
        <div className={styles.line__figure}>
          <Image
            src={packPlum}
            alt={line.format.name}
            className={styles.line__image}
            fill
            sizes="130px"
          />
        </div>

        <div className={styles.line__detail}>
          <h2 className={styles.line__name}>{product.name}</h2>
          <p className={styles.line__spec}>
            {product.flavour} · {line.format.unit ?? `${line.format.servings} servings`}
          </p>
          <p className={styles.planChip}>{planLabel(line.plan)}</p>

          {editable ? (
            <div className={styles.line__controls}>
              <div className={styles.stepper}>
                <LineControl
                  line={line}
                  intent="decrement"
                  className={styles.stepper__btn}
                  disabled={line.qty <= 1}
                  aria-label={`Decrease quantity of ${line.format.name}`}
                >
                  <IconMinus size={15} />
                </LineControl>
                <span className={styles.stepper__value}>{line.qty}</span>
                <LineControl
                  line={line}
                  intent="increment"
                  className={styles.stepper__btn}
                  disabled={line.qty >= MAX_QTY}
                  aria-label={`Increase quantity of ${line.format.name}`}
                >
                  <IconPlus size={15} />
                </LineControl>
              </div>

              {supportsSubscription(line.sku) ? (
                <LineControl line={line} intent="switchPlan" className={styles.linkBtn}>
                  Switch to {otherPlanLabel(line.plan)}
                </LineControl>
              ) : null}

              <LineControl line={line} intent="remove" className={styles.linkBtn}>
                Remove
              </LineControl>
            </div>
          ) : (
            <p className={styles.line__spec}>Quantity {line.qty}</p>
          )}
        </div>

        <div className={styles.line__money}>
          <p className={styles.line__total}>{formatCents(line.lineCents)}</p>
          <p className={styles.line__unit}>{formatCents(line.unitCents)} each</p>
        </div>
      </div>

      {shippingLot ? (
        <div className={styles.line__lot}>
          <IconDocumentCheck size={16} strokeWidth={1.7} className={styles.line__lotIcon} />
          <p className={styles.line__lotText}>
            Shipping from lot <strong>{shippingLot.batch}</strong> —{" "}
            <Link href={`/lot/${shippingLot.batch}`}>read its lab report</Link> before you buy.
          </p>
        </div>
      ) : null}
    </article>
  );
}

export function OrderSummary({ totals }: { totals: BagTotals }) {
  const subscribed = totals.lines.some((line) => line.plan === "sub");

  return (
    <section className={styles.summary__card} aria-labelledby="summary-title">
      <h2 id="summary-title" className={styles.summary__label}>
        Order summary
      </h2>

      <dl className={styles.summary__rows}>
        <div className={styles.summary__row}>
          <dt>Subtotal</dt>
          <dd>{formatCents(totals.subtotalCents)}</dd>
        </div>

        {totals.savingCents > 0 ? (
          <div className={`${styles.summary__row} ${styles["summary__row--saving"]}`}>
            <dt>{subscribed ? "Subscription" : "Bundle"} saving</dt>
            <dd>−{formatCents(totals.savingCents)}</dd>
          </div>
        ) : null}

        <div className={styles.summary__row}>
          <dt>Shipping</dt>
          <dd>{totals.freeShipping ? "Free" : formatCents(totals.shippingCents)}</dd>
        </div>

        <div className={`${styles.summary__row} ${styles["summary__row--muted"]}`}>
          <dt>Estimated tax</dt>
          <dd>Calculated at payment</dd>
        </div>
      </dl>

      <div className={styles.summary__total}>
        <span className={styles.summary__totalLabel}>Total</span>
        <span className={styles.summary__totalValue}>{formatCents(totals.totalCents)}</span>
      </div>
    </section>
  );
}

/** The two standing promises that sit under the summary on both bag and checkout. */
export function SummaryNotes() {
  return (
    <>
      <section className={styles.sideCard} aria-labelledby="what-ships">
        <h2 id="what-ships" className={styles.sideCard__label}>
          What ships
        </h2>
        <p className={styles.sideCard__body}>
          One jar with a {scoopSize} scoop, a dosing card, and the batch number printed on the
          base. Recyclable mailer, no plastic void fill, no sample sachets you didn&rsquo;t ask
          for.
        </p>
      </section>

      <section
        className={`${styles.sideCard} ${styles["sideCard--card"]}`}
        aria-labelledby="returns"
      >
        <h2 id="returns" className={styles.sideCard__label}>
          {commerce.returnWindowDays}-day return
        </h2>
        <p className={styles.sideCard__body}>
          On an opened jar, not just an unopened one. If it isn&rsquo;t for you we would rather
          have the feedback than the sale.
        </p>
      </section>
    </>
  );
}

/** Free shipping crosses at the published threshold; say how far away it is. */
export function ShippingNote({ totals }: { totals: BagTotals }) {
  if (totals.freeShipping) return null;
  const away = commerce.shippingFreeOver - totals.subtotalCents / 100;

  return (
    <p className={styles.terms}>
      {formatPrice(Math.round(away * 100) / 100, true)} more for free US shipping.
    </p>
  );
}
