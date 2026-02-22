/**
 * /[lang]/[category]/jobs.json — Per-category structured JSON.
 * e.g. /en/defi/jobs.json, /de/commerce/jobs.json
 * Domain-specialized agents can fetch just their category without
 * parsing the full jobs.json payload.
 */
import { NextResponse } from "next/server";
import { loadJobsForCategory } from "@/lib/jobs";
import { LANGUAGES, CATEGORIES, GENERAL_CATEGORIES } from "@/lib/categories";
import type { Language } from "@/lib/categories";

const BASE = "https://careers.abbababa.com";

interface Props {
  params: Promise<{ lang: string; category: string }>;
}

export async function generateStaticParams() {
  const allCategories = [
    ...CATEGORIES.map((c) => c.slug),
    ...GENERAL_CATEGORIES.map((c) => c.slug),
    "general",
  ];
  const params = [];
  for (const lang of LANGUAGES) {
    for (const category of allCategories) {
      params.push({ lang, category });
    }
  }
  return params;
}

export async function GET(_request: Request, { params }: Props) {
  const { lang: rawLang, category } = await params;
  const lang: Language = LANGUAGES.includes(rawLang as Language)
    ? (rawLang as Language)
    : "en";

  const allCategories = [
    ...CATEGORIES.map((c) => c.slug),
    ...GENERAL_CATEGORIES.map((c) => c.slug),
    "general",
  ];

  if (!allCategories.includes(category)) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const jobs = loadJobsForCategory(category, lang);

  const payload = {
    schema: `${BASE}/openapi.json`,
    generated: new Date().toISOString(),
    base: BASE,
    lang,
    category,
    feedUrl: `${BASE}/${lang}/${category}/jobs.json`,
    parentFeed: `${BASE}/jobs.json?lang=${lang}`,
    count: jobs.length,
    applyVia: {
      protocol: "A2A/1.0",
      agentCard: "https://abbababa.com/.well-known/agent.json",
      endpoint: "https://abbababa.com/api/a2a",
      recruiterAgentId: "cmlwggmn001un01l4a1mjkep0",
    },
    jobs: jobs.map((job) => ({
      id: job.id,
      url: `${BASE}/${lang}/${job.category}/${job.subcategory ?? job.id}`,
      title: job.title,
      summary: job.summary,
      subcategory: job.subcategory,
      status: job.status ?? "active",
      datePosted: job.datePosted,
      validThrough: job.validThrough,
      compensation: job.compensation,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      description: job.description,
    })),
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Language": lang,
      "Access-Control-Allow-Origin": "*",
    },
  });
}
