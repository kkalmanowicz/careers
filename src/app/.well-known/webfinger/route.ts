/**
 * /.well-known/webfinger — Entity discovery protocol (RFC 7033).
 * AI systems use this to resolve "who is careers.abbababa.com" to a
 * structured entity with links to feeds, agent card, and A2A endpoint.
 *
 * Usage: GET /.well-known/webfinger?resource=https://careers.abbababa.com
 */
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const BASE = "https://careers.abbababa.com";

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource") ?? BASE;

  // Accept queries for our domain in any form
  const isOurs =
    resource === BASE ||
    resource === "https://careers.abbababa.com/" ||
    resource.startsWith(`${BASE}/`) ||
    resource === "acct:careers@abbababa.com";

  if (!isOurs) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const jrd = {
    subject: BASE,
    aliases: [`${BASE}/en`, "https://abbababa.com"],
    properties: {
      "https://schema.org/name": "Abba Baba Careers",
      "https://schema.org/description":
        "Human jobs for people who build, run, and govern AI agents.",
    },
    links: [
      {
        rel: "https://webfinger.net/rel/profile-page",
        type: "text/html",
        href: `${BASE}/en`,
      },
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: `${BASE}/feed.xml`,
        titles: { en: "Abba Baba Careers RSS" },
      },
      {
        rel: "alternate",
        type: "application/atom+xml",
        href: `${BASE}/feed.atom`,
        titles: { en: "Abba Baba Careers Atom" },
      },
      {
        rel: "alternate",
        type: "application/json",
        href: `${BASE}/jobs.json`,
        titles: { en: "Structured Job Data" },
      },
      {
        rel: "https://llmstxt.org/rel/llms-txt",
        type: "text/plain",
        href: `${BASE}/llms.txt`,
        titles: { en: "LLM Index (Anthropic llms.txt)" },
      },
      {
        rel: "https://schema.org/agent",
        type: "application/json",
        href: "https://abbababa.com/.well-known/agent.json",
        titles: { en: "A2A Agent Card" },
      },
      {
        rel: "https://schema.org/potentialAction",
        type: "application/json",
        href: `${BASE}/openapi.json`,
        titles: { en: "OpenAPI Spec" },
      },
    ],
  };

  return NextResponse.json(jrd, {
    headers: {
      "Content-Type": "application/jrd+json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
