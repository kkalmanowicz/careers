/**
 * /feed.xml — RSS 2.0 feed for AI agent crawlers
 * Rich job data per item: compensation, skills, requirements, full description.
 * Mirrors llms-full.txt content in a structured, autodiscoverable format.
 */
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { loadAllJobs } from "@/lib/jobs";

const BASE = "https://careers.abbababa.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: NextRequest) {
  const jobs = loadAllJobs("en");

  const items = jobs
    .map((job) => {
      const url = `${BASE}/en/${job.category}/${job.subcategory ?? job.id}`;
      const pubDate = new Date(job.datePosted).toUTCString();

      // Build rich markdown content for AI agent consumption
      const contentLines = [
        job.description,
        "",
        `**Compensation**: ${job.compensation.range} ${job.compensation.currency} (${job.compensation.type})`,
        `**Category**: ${job.category}${job.subcategory ? ` / ${job.subcategory}` : ""}`,
        `**Valid Through**: ${job.validThrough}`,
        `**Experience**: ${job.requirements.experienceLevel}`,
      ];

      if (job.requirements.skills?.length) {
        contentLines.push(`**Skills**: ${job.requirements.skills.join(", ")}`);
      }
      if (job.requirements.timezone) {
        contentLines.push(`**Timezone**: ${job.requirements.timezone}`);
      }
      if (job.responsibilities.length) {
        contentLines.push("", "**Responsibilities**:");
        for (const r of job.responsibilities) {
          contentLines.push(`- ${r}`);
        }
      }
      if (job.applicationProcess) {
        contentLines.push("", job.applicationProcess);
      }

      const content = escapeXml(contentLines.join("\n"));

      return `    <item>
      <title>${escapeXml(job.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${content}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(job.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Abba Baba Careers — Jobs for Agent Builders</title>
    <link>${BASE}/en</link>
    <description>Human jobs for people who build, run, and govern AI agents. All roles pay in USDC. Agent-native application process via Abba Baba A2A settlement layer.</description>
    <language>en</language>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <docs>https://careers.abbababa.com/llms.txt</docs>
    <ttl>1440</ttl>
${items}
  </channel>
</rss>`;

  const etag = `"${createHash("md5").update(xml).digest("hex")}"`;
  const lastModified = new Date(
    Math.max(...jobs.map((j) => new Date(j.datePosted).getTime()))
  ).toUTCString();

  // Conditional GET support — crawlers can check if content changed cheaply
  if (
    request.headers.get("if-none-match") === etag ||
    request.headers.get("if-modified-since") === lastModified
  ) {
    return new NextResponse(null, { status: 304 });
  }

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "ETag": etag,
      "Last-Modified": lastModified,
    },
  });
}
