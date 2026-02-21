/**
 * refresh.ts
 * Hash-based refresh: detects changed shared blocks, regenerates affected jobs,
 * translates changed jobs, updates lastUpdated and validThrough dates.
 * Run: npm run careers:refresh
 */

import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import { translateJob } from "../src/lib/bedrock";
import { LANGUAGES } from "../src/lib/categories";
import type { Language } from "../src/lib/categories";

const JOBS_DIR = path.join(process.cwd(), "src/content/jobs");
const SHARED_DIR = path.join(process.cwd(), "src/content/shared");
const TRANSLATIONS_DIR = path.join(process.cwd(), "src/content/translations");
const HASH_CACHE = path.join(process.cwd(), "src/content/.block-hashes.json");

const TODAY = new Date().toISOString().split("T")[0];
const VALID_THROUGH = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

function hashFile(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  const content = fs.readFileSync(filePath, "utf-8");
  return createHash("sha256").update(content).digest("hex").substring(0, 16);
}

function loadHashCache(): Record<string, string> {
  if (!fs.existsSync(HASH_CACHE)) return {};
  return JSON.parse(fs.readFileSync(HASH_CACHE, "utf-8"));
}

function saveHashCache(cache: Record<string, string>) {
  fs.writeFileSync(HASH_CACHE, JSON.stringify(cache, null, 2), "utf-8");
}

function getSharedBlocks(): string[] {
  const blocks: string[] = [];

  function scanDir(dir: string, prefix = "") {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        scanDir(full, prefix ? `${prefix}/${f}` : f);
      } else if (f.endsWith(".mdx") || f.endsWith(".md")) {
        blocks.push(prefix ? `${prefix}/${f}` : f);
      }
    }
  }

  scanDir(SHARED_DIR);
  return blocks;
}

function getChangedBlocks(
  cache: Record<string, string>
): { changed: string[]; newCache: Record<string, string> } {
  const blocks = getSharedBlocks();
  const newCache: Record<string, string> = { ...cache };
  const changed: string[] = [];

  for (const block of blocks) {
    const filePath = path.join(SHARED_DIR, block);
    const newHash = hashFile(filePath);
    const blockKey = `shared:${block}`;

    if (cache[blockKey] !== newHash) {
      changed.push(block.replace(/\.(mdx|md)$/, "").replace("/", ":"));
      newCache[blockKey] = newHash;
    }
  }

  return { changed, newCache };
}

function getJobsAffectedByBlocks(changedBlocks: string[]): string[] {
  const affected: string[] = [];

  if (!fs.existsSync(JOBS_DIR)) return [];

  const categories = fs
    .readdirSync(JOBS_DIR)
    .filter((f) => fs.statSync(path.join(JOBS_DIR, f)).isDirectory());

  for (const category of categories) {
    const catDir = path.join(JOBS_DIR, category);
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const jobPath = path.join(catDir, file);
      const job = JSON.parse(fs.readFileSync(jobPath, "utf-8"));

      // Check if job references any changed block
      const jobBlocks: string[] = job.sharedBlocks ?? [];
      const jobPlatforms: string[] = (job.platforms ?? []).map((p: string) => `platforms:${p}`);
      const allRefs = [...jobBlocks, ...jobPlatforms];

      const isAffected = changedBlocks.some((b) =>
        allRefs.some((ref) => ref === b || ref.endsWith(b))
      );

      if (isAffected) {
        affected.push(`${category}/${file.replace(".json", "")}`);
      }
    }
  }

  return affected;
}

function updateJobDates(jobPath: string): void {
  const job = JSON.parse(fs.readFileSync(jobPath, "utf-8"));
  const content = JSON.stringify(job);
  const newHash = createHash("sha256").update(content).digest("hex").substring(0, 16);

  job.lastUpdated = TODAY;
  job.validThrough = VALID_THROUGH;
  job.contentHash = newHash;

  fs.writeFileSync(jobPath, JSON.stringify(job, null, 2), "utf-8");
  console.log(`  UPDATED DATES: ${jobPath}`);
}

async function translateAffectedJob(category: string, slug: string): Promise<void> {
  const srcPath = path.join(JOBS_DIR, category, `${slug}.json`);
  if (!fs.existsSync(srcPath)) return;

  const srcJob = JSON.parse(fs.readFileSync(srcPath, "utf-8"));
  const targetLangs = LANGUAGES.filter((l) => l !== "en");

  for (const lang of targetLangs) {
    const destPath = path.join(TRANSLATIONS_DIR, lang, category, `${slug}.json`);
    console.log(`  TRANSLATING: ${lang}/${category}/${slug}`);

    const translated = await translateJob(srcJob, lang as Language);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, JSON.stringify(translated, null, 2), "utf-8");

    await new Promise((r) => setTimeout(r, 200));
  }
}

async function main() {
  console.log("Running Abba Baba content refresh...\n");

  const cache = loadHashCache();
  const { changed, newCache } = getChangedBlocks(cache);

  if (changed.length === 0) {
    console.log("No shared block changes detected. All content is current.");
    saveHashCache(newCache);
    return;
  }

  console.log(`Changed blocks: ${changed.join(", ")}`);

  const affected = getJobsAffectedByBlocks(changed);
  console.log(`Affected jobs: ${affected.length}`);

  for (const jobRef of affected) {
    const [category, slug] = jobRef.split("/");
    const jobPath = path.join(JOBS_DIR, category, `${slug}.json`);

    updateJobDates(jobPath);

    const hasGatewayKey = !!process.env.AI_GATEWAY_API_KEY;

    if (hasGatewayKey) {
      await translateAffectedJob(category, slug);
    } else {
      console.log(`  SKIP TRANSLATION (AI_GATEWAY_API_KEY not set): ${jobRef}`);
    }
  }

  saveHashCache(newCache);
  console.log(`\nRefresh complete. Updated ${affected.length} jobs.`);
}

main().catch((err) => {
  console.error("Refresh failed:", err);
  process.exit(1);
});
