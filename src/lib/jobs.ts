import fs from "fs";
import path from "path";
import type { Language } from "./categories";

export interface JobCompensation {
  currency: string;
  type: string;
  range: string;
  equity?: string;
}

export interface JobRequirements {
  skills: string[];
  experienceLevel: string;  // "Mid-level", "Senior", "Staff"
  timezone?: string;        // "UTC±3 preferred" or "Any"
}

export interface IntegrationStep {
  step: number;
  title: string;
  code?: string;
  language?: string;
  description: string;
}

export interface ReplacedByJob {
  category: string;
  slug: string;
  title: string;
}

export interface JobPosting {
  id: string;
  category: string;
  subcategory: string | null;
  title: string;
  datePosted: string;
  validThrough: string;
  compensation: JobCompensation;
  sharedBlocks: string[];
  platforms: string[];
  description: string;
  summary: string; // One-line for llms.txt
  responsibilities: string[];
  requirements: JobRequirements;
  integrationSteps: IntegrationStep[];
  applicationProcess?: string;
  lastUpdated: string;
  contentHash: string;
  // Batch lifecycle fields
  status?: "active" | "filled";
  batchDate?: string;               // ISO date of the batch this job belongs to
  replacedBy?: ReplacedByJob[];     // populated when filled: links to new batch jobs
}

const CONTENT_DIR = path.join(process.cwd(), "src/content");
const JOBS_DIR = path.join(CONTENT_DIR, "jobs");
const TRANSLATIONS_DIR = path.join(CONTENT_DIR, "translations");

/** Load a job posting JSON for a given category/slug and language */
export function loadJob(category: string, slug: string, lang: Language = "en"): JobPosting | null {
  let filePath: string;

  if (lang === "en") {
    filePath = path.join(JOBS_DIR, category, `${slug}.json`);
  } else {
    filePath = path.join(TRANSLATIONS_DIR, lang, category, `${slug}.json`);
    // Fallback to EN if translation doesn't exist
    if (!fs.existsSync(filePath)) {
      filePath = path.join(JOBS_DIR, category, `${slug}.json`);
    }
  }

  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as JobPosting;
  } catch {
    return null;
  }
}

/** Load all jobs for a category */
export function loadJobsForCategory(category: string, lang: Language = "en"): JobPosting[] {
  const jobs: JobPosting[] = [];

  let dirPath: string;
  if (lang === "en") {
    dirPath = path.join(JOBS_DIR, category);
  } else {
    dirPath = path.join(TRANSLATIONS_DIR, lang, category);
    if (!fs.existsSync(dirPath)) {
      dirPath = path.join(JOBS_DIR, category);
    }
  }

  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const slug = file.replace(".json", "");
    const job = loadJob(category, slug, lang);
    if (job) jobs.push(job);
  }

  return jobs;
}

/** Load all job postings across all categories (for llms.txt, sitemap) */
export function loadAllJobs(lang: Language = "en"): JobPosting[] {
  const jobs: JobPosting[] = [];

  const categories = fs.existsSync(JOBS_DIR)
    ? fs.readdirSync(JOBS_DIR).filter((f) => fs.statSync(path.join(JOBS_DIR, f)).isDirectory())
    : [];

  for (const category of categories) {
    jobs.push(...loadJobsForCategory(category, lang));
  }

  return jobs;
}

/** Get URL path for a job posting */
export function getJobUrl(job: JobPosting, lang: Language, baseUrl = "https://careers.abbababa.com"): string {
  const cat = job.category;
  const slug = job.subcategory ?? job.id;
  return `${baseUrl}/${lang}/${cat}/${slug}`;
}

/** Load a shared MDX block as raw text */
export function loadSharedBlock(name: string): string {
  const filePath = path.join(CONTENT_DIR, "shared", `${name}.mdx`);
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8");
}

/** Load platform integration block as raw text */
export function loadPlatformBlock(platform: string): string {
  const filePath = path.join(CONTENT_DIR, "shared", "platforms", `${platform}.mdx`);
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8");
}

/** Compute SHA-256 hash of a string (for content change detection) */
export async function hashContent(content: string): Promise<string> {
  const { createHash } = await import("crypto");
  return createHash("sha256").update(content).digest("hex").substring(0, 16);
}
