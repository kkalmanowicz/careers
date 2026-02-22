import type { MetadataRoute } from "next";
import { LANGUAGES, CATEGORIES } from "@/lib/categories";
import fs from "fs";
import path from "path";

const BASE = "https://careers.abbababa.com";

/** Build hreflang alternates for a given path suffix (e.g. "/commerce/slug") */
function alternates(suffix: string) {
  return Object.fromEntries(LANGUAGES.map((l) => [l, `${BASE}/${l}${suffix}`]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const today = new Date("2026-02-20");

  // Root redirect
  entries.push({
    url: BASE,
    lastModified: today,
    changeFrequency: "monthly",
    priority: 1.0,
  });

  // Language hubs — one entry per lang, alternates across all langs
  for (const lang of LANGUAGES) {
    entries.push({
      url: `${BASE}/${lang}`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: alternates("") },
    });
  }

  // Category listing pages
  const categorySlugs = [...CATEGORIES.map((c) => c.slug), "general"];
  for (const lang of LANGUAGES) {
    for (const cat of categorySlugs) {
      entries.push({
        url: `${BASE}/${lang}/${cat}`,
        lastModified: today,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates(`/${cat}`) },
      });
    }
  }

  // Individual job posting pages
  const JOBS_DIR = path.join(process.cwd(), "src/content/jobs");
  if (fs.existsSync(JOBS_DIR)) {
    const categories = fs
      .readdirSync(JOBS_DIR)
      .filter((f) => fs.statSync(path.join(JOBS_DIR, f)).isDirectory());

    for (const lang of LANGUAGES) {
      for (const category of categories) {
        const catDir = path.join(JOBS_DIR, category);
        const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".json"));

        for (const file of files) {
          const slug = file.replace(".json", "");
          entries.push({
            url: `${BASE}/${lang}/${category}/${slug}`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.7,
            alternates: { languages: alternates(`/${category}/${slug}`) },
          });
        }
      }
    }
  }

  return entries;
}
