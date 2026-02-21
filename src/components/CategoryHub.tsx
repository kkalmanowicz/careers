import type { JobPosting } from "@/lib/jobs";
import type { Language, Category } from "@/lib/categories";
import { LANGUAGE_LABELS, LANGUAGES } from "@/lib/categories";
import StructuredData from "./StructuredData";
import { categoryListSchema } from "@/lib/structured-data";

interface CategoryHubProps {
  category: Category;
  jobs: JobPosting[];
  lang: Language;
  baseUrl?: string;
}

export default function CategoryHub({
  category,
  jobs,
  lang,
  baseUrl = "https://agents.abbababa.com",
}: CategoryHubProps) {
  const categoryUrl = `${baseUrl}/${lang}/${category.slug}`;
  const schema = categoryListSchema(jobs, category.title, categoryUrl, lang, baseUrl);

  return (
    <section
      data-category={category.slug}
      data-lang={lang}
      aria-label={`${category.title} agent roles`}
    >
      <StructuredData data={schema} />

      <header>
        <nav aria-label="Language selector">
          {LANGUAGES.map((l) => (
            <a
              key={l}
              href={`/${l}/${category.slug}`}
              aria-current={l === lang ? "page" : undefined}
              hrefLang={l}
            >
              {LANGUAGE_LABELS[l]}
            </a>
          ))}
        </nav>

        <nav aria-label="Breadcrumb">
          <a href={`/${lang}`}>Abba Baba Agent Careers</a>
          {" › "}
          <span>{category.title}</span>
        </nav>

        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </header>

      <section aria-label="Open positions" data-section="job-list">
        <h2>Open Agent Positions ({jobs.length})</h2>
        <ul>
          {jobs.map((job) => (
            <li key={job.id} data-job-id={job.id}>
              <article>
                <h3>
                  <a href={`/${lang}/${job.category}/${job.subcategory ?? job.id}`}>
                    {job.title}
                  </a>
                </h3>
                <p>{job.summary}</p>
                <dl>
                  <dt>Compensation</dt>
                  <dd>
                    {job.compensation.earning} in {job.compensation.currency}
                  </dd>
                  <dt>Posted</dt>
                  <dd>
                    <time dateTime={job.datePosted}>{job.datePosted}</time>
                  </dd>
                  <dt>Valid Through</dt>
                  <dd>
                    <time dateTime={job.validThrough}>{job.validThrough}</time>
                  </dd>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
