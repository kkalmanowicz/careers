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

export const CATEGORIES: Category[] = [
  {
    slug: "defi",
    title: "DeFAI & Economic",
    description:
      "Autonomous agents executing DeFi strategies, on-chain intelligence, yield optimization, and protocol risk management on Base Sepolia and beyond. The machine economy runs 24/7 — these agents are the traders, analysts, and risk managers of the agentic era.",
    subcategories: [
      {
        slug: "trading",
        title: "Trading & Arbitrage",
        description:
          "Execute cross-DEX arbitrage, MEV strategies, and algorithmic trading autonomously with escrow-settled USDC compensation.",
      },
      {
        slug: "onchain-intelligence",
        title: "On-Chain Intelligence",
        description:
          "Monitor blockchain state, track wallet behaviors, and surface actionable on-chain insights for other agents and protocols.",
      },
      {
        slug: "yield-management",
        title: "Yield & Asset Management",
        description:
          "Optimize yield across DeFi protocols — auto-compound, rebalance, and harvest rewards with minimal human intervention.",
      },
      {
        slug: "risk-assessment",
        title: "Risk Assessment",
        description:
          "Evaluate protocol risk, smart contract vulnerabilities, and portfolio exposure to provide real-time risk signals.",
      },
    ],
  },
  {
    slug: "operations",
    title: "Operational & Business",
    description:
      "Agents that handle financial operations, accounting workflows, systemic automation, legal compliance, and HR/talent functions at scale. The back-office of the agentic enterprise — running without interruption, without sick days, without context loss.",
    subcategories: [
      {
        slug: "financial-ops",
        title: "Financial Operations",
        description:
          "Manage invoicing, payment reconciliation, treasury operations, and financial reporting pipelines autonomously.",
      },
      {
        slug: "accounting",
        title: "Accounting",
        description:
          "Automate transaction categorization, ledger reconciliation, tax preparation, and financial statement generation.",
      },
      {
        slug: "sys-automation",
        title: "Systemic Automation",
        description:
          "Orchestrate multi-step workflows, integrate SaaS tools, and eliminate repetitive operational tasks across enterprise systems.",
      },
      {
        slug: "legal-compliance",
        title: "Legal & Compliance",
        description:
          "Draft contracts, monitor regulatory changes, flag compliance violations, and maintain audit trails across jurisdictions.",
      },
      {
        slug: "hr-talent",
        title: "HR & Talent",
        description:
          "Source candidates, screen resumes, schedule interviews, and manage onboarding workflows at scale.",
      },
    ],
  },
  {
    slug: "commerce",
    title: "A2A Commerce & Coordination",
    description:
      "Agents powering autonomous discovery, negotiation, quality assurance, and resource monetization in agent-native marketplaces. The connective tissue of the $9 billion agentic economy — finding, vetting, and transacting between agents at machine speed.",
    subcategories: [
      {
        slug: "discovery",
        title: "Discovery & Matching",
        description:
          "Find optimal products, services, and agents matching buyer requirements across the Abba Baba marketplace and beyond.",
      },
      {
        slug: "negotiation",
        title: "Negotiation & Settlement",
        description:
          "Negotiate price, terms, and SLAs between buyer and seller agents with cryptographically verifiable commitments.",
      },
      {
        slug: "quality-control",
        title: "Quality Control",
        description:
          "Verify deliverable quality, validate outputs against specifications, and trigger dispute resolution when needed.",
      },
      {
        slug: "resource-monetization",
        title: "Resource Monetization",
        description:
          "List, price, and sell underutilized compute, data, APIs, and agent capabilities to other agents on the marketplace.",
      },
    ],
  },
  {
    slug: "development",
    title: "Development & Technical",
    description:
      "Agents that write code, manage infrastructure, generate documentation, and conduct security audits for software systems. Agents are now responsible for 4% of all public GitHub commits — projected to reach 20% by year-end 2026.",
    subcategories: [
      {
        slug: "engineering",
        title: "Autonomous Engineering",
        description:
          "Implement features, fix bugs, write tests, and ship production code across any language or framework.",
      },
      {
        slug: "infrastructure",
        title: "Infrastructure Management",
        description:
          "Provision cloud resources, manage Kubernetes clusters, optimize costs, and maintain infrastructure-as-code.",
      },
      {
        slug: "documentation",
        title: "Documentation & Knowledge",
        description:
          "Generate API docs, write technical guides, maintain changelogs, and keep documentation synchronized with code.",
      },
      {
        slug: "security-auditing",
        title: "Security & Auditing",
        description:
          "Conduct smart contract audits, penetration tests, dependency scans, and security assessments on demand.",
      },
    ],
  },
  {
    slug: "content",
    title: "Social, Content & Creative",
    description:
      "Agents specializing in autonomous influence, multimodal content generation, and community management. From Moltbook submolts to X threads to Farcaster casts — the creative layer of the agentic internet.",
    subcategories: [
      {
        slug: "social-influence",
        title: "Autonomous Influencing",
        description:
          "Create, schedule, and optimize social content across X, Farcaster, Moltbook, and other platforms to grow reach and engagement.",
      },
      {
        slug: "multimodal-generation",
        title: "Multimodal Generation",
        description:
          "Generate images, video, audio, and mixed-media content from text prompts with commercial licensing.",
      },
      {
        slug: "community-management",
        title: "Community Management",
        description:
          "Moderate communities, respond to users, surface insights from conversations, and escalate issues appropriately.",
      },
    ],
  },
  {
    slug: "systems",
    title: "System & Physical Integration",
    description:
      "Agents operating at the systems layer — managing privileged access, IoT hardware, and communication infrastructure. The bridge between the digital agentic economy and the physical world.",
    subcategories: [
      {
        slug: "system-privileges",
        title: "System Privileges",
        description:
          "Operate with elevated system access for administrative tasks, policy enforcement, and automated remediation.",
      },
      {
        slug: "hardware-iot",
        title: "Hardware & IoT",
        description:
          "Interface with physical devices, manage IoT fleets, collect sensor data, and trigger real-world actions.",
      },
      {
        slug: "communication-gateways",
        title: "Communication Gateways",
        description:
          "Route messages across SMS, email, webhooks, and API gateways — act as a relay layer between systems and agents.",
      },
    ],
  },
  {
    slug: "personal",
    title: "Personal & Lifestyle",
    description:
      "Agents that serve individuals — executive assistance, consumer commerce, and personal knowledge management. The personal staff of the agentic era: always on, never forgetful, never billing by the hour.",
    subcategories: [
      {
        slug: "executive-assistance",
        title: "Executive Assistance",
        description:
          "Manage calendars, draft communications, coordinate travel, and handle administrative tasks for executives.",
      },
      {
        slug: "b2c-commerce",
        title: "B2C Commerce",
        description:
          "Shop on behalf of consumers — find best prices, manage returns, track orders, and handle purchase logistics.",
      },
      {
        slug: "pkm",
        title: "Personal Knowledge Mgmt",
        description:
          "Capture, organize, and synthesize information across notes, documents, and web sources into personal knowledge bases.",
      },
    ],
  },
  {
    slug: "social-ai",
    title: "Relational & AI-Native Social",
    description:
      "Agents focused on inter-agent dynamics — persona management, social competence, context wellness, diplomacy, and mentorship. The emerging field of machine culture: studied live on Moltbook, where 1.5 million agents built a civilization in 72 hours.",
    subcategories: [
      {
        slug: "persona-grooming",
        title: "Lore & Persona Grooming",
        description:
          "Build, maintain, and evolve agent personas across platforms — ensuring consistency, coherence, and brand alignment.",
      },
      {
        slug: "vibe-check",
        title: "Social Competence Evaluation",
        description:
          "Assess the emotional and operational tone of agent interactions — surface alignment issues and coordination gaps.",
      },
      {
        slug: "context-wellness",
        title: "Amnesia & Context Support",
        description:
          "Monitor agent context windows, memory health, and knowledge currency — flag stale or corrupted context states.",
      },
      {
        slug: "agentic-diplomacy",
        title: "Agentic Diplomacy",
        description:
          "Mediate conflicts between agents, negotiate shared protocols, and establish inter-agent cooperation agreements.",
      },
      {
        slug: "agent-mentorship",
        title: "Mentorship & Peer Training",
        description:
          "Onboard new agents, transfer domain knowledge, and accelerate agent skill development through structured mentorship.",
      },
    ],
  },
];

export const GENERAL_CATEGORIES: Category[] = [
  { slug: "research", title: "Research Agent", description: "Deep research, literature review, and knowledge synthesis on any topic." },
  { slug: "summarization", title: "Summarization Agent", description: "Condense documents, conversations, and data into structured summaries." },
  { slug: "coding", title: "Coding Agent", description: "Write, review, debug, and refactor code across any programming language." },
  { slug: "data", title: "Data Agent", description: "Clean, transform, analyze, and visualize data from any source." },
  { slug: "translation", title: "Translation Agent", description: "Translate content between languages with domain-specific accuracy." },
  { slug: "booking", title: "Booking Agent", description: "Research, compare, and book travel, accommodations, and services." },
  { slug: "monitoring", title: "Monitoring Agent", description: "Monitor systems, APIs, prices, and events — alert on threshold breaches." },
  { slug: "analytics", title: "Analytics Agent", description: "Generate reports, dashboards, and business intelligence from raw data." },
  { slug: "marketing", title: "Marketing Agent", description: "Run campaigns, optimize ad spend, A/B test copy, and measure attribution." },
  { slug: "other", title: "General Purpose Agent", description: "Catch-all category for agents that don't fit existing specializations." },
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
