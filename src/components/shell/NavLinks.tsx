"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { nav } from "@/lib/content";

import styles from "./Shell.module.css";

/**
 * The centre links, in the order `site.json` lists them — the whole list, in both modes.
 * Only the active-page marker needs the client.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.navLinks} aria-label="Primary">
      {nav.map((link) => {
        const active = pathname === link.route || pathname.startsWith(`${link.route}/`);
        return (
          <Link
            key={link.route}
            href={link.route}
            className={styles.navLink}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
