import type { Metadata } from "next";
import { Cormorant_Garamond, Inter_Tight } from "next/font/google";

import { AnnouncementBar } from "@/components/shell/AnnouncementBar";
import { CookieBar } from "@/components/shell/CookieBar";
import { Nav } from "@/components/shell/Nav";
import { getBagCount } from "@/lib/bag";
import { readConsent } from "@/lib/consent";
import { product, site } from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import styles from "@/components/shell/Shell.module.css";
import "./globals.css";

/**
 * Display: Cormorant Garamond. Body: Inter Tight. Doses and prices are set in the display
 * serif and labels in the sans — that inversion is the brand's signature.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lunara.co"),
  title: {
    default: `${site.brand.name} — ${product.subtitle}`,
    template: `%s · ${site.brand.name}`,
  },
  description:
    "Every milligram named. No proprietary blends, no undisclosed complexes, and a lab report for every lot at a URL printed on the box.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [mode, bagCount, consent] = await Promise.all([
    resolveSiteMode(),
    getBagCount(),
    readConsent(),
  ]);

  return (
    <html lang="en" className={`${cormorant.variable} ${interTight.variable}`}>
      <body>
        <a href="#main" className="lu-skip-link">
          Skip to content
        </a>

        <div className={styles.header}>
          <AnnouncementBar mode={mode} />
          <Nav mode={mode} bagCount={mode === "store" ? bagCount : 0} />
        </div>

        {children}

        {consent === null ? <CookieBar /> : null}
      </body>
    </html>
  );
}
