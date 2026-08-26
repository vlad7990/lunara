import Link from "next/link";

import { IconBag } from "@/components/Icon";
import { site, type SiteMode } from "@/lib/content";

import { NavLinks } from "./NavLinks";
import styles from "./Shell.module.css";

/**
 * The nav action is the one mode-dependent thing up here: "Join the list" in waitlist mode,
 * the bag in store mode. Both are decided on the server, so neither flashes.
 */
export function Nav({ mode, bagCount }: { mode: SiteMode; bagCount: number }) {
  const action = mode === "store" ? site.navAction.store : site.navAction.waitlist;

  return (
    <div className={styles.nav}>
      <Link href="/" className={styles.wordmark} aria-label={`${site.brand.name} — home`}>
        {site.brand.name}
      </Link>

      <NavLinks />

      <div className={styles.navAction}>
        {mode === "store" ? (
          <Link href={action.route} className="lu-btn lu-btn--nav">
            <IconBag size={14} />
            {action.label.replace("{count}", String(bagCount))}
          </Link>
        ) : (
          <Link href={action.route} className="lu-btn lu-btn--nav">
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
