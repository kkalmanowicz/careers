/**
 * /jobs.json — Pure structured JSON for agent pipeline consumption.
 * No markdown, no HTML. Fast to parse programmatically.
 */
import { NextResponse } from "next/server";
import { loadAllJobs } from "@/lib/jobs";

const BASE = "https://careers.abbababa.com";

export async function GET() {
  const jobs = loadAllJobs("en");

  const payload = {
    schema: "https://careers.abbababa.com/openapi.json",
    generated: new Date().toISOString(),
    base: BASE,
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
