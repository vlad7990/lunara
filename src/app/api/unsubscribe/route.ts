import { NextResponse, type NextRequest } from "next/server";

import { isValidEmail, waitlist } from "@/lib/waitlist";

/**
 * One-click unsubscribe (RFC 8058).
 *
 * Gmail and Yahoo POST here directly from their own UI when the `List-Unsubscribe-Post`
 * header is present, with no human on the other end — so this acts immediately and returns
 * plain 200, rather than rendering a confirmation page nobody will see.
 *
 * The human-facing page at `/unsubscribe` handles the GET.
 */
export async function POST(request: NextRequest) {
  const email =
    request.nextUrl.searchParams.get("email") ??
    (await request.formData().catch(() => null))?.get("email")?.toString() ??
    "";

  if (isValidEmail(email)) {
    try {
      await waitlist.unsubscribe(email);
    } catch (error) {
      console.error("[lunara] One-click unsubscribe failed:", error);
      return new NextResponse("Could not process that right now.", { status: 500 });
    }
  }

  // Always 200 for a well-formed request: whether the address was on the list is not
  // something an unauthenticated caller gets to learn.
  return new NextResponse("Unsubscribed.", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

/** A GET here is a mail scanner following the header. Send it to the page, unsubscribing nobody. */
export function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const target = email
    ? `/unsubscribe?email=${encodeURIComponent(email)}`
    : "/unsubscribe";
  return NextResponse.redirect(new URL(target, request.nextUrl.origin));
}
