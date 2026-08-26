import "server-only";

import type { Mailer, OutboundEmail, SendResult } from "./types";

/**
 * Resend, over its REST API.
 *
 * Called with `fetch` rather than the SDK so no dependency sits in `package.json` for a
 * provider that is not provisioned yet. Swap in the SDK freely — nothing above the `Mailer`
 * interface knows or cares.
 *
 * Activates as soon as `RESEND_API_KEY` and `EMAIL_FROM` are present. Until then
 * `configured` is false and the site says so rather than promising an email it cannot send.
 */

const ENDPOINT = "https://api.resend.com/emails";

export function createResendMailer(apiKey: string, from: string): Mailer {
  return {
    configured: true,

    async send(message: OutboundEmail): Promise<SendResult> {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };

      const body: Record<string, unknown> = {
        from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      };

      // Gmail and Yahoo require a one-click unsubscribe on bulk mail, and it is the right
      // thing regardless: "Unsubscribe from any email" is a promise the signup form makes.
      if (message.unsubscribeUrl) {
        body.headers = {
          "List-Unsubscribe": `<${message.unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        };
      }

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        return {
          sent: false,
          reason: `Resend responded ${response.status}: ${detail.slice(0, 200)}`,
        };
      }

      const payload = (await response.json().catch(() => ({}))) as { id?: string };
      return { sent: true, id: payload.id };
    },
  };
}
