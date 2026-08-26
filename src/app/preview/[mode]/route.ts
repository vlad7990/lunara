import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { MODE_PREVIEW_COOKIE, modePreviewEnabled } from "@/lib/mode";

/**
 * Staging-only mode switch: `/preview/store`, `/preview/waitlist`.
 *
 * The Preview chips in the design references are a design affordance and are not shipped —
 * but a reviewer still needs to see both modes on one deployment. This sets the override
 * cookie the server reads, then bounces back to the page you came from.
 *
 * It is a 404 in production unless `LUNARA_ALLOW_MODE_PREVIEW=1` is set explicitly, so the
 * live site has exactly one mode and no visitor-facing way to change it.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mode: string }> },
) {
  if (!modePreviewEnabled()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { mode } = await params;
  if (mode !== "waitlist" && mode !== "store") {
    return new NextResponse("Unknown mode", { status: 400 });
  }

  (await cookies()).set(MODE_PREVIEW_COOKIE, mode, { path: "/", sameSite: "lax" });

  const back = request.nextUrl.searchParams.get("next") ?? "/";
  // Only ever bounce to a path on this site.
  const target = back.startsWith("/") && !back.startsWith("//") ? back : "/";

  return NextResponse.redirect(new URL(target, request.nextUrl.origin));
}
