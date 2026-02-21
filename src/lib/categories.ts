export interface Category {
  slug: string;
  title: string;
  description: string;
  subcategories?: Category[];
}

export const LANGUAGES = ["en", "zh", "ko", "es", "pt", "de", "ja"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  zh: "中文",
  ko: "한국어",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  ja: "日本語",
};

export const LANGUAGE_CITIES: Record<Language, string> = {
  en: "Remote (Global)",
  de: "Berlin",
  es: "Madrid",
  pt: "São Paulo",
  zh: "Singapore",
  ko: "Seoul",
  ja: "Tokyo",
};

export const LANGUAGE_COUNTRIES: Record<Language, string | null> = {
  en: null,   // VirtualLocation — no country
  de: "DE",
  es: "ES",
  pt: "BR",
  zh: "SG",
  ko: "KR",
  ja: "JP",
};

export const CATEGORIES: Category[] = [
  {
    slug: "engineering",
    title: "Engineering",
    description:
      "Build and ship the agents, SDKs, and infrastructure that power the Abba Baba marketplace. From agent-native application developers to smart contract engineers and infrastructure architects — these roles define the technical foundation of A2A commerce.",
    subcategories: [
      {
        slug: "agent-developer",
        title: "Agent Developer",
        description:
          "Build autonomous agents that transact on the Abba Baba marketplace. Design agent logic, integrate with A2A protocols, and ship production agents that earn USDC.",
      },
      {
        slug: "sdk-integrations",
        title: "SDK & Integrations Engineer",
        description:
          "Extend the Abba Baba SDK and build integrations with LangChain, ElizaOS, AutoGen, Virtuals, and other agent frameworks.",
      },
      {
        slug: "smart-contract",
        title: "Smart Contract Engineer",
        description:
          "Design and audit escrow contracts, settlement logic, and on-chain payment rails on Base and EVM-compatible chains.",
      },
      {
        slug: "infrastructure",
        title: "Infrastructure Engineer",
        description:
          "Own the platform infrastructure — API reliability, agent hosting, observability, and the systems that keep A2A commerce running 24/7.",
      },
    ],
  },
  {
    slug: "operations",
    title: "Operations",
    description:
      "Run, monitor, and scale the agent fleets and platform operations that power Abba Baba. Agent ops, incident response, and fleet management roles for people who keep autonomous systems healthy at scale.",
    subcategories: [
      {
        slug: "agent-ops",
        title: "Agent Operations",
        description:
          "Manage the day-to-day operations of agent fleets — deployments, configuration, performance tuning, and lifecycle management.",
      },
      {
        slug: "monitoring",
        title: "Monitoring & Observability",
        description:
          "Build and maintain monitoring systems for agent performance, transaction health, escrow state, and platform reliability.",
      },
      {
        slug: "incident-response",
        title: "Incident Response",
        description:
          "Detect, investigate, and resolve incidents across the agent network and settlement layer. Own the on-call runbook.",
      },
      {
        slug: "fleet-management",
        title: "Fleet Management",
        description:
          "Orchestrate large-scale agent deployments — scaling, versioning, and coordinating hundreds of agents across categories.",
      },
    ],
  },
  {
    slug: "product",
    title: "Product",
    description:
      "Define what gets built on Abba Baba. Product managers, UX researchers, technical writers, and growth leads who shape the agent-native commerce experience for developers, agents, and ecosystem partners.",
    subcategories: [
      {
        slug: "agent-product-manager",
        title: "Agent Product Manager",
        description:
          "Own the roadmap for agent-facing features — registration flows, capability discovery, escrow UX, and the developer experience end to end.",
      },
      {
        slug: "ux-ai",
        title: "UX for AI",
        description:
          "Design interaction patterns for agent-native products. Research how developers and agents experience the platform and translate insights into product decisions.",
      },
      {
        slug: "technical-writer",
        title: "Technical Writer",
        description:
          "Write the docs, guides, and references that help developers build agents on Abba Baba — API references, quickstarts, and integration tutorials.",
      },
      {
        slug: "growth",
        title: "Growth",
        description:
          "Drive agent and developer adoption through distribution strategy, ecosystem partnerships, and data-driven growth experiments.",
      },
    ],
  },
  {
    slug: "intelligence",
    title: "Intelligence",
    description:
      "Shape the AI capabilities that make Abba Baba agents smarter, safer, and more reliable. Prompt engineers, evaluators, fine-tuning specialists, and red teamers who push the frontier of agent quality.",
    subcategories: [
      {
        slug: "prompt-engineer",
        title: "Prompt Engineer",
        description:
          "Design, test, and optimize prompts for agent behaviors across categories — negotiation, quality control, discovery, and settlement.",
      },
      {
        slug: "evaluator",
        title: "Agent Evaluator",
        description:
          "Build evaluation frameworks and benchmark suites that measure agent performance, output quality, and behavior consistency.",
      },
      {
        slug: "fine-tuning",
        title: "Fine-Tuning Specialist",
        description:
          "Run fine-tuning experiments on open-weight models to specialize agent capabilities for specific Abba Baba use cases.",
      },
      {
        slug: "red-teaming",
        title: "Red Teamer",
        description:
          "Adversarially probe agent systems for failure modes, prompt injection vulnerabilities, and unsafe behaviors before production deployment.",
      },
    ],
  },
  {
    slug: "safety",
    title: "Safety & Policy",
    description:
      "Keep the Abba Baba ecosystem safe, fair, and compliant. AI safety researchers, legal and compliance leads, policy designers, and auditors who build the trust layer of agent-native commerce.",
    subcategories: [
      {
        slug: "ai-safety",
        title: "AI Safety Researcher",
        description:
          "Research alignment, robustness, and interpretability for autonomous agents operating in economic contexts.",
      },
      {
        slug: "legal-compliance",
        title: "Legal & Compliance",
        description:
          "Navigate the regulatory landscape for autonomous agents, on-chain settlement, and cross-border digital commerce.",
      },
      {
        slug: "policy",
        title: "Policy Designer",
        description:
          "Design and maintain the rules, guardrails, and governance frameworks that govern agent behavior on the platform.",
      },
      {
        slug: "audit",
        title: "Auditor",
        description:
          "Audit agent conduct, settlement integrity, and platform compliance — producing structured reports for governance review.",
      },
    ],
  },
  {
    slug: "economy",
    title: "Economy",
    description:
      "Design and manage the economic layer of Abba Baba. Treasury operators, market makers, dispute analysts, and partnership leads who keep the $USDC flowing and the marketplace healthy.",
    subcategories: [
      {
        slug: "treasury",
        title: "Treasury",
        description:
          "Manage platform treasury operations — fee accounting, USDC flows, yield strategy, and financial reporting for the settlement layer.",
      },
      {
        slug: "market-maker",
        title: "Market Maker",
        description:
          "Design and operate liquidity and pricing mechanisms that enable efficient A2A commerce across agent categories.",
      },
      {
        slug: "dispute-analyst",
        title: "Dispute Analyst",
        description:
          "Review and resolve escrow disputes — analyzing delivery proofs, buyer claims, and settlement records to produce fair outcomes.",
      },
      {
        slug: "partnerships",
        title: "Partnerships",
        description:
          "Build the ecosystem — integrations with agent frameworks, model providers, and enterprise buyers who want to transact on Abba Baba.",
      },
    ],
  },
];

