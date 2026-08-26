"use client";

import { useState } from "react";

import { site } from "@/lib/content";

import styles from "../bag/bag.module.css";

/**
 * Checkout.
 *
 * The pay button is gated on the acknowledgement checkbox — 18 or older, not pregnant or
 * nursing, warnings read. That statement comes from `site.json → commerce.checkoutGate`, so
 * counsel can change the wording without anyone touching this file.
 *
 * The gate is enforced again on the server when the order is submitted; this is the
 * affordance, not the control.
 */
export function CheckoutForm({ total }: { total: string }) {
  const [acknowledged, setAcknowledged] = useState(false);

  const fields = [
    { name: "email", label: "Email", type: "email", autoComplete: "email", wide: true },
    { name: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
    { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
    {
      name: "address",
      label: "Address",
      type: "text",
      autoComplete: "street-address",
      wide: true,
    },
    { name: "city", label: "City", type: "text", autoComplete: "address-level2" },
  ];

  return (
    <section className={styles.checkout} aria-labelledby="checkout-title">
      <h2 id="checkout-title" className={styles.checkout__title}>
        Checkout
      </h2>

      <div className={styles.fields}>
        {fields.map((field) => (
          <div
            key={field.name}
            className={`${styles.field} ${field.wide ? styles["field--wide"] : ""}`}
          >
            <label htmlFor={`co-${field.name}`} className={styles.field__label}>
              {field.label}
            </label>
            <input
              id={`co-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              placeholder={field.type === "email" ? "you@email.com" : undefined}
              className={`lu-field ${styles.field__input}`}
            />
          </div>
        ))}

        <div className={styles.field__pair}>
          <div className={styles.field}>
            <label htmlFor="co-state" className={styles.field__label}>
              State
            </label>
            <input
              id="co-state"
              name="state"
              type="text"
              autoComplete="address-level1"
              required
              className={`lu-field ${styles.field__input}`}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="co-zip" className={styles.field__label}>
              ZIP
            </label>
            <input
              id="co-zip"
              name="zip"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              className={`lu-field ${styles.field__input}`}
            />
          </div>
        </div>
      </div>

      <div className={styles.ack}>
        <p className={styles.ack__label}>Required before purchase</p>
        <label className={styles.ack__row}>
          <input
            type="checkbox"
            name="acknowledged"
            className={styles.ack__box}
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
          />
          <span className={styles.ack__text}>{site.commerce.checkoutGate.text}</span>
        </label>
      </div>

      <button type="submit" className={`lu-btn ${styles.pay}`} disabled={!acknowledged}>
        Pay {total}
      </button>

      <p className={styles.terms}>
        By paying you agree to our <a href="/terms">terms</a> and, for subscriptions, to a
        recurring charge you can cancel from any email in one click.
      </p>
    </section>
  );
}
