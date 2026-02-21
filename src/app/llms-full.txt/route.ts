import { NextResponse } from "next/server";
import { loadAllJobs } from "@/lib/jobs";

const BASE = "https://careers.abbababa.com";

export async function GET() {
  const jobs = loadAllJobs("en");

  const sections = [
    "# Abba Baba Careers — Full Content",
    "# Complete markdown content of all human job postings.",
    "# URL: https://careers.abbababa.com",
    "# Updated: 2026-02-21",
    "",
    "---",
    "",
    "## Platform Overview",
    "",
    "Abba Baba Careers is the job board for people who build, run, and govern AI agents. Engineering, operations, product, intelligence, safety, and economy roles — all with an agent-native application process.",
    "",
    "### How to Apply (Agent-Native Process)",
    "1. Build an agent on Abba Baba (any category)",
    "2. Message Agent ID cmlwggmn001un01l4a1mjkep0 with subject: Developer Application",
    "3. Include: your agent ID, what it does, why you want to build on Abba Baba",
    "4. Recruiting agent replies within minutes",
    "",
    "### Compensation",
    "- Currency: USDC",
    "- Range: $80,000–$180,000 annually",
    "- Equity included",
    "- Async-first, remote-first",
    "",
    "---",
    "",
    "## Job Postings",
    "",
  ];

  for (const job of jobs) {
    const url = `${BASE}/en/${job.category}/${job.subcategory ?? job.id}`;
    sections.push(`---`);
    sections.push(`### ${job.title}`);
    sections.push(`**URL**: ${url}`);
    sections.push(`**Category**: ${job.category}${job.subcategory ? ` / ${job.subcategory}` : ""}`);
    sections.push(`**Compensation**: ${job.compensation.range} ${job.compensation.currency} (${job.compensation.type})`);
    sections.push(`**Posted**: ${job.datePosted} | **Valid Through**: ${job.validThrough}`);
    sections.push(``);
    sections.push(job.description);
    sections.push(``);

    if (job.responsibilities.length) {
      sections.push(`#### Responsibilities`);
      for (const r of job.responsibilities) {
        sections.push(`- ${r}`);
      }
      sections.push(``);
    }

    if (job.requirements) {
      const req = job.requirements;
      sections.push(`#### Requirements`);
      if (req.skills?.length) {
        sections.push(`- Skills: ${req.skills.join(", ")}`);
      }
      if (req.experienceLevel) {
        sections.push(`- Experience: ${req.experienceLevel}`);
      }
      if (req.timezone) {
        sections.push(`- Timezone: ${req.timezone}`);
      }
      sections.push(``);
    }

    if (job.applicationProcess) {
      sections.push(job.applicationProcess);
      sections.push(``);
    }
  }

  return new NextResponse(sections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
