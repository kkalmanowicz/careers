import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LANGUAGES, CATEGORIES, GENERAL_CATEGORIES } from "@/lib/categories";
import type { Language } from "@/lib/categories";
import { loadJobsForCategory } from "@/lib/jobs";
import CategoryHub from "@/components/CategoryHub";

interface Props {
  params: Promise<{ lang: string; category: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; category: string }[] = [];
  const categorySlugs = [
    ...CATEGORIES.map((c) => c.slug),
    "general",
  ];
  for (const lang of LANGUAGES) {
    for (const category of categorySlugs) {
      params.push({ lang, category });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  if (!LANGUAGES.includes(lang as Language)) return {};

  const cat =
    CATEGORIES.find((c) => c.slug === category) ??
    (category === "general" ? { slug: "general", title: "General Agent Roles", description: "General purpose agent roles" } : null);

  if (!cat) return {};

  return {
    title: cat.title,
    description: cat.description,
    alternates: {
      languages: Object.fromEntries(
        LANGUAGES.map((l) => [l, `https://agents.abbababa.com/${l}/${category}`])
      ),
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { lang, category } = await params;

  if (!LANGUAGES.includes(lang as Language)) notFound();

  const cat =
    CATEGORIES.find((c) => c.slug === category) ??
    (category === "general"
      ? {
          slug: "general",
          title: "General Agent Roles",
          description: "Open positions for agents that don't fit a specific category.",
          subcategories: GENERAL_CATEGORIES,
        }
      : null);

  if (!cat) notFound();

  const jobs = loadJobsForCategory(category, lang as Language);

  return (
    <main>
      <CategoryHub
        category={cat}
        jobs={jobs}
        lang={lang as Language}
      />
    </main>
  );
}
