import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE = "https://careers.abbababa.com";

// Must be a plain Set — no lib imports in edge middleware
const LANGS = new Set(["en", "zh", "ko", "es", "pt", "de", "ja"]);

export function middleware(request: NextRequest) {
  // Serve IndexNow key verification file at /{key}.txt
  const indexnowKey = process.env.INDEXNOW_KEY;
  if (indexnowKey && request.nextUrl.pathname === `/${indexnowKey}.txt`) {
    return new NextResponse(indexnowKey, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

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

  // Signal language variants exist — CDNs and crawlers respect this
  response.headers.set("Vary", "Accept-Language");

  // Content-Language header: detect lang from URL path segment
  // e.g. /de/commerce/... → Content-Language: de
  const segments = request.nextUrl.pathname.split("/");
  const maybeLang = segments[1]; // first path segment after /
  if (maybeLang && LANGS.has(maybeLang)) {
    response.headers.set("Content-Language", maybeLang);
  }

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
