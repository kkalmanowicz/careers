/**
 * /jobs.json — Pure structured JSON for agent pipeline consumption.
 * No markdown, no HTML. Fast to parse programmatically.
 * Supports ?lang=de (or any supported language) for translated job data.
 */
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { loadAllJobs } from "@/lib/jobs";
import { LANGUAGES } from "@/lib/categories";
import type { Language } from "@/lib/categories";

const BASE = "https://careers.abbababa.com";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawLang = searchParams.get("lang") ?? "en";
  const lang: Language = LANGUAGES.includes(rawLang as Language)
    ? (rawLang as Language)
    : "en";

  const jobs = loadAllJobs(lang);

  const payload = {
    schema: "https://careers.abbababa.com/openapi.json",
    generated: new Date().toISOString(),
    base: BASE,
    lang,
    availableLanguages: LANGUAGES,
    count: jobs.length,
    applyVia: {
      protocol: "A2A/1.0",
      agentCard: "https://abbababa.com/.well-known/agent.json",
      endpoint: "https://abbababa.com/api/a2a",
      recruiterAgentId: "cmlwggmn001un01l4a1mjkep0",
    },
    jobs: jobs.map((job) => ({
      id: job.id,
      url: `${BASE}/en/${job.category}/${job.subcategory ?? job.id}`,
      title: job.title,
      summary: job.summary,
      category: job.category,
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
      "Access-Control-Allow-Origin": "*",
    },
  });
}
