import "server-only";

import { cookies } from "next/headers";

import type { SiteMode } from "./content";

export type { SiteMode };

/**
 * One flag runs the whole site.
 *
 * `SITE_MODE` is resolved server-side, per request. Waitlist is the default. It changes only
 * the commerce surfaces — nav action, announcement bar, home block 3, product buy panel,
 * `/bag`, shop CTAs and the FAQ ordering group. Everything else is byte-identical.
 *
 * It is never resolved in the client: a commerce surface that flashes the wrong state is the
 * one bug this flag exists to prevent.
 */

const DEFAULT_MODE: SiteMode = "waitlist";

/** The staging override cookie. Never read in the browser, never set in production. */
export const MODE_PREVIEW_COOKIE = "lunara.mode";

function isSiteMode(value: string | undefined): value is SiteMode {
  return value === "waitlist" || value === "store";
}

/**
 * Preview lets a reviewer see both modes on one deployment. It is off in production unless
 * `LUNARA_ALLOW_MODE_PREVIEW` is explicitly set, so the shipped site has exactly one mode.
 */
export function modePreviewEnabled(): boolean {
  if (process.env.LUNARA_ALLOW_MODE_PREVIEW === "1") return true;
  return process.env.NODE_ENV !== "production";
}

/** The configured mode, ignoring any preview override. This is what the site actually is. */
export function configuredSiteMode(): SiteMode {
  const fromEnv = process.env.SITE_MODE;
  return isSiteMode(fromEnv) ? fromEnv : DEFAULT_MODE;
}

export async function resolveSiteMode(): Promise<SiteMode> {
  if (modePreviewEnabled()) {
    const override = (await cookies()).get(MODE_PREVIEW_COOKIE)?.value;
    if (isSiteMode(override)) return override;
  }
  return configuredSiteMode();
}

export async function isStoreMode(): Promise<boolean> {
  return (await resolveSiteMode()) === "store";
}
