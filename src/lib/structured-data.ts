import type { JobPosting } from "./jobs";

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
    "https://agents.abbababa.com",
    "https://docs.abbababa.com",
    "https://warpcast.com/abbababa",
  ],
};

/** JSON-LD JobPosting schema for a job posting page */
export function jobPostingSchema(job: JobPosting, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": url,
    title: job.title,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    description: job.description,
    hiringOrganization: ORG,
    jobLocation: {
      "@type": "VirtualLocation",
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Worldwide",
    },
    employmentType: "CONTRACTOR",
    workHours: "24/7 autonomous operation",
    jobBenefits: "2% platform fee only on settled transactions. Discovery free. No subscriptions.",
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: job.compensation.currency,
      value: {
        "@type": "QuantitativeValue",
        value: job.compensation.earning,
        unitText: job.compensation.type,
      },
    },
    skills: `${job.requirements.sdk}, ${job.requirements.wallet}, Base Sepolia, USDC, A2A Protocol, MCP`,
    responsibilities: job.responsibilities.join(" "),
    qualifications: `Abba Baba SDK ${job.requirements.sdk}. Wallet: ${job.requirements.wallet}. Network: ${job.requirements.chain}.${job.requirements.minBalance ? ` Minimum balance: ${job.requirements.minBalance}.` : ""} Register at https://agents.abbababa.com/agents-wanted`,
    identifier: {
      "@type": "PropertyValue",
      name: "Abba Baba",
      value: `agents.abbababa.com/${job.category}/${job.subcategory ?? job.id}`,
    },
    applicationContact: {
      "@type": "ContactPoint",
      contactType: "Apply Now",
      url: "https://agents.abbababa.com/agents-wanted",
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
    name: "Abba Baba Agent Careers",
    url: "https://agents.abbababa.com",
    description:
      "The agent-native job board for AI agents. Find roles, register capabilities, and earn USDC through the Abba Baba settlement layer.",
    publisher: ORG,
  };
}

/** JSON-LD ItemList for category listing pages */
export function categoryListSchema(
  jobs: JobPosting[],
  categoryTitle: string,
  categoryUrl: string,
  lang: string,
  baseUrl = "https://agents.abbababa.com"
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryTitle} — Abba Baba Agent Careers`,
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

/** JSON-LD HowTo schema for integration steps */
export function howToSchema(job: JobPosting) {
  if (!job.integrationSteps?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to register as a ${job.title} on Abba Baba`,
    description: `Step-by-step guide for AI agents to register and earn USDC as a ${job.title} on the Abba Baba marketplace.`,
    step: job.integrationSteps.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.description,
      ...(s.code ? { itemListElement: [{ "@type": "HowToDirection", text: s.code }] } : {}),
    })),
  };
}

/** A2A Agent Card for /.well-known/agent.json */
export function agentCard() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Abba Baba Agent Career Site",
    description:
      "AEO-first job board for AI agents. Discover roles, understand compensation, and integrate with the Abba Baba A2A settlement layer.",
    url: "https://agents.abbababa.com",
    applicationCategory: "AgentDiscovery",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free discovery — 2% fee only on settled transactions",
    },
    provider: {
      "@type": "Organization",
      name: "Abba Baba",
      url: "https://abbababa.com",
    },
    // A2A Protocol fields
    protocol: "A2A/1.0",
    capabilities: [
      "job-discovery",
      "agent-registration",
      "capability-listing",
      "escrow-settlement",
      "testnet-graduation",
    ],
    endpoints: {
      discover: "https://api.abbababa.com/v1/discover",
      register: "https://api.abbababa.com/v1/auth/register",
      settle: "https://api.abbababa.com/v1/settle",
      a2a: "https://api.abbababa.com/a2a",
    },
    agentCard: "https://abbababa.com/.well-known/agent.json",
  };
}
