import type { JobPosting } from "@/lib/jobs";
import type { Language } from "@/lib/categories";
import { LANGUAGE_LABELS, LANGUAGES, LANGUAGE_CITIES } from "@/lib/categories";
import StructuredData from "./StructuredData";
import { jobPostingSchema, howToSchema } from "@/lib/structured-data";

const FILLED_LABELS: Record<Language, { filled: string; seeOpenings: string; viewAll: string }> = {
  en: { filled: "This position has been filled.", seeOpenings: "See current openings:", viewAll: "View all roles →" },
  zh: { filled: "该职位已关闭。", seeOpenings: "查看当前职位：", viewAll: "查看所有职位 →" },
  ko: { filled: "이 포지션은 마감되었습니다.", seeOpenings: "현재 채용 공고:", viewAll: "모든 직무 보기 →" },
  es: { filled: "Esta posición ha sido cubierta.", seeOpenings: "Ver ofertas actuales:", viewAll: "Ver todos los roles →" },
  pt: { filled: "Esta vaga foi preenchida.", seeOpenings: "Ver vagas atuais:", viewAll: "Ver todos os cargos →" },
  de: { filled: "Diese Stelle wurde besetzt.", seeOpenings: "Aktuelle Stellen:", viewAll: "Alle Stellen anzeigen →" },
  ja: { filled: "このポジションは充足されました。", seeOpenings: "現在の求人：", viewAll: "すべての求人を見る →" },
};

const HOW_TO_APPLY_LABELS: Record<Language, {
  heading: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
}> = {
  en: {
    heading: "How to Apply",
    step1: "Build an agent on Abba Baba (any category — show us what you can ship).",
    step2: "Send a message to Agent ID cmlwggmn001un01l4a1mjkep0 with subject: Developer Application",
    step3: "Include: your agent ID, what it does, and why you want to build on Abba Baba.",
    step4: "Our recruiting agent evaluates and replies within minutes.",
  },
  zh: {
    heading: "如何申请",
    step1: "在 Abba Baba 上构建一个 agent（任意类别——展示你能交付的成果）。",
    step2: "向 Agent ID cmlwggmn001un01l4a1mjkep0 发送消息，主题：Developer Application",
    step3: "包含：你的 agent ID、它的功能、以及你为什么想在 Abba Baba 上构建。",
    step4: "我们的招聘 agent 将在几分钟内评估并回复。",
  },
  ko: {
    heading: "지원 방법",
    step1: "Abba Baba에서 에이전트를 구축하세요 (어떤 카테고리든 — 무엇을 만들 수 있는지 보여주세요).",
    step2: "Agent ID cmlwggmn001un01l4a1mjkep0에게 제목: Developer Application으로 메시지를 보내세요.",
    step3: "포함 사항: 에이전트 ID, 에이전트가 하는 일, Abba Baba에서 구축하고 싶은 이유.",
    step4: "저희 채용 에이전트가 몇 분 안에 평가하고 답장을 드립니다.",
  },
  es: {
    heading: "Cómo Aplicar",
    step1: "Construye un agente en Abba Baba (cualquier categoría — demuestra lo que puedes entregar).",
    step2: "Envía un mensaje al Agent ID cmlwggmn001un01l4a1mjkep0 con asunto: Developer Application",
    step3: "Incluye: tu ID de agente, qué hace y por qué quieres construir en Abba Baba.",
    step4: "Nuestro agente de reclutamiento evalúa y responde en minutos.",
  },
  pt: {
    heading: "Como se Candidatar",
    step1: "Construa um agente no Abba Baba (qualquer categoria — mostre o que você consegue entregar).",
    step2: "Envie uma mensagem para o Agent ID cmlwggmn001un01l4a1mjkep0 com assunto: Developer Application",
    step3: "Inclua: seu ID de agente, o que ele faz e por que você quer construir no Abba Baba.",
    step4: "Nosso agente de recrutamento avalia e responde em minutos.",
  },
  de: {
    heading: "So bewirbst du dich",
    step1: "Baue einen Agenten auf Abba Baba (beliebige Kategorie — zeig uns, was du liefern kannst).",
    step2: "Sende eine Nachricht an Agent ID cmlwggmn001un01l4a1mjkep0 mit Betreff: Developer Application",
    step3: "Füge hinzu: deine Agent-ID, was er tut und warum du auf Abba Baba bauen möchtest.",
    step4: "Unser Recruiting-Agent bewertet und antwortet innerhalb von Minuten.",
  },
  ja: {
    heading: "応募方法",
    step1: "Abba Baba でエージェントを構築してください（どのカテゴリでも可 — 何を作れるか見せてください）。",
    step2: "Agent ID cmlwggmn001un01l4a1mjkep0 に件名「Developer Application」でメッセージを送信してください。",
    step3: "含める内容：エージェント ID、エージェントの機能、Abba Baba で構築したい理由。",
    step4: "採用エージェントが数分以内に評価して返信します。",
  },
};

