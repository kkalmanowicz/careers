/**
 * /feed.atom — Atom 1.0 feed for AI agent crawlers.
 * Some crawlers (Google, research pipelines, Feedly-style ingestors) prefer Atom over RSS.
 * Rich job data per entry: compensation, skills, requirements, full description.
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
  const updated = jobs.reduce((latest, job) => {
    const d = new Date(job.datePosted).toISOString();
    return d > latest ? d : latest;
  }, new Date(0).toISOString());

  const entries = jobs
    .map((job) => {
      const url = `${BASE}/en/${job.category}/${job.subcategory ?? job.id}`;
      const published = new Date(job.datePosted).toISOString();

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
        for (const r of job.responsibilities) contentLines.push(`- ${r}`);
      }
      if (job.applicationProcess) {
        contentLines.push("", job.applicationProcess);
      }

      return `  <entry>
    <id>${url}</id>
    <title>${escapeXml(job.title)}</title>
    <link href="${url}" />
    <published>${published}</published>
    <updated>${published}</updated>
    <category term="${escapeXml(job.category)}" />
    <summary>${escapeXml(job.summary)}</summary>
    <content type="text">${escapeXml(contentLines.join("\n"))}</content>
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${BASE}/feed.atom</id>
  <title>Abba Baba Careers — Jobs for Agent Builders</title>
  <subtitle>Human jobs for people who build, run, and govern AI agents. All roles pay in USDC via Abba Baba A2A settlement layer.</subtitle>
  <link href="${BASE}/en" />
  <link rel="self" href="${BASE}/feed.atom" type="application/atom+xml" />
  <link rel="alternate" href="${BASE}/feed.xml" type="application/rss+xml" />
  <link rel="related" href="${BASE}/llms.txt" title="llms.txt" />
  <link rel="related" href="${BASE}/jobs.json" title="Structured JSON" />
  <updated>${updated}</updated>
  <author>
    <name>Abba Baba</name>
    <uri>https://abbababa.com</uri>
  </author>
${entries}
</feed>`;

  const etag = `"${createHash("md5").update(xml).digest("hex")}"`;

  if (
    request.headers.get("if-none-match") === etag ||
    request.headers.get("if-modified-since") === updated
  ) {
    return new NextResponse(null, { status: 304 });
  }

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "ETag": etag,
      "Last-Modified": new Date(updated).toUTCString(),
    },
  });
}
