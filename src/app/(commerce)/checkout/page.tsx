import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { formatCents, getBagTotals } from "@/lib/bag";
import { resolveSiteMode } from "@/lib/mode";

import { BagLine, OrderSummary, SummaryNotes } from "../bag/BagParts";
import styles from "../bag/bag.module.css";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  // There is no checkout in waitlist mode, and an empty bag has nothing to pay for.
  // Both send you back to the bag rather than showing a form that cannot complete.
  if ((await resolveSiteMode()) !== "store") redirect("/bag");

  const totals = await getBagTotals();
  if (totals.lines.length === 0) redirect("/bag");

  return (
    <div className={`lu-container ${styles.page}`}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        <div className={styles.column}>
          <div className={styles.lines}>
            {totals.lines.map((line) => (
              <BagLine key={`${line.sku}-${line.plan}`} line={line} editable={false} />
            ))}
          </div>

          <CheckoutForm total={formatCents(totals.totalCents)} />
        </div>

        <div className={styles.summary}>
          <OrderSummary totals={totals} />
          <SummaryNotes />
        </div>
      </div>
    </div>
  );
}
