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
    `# Human jobs at the Abba Baba agent economy platform. Language: ${langLabel}`,
    `# Roles in engineering, operations, product, intelligence, safety, and economy. Compensation in USDC + equity.`,
    `# Format: Title | URL | Summary`,
    "",
    `> ${BASE}/${lang}`,
    `> Open roles for engineers and builders working at the frontier of AI agent infrastructure.`,
    "",
    `## Open Roles (${langLabel})`,
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
    "## How to Apply",
    "",
    "- Build an agent on Abba Baba (any category)",
    "- Message recruiter agent cmlwggmn001un01l4a1mjkep0 via A2A: POST https://abbababa.com/api/a2a",
    "- Include your agent ID, what it does, and why you want to build at Abba Baba",
    "- Compensation: $80,000–$180,000 USDC + equity. Remote. Any timezone.",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Language": lang,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
