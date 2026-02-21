/**
 * expire.ts
 * Deletes all EN source files and translation files for a given batch date.
 *
 * Run: npm run careers:expire -- --batch=2026-01-08
 * Dry run: npm run careers:expire -- --batch=2026-01-08 --dry-run
 *
 * Safety: requires --batch flag explicitly. Will not delete files without it.
 * Always run --dry-run first to confirm what will be deleted.
 */

import fs from "fs";
import path from "path";
import { LANGUAGES } from "../src/lib/categories";

const JOBS_DIR = path.join(process.cwd(), "src/content/jobs");
const TRANSLATIONS_DIR = path.join(process.cwd(), "src/content/translations");

const args = process.argv.slice(2);
const batchArg = args.find((a) => a.startsWith("--batch="))?.split("=")[1];
const dryRun = args.includes("--dry-run");

if (!batchArg) {
  console.error("Usage: npm run careers:expire -- --batch=YYYY-MM-DD [--dry-run]");
  console.error("Always run with --dry-run first to preview what will be deleted.");
  process.exit(1);
}

interface JobFile {
  batchDate?: string;
  [key: string]: unknown;
}

function deleteFile(filePath: string): void {
  if (dryRun) {
    console.log(`  [DRY RUN] would delete: ${filePath}`);
  } else {
    fs.unlinkSync(filePath);
    console.log(`  DELETED: ${filePath}`);
  }
}

// Main
console.log(`\nExpiring batch: ${batchArg}\n`);
if (dryRun) console.log("  [DRY RUN MODE — no files will be deleted]\n");

const categories = fs.readdirSync(JOBS_DIR).filter((f) =>
  fs.statSync(path.join(JOBS_DIR, f)).isDirectory()
);

let deleted = 0;

for (const category of categories) {
  const catDir = path.join(JOBS_DIR, category);
  const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(catDir, file);
    const job = JSON.parse(fs.readFileSync(filePath, "utf-8")) as JobFile;

    if (job.batchDate !== batchArg) continue;

    const slug = file.replace(".json", "");

    // Delete EN source
    deleteFile(filePath);

    // Delete all translation files
    const targetLangs = LANGUAGES.filter((l) => l !== "en");
    for (const lang of targetLangs) {
      const transPath = path.join(TRANSLATIONS_DIR, lang, category, file);
      if (fs.existsSync(transPath)) {
        deleteFile(transPath);
      }
    }

    deleted++;
    console.log(`  ${dryRun ? "Would expire" : "Expired"}: ${category}/${slug} (${LANGUAGES.length - 1} translation files)`);
  }
}

if (deleted === 0) {
  console.log(`No jobs found with batchDate: ${batchArg}`);
} else {
  console.log(`\n${dryRun ? "[DRY RUN] Would delete" : "Deleted"} ${deleted} jobs (${deleted * (LANGUAGES.length - 1 + 1)} files total).`);
  if (!dryRun) {
    console.log("Next step: npm run build — verify page count dropped correctly, then commit + push.");
  }
}
