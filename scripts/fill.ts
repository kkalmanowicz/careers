/**
 * fill.ts
 * Marks a batch of jobs as "filled" and links them to the new batch.
 *
 * Run: npm run careers:fill -- --batch=2026-02-21 --replaced-by=2026-03-07
 * Dry run: npm run careers:fill -- --batch=2026-02-21 --replaced-by=2026-03-07 --dry-run
 *
 * For each filled job:
 *   - Sets status: "filled"
 *   - Auto-selects up to 5 active jobs from the same category in the new batch
 *   - Writes replacedBy array with { category, slug, title }
 *   - Updates all 6 translation files to match (no Bedrock call needed — status/replacedBy aren't translated)
 */

import fs from "fs";
import path from "path";
import { LANGUAGES } from "../src/lib/categories";

const JOBS_DIR = path.join(process.cwd(), "src/content/jobs");
const TRANSLATIONS_DIR = path.join(process.cwd(), "src/content/translations");

const args = process.argv.slice(2);
const batchArg = args.find((a) => a.startsWith("--batch="))?.split("=")[1];
const replacedByArg = args.find((a) => a.startsWith("--replaced-by="))?.split("=")[1];
const dryRun = args.includes("--dry-run");

if (!batchArg || !replacedByArg) {
  console.error("Usage: npm run careers:fill -- --batch=YYYY-MM-DD --replaced-by=YYYY-MM-DD");
  process.exit(1);
}

interface JobFile {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  status?: "active" | "filled";
  batchDate?: string;
  replacedBy?: Array<{ category: string; slug: string; title: string }>;
  [key: string]: unknown;
}

/** Load all job files matching a given batchDate */
function loadBatch(batchDate: string): Array<{ filePath: string; slug: string; job: JobFile }> {
  const results: Array<{ filePath: string; slug: string; job: JobFile }> = [];

  const categories = fs.readdirSync(JOBS_DIR).filter((f) =>
    fs.statSync(path.join(JOBS_DIR, f)).isDirectory()
  );

  for (const category of categories) {
    const catDir = path.join(JOBS_DIR, category);
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = path.join(catDir, file);
      const job = JSON.parse(fs.readFileSync(filePath, "utf-8")) as JobFile;
      if (job.batchDate === batchDate) {
        results.push({ filePath, slug: file.replace(".json", ""), job });
      }
    }
  }

  return results;
}

/** Auto-select up to maxCount active jobs from the same category in the new batch */
function selectReplacements(
  category: string,
  newBatchDate: string,
  maxCount = 5
): Array<{ category: string; slug: string; title: string }> {
  const catDir = path.join(JOBS_DIR, category);
  if (!fs.existsSync(catDir)) return [];

  const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));
  const replacements: Array<{ category: string; slug: string; title: string }> = [];

  for (const file of files) {
    if (replacements.length >= maxCount) break;
    const job = JSON.parse(
      fs.readFileSync(path.join(catDir, file), "utf-8")
    ) as JobFile;
    if (job.batchDate === newBatchDate && job.status !== "filled") {
      replacements.push({
        category,
        slug: file.replace(".json", ""),
        title: job.title,
      });
    }
  }

  return replacements;
}

/** Update the status/replacedBy fields in all translation files for a job (no Bedrock needed) */
function updateTranslations(
  category: string,
  slug: string,
  updates: { status: "filled"; replacedBy: Array<{ category: string; slug: string; title: string }> }
): void {
  const targetLangs = LANGUAGES.filter((l) => l !== "en");
  for (const lang of targetLangs) {
    const filePath = path.join(TRANSLATIONS_DIR, lang, category, `${slug}.json`);
    if (!fs.existsSync(filePath)) continue;
    const job = JSON.parse(fs.readFileSync(filePath, "utf-8")) as JobFile;
    const updated = { ...job, ...updates };
    if (!dryRun) {
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
    }
    console.log(`  ${dryRun ? "[DRY RUN] would update" : "UPDATED"}: ${lang}/${category}/${slug}`);
  }
}

// Main
console.log(`\nFilling batch: ${batchArg} → replaced by: ${replacedByArg}\n`);
if (dryRun) console.log("  [DRY RUN MODE — no files will be written]\n");

const toFill = loadBatch(batchArg);

if (toFill.length === 0) {
  console.error(`No jobs found with batchDate: ${batchArg}`);
  process.exit(1);
}

console.log(`Found ${toFill.length} jobs in batch ${batchArg}\n`);

let filled = 0;

for (const { filePath, slug, job } of toFill) {
  const replacedBy = selectReplacements(job.category, replacedByArg);

  const updates = {
    status: "filled" as const,
    replacedBy,
  };

  console.log(`  ${job.category}/${slug}`);
  console.log(`    → replacedBy: ${replacedBy.map((r) => r.slug).join(", ") || "(none found)"}`);

  if (!dryRun) {
    const updated = { ...job, ...updates };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  }

  // Sync translation files (status + replacedBy only — no Bedrock needed)
  updateTranslations(job.category, slug, updates);

  filled++;
}

console.log(`\n${dryRun ? "[DRY RUN] Would fill" : "Filled"} ${filled} jobs.`);
console.log("Next step: npm run build — verify filled banner on old pages, then commit + push.");
