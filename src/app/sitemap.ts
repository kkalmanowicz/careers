import type { MetadataRoute } from "next";
import { LANGUAGES, CATEGORIES, GENERAL_CATEGORIES } from "@/lib/categories";
import fs from "fs";
import path from "path";

const BASE = "https://agents.abbababa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const today = new Date("2026-02-20");

  // Root redirect page
  entries.push({
    url: BASE,
    lastModified: today,
    changeFrequency: "monthly",
    priority: 1.0,
  });

  // Language hubs
  for (const lang of LANGUAGES) {
    entries.push({
      url: `${BASE}/${lang}`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Category listing pages
  for (const lang of LANGUAGES) {
    for (const cat of CATEGORIES) {
      entries.push({
        url: `${BASE}/${lang}/${cat.slug}`,
        lastModified: today,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    // General category
    entries.push({
      url: `${BASE}/${lang}/general`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    });
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
        const files = fs
          .readdirSync(catDir)
          .filter((f) => f.endsWith(".json"));

        for (const file of files) {
          const slug = file.replace(".json", "");
          entries.push({
            url: `${BASE}/${lang}/${category}/${slug}`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    }
  }

  return entries;
}
