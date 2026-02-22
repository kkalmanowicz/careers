import type { Metadata } from "next";
import "./globals.css";
import { LANGUAGES } from "@/lib/categories";
import { websiteSchema } from "@/lib/structured-data";
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
  const schema = websiteSchema();

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
        <link rel="alternate" type="application/rss+xml" title="Abba Baba Careers RSS" href="https://careers.abbababa.com/feed.xml" />
        <link rel="alternate" type="application/atom+xml" title="Abba Baba Careers Atom" href="https://careers.abbababa.com/feed.atom" />
        <link rel="alternate" type="application/json" title="Abba Baba Careers JSON" href="https://careers.abbababa.com/jobs.json" />
        {/* Global JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