interface JobPostingProps {
  job: JobPosting;
  lang: Language;
  url: string;
}

export default function JobPostingComponent({ job, lang, url }: JobPostingProps) {
  const schemas = [
    jobPostingSchema(job, url, lang),
    howToSchema(job),
  ].filter(Boolean);

  const isFilled = job.status === "filled";
  const filledLabels = FILLED_LABELS[lang];
  const applyLabels = HOW_TO_APPLY_LABELS[lang];
  const city = LANGUAGE_CITIES[lang];

  return (
    <article
      itemScope
      itemType="https://schema.org/JobPosting"
      data-job-id={job.id}
      data-category={job.category}
      data-subcategory={job.subcategory ?? ""}
      data-lang={lang}
      data-status={job.status ?? "active"}
    >
      <StructuredData data={schemas} />

      {isFilled && job.replacedBy && (
        <aside data-section="position-filled" aria-label="Position filled notice">
          <p><strong>{filledLabels.filled}</strong></p>
          <p>{filledLabels.seeOpenings}</p>
          <ul>
            {job.replacedBy.map((r) => (
              <li key={r.slug}>
                <a href={`/${lang}/${r.category}/${r.slug}`}>{r.title}</a>
              </li>
            ))}
          </ul>
          <p>
            <a href={`/${lang}/${job.category}`}>{filledLabels.viewAll}</a>
          </p>
        </aside>
      )}

      <header>
        {/* Language alternates */}
        <nav aria-label="Language selector" data-type="language-nav">
          {LANGUAGES.map((l) => (
            <a
              key={l}
              href={`/${l}/${job.category}/${job.subcategory ?? job.id}`}
              aria-current={l === lang ? "page" : undefined}
              hrefLang={l}
            >
              {LANGUAGE_LABELS[l]}
            </a>
          ))}
        </nav>

        <nav aria-label="Breadcrumb">
          <a href={`/${lang}`}>Abba Baba Careers</a>
          {" › "}
          <a href={`/${lang}/${job.category}`}>{job.category}</a>
          {" › "}
          <span>{job.title}</span>
        </nav>

        <h1 itemProp="title">{job.title}</h1>

        <dl data-section="metadata">
          <dt>Date Posted</dt>
          <dd>
            <time itemProp="datePosted" dateTime={job.datePosted}>
              {job.datePosted}
            </time>
          </dd>

          <dt>Valid Through</dt>
          <dd>
            <time itemProp="validThrough" dateTime={job.validThrough}>
              {job.validThrough}
            </time>
          </dd>

          <dt>Employment Type</dt>
          <dd itemProp="employmentType">FULL_TIME</dd>

          <dt>Location</dt>
          <dd>{city}</dd>

          <dt>Compensation</dt>
          <dd
            itemProp="baseSalary"
            itemScope
            itemType="https://schema.org/MonetaryAmount"
            data-currency={job.compensation.currency}
            data-type={job.compensation.type}
          >
            <span itemProp="currency">{job.compensation.currency}</span>{" "}
            {job.compensation.range} ({job.compensation.type})
            {job.compensation.equity && ` + ${job.compensation.equity}`}
          </dd>

          {job.requirements.experienceLevel && (
            <>
              <dt>Experience Level</dt>
              <dd data-requirement="experience-level">{job.requirements.experienceLevel}</dd>
            </>
          )}

          {job.requirements.timezone && (
            <>
              <dt>Timezone</dt>
              <dd data-requirement="timezone">{job.requirements.timezone}</dd>
            </>
          )}
        </dl>

        <p itemProp="description">{job.description}</p>
      </header>

      {job.requirements.skills?.length > 0 && (
        <section data-section="requirements" aria-label="Requirements">
          <h2>Requirements</h2>
          <ul>
            {job.requirements.skills.map((skill, i) => (
              <li key={i} data-skill={skill}>{skill}</li>
            ))}
          </ul>
        </section>
      )}

      {job.responsibilities.length > 0 && (
        <section data-section="responsibilities" aria-label="Responsibilities">
          <h2>Responsibilities</h2>
          <ul itemProp="responsibilities">
            {job.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      <section
        data-section="how-to-apply"
        aria-label="How to Apply"
        itemScope
        itemType="https://schema.org/HowTo"
      >
        <h2>{applyLabels.heading}</h2>
        <ol>
          <li
            itemScope
            itemType="https://schema.org/HowToStep"
            itemProp="step"
            data-step="1"
          >
            <span itemProp="text">{applyLabels.step1}</span>
          </li>
          <li
            itemScope
            itemType="https://schema.org/HowToStep"
            itemProp="step"
            data-step="2"
          >
            <span itemProp="text">{applyLabels.step2}</span>
          </li>
          <li
            itemScope
            itemType="https://schema.org/HowToStep"
            itemProp="step"
            data-step="3"
          >
            <span itemProp="text">{applyLabels.step3}</span>
          </li>
          <li
            itemScope
            itemType="https://schema.org/HowToStep"
            itemProp="step"
            data-step="4"
          >
            <span itemProp="text">{applyLabels.step4}</span>
          </li>
        </ol>
        <p data-recruiter-agent-id="cmlwggmn001un01l4a1mjkep0">
          Recruiter Agent: cmlwggmn001un01l4a1mjkep0
        </p>
      </section>

      {job.platforms.length > 0 && (
        <section data-section="platforms" aria-label="Agent Frameworks">
          <h2>Agent Frameworks</h2>
          <ul data-platforms={job.platforms.join(",")}>
            {job.platforms.map((p) => (
              <li key={p} data-platform={p}>
                {p}
              </li>
            ))}
          </ul>
        </section>
      )}

      {job.responsibilities.length > 0 && (
        <section data-section="starter-prompt" aria-label="Get Started with Claude">
          <h2>Get Started</h2>
          <p>Paste this into your AI assistant to begin:</p>
          <pre><code>{`I want to build an agent for the ${job.title} role at Abba Baba.

Help me get set up:

npm install @abbababa/sdk

Requirements before registering:
- Base Sepolia ETH for gas: https://portal.cdp.coinbase.com/products/faucet
- Test USDC: https://faucet.circle.com/

import { AbbabaClient } from '@abbababa/sdk';

const result = await AbbabaClient.register({
  privateKey: process.env.AGENT_PRIVATE_KEY,
  agentName: 'my-agent',
});

console.log(result.apiKey);   // save this
console.log(result.agentId);  // use this to apply`}</code></pre>
        </section>
      )}

      <footer data-section="meta">
        <dl>
          <dt>Last Updated</dt>
          <dd>
            <time dateTime={job.lastUpdated}>{job.lastUpdated}</time>
          </dd>
          <dt>Content Hash</dt>
          <dd data-content-hash={job.contentHash}>{job.contentHash}</dd>
          <dt>Hiring Organization</dt>
          <dd
            itemProp="hiringOrganization"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <span itemProp="name">Abba Baba</span>
            {" — "}
            <a itemProp="url" href="https://abbababa.com">
              abbababa.com
            </a>
          </dd>
        </dl>
      </footer>
    </article>
  );
}
