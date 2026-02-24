/**
 * check-urls.ts
 * Audits the codebase for URL correctness.
 *
 * Two modes:
 *   Static  — scans source files for banned/wrong patterns (always runs)
 *   Live    — fires HEAD requests against key careers.abbababa.com endpoints
 *
 * Run: npm run careers:check-urls
 * Run (live): npm run careers:check-urls -- --live
 * Run (live against local dev): npm run careers:check-urls -- --live --base=http://localhost:3000
 */

import fs from "fs";
import path from "path";
import { glob } from "fs/promises";

const args = process.argv.slice(2);
const LIVE = args.includes("--live");
const baseArg = args.find((a) => a.startsWith("--base="))?.split("=")[1];
const LIVE_BASE = baseArg ?? "https://careers.abbababa.com";

// ---------------------------------------------------------------------------
// 1. STATIC CHECKS — patterns that must never appear in source
// ---------------------------------------------------------------------------

interface BannedPattern {
  pattern: RegExp;
  reason: string;
}

const BANNED: BannedPattern[] = [
  {
    pattern: /https?:\/\/api\.abbababa\.com/g,
    reason: "api.abbababa.com is not a real domain — use abbababa.com/api/v1",
  },
  {
    pattern: /https?:\/\/agents\.abbababa\.com/g,
    reason: "agents.abbababa.com belongs to the /agents site, not /careers",
  },
  {
    pattern: /https?:\/\/www\.abbababa\.com/g,
    reason: "use abbababa.com (no www)",
  },
];

const SCAN_EXTENSIONS = [".ts", ".tsx", ".mdx", ".md", ".json", ".txt"];
const SCAN_DIRS = ["src", "scripts", "public"];
const IGNORE_PATHS = ["node_modules", ".next", "dist"];

interface StaticError {
  file: string;
  line: number;
  match: string;
  reason: string;
}

async function collectFiles(root: string): Promise<string[]> {
  const files: string[] = [];
  const cwd = process.cwd();

  for (const dir of SCAN_DIRS) {
    const dirPath = path.join(cwd, dir);
    if (!fs.existsSync(dirPath)) continue;

    const iterator = glob(`${dirPath}/**/*`, { withFileTypes: false });
    for await (const f of iterator) {
      const filePath = f as unknown as string;
      if (IGNORE_PATHS.some((ig) => filePath.includes(ig))) continue;
      if (!SCAN_EXTENSIONS.some((ext) => filePath.endsWith(ext))) continue;
      if (!fs.statSync(filePath).isFile()) continue;
      files.push(filePath);
    }
  }

  return files;
}

async function runStaticChecks(): Promise<StaticError[]> {
  const errors: StaticError[] = [];
  const files = await collectFiles(process.cwd());

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const { pattern, reason } of BANNED) {
        pattern.lastIndex = 0;
        const matches = line.match(pattern);
        if (matches) {
          for (const match of matches) {
            errors.push({
              file: path.relative(process.cwd(), file),
              line: i + 1,
              match,
              reason,
            });
          }
        }
      }
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// 2. LIVE CHECKS — HEAD requests against key endpoints
// ---------------------------------------------------------------------------

interface LiveEndpoint {
  url: string;
  expectStatus: number;
  description: string;
}