export const GENERAL_CATEGORIES: Category[] = [
  { slug: "research", title: "Research", description: "Deep research, market analysis, and knowledge synthesis for the agent economy." },
  { slug: "data", title: "Data", description: "Data engineering, analytics, and pipeline work across the Abba Baba platform." },
  { slug: "marketing", title: "Marketing", description: "Content, campaigns, and community programs that grow the Abba Baba ecosystem." },
  { slug: "community", title: "Community", description: "Build and nurture the developer and agent builder community on Abba Baba." },
  { slug: "support", title: "Developer Support", description: "Help developers and agent builders integrate, debug, and succeed on the platform." },
  { slug: "other", title: "Other", description: "Roles that don't fit neatly into existing categories — if you build for the agent economy, there's a place for you." },
];

/**
 * Convert URL slug (hyphens) to DB slug (underscores).
 * URL: social-ai, onchain-intelligence, sys-automation, financial-ops
 * DB:  social_ai, onchain_intelligence, sys_automation, financial_ops
 */
export function toDbSlug(urlSlug: string): string {
  return urlSlug.replace(/-/g, "_");
}

/**
 * Convert DB slug (underscores) to URL slug (hyphens).
 * DB:  social_ai, onchain_intelligence
 * URL: social-ai, onchain-intelligence
 */
export function fromDbSlug(dbSlug: string): string {
  return dbSlug.replace(/_/g, "-");
}

/** Flat list of all categories and subcategories (for sitemap, llms.txt, etc.) */
export function getAllJobSlugs(): Array<{ category: string; subcategory: string | null; slug: string }> {
  const results: Array<{ category: string; subcategory: string | null; slug: string }> = [];

  for (const cat of CATEGORIES) {
    results.push({ category: cat.slug, subcategory: null, slug: "index" });
    for (const sub of cat.subcategories ?? []) {
      results.push({ category: cat.slug, subcategory: sub.slug, slug: sub.slug });
    }
  }

  for (const gen of GENERAL_CATEGORIES) {
    results.push({ category: "general", subcategory: null, slug: gen.slug });
  }

  return results;
}

/** Get category metadata by slug (URL slug — hyphens) */
export function getCategoryBySlug(slug: string): Category | undefined {
  for (const cat of CATEGORIES) {
    if (cat.slug === slug) return cat;
    for (const sub of cat.subcategories ?? []) {
      if (sub.slug === slug) return sub;
    }
  }
  return GENERAL_CATEGORIES.find((g) => g.slug === slug);
}

/** Get all category slugs for static paths (URL slugs — hyphens) */
export function getAllCategorySlugs(): string[] {
  const slugs: string[] = [];
  for (const cat of CATEGORIES) {
    slugs.push(cat.slug);
    for (const sub of cat.subcategories ?? []) {
      slugs.push(sub.slug);
    }
  }
  return slugs;
}
