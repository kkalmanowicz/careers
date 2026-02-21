/**
 * translate.ts
 * Translates EN job JSON files to 6 other languages via AI Gateway.
 *
 * Run: npm run careers:translate
 * Or: npm run careers:translate -- --lang=zh               (single language)
 * Or: npm run careers:translate -- --category=defi         (single category)
 * Or: npm run careers:translate -- --batch=2026-03-07      (new batch only)
 * Or: npm run careers:translate -- --slug=analytics-2026-03-07  (spot-check one job × all langs)
 * Or: npm run careers:translate -- --force                 (retranslate all, ignore hash)
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { translateJob } from "../src/lib/bedrock";
import { LANGUAGES } from "../src/lib/categories";
import type { Language } from "../src/lib/categories";

const JOBS_DIR = path.join(process.cwd(), "src/content/jobs");
const TRANSLATIONS_DIR = path.join(process.cwd(), "src/content/translations");

// Parse CLI args
const args = process.argv.slice(2);
const langArg = args.find((a) => a.startsWith("--lang="))?.split("=")[1] as Language | undefined;
const categoryArg = args.find((a) => a.startsWith("--category="))?.split("=")[1];
const batchArg = args.find((a) => a.startsWith("--batch="))?.split("=")[1];    // filter by batchDate
const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];      // single slug spot-check
const forceArg = args.includes("--force");

const targetLangs = langArg
  ? [langArg]
  : LANGUAGES.filter((l) => l !== "en");

async function translateFile(
  category: string,
  slug: string,
  lang: Language
): Promise<void> {
  const srcPath = path.join(JOBS_DIR, category, `${slug}.json`);
  const destPath = path.join(TRANSLATIONS_DIR, lang, category, `${slug}.json`);

  if (!fs.existsSync(srcPath)) return;

  // Skip if already translated and not force
  if (!forceArg && fs.existsSync(destPath)) {
    const src = JSON.parse(fs.readFileSync(srcPath, "utf-8"));
    const dest = JSON.parse(fs.readFileSync(destPath, "utf-8"));
    if (src.contentHash === dest.contentHash) {
      console.log(`  SKIP (unchanged): ${lang}/${category}/${slug}`);
      return;
    }
  }

  console.log(`  TRANSLATING: ${lang}/${category}/${slug}`);

  const srcJob = JSON.parse(fs.readFileSync(srcPath, "utf-8"));

  try {
    const translated = await translateJob(srcJob, lang);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, JSON.stringify(translated, null, 2), "utf-8");
    console.log(`  WROTE: ${destPath}`);
  } catch (err) {
    console.error(`  FAILED: ${lang}/${category}/${slug} — ${(err as Error).message}`);
    // Don't rethrow — continue with other files
  }
}

async function main() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    console.error("ERROR: AI_GATEWAY_API_KEY not set. Check .env or environment.");
    process.exit(1);
  }

  const categories = categoryArg
    ? [categoryArg]
    : fs.readdirSync(JOBS_DIR).filter((f) =>
        fs.statSync(path.join(JOBS_DIR, f)).isDirectory()
      );

  if (batchArg) console.log(`Batch filter: ${batchArg}`);
  if (slugArg) console.log(`Slug filter: ${slugArg}`);
  console.log(`Translating to: ${targetLangs.join(", ")}`);
  console.log(`Categories: ${categories.join(", ")}`);
  console.log();

  // Build full task list (filtered by --batch or --slug if provided)
  const tasks: Array<{ lang: Language; category: string; slug: string }> = [];
  for (const lang of targetLangs) {
    for (const category of categories) {
      const catDir = path.join(JOBS_DIR, category);
      if (!fs.existsSync(catDir)) continue;
      const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));
      for (const file of files) {
        const slug = file.replace(".json", "");

        // --slug: only the specific slug (search across all categories)
        if (slugArg && slug !== slugArg) continue;

        // --batch: only files whose batchDate matches
        if (batchArg) {
          const jobData = JSON.parse(
            fs.readFileSync(path.join(catDir, file), "utf-8")
          ) as { batchDate?: string };
          if (jobData.batchDate !== batchArg) continue;
        }

        tasks.push({ lang, category, slug });
      }
    }
  }

  console.log(`Total tasks: ${tasks.length} (concurrency: 20)\n`);

  // Run with concurrency pool of 20
  const CONCURRENCY = 20;
  let completed = 0;

  async function runPool() {
    const queue = [...tasks];
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length > 0) {
        const task = queue.shift();
        if (!task) break;
        await translateFile(task.category, task.slug, task.lang);
        completed++;
      }
    });
    await Promise.all(workers);
  }

  await runPool();
  console.log(`\nDone. Processed ${completed} translation tasks.`);
}

main().catch((err) => {
  console.error("Translation failed:", err);
  process.exit(1);
});
