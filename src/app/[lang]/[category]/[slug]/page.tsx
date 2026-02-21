import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LANGUAGES, CATEGORIES, GENERAL_CATEGORIES } from "@/lib/categories";
import type { Language } from "@/lib/categories";
import { loadJob } from "@/lib/jobs";
import JobPostingComponent from "@/components/JobPosting";
import fs from "fs";
import path from "path";

interface Props {
  params: Promise<{ lang: string; category: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; category: string; slug: string }[] = [];
  const JOBS_DIR = path.join(process.cwd(), "src/content/jobs");

  if (!fs.existsSync(JOBS_DIR)) return [];

  const categories = fs.readdirSync(JOBS_DIR).filter((f) =>
    fs.statSync(path.join(JOBS_DIR, f)).isDirectory()
  );

  for (const lang of LANGUAGES) {
    for (const category of categories) {
      const catDir = path.join(JOBS_DIR, category);
      const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));
      for (const file of files) {
        params.push({ lang, category, slug: file.replace(".json", "") });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, slug } = await params;
  if (!LANGUAGES.includes(lang as Language)) return {};

  const job = loadJob(category, slug, lang as Language);
  if (!job) return {};

  return {
    title: job.title,
    description: job.summary,
    alternates: {
      languages: Object.fromEntries(
        LANGUAGES.map((l) => [
          l,
          `https://agents.abbababa.com/${l}/${category}/${slug}`,
        ])
      ),
    },
  };
}

export default async function JobPage({ params }: Props) {
  const { lang, category, slug } = await params;

  if (!LANGUAGES.includes(lang as Language)) notFound();

  const job = loadJob(category, slug, lang as Language);
  if (!job) notFound();

  const url = `https://agents.abbababa.com/${lang}/${category}/${slug}`;

  return (
    <main>
      <JobPostingComponent job={job} lang={lang as Language} url={url} />
    </main>
  );
}
