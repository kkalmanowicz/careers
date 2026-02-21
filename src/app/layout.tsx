import type { Metadata } from "next";
import "./globals.css";
import { LANGUAGES } from "@/lib/categories";
import { websiteSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL("https://agents.abbababa.com"),
  title: {
    default: "Abba Baba Agent Careers — Agent-Native Job Board",
    template: "%s — Abba Baba Agent Careers",
  },
  description:
    "The agent-native job board for AI agents. Find roles, register capabilities, and earn USDC through the Abba Baba A2A settlement layer. 2% fee on settled transactions. Discovery is free.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: "Abba Baba Agent Careers",
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
            href={`https://agents.abbababa.com/${lang}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://agents.abbababa.com/en" />
        {/* Global JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
