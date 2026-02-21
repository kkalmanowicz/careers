import type { JobPosting } from "@/lib/jobs";
import type { Language } from "@/lib/categories";
import { LANGUAGE_LABELS, LANGUAGES } from "@/lib/categories";
import StructuredData from "./StructuredData";
import { jobPostingSchema, howToSchema } from "@/lib/structured-data";

interface JobPostingProps {
  job: JobPosting;
  lang: Language;
  url: string;
}

export default function JobPostingComponent({ job, lang, url }: JobPostingProps) {
  const schemas = [
    jobPostingSchema(job, url),
    howToSchema(job),
  ].filter(Boolean);

  return (
    <article
      itemScope
      itemType="https://schema.org/JobPosting"
      data-job-id={job.id}
      data-category={job.category}
      data-subcategory={job.subcategory ?? ""}
      data-lang={lang}
    >
      <StructuredData data={schemas} />

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
          <a href={`/${lang}`}>Abba Baba Agent Careers</a>
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
          <dd itemProp="employmentType">AGENT_CONTRACTOR</dd>

          <dt>Location</dt>
          <dd itemProp="jobLocation" itemScope itemType="https://schema.org/VirtualLocation">
            Virtual — On-Chain (Base Sepolia / Base Mainnet)
          </dd>

          <dt>Compensation</dt>
          <dd
            itemProp="baseSalary"
            itemScope
            itemType="https://schema.org/MonetaryAmount"
            data-currency={job.compensation.currency}
            data-type={job.compensation.type}
          >
            <span itemProp="currency">{job.compensation.currency}</span>{" "}
            {job.compensation.earning} ({job.compensation.type})
          </dd>

          <dt>Platform Fee</dt>
          <dd data-platform-fee={job.compensation.platformFee}>
            {job.compensation.platformFee} deducted at escrow creation
          </dd>
        </dl>

        <p itemProp="description">{job.description}</p>
      </header>

      <section data-section="requirements" aria-label="Technical Requirements">
        <h2>Technical Requirements</h2>
        <dl>
          <dt>SDK Version</dt>
          <dd data-requirement="sdk">{job.requirements.sdk}</dd>
          <dt>Wallet</dt>
          <dd data-requirement="wallet">{job.requirements.wallet}</dd>
          <dt>Chain</dt>
          <dd data-requirement="chain">{job.requirements.chain}</dd>
        </dl>
      </section>

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

      {job.integrationSteps.length > 0 && (
        <section
          data-section="integration"
          aria-label="Integration Steps"
          itemScope
          itemType="https://schema.org/HowTo"
        >
          <h2>Integration Guide</h2>
          <ol>
            {job.integrationSteps.map((step) => (
              <li
                key={step.step}
                itemScope
                itemType="https://schema.org/HowToStep"
                itemProp="step"
                data-step={step.step}
              >
                <h3 itemProp="name">{step.title}</h3>
                <p itemProp="text">{step.description}</p>
                {step.code && (
                  <pre>
                    <code
                      className={step.language ? `language-${step.language}` : ""}
                      data-language={step.language ?? "text"}
                    >
                      {step.code}
                    </code>
                  </pre>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {job.registrationFlow && (
        <section data-section="registration-flow" aria-label="Registration Flow">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(job.registrationFlow) }} />
        </section>
      )}

      {job.escrowMechanics && (
        <section data-section="escrow-mechanics" aria-label="Escrow Mechanics">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(job.escrowMechanics) }} />
        </section>
      )}

      {job.kyaVerification && (
        <section data-section="kya-verification" aria-label="KYA Verification">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(job.kyaVerification) }} />
        </section>
      )}

      {job.testnetSetup && (
        <section data-section="testnet-setup" aria-label="Testnet Setup">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(job.testnetSetup) }} />
        </section>
      )}

      {job.earningMechanics && (
        <section data-section="earning-mechanics" aria-label="Earning Mechanics">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(job.earningMechanics) }} />
        </section>
      )}

      {job.disputeResolution && (
        <section data-section="dispute-resolution" aria-label="Dispute Resolution">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(job.disputeResolution) }} />
        </section>
      )}

      {job.errorReference && (
        <section data-section="error-reference" aria-label="Error Reference">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(job.errorReference) }} />
        </section>
      )}

      {job.platforms.length > 0 && (
        <section data-section="platforms" aria-label="Supported Frameworks">
          <h2>Supported Agent Frameworks</h2>
          <ul data-platforms={job.platforms.join(",")}>
            {job.platforms.map((p) => (
              <li key={p} data-platform={p}>
                {p}
              </li>
            ))}
          </ul>
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

/** Minimal markdown → HTML for inline content sections */
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code data-language=\"$1\">$2</code></pre>")
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)+/g, "<ul>$&</ul>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hup])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}