function buildLiveChecks(base: string): LiveEndpoint[] {
  return [
    { url: `${base}/`,                          expectStatus: 200, description: "Root redirect / homepage" },
    { url: `${base}/en`,                         expectStatus: 200, description: "English homepage" },
    { url: `${base}/sitemap.xml`,                expectStatus: 200, description: "Sitemap" },
    { url: `${base}/robots.txt`,                 expectStatus: 200, description: "robots.txt" },
    { url: `${base}/llms.txt`,                   expectStatus: 200, description: "llms.txt (AEO)" },
    { url: `${base}/llms-full.txt`,              expectStatus: 200, description: "llms-full.txt (AEO)" },
    { url: `${base}/agents.txt`,                 expectStatus: 200, description: "agents.txt (AEO)" },
    { url: `${base}/feed.xml`,                   expectStatus: 200, description: "RSS feed" },
    { url: `${base}/feed.atom`,                  expectStatus: 200, description: "Atom feed" },
    { url: `${base}/jobs.json`,                  expectStatus: 200, description: "jobs.json (machine-readable)" },
    { url: `${base}/openapi.json`,               expectStatus: 200, description: "OpenAPI spec" },
    { url: `${base}/.well-known/agent.json`,     expectStatus: 200, description: "A2A Agent Card" },
    { url: `${base}/.well-known/ai-plugin.json`, expectStatus: 200, description: "ChatGPT plugin manifest" },
    { url: `${base}/en/llms.txt`,                expectStatus: 200, description: "Per-lang llms.txt (en)" },
    { url: `${base}/en/jobs.json`,               expectStatus: 200, description: "Per-lang jobs.json (en)" },
    { url: `${base}/api/mcp`,                    expectStatus: 200, description: "MCP server" },
    // Banned domains should 404 / not exist at all — these verify we haven't accidentally
    // set up redirects that mask the wrong domain being used in source.
    { url: `${base}/en/engineering`,             expectStatus: 200, description: "Category page (engineering)" },
    { url: `${base}/en/general`,                 expectStatus: 200, description: "Category page (general)" },
  ];
}

interface LiveResult {
  url: string;
  description: string;
  status: number | null;
  ok: boolean;
  error?: string;
}

async function runLiveChecks(base: string): Promise<LiveResult[]> {
  const checks = buildLiveChecks(base);
  const results: LiveResult[] = [];

  for (const check of checks) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const res = await fetch(check.url, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      results.push({
        url: check.url,
        description: check.description,
        status: res.status,
        ok: res.status === check.expectStatus,
        error: res.status !== check.expectStatus
          ? `expected ${check.expectStatus}, got ${res.status}`
          : undefined,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        url: check.url,
        description: check.description,
        status: null,
        ok: false,
        error: msg,
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// 3. MAIN
// ---------------------------------------------------------------------------

const RESET  = "\x1b[0m";
const RED    = "\x1b[31m";
const GREEN  = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BOLD   = "\x1b[1m";

async function main() {
  let exitCode = 0;

  // --- Static ---
  console.log(`\n${BOLD}── Static URL checks ──────────────────────────────────────${RESET}`);
  const staticErrors = await runStaticChecks();

  if (staticErrors.length === 0) {
    console.log(`${GREEN}✓ No banned URL patterns found${RESET}`);
  } else {
    exitCode = 1;
    for (const e of staticErrors) {
      console.log(`${RED}✗ ${e.file}:${e.line}${RESET}`);
      console.log(`  matched: ${YELLOW}${e.match}${RESET}`);
      console.log(`  reason:  ${e.reason}`);
    }
    console.log(`\n${RED}${staticErrors.length} static error(s)${RESET}`);
  }

  // --- Live ---
  if (LIVE) {
    console.log(`\n${BOLD}── Live endpoint checks → ${LIVE_BASE} ──────────────────────${RESET}`);
    const liveResults = await runLiveChecks(LIVE_BASE);

    const passed = liveResults.filter((r) => r.ok);
    const failed = liveResults.filter((r) => !r.ok);

    for (const r of liveResults) {
      const icon = r.ok ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
      const status = r.status !== null ? `[${r.status}]` : "[ERR]";
      console.log(`  ${icon} ${status.padEnd(7)} ${r.description}`);
      if (!r.ok && r.error) {
        console.log(`         ${YELLOW}→ ${r.error}${RESET}`);
      }
    }

    console.log(`\n${GREEN}${passed.length} passed${RESET}  ${failed.length > 0 ? RED : ""}${failed.length} failed${RESET}`);
    if (failed.length > 0) exitCode = 1;
  } else {
    console.log(`\n${YELLOW}Tip: run with --live to also check endpoints (or --live --base=http://localhost:3000)${RESET}`);
  }

  console.log();
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
