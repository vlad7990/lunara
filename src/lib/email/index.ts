import "server-only";

import { createResendMailer } from "./resend";
import type { Mailer, OutboundEmail, SendResult } from "./types";

export type { Mailer, OutboundEmail, SendResult } from "./types";

/**
 * Outbound email.
 *
 * No provider is provisioned yet — sending needs a domain we own, and `lunara.co` is not on
 * the account. Until `RESEND_API_KEY` and `EMAIL_FROM` are set this is a mailer that reports
 * `configured: false` and sends nothing.
 *
 * That flag is not decoration. The signup confirmation reads it and does not promise an
 * inbox it cannot deliver to.
 */

/** Logs what would have been sent, so the flow is inspectable before a provider exists. */
function createInertMailer(): Mailer {
  return {
    configured: false,

    async send(message: OutboundEmail): Promise<SendResult> {
      if (process.env.NODE_ENV !== "production") {
        console.info(
          `[lunara] Email not configured — would have sent "${message.subject}" to ${message.to}`,
        );
      }
      return { sent: false, reason: "No email provider configured." };
    },
  };
}

function selectMailer(): Mailer {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (apiKey && from) return createResendMailer(apiKey, from);
  return createInertMailer();
}

export const mailer: Mailer = selectMailer();

/** The absolute origin, used for links inside emails. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
