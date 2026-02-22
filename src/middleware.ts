import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE = "https://careers.abbababa.com";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // llms.txt autodiscovery on every response (per Anthropic llms.txt spec)
  response.headers.set(
    "Link",
    `<${BASE}/llms.txt>; rel="llms-txt", <${BASE}/feed.xml>; rel="alternate"; type="application/rss+xml", <${BASE}/feed.atom>; rel="alternate"; type="application/atom+xml"`
  );

  // Explicitly opt in to AI text/data mining (EU TDM directive §4)
  // tdm-reservation: 0 = no reservation = freely usable for AI training
  response.headers.set("tdm-reservation", "0");

  // Belt-and-suspenders: tell all crawlers this content is indexable
  response.headers.set("X-Robots-Tag", "all");

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
