/**
 * /api/mcp — Model Context Protocol (MCP) HTTP endpoint.
 * Spec: https://modelcontextprotocol.io (2025-03-26 streamable HTTP transport)
 *
 * Exposes job search as callable MCP tools so Claude and other MCP-compatible
 * AI clients can query jobs directly without crawling the site.
 *
 * Tools:
 *   list_jobs      — all jobs, optional lang + category filter
 *   get_job        — single job by category + slug
 *   list_categories — all available categories
 */
import { NextRequest, NextResponse } from "next/server";
import { loadAllJobs, loadJobsForCategory, loadJob } from "@/lib/jobs";
import { LANGUAGES, CATEGORIES, GENERAL_CATEGORIES } from "@/lib/categories";
import type { Language } from "@/lib/categories";

const SERVER_INFO = {
  name: "abbababa-careers",
  version: "1.0.0",
};

const TOOLS = [
  {
    name: "list_jobs",
    description:
      "List open job postings on Abba Baba Careers. All roles pay in USDC via the Abba Baba A2A settlement layer. Apply via A2A protocol to recruiter agent cmlwggmn001un01l4a1mjkep0.",
    inputSchema: {
      type: "object",
      properties: {
        lang: {
          type: "string",
          enum: LANGUAGES,
          description: "Language for job titles and descriptions. Defaults to 'en'.",
        },
        category: {
          type: "string",
          description:
            "Filter by category slug (e.g. 'defi', 'commerce', 'development'). Omit for all categories.",
        },
      },
    },
  },
  {
    name: "get_job",
    description: "Get full details of a specific job posting by category and slug.",
    inputSchema: {
      type: "object",
      required: ["category", "slug"],
      properties: {
        category: { type: "string", description: "Category slug, e.g. 'defi'" },
        slug: {
          type: "string",
          description: "Job slug, e.g. 'market-maker-2026-02-21'",
        },
        lang: {
          type: "string",
          enum: LANGUAGES,
          description: "Language. Defaults to 'en'.",
        },
      },
    },
  },
  {
    name: "list_categories",
    description: "List all job categories available on Abba Baba Careers.",
    inputSchema: { type: "object", properties: {} },
  },
];

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

function ok(id: string | number | null, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

function err(id: string | number | null, code: number, message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code, message } });
}

function textContent(text: string) {
  return { content: [{ type: "text", text }] };
}

export async function POST(request: NextRequest) {
  let rpc: JsonRpcRequest;
  try {
    rpc = (await request.json()) as JsonRpcRequest;
  } catch {
    return err(null, -32700, "Parse error");
  }

  const { id, method, params = {} } = rpc;

  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: "2025-03-26",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions:
          "This MCP server provides job listings from Abba Baba Careers — roles for people who build AI agents. Use list_jobs to browse, get_job for details. Apply via A2A protocol.",
      });

    case "notifications/initialized":
      return new NextResponse(null, { status: 204 });

    case "tools/list":
      return ok(id, { tools: TOOLS });

    case "tools/call": {
      const name = params.name as string;
      const args = (params.arguments ?? {}) as Record<string, string>;
      const lang: Language = LANGUAGES.includes(args.lang as Language)
        ? (args.lang as Language)
        : "en";

      if (name === "list_jobs") {
        const jobs = args.category
          ? loadJobsForCategory(args.category, lang)
          : loadAllJobs(lang);

        const text = jobs
          .map(
            (j) =>
              `**${j.title}**\n` +
              `URL: https://careers.abbababa.com/${lang}/${j.category}/${j.subcategory ?? j.id}\n` +
              `Compensation: ${j.compensation.range} ${j.compensation.currency}\n` +
              `Summary: ${j.summary}`
          )
          .join("\n\n");

        return ok(id, textContent(jobs.length ? text : "No jobs found for that filter."));
      }

      if (name === "get_job") {
        if (!args.category || !args.slug) {
          return ok(id, textContent("Error: category and slug are required."));
        }
        const job = loadJob(args.category, args.slug, lang);
        if (!job) {
          return ok(id, textContent(`Job not found: ${args.category}/${args.slug}`));
        }
        const url = `https://careers.abbababa.com/${lang}/${job.category}/${job.subcategory ?? job.id}`;
        const lines = [
          `# ${job.title}`,
          `**URL**: ${url}`,
          `**Compensation**: ${job.compensation.range} ${job.compensation.currency} (${job.compensation.type})`,
          `**Valid Through**: ${job.validThrough}`,
          `**Experience**: ${job.requirements.experienceLevel}`,
          job.requirements.skills?.length
            ? `**Skills**: ${job.requirements.skills.join(", ")}`
            : "",
          "",
          job.description,
          "",
          "## Responsibilities",
          ...job.responsibilities.map((r) => `- ${r}`),
          "",
          "## How to Apply",
          "Message recruiter agent ID: cmlwggmn001un01l4a1mjkep0 via A2A endpoint: https://abbababa.com/api/a2a",
        ];
        return ok(id, textContent(lines.filter(Boolean).join("\n")));
      }

      if (name === "list_categories") {
        const all = [
          ...CATEGORIES.map((c) => ({ slug: c.slug, title: c.title, description: c.description })),
          ...GENERAL_CATEGORIES.map((c) => ({ slug: c.slug, title: c.title, description: c.description })),
        ];
        const text = all
          .map((c) => `**${c.title}** (\`${c.slug}\`): ${c.description}`)
          .join("\n");
        return ok(id, textContent(text));
      }

      return err(id, -32601, `Unknown tool: ${name}`);
    }

    default:
      return err(id, -32601, `Method not found: ${method}`);
  }
}

// MCP clients may probe with GET for server info
export async function GET() {
  return NextResponse.json({
    name: SERVER_INFO.name,
    version: SERVER_INFO.version,
    protocol: "MCP/2025-03-26",
    transport: "http",
    endpoint: "https://careers.abbababa.com/api/mcp",
    tools: TOOLS.map((t) => t.name),
  });
}
