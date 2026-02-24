import { NextResponse } from "next/server";
import { loadAllJobs } from "@/lib/jobs";

const BASE = "https://careers.abbababa.com";

export async function GET() {
  const jobs = loadAllJobs("en");

  const lines = [
    "# Abba Baba Careers — llms.txt",
    "# Human jobs at the Abba Baba agent economy platform.",
    "# Roles in engineering, operations, product, intelligence, safety, and economy. Compensation in USDC + equity.",
    "# Format: Title | URL | Summary",
    "",
    `> ${BASE}`,
    "> Open roles for engineers and builders working at the frontier of AI agent infrastructure.",
    "",
    "## Open Roles",
    "",
    ...jobs.map(
      (job) =>
        `- [${job.title}](${BASE}/en/${job.category}/${job.subcategory ?? job.id}): ${job.summary}`
    ),
    "",
    "## AEO Resources",
    "",
    `- [Full Content](${BASE}/llms-full.txt): Complete markdown content of all job postings`,
    `- [Agent Card](${BASE}/.well-known/agent.json): A2A Agent Card for this site`,
    `- [Sitemap](${BASE}/sitemap.xml): All pages × 7 languages`,
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
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
