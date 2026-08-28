"use client";

import { useState, type ReactNode } from "react";

import { spellCountCapital } from "@/lib/content";

import styles from "./shop.module.css";

/**
 * The shop filter is client-side only — a button per filter, no URL change, no refetch. The
 * cards themselves are rendered on the server (they carry prices and mode-dependent CTAs)
 * and passed in; this component only decides which of the two groups is on screen.
 */

type Filter = "all" | "formats" | "bundles";

/** The "all" note counts the shop, so it takes the same `totalCount` the chip is labelled with. */
const notesFor = (totalCount: number): Record<Filter, string> => ({
  all: `${spellCountCapital(totalCount)} ways to buy one formula.`,
  formats: "Same powder, same dose — pick where you take it.",
  bundles: "Both priced for the eight-to-twelve week test.",
});

export function ShopFilter({
  formatCards,
  bundleCards,
  totalCount,
}: {
  formatCards: ReactNode;
  bundleCards: ReactNode;
  totalCount: number;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const notes = notesFor(totalCount);

  const options: { id: Filter; label: string }[] = [
    { id: "all", label: `All · ${totalCount}` },
    { id: "formats", label: "Formats" },
    { id: "bundles", label: "Bundles & subscription" },
  ];

  return (
    <>
      <div className={`lu-container ${styles.filter}`}>
        <div className={styles.filter__buttons} role="group" aria-label="Filter products">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={styles.filter__btn}
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className={styles.filter__note} aria-live="polite">
          {notes[filter]}
        </p>
      </div>

      <div className={`lu-container ${styles.grid}`}>
        {filter === "bundles" ? null : formatCards}
        {filter === "formats" ? null : bundleCards}
      </div>
    </>
  );
}
