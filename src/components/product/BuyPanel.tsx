"use client";

import { useState } from "react";

import { addToBag } from "@/components/bag/actions";
import { IconMinus, IconPlus } from "@/components/Icon";

import styles from "./BuyPanel.module.css";

/**
 * The store-mode buy panel: plan picker, quantity, and an add-to-bag button that shows the
 * live line total.
 *
 * Prices arrive pre-computed in cents from the server — this component never does money
 * arithmetic on a float, and it never invents a price the server would not honour.
 */

export interface BuyPanelProps {
  sku: string;
  /** Cents. Both plans, resolved server-side from `product.json`. */
  subCents: number;
  onceCents: number;
  listPrice: string;
  subPrice: string;
  oncePrice: string;
  perServing: string;
  foundingPrice: string;
  intervalDays: number;
  discountPct: number;
  servings: number;
  maxQty: number;
  /** "Free US shipping over $50 · 60-day return on an opened jar · ships in 1–2 days" */
  terms: string;
}

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function BuyPanel(props: BuyPanelProps) {
  const [plan, setPlan] = useState<"sub" | "once">("sub");
  const [qty, setQty] = useState(1);

  const unitCents = plan === "sub" ? props.subCents : props.onceCents;
  const lineTotal = money(unitCents * qty);

  return (
    <div className={styles.panel}>
      <div className={styles.priceRow}>
        <p className={styles.price}>{props.listPrice}</p>
        <p className={styles.priceMeta}>
          {props.perServing} per serving · founding members {props.foundingPrice}
        </p>
      </div>

      <div className={styles.plans} role="radiogroup" aria-label="Purchase plan">
        <button
          type="button"
          role="radio"
          aria-checked={plan === "sub"}
          className={styles.plan}
          onClick={() => setPlan("sub")}
        >
          <span className={styles.plan__name}>Subscribe &amp; save {props.discountPct}%</span>
          <span className={styles.plan__meta}>
            {props.subPrice} every {props.intervalDays} days · skip anytime
          </span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={plan === "once"}
          className={styles.plan}
          onClick={() => setPlan("once")}
        >
          <span className={styles.plan__name}>One-time</span>
          <span className={styles.plan__meta}>
            {props.oncePrice} · single {props.intervalDays}-day jar
          </span>
        </button>
      </div>

      <form action={addToBag} className={styles.buyRow}>
        <input type="hidden" name="sku" value={props.sku} />
        <input type="hidden" name="plan" value={plan} />
        <input type="hidden" name="qty" value={qty} />

        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepper__btn}
            onClick={() => setQty((current) => Math.max(current - 1, 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <IconMinus size={16} />
          </button>
          <output className={styles.stepper__value} aria-label="Quantity">
            {qty}
          </output>
          <button
            type="button"
            className={styles.stepper__btn}
            onClick={() => setQty((current) => Math.min(current + 1, props.maxQty))}
            disabled={qty >= props.maxQty}
            aria-label="Increase quantity"
          >
            <IconPlus size={16} />
          </button>
        </div>

        <button type="submit" className={`lu-btn ${styles.add}`}>
          Add to bag · {lineTotal}
        </button>
      </form>

      <p className={styles.terms}>{props.terms}</p>
    </div>
  );
}
