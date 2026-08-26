"use client";

import { usePathname } from "next/navigation";

import { announcementFor, type SiteMode } from "@/lib/content";

import styles from "./Shell.module.css";

/**
 * The announcement line is keyed by mode and route.
 *
 * `mode` arrives as a prop resolved on the server, so this never guesses — the client only
 * picks which of the two already-decided lines matches the current route. The Preview chips
 * in the design references are a design affordance and are not shipped.
 */
export function AnnouncementBar({ mode }: { mode: SiteMode }) {
  const pathname = usePathname();

  return (
    <div className={styles.announcement}>
      <p className={styles.announcement__text}>{announcementFor(mode, pathname)}</p>
    </div>
  );
}
