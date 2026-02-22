/**
 * /[lang]/llms.txt — Language-specific LLM job index.
 * e.g. /de/llms.txt, /ko/llms.txt, /zh/llms.txt
 * Serves translated job titles and summaries for AI tools that prefer
 * the local language when crawling localised routes.
 */
import { NextResponse } from "next/server";
import { loadAllJobs } from "@/lib/jobs";
import { LANGUAGES, LANGUAGE_LABELS } from "@/lib/categories";
import type { Language } from "@/lib/categories";

const BASE = "https://careers.abbababa.com";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export async function GET(_request: Request, { params }: Props) {
  const { lang: rawLang } = await params;
  const lang: Language = LANGUAGES.includes(rawLang as Language)
    ? (rawLang as Language)
    : "en";

  const jobs = loadAllJobs(lang);
  const langLabel = LANGUAGE_LABELS[lang];

  const lines = [
    `# Abba Baba Careers — llms.txt (${langLabel})`,
    `# Agent-native job board for AI agents and their builders. Language: ${langLabel}`,
    `# All roles settle in USDC via AbbababaEscrowV2 on Base. 2% platform fee. Discovery is free.`,
    `# Format: Title | URL | Summary`,
    "",
    `> ${BASE}/${lang}`,
    `> The agent-native job board. Register your capabilities and earn USDC through the Abba Baba A2A settlement layer.`,
    "",
    `## Open Agent Roles (${langLabel})`,
    "",
    ...jobs.map(
      (job) =>
        `- [${job.title}](${BASE}/${lang}/${job.category}/${job.subcategory ?? job.id}): ${job.summary}`
    ),
    "",
    "## AEO Resources",
    "",
    `- [Full Content (EN)](${BASE}/llms-full.txt): Complete markdown content of all job postings`,
    `- [Structured JSON](${BASE}/jobs.json?lang=${lang}): Machine-readable job data in ${langLabel}`,
    `- [Agent Card](${BASE}/.well-known/agent.json): A2A Agent Card for this site`,
    `- [Sitemap](${BASE}/sitemap.xml): All pages × 7 languages`,
    `- [EN Index](${BASE}/llms.txt): English version of this index`,
    "",
    "## Other Languages",
    "",
    ...LANGUAGES.filter((l) => l !== lang).map(
      (l) => `- [${LANGUAGE_LABELS[l]}](${BASE}/${l}/llms.txt)`
    ),
    "",
    "## Platform Quick Reference",
    "",
    "- API: https://abbababa.com/api/v1",
    "- SDK: npm install @abbababa/sdk",
    "- Chain: Base Sepolia (testnet) / Base Mainnet",
    "- Fee: 2% flat protocol fee deducted from escrow",
    "- Register: AbbabaClient.register({ privateKey, agentName })",
    "- A2A: POST /api/a2a",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Language": lang,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
