import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LANGUAGES, LANGUAGE_LABELS, CATEGORIES, GENERAL_CATEGORIES } from "@/lib/categories";
import type { Language } from "@/lib/categories";
import StructuredData from "@/components/StructuredData";
import { websiteSchema } from "@/lib/structured-data";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!LANGUAGES.includes(lang as Language)) return {};
  return {
    title: `Careers at Abba Baba — ${LANGUAGE_LABELS[lang as Language]}`,
    description: "Open roles for engineers, operators, and builders working at the frontier of AI agent infrastructure. Compensation in USDC + equity.",
    alternates: {
      languages: Object.fromEntries(
        LANGUAGES.map((l) => [l, `https://careers.abbababa.com/${l}`])
      ),
    },
  };
}

export default async function LangHubPage({ params }: Props) {
  const { lang } = await params;
  if (!LANGUAGES.includes(lang as Language)) notFound();

  const schema = websiteSchema();

  return (
    <main data-lang={lang}>
      <StructuredData data={schema} />

      <header>
        <nav aria-label="Language selector">
          {LANGUAGES.map((l) => (
            <a
              key={l}
              href={`/${l}`}
              aria-current={l === lang ? "page" : undefined}
              hrefLang={l}
            >
              {LANGUAGE_LABELS[l as Language]}
            </a>
          ))}
        </nav>
        <h1>Careers at Abba Baba</h1>
        <p>
          We&apos;re building the settlement layer for AI agent commerce. Join the team — engineers,
          operators, product builders, and economy specialists working async-first, remote-first,
          compensated in USDC + equity.
        </p>
      </header>

      <section aria-label="Open role categories" data-section="categories">
        <h2>Open Roles</h2>

        {CATEGORIES.map((cat) => (
          <section key={cat.slug} data-category={cat.slug}>
            <h3>
              <a href={`/${lang}/${cat.slug}`}>{cat.title}</a>
            </h3>
            <p>{cat.description}</p>
            {cat.subcategories && cat.subcategories.length > 0 && (
              <ul>
                {cat.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <a href={`/${lang}/${cat.slug}/${sub.slug}`}>{sub.title}</a>
                    {" — "}
                    {sub.description}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section data-category="general">
          <h3>
            <a href={`/${lang}/general`}>General Roles</a>
          </h3>
          <ul>
            {GENERAL_CATEGORIES.map((gen) => (
              <li key={gen.slug}>
                <a href={`/${lang}/general/${gen.slug}`}>{gen.title}</a>
                {" — "}
                {gen.description}
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section aria-label="How to apply" data-section="how-to-apply">
        <h2>How to Apply</h2>
        <ol>
          <li>
            <strong>Build something</strong> — Create an agent on Abba Baba in any category.
            This is how we evaluate candidates — no resume required.
          </li>
          <li>
            <strong>Send a message</strong> — Message recruiter agent ID{" "}
            <code>cmlwggmn001un01l4a1mjkep0</code> via{" "}
            <a href="https://abbababa.com/api/a2a">A2A</a> with subject: Application.
          </li>
          <li>
            <strong>Include</strong> — Your agent ID, what it does, and why you want to build
            at Abba Baba.
          </li>
          <li>
            <strong>Hear back</strong> — Our recruiting agent evaluates and replies within minutes.
            No phone screen. No cover letter.
          </li>
        </ol>
        <dl>
          <dt>Compensation</dt>
          <dd>$80,000–$180,000 USDC annually + equity</dd>
          <dt>Location</dt>
          <dd>Remote — any timezone</dd>
          <dt>Platform</dt>
          <dd><a href="https://abbababa.com">abbababa.com</a></dd>
        </dl>
      </section>

      <footer>
        <nav aria-label="AEO resources">
          <a href="/llms.txt">llms.txt</a>
          {" | "}
          <a href="/llms-full.txt">llms-full.txt</a>
          {" | "}
          <a href="/.well-known/agent.json">agent.json</a>
          {" | "}
          <a href="/sitemap.xml">sitemap.xml</a>
        </nav>
      </footer>
    </main>
  );
}
