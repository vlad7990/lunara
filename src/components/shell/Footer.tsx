import Link from "next/link";

import { FdaDisclaimer } from "@/components/compliance";
import { compliance, footerGroups, product, site } from "@/lib/content";

import styles from "./Shell.module.css";

/**
 * Footer link labels live in `site.json`; the routes they resolve to live here, because a
 * route is an implementation fact and not copy. Labels with no page yet render as plain
 * text rather than as a link to nowhere.
 */
const ROUTES: Record<string, string> = {
  Shop: "/shop",
  "Crave Balance": "/crave-balance",
  "Open formula": "/open-formula",
  "Batch COAs": "/lot",
  FAQ: "/faq",
  About: "/about",
  Contact: `mailto:${site.brand.email}`,
  Terms: "/terms",
  "Privacy · CCPA": "/privacy",
  "Shipping & returns": "/shipping",
  Accessibility: "/accessibility",
  "Your privacy choices": "/privacy#your-privacy-choices",
  "Do not sell or share": "/privacy#do-not-sell-or-share",
};

const LEGAL_LINKS = ["Terms", "Privacy · CCPA", "Shipping & returns", "Accessibility"];

/**
 * The age, pregnancy and physician warnings run alongside the copyright. They are quoted
 * from `compliance.json` rather than condensed by hand — a shortened warning is a new
 * warning, and this one has not been reviewed in that form.
 */
function warningLine(): string {
  return compliance.warningSet.slice(0, 3).join(" ");
}

export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={styles.footer}>
      <div
        className={[
          "lu-container",
          styles.footer__inner,
          compact ? styles["footer__inner--compact"] : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {compact ? null : (
          <div className={styles.footer__top}>
            <div className={styles.footer__brand}>
              <span className={styles.footer__wordmark}>{site.brand.name}</span>
              <p className={styles.footer__tagline}>{product.subtitle}, published in full.</p>
            </div>

            <div className={styles.footer__groups}>
              {footerGroups.map((group) => (
                <div key={group.heading} className={styles.footer__group}>
                  <h2 className={styles.footer__heading}>{group.heading}</h2>
                  {group.links.map((label) => {
                    const href = ROUTES[label];
                    if (!href) return <span key={label}>{label}</span>;
                    return (
                      <Link key={label} href={href} className={styles.footer__link}>
                        {label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.footer__legal}>
          <FdaDisclaimer withPreLaunch />
          <p className={styles.footer__legalLine}>
            {warningLine()} {site.brand.copyright}.
          </p>
          {compact ? (
            <p className={styles.footer__legalLine}>
              {LEGAL_LINKS.map((label, index) => (
                <span key={label}>
                  {index > 0 ? " · " : null}
                  <Link href={ROUTES[label]}>{label}</Link>
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
