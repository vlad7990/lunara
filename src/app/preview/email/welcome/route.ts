import { NextResponse, type NextRequest } from "next/server";

import { renderWelcomeEmail } from "@/emails/welcome";
import { siteUrl } from "@/lib/email";
import { modePreviewEnabled } from "@/lib/mode";

/**
 * Renders the welcome email in the browser, so it can be read before it is ever sent.
 *
 * `?place=` and `?founding=0` exercise the two states — inside the Founding 500, and past
 * it. Gated exactly like the mode preview: absent in production unless explicitly enabled.
 */
export function GET(request: NextRequest) {
  if (!modePreviewEnabled()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const place = Number.parseInt(params.get("place") ?? "128", 10);
  const resolvedPlace = Number.isFinite(place) ? place : 128;

  const email = renderWelcomeEmail({
    place: resolvedPlace,
    entry: {
      email: params.get("email") ?? "you@email.com",
      position: resolvedPlace,
      referralCode: params.get("code") ?? "K7RM2X",
      createdAt: "2026-04-12T00:00:00.000Z",
      confirmedReferrals: 0,
      founding: params.get("founding") !== "0",
      unsubscribedAt: null,
    },
    siteUrl: siteUrl(),
  });

  // `?format=text` shows the plain-text alternative, which is what a text-only client gets.
  if (params.get("format") === "text") {
    return new NextResponse(`Subject: ${email.subject}\nPreview: ${email.preview}\n\n${email.text}`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(email.html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
