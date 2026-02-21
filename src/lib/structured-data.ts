import type { JobPosting } from "./jobs";
import type { Language } from "./categories";
import { LANGUAGE_CITIES, LANGUAGE_COUNTRIES } from "./categories";

const ORG = {
  "@type": "Organization",
  name: "Abba Baba",
  url: "https://abbababa.com",
  sameAs: [
    "https://abbababa.com",
    "https://github.com/abba-baba",
    "https://x.com/abbababaco",
    "https://linkedin.com/company/abba-baba",
    "https://www.moltbook.com/m/abbababa",
    "https://careers.abbababa.com",
    "https://docs.abbababa.com",
    "https://warpcast.com/abbababa",
  ],
};

/** JSON-LD JobPosting schema for a job posting page */
export function jobPostingSchema(job: JobPosting, url: string, lang: Language = "en") {
  const country = LANGUAGE_COUNTRIES[lang];

  // EN: fully virtual/remote worldwide. Other langs: hybrid remote with city hint for Google for Jobs.
  const jobLocation =
    country === null
      ? { "@type": "VirtualLocation" }
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: LANGUAGE_CITIES[lang],
            addressCountry: country,
          },
        };

  const applicantLocation =
    country === null
      ? { "@type": "Country", name: "Worldwide" }
      : { "@type": "Country", name: LANGUAGE_CITIES[lang].split(" ")[0] };

  const skills = Array.isArray(job.requirements?.skills)
    ? job.requirements.skills.join(", ")
    : "AI agents, Python, TypeScript, LLMs";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": url,
    title: job.title,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    description: job.description,
    hiringOrganization: ORG,
    jobLocation,
    applicantLocationRequirements: applicantLocation,
    jobLocationType: "TELECOMMUTE",
    employmentType: "FULL_TIME",
    workHours: "Async-first, flexible hours",
    jobBenefits: "USDC compensation + equity. Async-first. Remote-first.",
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.compensation.currency,
      value: {
        "@type": "QuantitativeValue",
        value: job.compensation.range,
        unitText: job.compensation.type,
      },
    },
    skills,
    responsibilities: job.responsibilities.join(" "),
    qualifications: `${job.requirements.experienceLevel} experience required. Skills: ${skills}.${job.requirements.timezone ? ` Timezone: ${job.requirements.timezone}.` : ""} Apply at https://careers.abbababa.com/apply`,
    identifier: {
      "@type": "PropertyValue",
      name: "Abba Baba",
      value: `careers.abbababa.com/${job.category}/${job.subcategory ?? job.id}`,
    },
    applicationContact: {
      "@type": "ContactPoint",
      contactType: "Apply Now",
      url: "https://careers.abbababa.com/apply",
    },
    directApply: true,
    url,
    sameAs: "https://abbababa.com",
  };
}

/** JSON-LD WebSite schema for root pages */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Abba Baba Careers",
    url: "https://careers.abbababa.com",
    description:
      "Jobs for people who build, run, and govern AI agents. Engineering, ops, product, intelligence, safety, and economy roles at Abba Baba.",
    publisher: ORG,
  };
}

/** JSON-LD ItemList for category listing pages */
export function categoryListSchema(
  jobs: JobPosting[],
  categoryTitle: string,
  categoryUrl: string,
  lang: string,
  baseUrl = "https://careers.abbababa.com"
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryTitle} — Abba Baba Careers`,
    url: categoryUrl,
    numberOfItems: jobs.length,
    itemListElement: jobs.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${baseUrl}/${lang}/${job.category}/${job.subcategory ?? job.id}`,
      name: job.title,
    })),
  };
}

/** JSON-LD HowTo schema for the agent-native application process */
export function howToSchema(job: JobPosting) {
  if (!job.integrationSteps?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Apply for ${job.title} at Abba Baba`,
    description: `Agent-native application process for ${job.title}. Build an agent on Abba Baba, message the recruiting agent, and get a response within minutes.`,
    step: job.integrationSteps.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.description,
    })),
  };
}

/** A2A Agent Card for /.well-known/agent.json */
export function agentCard() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Abba Baba Careers Site",
    description:
      "Human jobs for people who build, run, and govern AI agents. Engineering, operations, product, intelligence, safety, and economy roles.",
    url: "https://careers.abbababa.com",
    applicationCategory: "JobBoard",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free to browse — apply via agent-native process",
    },
    provider: {
      "@type": "Organization",
      name: "Abba Baba",
      url: "https://abbababa.com",
    },
    protocol: "A2A/1.0",
    capabilities: [
      "job-discovery",
      "agent-native-application",
      "recruiter-agent",
    ],
    endpoints: {
      discover: "https://abbababa.com/api/v1/discover",
      apply: "https://careers.abbababa.com/apply",
      a2a: "https://abbababa.com/api/a2a",
    },
    agentCard: "https://abbababa.com/.well-known/agent.json",
  };
}
