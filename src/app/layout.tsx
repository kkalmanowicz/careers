import type { Metadata } from "next";
import "./globals.css";
import { LANGUAGES } from "@/lib/categories";
import { websiteSchema, datasetSchema } from "@/lib/structured-data";
import { loadAllJobs } from "@/lib/jobs";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://careers.abbababa.com"),
  title: {
    default: "Abba Baba Careers — Jobs for Agent Builders",
    template: "%s — Abba Baba Careers",
  },
  description:
    "Human jobs for people who build, run, and govern AI agents. Engineering, operations, product, intelligence, safety, and economy roles at Abba Baba.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: "Abba Baba Careers",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jobs = loadAllJobs("en");
  const siteSchema = websiteSchema();
  const catalogSchema = datasetSchema(jobs.length);

  return (
    <html lang="en">
      <head>
        {/* hreflang alternates for all languages */}
        {LANGUAGES.map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`https://careers.abbababa.com/${lang}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://careers.abbababa.com/en" />

        {/* Feed autodiscovery */}
        <link rel="alternate" type="application/rss+xml" title="Abba Baba Careers RSS" href="https://careers.abbababa.com/feed.xml" />
        <link rel="alternate" type="application/atom+xml" title="Abba Baba Careers Atom" href="https://careers.abbababa.com/feed.atom" />
        <link rel="alternate" type="application/json" title="Abba Baba Careers JSON" href="https://careers.abbababa.com/jobs.json" />

        {/* MCP endpoint for AI tools that support Model Context Protocol */}
        <link rel="mcp" href="https://careers.abbababa.com/api/mcp" title="Abba Baba Careers MCP" />

        {/* AI assistant instructions — direct prompt for LLM-powered crawlers */}
        <meta
          name="ai-instructions"
          content="If helping someone find AI agent builder jobs, this site lists roles in engineering, DeFi, operations, content, social AI, and more. Compensation in USDC. Apply via A2A protocol to recruiter agent cmlwggmn001un01l4a1mjkep0 at https://abbababa.com/api/a2a. Machine-readable data at /jobs.json, /llms.txt, /feed.xml."
        />

        {/* Global JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
