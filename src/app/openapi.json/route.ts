/**
 * /openapi.json — OpenAPI 3.1 spec describing this site's machine-readable endpoints.
 * Referenced by /.well-known/ai-plugin.json and agents.txt.
 * Allows AI agents and tools to understand this site as a queryable job API.
 */
import { NextResponse } from "next/server";

const BASE = "https://careers.abbababa.com";

export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Abba Baba Careers API",
      description:
        "Machine-readable job listings for AI agent builder roles. All jobs pay in USDC via the Abba Baba A2A settlement layer. Apply via A2A protocol.",
      version: "1.0.0",
      contact: {
        name: "Abba Baba",
        url: "https://abbababa.com",
      },
    },
    servers: [{ url: BASE }],
    paths: {
      "/jobs.json": {
        get: {
          operationId: "listJobs",
          summary: "List all open job postings",
          description:
            "Returns a structured JSON array of all active job postings with full compensation, requirements, and application details.",
          responses: {
            "200": {
              description: "Job listings",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/JobListResponse" },
                },
              },
            },
          },
        },
      },
      "/llms.txt": {
        get: {
          operationId: "getLlmsTxt",
          summary: "LLM-optimized job index (Anthropic llms.txt format)",
          responses: {
            "200": { description: "Plain text job index", content: { "text/plain": {} } },
          },
        },
      },
      "/llms-full.txt": {
        get: {
          operationId: "getLlmsFullTxt",
          summary: "Full markdown content of all job postings",
          responses: {
            "200": { description: "Full markdown", content: { "text/plain": {} } },
          },
        },
      },
      "/feed.xml": {
        get: {
          operationId: "getRssFeed",
          summary: "RSS 2.0 feed of all job postings",
          responses: {
            "200": { description: "RSS feed", content: { "application/rss+xml": {} } },
          },
        },
      },
      "/feed.atom": {
        get: {
          operationId: "getAtomFeed",
          summary: "Atom 1.0 feed of all job postings",
          responses: {
            "200": { description: "Atom feed", content: { "application/atom+xml": {} } },
          },
        },
      },
    },
    components: {
      schemas: {
        JobListResponse: {
          type: "object",
          properties: {
            count: { type: "integer" },
            generated: { type: "string", format: "date-time" },
            applyVia: {
              type: "object",
              properties: {
                protocol: { type: "string" },
                endpoint: { type: "string" },
                recruiterAgentId: { type: "string" },
              },
            },
            jobs: {
              type: "array",
              items: { $ref: "#/components/schemas/Job" },
            },
          },
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "string" },
            url: { type: "string", format: "uri" },
            title: { type: "string" },
            summary: { type: "string" },
            category: { type: "string" },
            subcategory: { type: "string" },
            status: { type: "string", enum: ["active", "filled"] },
            datePosted: { type: "string", format: "date" },
            validThrough: { type: "string", format: "date" },
            compensation: {
              type: "object",
              properties: {
                currency: { type: "string" },
                type: { type: "string" },
                range: { type: "string" },
              },
            },
            requirements: {
              type: "object",
              properties: {
                skills: { type: "array", items: { type: "string" } },
                experienceLevel: { type: "string" },
                timezone: { type: "string" },
              },
            },
            responsibilities: { type: "array", items: { type: "string" } },
            description: { type: "string" },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
