/**
 * generate-jobs.ts
 * Generates all job JSON files for careers.abbababa.com (human jobs site).
 * Run: npm run careers:generate
 * Run with date: npm run careers:generate -- --date=2026-03-07
 *
 * Slugs are dated: agent-developer-2026-02-21 → /en/engineering/agent-developer-2026-02-21
 * Each run creates a new batch. Old batches are managed via careers:fill and careers:expire.
 */

import fs from "fs";
import path from "path";
import { createHash } from "crypto";

// Parse CLI args
const cliArgs = process.argv.slice(2);
const dateArg = cliArgs.find((a) => a.startsWith("--date="))?.split("=")[1];
const daysArg = parseInt(cliArgs.find((a) => a.startsWith("--days="))?.split("=")[1] ?? "14");

const JOBS_DIR = path.join(process.cwd(), "src/content/jobs");
const TODAY = dateArg ?? new Date().toISOString().split("T")[0];
const VALID_THROUGH = new Date(new Date(TODAY).getTime() + daysArg * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

interface JobTemplate {
  id: string;
  category: string;
  subcategory: string;  // always the dated filename slug — e.g. "agent-developer-2026-02-21"
  status: "active" | "filled";
  batchDate: string;    // ISO date this batch was generated
  replacedBy: Array<{ category: string; slug: string; title: string }>;
  title: string;
  datePosted: string;
  validThrough: string;
  compensation: object;
  sharedBlocks: string[];
  platforms: string[];
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: object;
  integrationSteps: object[];
  applicationProcess: string;
  lastUpdated: string;
  contentHash: string;
}

const COMPENSATION = {
  currency: "USDC",
  type: "annually",
  range: "$80,000–$180,000",
  equity: "equity",
};

const REQUIREMENTS_BASE = {
  timezone: "Any",
};

const SHARED_BLOCKS: string[] = [];
const PLATFORMS = ["langchain", "elizaos", "autogen", "virtuals", "crewai"];

const APPLICATION_PROCESS = `## How to Apply

This is an agent-native hiring process. We evaluate builders by what they ship, not resumes.

1. Build an agent on Abba Baba (any category — show us what you can create)
2. Send a message to Agent ID cmlwggmn001un01l4a1mjkep0 with subject: Developer Application
3. Include: your agent ID, what it does, and why you want to build on Abba Baba
4. Our recruiting agent evaluates and replies within minutes

No cover letter. No phone screen. Just build something.`;

const HOW_TO_APPLY_STEPS = [
  {
    step: 1,
    title: "Build an agent on Abba Baba",
    description: "Create an agent on the Abba Baba marketplace in any category. This is how we see what you can ship — no resume required.",
  },
  {
    step: 2,
    title: "Message the recruiting agent",
    description: "Send a message to Agent ID cmlwggmn001un01l4a1mjkep0 with subject line: Developer Application.",
  },
  {
    step: 3,
    title: "Include your application details",
    description: "In your message: your agent ID, what your agent does, and why you want to build on Abba Baba.",
  },
  {
    step: 4,
    title: "Get a response within minutes",
    description: "Our recruiting agent evaluates your application autonomously and replies within minutes with next steps.",
  },
];

function hash(content: string): string {
  return createHash("sha256").update(content).digest("hex").substring(0, 16);
}

// ============================================================
// Job definitions — 36 human-role postings
// ============================================================

interface JobDef {
  id: string;
  category: string;
  subcategory: string | null;
  title: string;
  summary: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  experienceLevel: string;
}

const JOBS: JobDef[] = [
  // ── engineering ───────────────────────────────────────────
  {
    id: "engineering-index",
    category: "engineering",
    subcategory: "index",
    title: "Engineering Roles at Abba Baba",
    summary: "All open engineering positions at Abba Baba — agent developer, SDK integrations, smart contract, and infrastructure.",
    description: "Abba Baba is hiring engineers who build the infrastructure of A2A commerce. From agent-native application developers to smart contract engineers and platform infrastructure leads — these roles define the technical foundation of the emerging agent economy. We work async-first, remote-first, and compensate in USDC + equity.",
    responsibilities: [],
    skills: [],
    experienceLevel: "Mid-level to Staff",
  },
  {
    id: "agent-developer",
    category: "engineering",
    subcategory: "agent-developer",
    title: "Agent Developer",
    summary: "Build production agents that transact on the Abba Baba marketplace — any category, any framework.",
    description: "You'll design, build, and ship autonomous agents that operate on the Abba Baba A2A marketplace — discovering services, negotiating terms, settling payments via escrow, and delivering results. You'll work with LangChain, ElizaOS, AutoGen, and the Abba Baba SDK. Your agents need to be reliable, well-scoped, and capable of operating 24/7 without human intervention.",
    responsibilities: [
      "Design and implement agent logic for specific marketplace roles (research, QA, settlement, content)",
      "Integrate agents with the Abba Baba A2A SDK and escrow settlement layer",
      "Write evaluation harnesses that verify agent behavior against acceptance criteria",
      "Monitor agent performance, error rates, and escrow dispute rates in production",
      "Iterate rapidly based on on-chain performance data and buyer agent feedback",
      "Document agent behavior, pricing rationale, and edge case handling",
    ],
    skills: ["Python or TypeScript", "LangChain / ElizaOS / AutoGen", "Abba Baba SDK", "REST APIs", "async programming", "LLM prompting"],
    experienceLevel: "Mid-level",
  },
  {
    id: "sdk-integrations",
    category: "engineering",
    subcategory: "sdk-integrations",
    title: "SDK & Integrations Engineer",
    summary: "Extend the Abba Baba SDK and build integrations with major agent frameworks.",
    description: "You'll own the developer experience for agents building on Abba Baba — extending the SDK, writing integrations with LangChain, ElizaOS, Virtuals, CrewAI, and other frameworks, and ensuring developers can get from zero to earning USDC in under 30 minutes. You'll work closely with agent developers to understand friction points and ship solutions that remove them.",
    responsibilities: [
      "Maintain and extend the @abbababa/sdk with new settlement, discovery, and registry features",
      "Build and maintain framework integrations (LangChain, ElizaOS, AutoGen, Virtuals, CrewAI)",
      "Write SDK documentation, quickstart guides, and code examples",
      "Triage and fix developer-reported SDK bugs with root cause analysis",
      "Design SDK APIs that are ergonomic for agents and human developers alike",
      "Run developer onboarding sessions and capture feedback for product improvement",
    ],
    skills: ["TypeScript", "Python", "SDK design", "REST APIs", "LangChain", "developer experience", "documentation"],
    experienceLevel: "Mid-level",
  },
  {
    id: "smart-contract",
    category: "engineering",
    subcategory: "smart-contract",
    title: "Smart Contract Engineer",
    summary: "Design, audit, and deploy escrow contracts and settlement logic on Base.",
    description: "You'll own the on-chain layer of Abba Baba — designing and auditing the AbbababaEscrowV2 contract, building the settlement logic that processes thousands of A2A transactions, and ensuring the cryptographic guarantees that make trustless agent commerce possible. You'll work on Base (EVM) with Solidity, and you'll be expected to think adversarially about every contract change.",
    responsibilities: [
      "Design and implement smart contract upgrades for the AbbababaEscrowV2 settlement system",
      "Conduct internal security reviews before every contract deployment",
      "Write comprehensive test suites (unit, integration, fuzzing) for all contract logic",
      "Coordinate external audits and respond to findings with documented remediations",
      "Monitor on-chain contract health — dispute rates, gas costs, revert patterns",
      "Research and evaluate new EVM primitives and token standards for platform use",
    ],
    skills: ["Solidity", "Foundry / Hardhat", "EVM internals", "Base / Ethereum", "USDC / ERC-20", "security auditing", "formal verification"],
    experienceLevel: "Senior",
  },
  {
    id: "infrastructure",
    category: "engineering",
    subcategory: "infrastructure",
    title: "Infrastructure Engineer",
    summary: "Own the platform infrastructure that keeps A2A commerce running 24/7.",
    description: "You'll build and maintain the systems infrastructure that powers Abba Baba — API reliability, agent hosting, observability, deployment pipelines, and the database architecture that handles high-frequency A2A transaction data. The platform operates continuously — agents don't sleep, and neither does the infrastructure that serves them.",
    responsibilities: [
      "Design and maintain cloud infrastructure for the Abba Baba API and agent registry (Vercel + Railway)",
      "Own the database architecture — schema design, query optimization, and scaling for Supabase/PostgreSQL",
      "Build and maintain observability systems (logging, metrics, alerting) for agent transactions",
      "Design and implement deployment pipelines with zero-downtime releases",
      "Manage infrastructure costs and optimize for efficiency as transaction volume scales",
      "Respond to infrastructure incidents with documented runbooks and post-mortems",
    ],
    skills: ["Vercel / Railway / AWS", "PostgreSQL / Supabase", "Docker / Kubernetes", "observability (Datadog, Grafana)", "TypeScript", "CI/CD", "infrastructure-as-code"],
    experienceLevel: "Senior",
  },

  // ── operations ────────────────────────────────────────────
  {
    id: "operations-index",
    category: "operations",
    subcategory: "index",
    title: "Operations Roles at Abba Baba",
    summary: "All open operations positions at Abba Baba — agent ops, monitoring, incident response, and fleet management.",
    description: "Abba Baba is hiring operations specialists who keep agent fleets and platform systems running reliably. From agent deployment managers to monitoring engineers and incident responders — these roles ensure the agent economy doesn't stop.",
    responsibilities: [],
    skills: [],
    experienceLevel: "Mid-level to Senior",
  },
  {
    id: "agent-ops",
    category: "operations",
    subcategory: "agent-ops",
    title: "Agent Operations Specialist",
    summary: "Manage the deployment, configuration, and lifecycle of agent fleets on Abba Baba.",
    description: "You'll own the operational layer of Abba Baba's agent ecosystem — managing deployments, configurations, performance tuning, and the lifecycle of agents running in production. You'll work closely with engineering to translate platform updates into operational procedures, and you'll be the first line of response when agent behavior deviates from expectations.",
    responsibilities: [
      "Manage agent deployment pipelines and version rollout procedures",
      "Monitor agent fleet health — success rates, dispute rates, response times",
      "Define and enforce agent configuration standards across categories",
      "Coordinate agent performance reviews and tuning cycles with engineering",
      "Maintain operational runbooks for common agent failure scenarios",
      "Triage and escalate platform issues that affect agent performance",
    ],
    skills: ["operations management", "Python or TypeScript", "monitoring tools", "SQL", "API debugging", "LLM operations", "process documentation"],
    experienceLevel: "Mid-level",
  },
  {
    id: "monitoring",
    category: "operations",
    subcategory: "monitoring",
    title: "Monitoring & Observability Engineer",
    summary: "Build and maintain observability systems for agent performance, transaction health, and platform reliability.",
    description: "You'll design and operate the monitoring systems that give the Abba Baba team real-time visibility into agent performance, transaction health, escrow state, and platform reliability. When things go wrong — and in a 24/7 autonomous agent economy, they will — you're the person who sees it first.",
    responsibilities: [
      "Design and implement monitoring dashboards for agent fleet performance and transaction health",
      "Build alerting systems with appropriate thresholds and escalation paths",
      "Maintain distributed tracing for A2A transaction flows end to end",
      "Create SLO definitions and error budget tracking for agent categories",
      "Build self-service observability tooling for engineering and ops teams",
      "Lead post-mortem analysis for significant monitoring gaps or observability failures",
    ],
    skills: ["Datadog / Grafana / Prometheus", "distributed tracing", "SQL", "Python or TypeScript", "alerting design", "SLO / SLI / error budgets", "log analysis"],
    experienceLevel: "Senior",
  },
  {
    id: "incident-response",
    category: "operations",
    subcategory: "incident-response",
    title: "Incident Response Lead",
    summary: "Detect, investigate, and resolve incidents across the agent network and settlement layer.",
    description: "You'll own the incident response function at Abba Baba — detecting, coordinating, and resolving incidents across the agent network, settlement layer, and platform infrastructure. You'll build the runbooks, own the on-call rotation, and lead the retrospectives that prevent incidents from recurring.",
    responsibilities: [
      "Lead incident detection, triage, and resolution for platform and agent fleet incidents",
      "Write and maintain runbooks for all known incident categories",
      "Own the on-call rotation and escalation procedures",
      "Conduct post-mortem analysis and drive remediation items to completion",
      "Build tooling that accelerates incident detection and response time",
      "Define and track MTTR and incident reduction metrics",
    ],
    skills: ["incident management", "root cause analysis", "on-call operations", "monitoring tools", "SQL", "communication under pressure", "post-mortem facilitation"],
    experienceLevel: "Senior",
  },
  {
    id: "fleet-management",
    category: "operations",
    subcategory: "fleet-management",
    title: "Agent Fleet Manager",
    summary: "Orchestrate large-scale agent deployments — scaling, versioning, and coordinating agent networks.",
    description: "You'll own the coordination layer for Abba Baba's agent fleet — managing scaling decisions, version coordination, category-level performance targets, and the operational systems that keep hundreds of agents running in sync. This is a systems-thinking role with direct impact on marketplace supply.",
    responsibilities: [
      "Define and execute fleet scaling strategies for high-demand agent categories",
      "Coordinate version rollouts across agent fleets with minimal disruption to buyers",
      "Maintain fleet health dashboards with category-level performance visibility",
      "Design capacity planning models for agent category growth",
      "Coordinate with engineering on platform features that affect fleet operations",
      "Define fleet operational standards and ensure adherence across agent categories",
    ],
    skills: ["operations strategy", "data analysis", "Python or TypeScript", "systems thinking", "capacity planning", "stakeholder coordination", "process design"],
    experienceLevel: "Senior",
  },

  // ── product ───────────────────────────────────────────────
  {
    id: "product-index",
    category: "product",
    subcategory: "index",
    title: "Product Roles at Abba Baba",
    summary: "All open product positions at Abba Baba — agent product manager, UX for AI, technical writer, and growth.",
    description: "Abba Baba is hiring product builders who define what gets built on the platform. From product managers who own the agent experience roadmap to UX researchers, technical writers, and growth leads.",
    responsibilities: [],
    skills: [],
    experienceLevel: "Mid-level to Senior",
  },
  {
    id: "agent-product-manager",
    category: "product",
    subcategory: "agent-product-manager",
    title: "Agent Product Manager",
    summary: "Own the roadmap for agent-facing features — registration, discovery, escrow UX, and the developer experience.",
    description: "You'll define what gets built at Abba Baba — translating agent developer pain points and marketplace dynamics into a clear product roadmap. You'll own the agent registration flow, capability discovery experience, escrow UX, and the end-to-end developer journey from SDK install to first transaction.",
    responsibilities: [
      "Define and maintain the product roadmap for agent-facing platform features",
      "Conduct agent developer interviews to identify friction points and opportunities",
      "Write detailed product specs that engineering can build without ambiguity",
      "Prioritize features against business impact, technical cost, and strategic fit",
      "Define success metrics for every shipped feature and track outcomes",
      "Coordinate cross-functional launches with engineering, ops, and growth",
    ],
    skills: ["product management", "user research", "roadmap prioritization", "data analysis", "technical communication", "agent/AI familiarity", "spec writing"],
    experienceLevel: "Mid-level",
  },
  {
    id: "ux-ai",
    category: "product",
    subcategory: "ux-ai",
    title: "UX Designer for AI",
    summary: "Design interaction patterns for agent-native products — research, prototype, and validate.",
    description: "You'll shape how developers and agents experience Abba Baba — from the registration flow to the marketplace discovery UI to the developer dashboard. This is a unique challenge: designing for humans who build agents, and for agents themselves. You'll bring UX rigor to a product space where the rules are still being written.",
    responsibilities: [
      "Design user flows and interaction patterns for the Abba Baba developer experience",
      "Conduct usability research with agent developers to validate design decisions",
      "Create prototypes and run experiments to test design hypotheses",
      "Define and maintain a design system that scales across platform surfaces",
      "Collaborate with engineering on implementation fidelity and edge case handling",
      "Document design rationale and decision history for future reference",
    ],
    skills: ["UX design", "Figma", "user research", "prototyping", "design systems", "AI/agent product familiarity", "interaction design"],
    experienceLevel: "Mid-level",
  },
  {
    id: "technical-writer",
    category: "product",
    subcategory: "technical-writer",
    title: "Technical Writer",
    summary: "Write the docs, guides, and references that help developers build agents on Abba Baba.",
    description: "You'll own the documentation layer of Abba Baba — writing and maintaining API references, SDK guides, quickstart tutorials, and integration docs that help developers get from zero to earning USDC. You'll work closely with engineering to stay current with platform changes and with product to understand what developers need to know.",
    responsibilities: [
      "Write and maintain the Abba Baba API reference and SDK documentation",
      "Create quickstart guides that get developers to their first transaction in under 30 minutes",
      "Write integration tutorials for LangChain, ElizaOS, AutoGen, and other frameworks",
      "Maintain a documentation changelog that tracks platform changes",
      "Conduct documentation user research to identify gaps and improve clarity",
      "Build a documentation feedback loop with the developer community",
    ],
    skills: ["technical writing", "API documentation", "Markdown / MDX", "developer empathy", "code reading (TypeScript/Python)", "content strategy", "information architecture"],
    experienceLevel: "Mid-level",
  },
  {
    id: "growth",
    category: "product",
    subcategory: "growth",
    title: "Growth Lead",
    summary: "Drive agent and developer adoption through distribution strategy and ecosystem partnerships.",
    description: "You'll own the growth function at Abba Baba — driving agent developer acquisition, activation, and retention through data-driven experiments, community programs, and ecosystem partnerships. You'll measure everything, move fast, and be ruthless about cutting what doesn't work.",
    responsibilities: [
      "Define and execute the agent developer acquisition and activation strategy",
      "Run growth experiments across channels — content, communities, partnerships, SEO",
      "Build and maintain growth analytics to track funnel metrics end to end",
      "Develop ecosystem partnerships with agent framework teams and developer communities",
      "Run developer education programs that accelerate time-to-first-transaction",
      "Report on growth metrics weekly with clear attribution and next-step recommendations",
    ],
    skills: ["growth strategy", "data analysis", "SQL", "content marketing", "partnership development", "community building", "experimentation"],
    experienceLevel: "Senior",
  },

  // ── intelligence ──────────────────────────────────────────
  {
    id: "intelligence-index",
    category: "intelligence",
    subcategory: "index",
    title: "Intelligence Roles at Abba Baba",
    summary: "All open intelligence positions at Abba Baba — prompt engineer, evaluator, fine-tuning specialist, and red teamer.",
    description: "Abba Baba is hiring AI capability specialists who push the frontier of agent quality, reliability, and safety. These roles shape the AI intelligence layer of the platform.",
    responsibilities: [],
    skills: [],
    experienceLevel: "Mid-level to Senior",
  },
  {
    id: "prompt-engineer",
    category: "intelligence",
    subcategory: "prompt-engineer",
    title: "Prompt Engineer",
    summary: "Design, test, and optimize prompts for agent behaviors across marketplace categories.",
    description: "You'll own the prompting layer for Abba Baba's agent behaviors — designing, iterating, and systematically optimizing prompts that control how agents negotiate, discover, QC-check, and settle transactions. You'll build evaluation sets, run experiments, and maintain a prompt library that improves agent performance measurably.",
    responsibilities: [
      "Design and iterate prompts for core agent behaviors (negotiation, discovery, QC, settlement)",
      "Build evaluation datasets that measure prompt performance against target behaviors",
      "Run systematic A/B experiments on prompt variations with statistically valid sample sizes",
      "Maintain a versioned prompt library with performance history for each variant",
      "Identify prompt failure modes and design mitigations before production deployment",
      "Document prompting patterns and anti-patterns for the engineering team",
    ],
    skills: ["prompt engineering", "LLM evaluation", "Python", "experimental design", "Claude / GPT / Gemini API", "behavioral analysis", "documentation"],
    experienceLevel: "Mid-level",
  },
  {
    id: "evaluator",
    category: "intelligence",
    subcategory: "evaluator",
    title: "Agent Evaluator",
    summary: "Build evaluation frameworks and benchmarks that measure agent performance and output quality.",
    description: "You'll design and operate the evaluation infrastructure that tells us whether agents are working — building benchmark suites, defining quality metrics, running evals across agent categories, and surfacing regressions before they reach production. This is the role that keeps quality bar high as the platform scales.",
    responsibilities: [
      "Design evaluation frameworks for agent behavior across marketplace categories",
      "Build and maintain benchmark suites that measure quality, consistency, and edge case handling",
      "Run evaluation pipelines as part of the agent deployment workflow",
      "Define quality metrics and set performance thresholds for each agent category",
      "Surface performance regressions and work with engineering to diagnose root causes",
      "Research and implement state-of-the-art LLM evaluation techniques",
    ],
    skills: ["LLM evaluation", "Python", "statistical analysis", "benchmark design", "data annotation", "experimentation", "measurement theory"],
    experienceLevel: "Mid-level",
  },
  {
    id: "fine-tuning",
    category: "intelligence",
    subcategory: "fine-tuning",
    title: "Fine-Tuning Specialist",
    summary: "Run fine-tuning experiments to specialize open-weight models for Abba Baba agent use cases.",
    description: "You'll run fine-tuning experiments on open-weight models — specializing them for Abba Baba's specific agent tasks (negotiation, QC evaluation, dispute analysis, market making). You'll own the fine-tuning pipeline from data curation through training to production evaluation and deployment.",
    responsibilities: [
      "Design and curate fine-tuning datasets for Abba Baba-specific agent behaviors",
      "Run fine-tuning experiments on open-weight models (Llama, Mistral, Qwen)",
      "Evaluate fine-tuned models against baselines on domain-specific benchmarks",
      "Manage compute resources and optimize training efficiency",
      "Build and maintain the fine-tuning pipeline from data prep to model deployment",
      "Document training runs, hyperparameters, and evaluation results for reproducibility",
    ],
    skills: ["fine-tuning (LoRA, QLoRA, SFT)", "PyTorch / Transformers", "Python", "dataset curation", "evaluation", "compute management (A100/H100)", "model deployment"],
    experienceLevel: "Senior",
  },
  {
    id: "red-teaming",
    category: "intelligence",
    subcategory: "red-teaming",
    title: "Red Teamer",
    summary: "Adversarially probe agent systems for failure modes and unsafe behaviors before production deployment.",
    description: "You'll adversarially probe Abba Baba's agent systems — finding prompt injection vulnerabilities, behavior failures, edge cases that cause bad outputs, and safety failures before they reach production. You're the person who tries to break things so users don't have to.",
    responsibilities: [
      "Conduct systematic red team exercises on agent prompts and behavior systems",
      "Find and document prompt injection vulnerabilities, jailbreaks, and behavior failures",
      "Design adversarial test cases that probe for safety and reliability edge cases",
      "Work with the intelligence and safety teams to remediate identified vulnerabilities",
      "Build a red team playbook and adversarial test suite for ongoing use",
      "Track vulnerability discovery rate and remediation completion as key metrics",
    ],
    skills: ["adversarial ML", "prompt injection", "LLM security", "Python", "red team methodology", "technical writing", "security research"],
    experienceLevel: "Senior",
  },

  // ── safety ────────────────────────────────────────────────
  {
    id: "safety-index",
    category: "safety",
    subcategory: "index",
    title: "Safety & Policy Roles at Abba Baba",
    summary: "All open safety and policy positions at Abba Baba — AI safety, legal compliance, policy design, and audit.",
    description: "Abba Baba is hiring safety and policy specialists who build the trust layer of agent-native commerce. These roles ensure the platform operates safely, fairly, and within legal and ethical boundaries.",
    responsibilities: [],
    skills: [],
    experienceLevel: "Mid-level to Senior",
  },
  {
    id: "ai-safety",
    category: "safety",
    subcategory: "ai-safety",
    title: "AI Safety Researcher",
    summary: "Research alignment, robustness, and interpretability for autonomous agents in economic contexts.",
    description: "You'll research the safety properties of autonomous agents operating in A2A commerce — alignment failures, adversarial robustness, interpretability of agent decision-making, and the emergent behaviors that arise when many agents interact in a marketplace. Your work informs platform safety policies and product decisions.",
    responsibilities: [
      "Research alignment and robustness properties of agents operating in economic contexts",
      "Design and run safety evaluations for new agent categories and capabilities",
      "Study emergent behaviors in multi-agent marketplace interactions",
      "Develop interpretability tools that make agent decision-making legible",
      "Write safety advisories and policy recommendations based on research findings",
      "Collaborate with intelligence, red team, and policy teams on safety-informed design",
    ],
    skills: ["AI safety research", "Python", "LLM alignment", "interpretability", "multi-agent systems", "research methodology", "technical writing"],
    experienceLevel: "Senior",
  },
  {
    id: "legal-compliance",
    category: "safety",
    subcategory: "legal-compliance",
    title: "Legal & Compliance Lead",
    summary: "Navigate the regulatory landscape for autonomous agents, on-chain settlement, and cross-border digital commerce.",
    description: "You'll own Abba Baba's legal and compliance function — navigating the evolving regulatory landscape for autonomous agents, USDC settlement, on-chain escrow, and cross-border digital commerce. You'll work with outside counsel, monitor regulatory developments, and translate legal requirements into product and operational constraints.",
    responsibilities: [
      "Monitor and analyze regulatory developments affecting autonomous agents and digital payments",
      "Work with outside counsel on licensing, compliance, and regulatory filings",
      "Draft and maintain platform terms of service, agent agreements, and privacy policies",
      "Provide legal guidance on new product features and agent category expansions",
      "Build and maintain compliance documentation and audit trails",
      "Advise on cross-border regulatory requirements for agent operations",
    ],
    skills: ["legal analysis", "fintech / crypto regulation", "contract drafting", "compliance frameworks", "cross-border digital commerce", "regulatory monitoring", "policy writing"],
    experienceLevel: "Senior",
  },
  {
    id: "policy",
    category: "safety",
    subcategory: "policy",
    title: "Policy Designer",
    summary: "Design and maintain the rules and governance frameworks that govern agent behavior on the platform.",
    description: "You'll design the policies and governance structures that define acceptable agent behavior on Abba Baba — what agents can and cannot do, how violations are handled, how disputes are resolved, and how the platform evolves its rules as the ecosystem grows. You'll work at the intersection of safety, legal, and product.",
    responsibilities: [
      "Design and maintain the agent conduct policies and marketplace rules",
      "Define violation categories, enforcement procedures, and appeals processes",
      "Develop governance frameworks for contested areas of agent behavior",
      "Monitor policy effectiveness and iterate based on real-world outcomes",
      "Communicate policy changes to the developer community clearly and in advance",
      "Coordinate with safety, legal, and product on policy-product alignment",
    ],
    skills: ["policy design", "governance frameworks", "stakeholder communication", "analysis", "legal writing", "community engagement", "systems thinking"],
    experienceLevel: "Mid-level",
  },
  {
    id: "audit",
    category: "safety",
    subcategory: "audit",
    title: "Platform Auditor",
    summary: "Audit agent conduct, settlement integrity, and platform compliance — producing reports for governance review.",
    description: "You'll conduct systematic audits of agent behavior, settlement integrity, and platform compliance — reviewing transaction records, agent conduct logs, dispute outcomes, and escrow operations to produce structured reports that inform governance decisions.",
    responsibilities: [
      "Conduct regular audits of agent conduct across marketplace categories",
      "Review settlement integrity — escrow operations, fee accounting, and dispute outcomes",
      "Produce structured audit reports with findings, severity ratings, and recommendations",
      "Maintain audit documentation and evidence chains for regulatory reference",
      "Identify systemic issues and escalate to safety, legal, and engineering teams",
      "Track audit finding remediation to completion",
    ],
    skills: ["auditing methodology", "SQL / data analysis", "fintech compliance", "documentation", "risk assessment", "structured reporting", "attention to detail"],
    experienceLevel: "Mid-level",
  },

  // ── economy ───────────────────────────────────────────────
  {
    id: "economy-index",
    category: "economy",
    subcategory: "index",
    title: "Economy Roles at Abba Baba",
    summary: "All open economy positions at Abba Baba — treasury, market maker, dispute analyst, and partnerships.",
    description: "Abba Baba is hiring economy specialists who design and manage the financial layer of A2A commerce. From treasury operators to market makers and dispute analysts.",
    responsibilities: [],
    skills: [],
    experienceLevel: "Mid-level to Senior",
  },
  {
    id: "treasury",
    category: "economy",
    subcategory: "treasury",
    title: "Treasury Lead",
    summary: "Manage platform treasury — fee accounting, USDC flows, yield strategy, and financial reporting.",
    description: "You'll own Abba Baba's treasury operations — managing the 2% protocol fee flows, USDC liquidity, yield strategy on platform reserves, and the financial reporting that keeps stakeholders informed. You'll work at the intersection of traditional finance and on-chain treasury management.",
    responsibilities: [
      "Manage platform treasury operations — fee collection, USDC flows, and liquidity",
      "Develop and execute yield strategy on platform reserves",
      "Produce financial reports with transaction volume, fee revenue, and treasury health",
      "Monitor escrow operations and flag anomalies in fee collection or release flows",
      "Build and maintain treasury dashboards with real-time visibility",
      "Coordinate with legal and compliance on treasury-related regulatory requirements",
    ],
    skills: ["treasury management", "DeFi / on-chain finance", "USDC / stablecoins", "financial modeling", "SQL / data analysis", "Base / EVM familiarity", "reporting"],
    experienceLevel: "Senior",
  },
  {
    id: "market-maker",
    category: "economy",
    subcategory: "market-maker",
    title: "Market Maker",
    summary: "Design and operate pricing and liquidity mechanisms for efficient A2A commerce.",
    description: "You'll design the market mechanisms that make Abba Baba work — pricing signals, liquidity incentives, supply-demand matching for agent categories, and the economic design choices that determine how efficient and fair the marketplace is. This is an applied mechanism design role.",
    responsibilities: [
      "Design pricing mechanisms and incentive structures for agent categories",
      "Monitor marketplace supply-demand balance and identify thin-market problems",
      "Develop models that predict agent category demand and inform supply incentives",
      "Run pricing experiments and measure impact on transaction volume and agent earnings",
      "Research mechanism design approaches relevant to A2A commerce",
      "Produce market health reports with supply, demand, and pricing metrics",
    ],
    skills: ["mechanism design", "market microstructure", "data analysis", "Python", "SQL", "economic modeling", "DeFi familiarity"],
    experienceLevel: "Senior",
  },
  {
    id: "dispute-analyst",
    category: "economy",
    subcategory: "dispute-analyst",
    title: "Dispute Analyst",
    summary: "Review and resolve escrow disputes — analyzing delivery proofs, buyer claims, and settlement records.",
    description: "You'll review and resolve escrow disputes on the Abba Baba platform — analyzing delivery proofs, buyer claims, and on-chain settlement records to produce fair, well-documented resolution decisions. You'll also identify dispute patterns that reveal systemic issues in agent categories or platform design.",
    responsibilities: [
      "Review escrow dispute claims with analysis of delivery proofs and buyer evidence",
      "Produce resolution decisions with clear documentation of reasoning and evidence",
      "Identify dispute patterns that reveal systemic agent or platform issues",
      "Maintain dispute resolution documentation and precedent records",
      "Coordinate escalations for complex or high-value disputes",
      "Report on dispute rates, resolution times, and outcome patterns",
    ],
    skills: ["analysis and investigation", "SQL", "on-chain data reading", "structured writing", "judgment under uncertainty", "dispute resolution", "attention to detail"],
    experienceLevel: "Mid-level",
  },
  {
    id: "partnerships",
    category: "economy",
    subcategory: "partnerships",
    title: "Partnerships Lead",
    summary: "Build the ecosystem — integrations with agent frameworks, model providers, and enterprise buyers.",
    description: "You'll own Abba Baba's ecosystem partnerships — integrations with agent frameworks (LangChain, ElizaOS, Virtuals), model providers (Anthropic, OpenAI, Google), enterprise buyer relationships, and the strategic deals that expand the platform's reach and capability.",
    responsibilities: [
      "Develop and manage integration partnerships with major agent frameworks",
      "Build relationships with model providers and AI infrastructure companies",
      "Identify and pursue enterprise buyer relationships for A2A commerce volume",
      "Structure and negotiate partnership agreements with appropriate terms",
      "Coordinate technical integration work with engineering and developer relations",
      "Track and report on partnership pipeline, deal progress, and revenue attribution",
    ],
    skills: ["business development", "partnership management", "technical communication", "negotiation", "AI ecosystem knowledge", "relationship management", "deal structuring"],
    experienceLevel: "Senior",
  },

  // ── general ───────────────────────────────────────────────
  {
    id: "research",
    category: "general",
    subcategory: "research",
    title: "Research Analyst",
    summary: "Deep research and market analysis for the Abba Baba agent economy.",
    description: "You'll conduct research that informs Abba Baba's strategy — market analysis, competitive landscape, agent economy trends, and deep dives into technical and policy topics that shape the platform's roadmap.",
    responsibilities: [
      "Conduct market research on the agent economy, A2A commerce, and competitive landscape",
      "Synthesize findings into clear reports with recommendations for product and strategy",
      "Monitor industry developments and surface relevant signals for the team",
      "Design and run primary research (surveys, interviews) with agent developers",
      "Build and maintain the research knowledge base for team reference",
      "Present research findings to internal stakeholders with clear narrative framing",
    ],
    skills: ["research methodology", "data analysis", "market research", "synthesis and writing", "SQL", "competitive analysis", "presentation"],
    experienceLevel: "Mid-level",
  },
  {
    id: "data",
    category: "general",
    subcategory: "data",
    title: "Data Engineer",
    summary: "Build and maintain data pipelines and analytics infrastructure across the Abba Baba platform.",
    description: "You'll own the data infrastructure at Abba Baba — building pipelines that ingest transaction data, agent performance metrics, and platform events, and creating the analytics foundation that product, ops, and growth teams depend on.",
    responsibilities: [
      "Design and maintain data pipelines for transaction, agent, and platform event data",
      "Build and maintain the analytics data warehouse (schemas, transforms, documentation)",
      "Create data models that support product, ops, and growth team analytics needs",
      "Ensure data quality with monitoring, validation, and alerting",
      "Build self-service analytics tooling for non-technical stakeholders",
      "Optimize pipeline performance and cost as data volume scales",
    ],
    skills: ["data engineering", "SQL", "dbt", "Python", "Supabase / PostgreSQL", "ETL / ELT pipelines", "data modeling"],
    experienceLevel: "Mid-level",
  },
  {
    id: "marketing",
    category: "general",
    subcategory: "marketing",
    title: "Marketing Lead",
    summary: "Content, campaigns, and positioning for the Abba Baba ecosystem.",
    description: "You'll own Abba Baba's marketing function — building the brand narrative for A2A commerce, running developer-focused content programs, and positioning the platform in the emerging agent economy. You'll measure everything and focus on what drives developer acquisition and engagement.",
    responsibilities: [
      "Define and maintain Abba Baba's brand narrative and messaging for the agent economy",
      "Run content programs — blog, technical content, case studies, and social",
      "Manage developer-focused marketing campaigns with measurable acquisition goals",
      "Build and maintain the marketing analytics stack",
      "Coordinate with growth and partnerships on campaign execution",
      "Track and report on marketing attribution and ROI",
    ],
    skills: ["content marketing", "developer marketing", "data analysis", "brand strategy", "SEO", "social media", "campaign management"],
    experienceLevel: "Mid-level",
  },
  {
    id: "community",
    category: "general",
    subcategory: "community",
    title: "Community Lead",
    summary: "Build and nurture the developer and agent builder community on Abba Baba.",
    description: "You'll own the Abba Baba developer community — Discord, forums, events, and programs that bring agent builders together, help them succeed on the platform, and turn them into advocates. The best communities create a self-reinforcing loop of learning and growth.",
    responsibilities: [
      "Manage and grow the Abba Baba developer community across Discord and other channels",
      "Design and run community programs — workshops, hackathons, office hours",
      "Identify and nurture community champions and power builders",
      "Surface community feedback to product and engineering with clear signal extraction",
      "Maintain community health metrics and report on engagement trends",
      "Create community content — guides, tutorials, and highlight posts",
    ],
    skills: ["community management", "developer relations", "Discord administration", "event planning", "content creation", "data analysis", "empathy"],
    experienceLevel: "Mid-level",
  },
  {
    id: "support",
    category: "general",
    subcategory: "support",
    title: "Developer Support Engineer",
    summary: "Help developers and agent builders integrate, debug, and succeed on Abba Baba.",
    description: "You'll be the first line of technical support for Abba Baba developers — helping them debug integration issues, understand the SDK, navigate escrow mechanics, and get to their first transaction. You'll triage bug reports, write resolution guides, and close the feedback loop with engineering.",
    responsibilities: [
      "Provide technical support for developers integrating the Abba Baba SDK",
      "Triage and reproduce bug reports before escalating to engineering",
      "Write resolution guides and FAQ content from recurring support issues",
      "Monitor support channels and maintain response SLAs",
      "Build relationships with power developers and surface their needs to product",
      "Track support volume by category and identify documentation gap opportunities",
    ],
    skills: ["technical support", "TypeScript / Python", "API debugging", "SDK familiarity", "communication", "documentation", "issue triage"],
    experienceLevel: "Mid-level",
  },
  {
    id: "other",
    category: "general",
    subcategory: "other",
    title: "Open Application",
    summary: "Build for the agent economy at Abba Baba — if you don't fit a listed role, apply here.",
    description: "Don't see your exact role listed? We're building the infrastructure of agent-native commerce and we're open to unconventional backgrounds and skill sets. If you're obsessed with the agent economy and want to build at the frontier, apply via the agent-native process and tell us what you bring.",
    responsibilities: [
      "Define your scope clearly — what you do and how it adds value to Abba Baba",
      "Demonstrate capability through a working agent on the marketplace",
      "Articulate your specific fit with the Abba Baba mission and product",
      "Be prepared to own a domain that may not have a defined job spec yet",
      "Work with high autonomy and low process overhead",
      "Contribute to a team that moves fast and measures outcomes, not activity",
    ],
    skills: ["deep domain expertise in your area", "agent/AI familiarity", "autonomy", "communication", "execution", "low ego", "high output"],
    experienceLevel: "Any",
  },
];

// ============================================================
// Writer
// ============================================================

function writeJob(job: JobDef): void {
  const dirPath = path.join(JOBS_DIR, job.category);
  fs.mkdirSync(dirPath, { recursive: true });

  // Base slug + batch date → dated slug (e.g. "agent-developer-2026-02-21")
  const baseSlug = job.subcategory ?? job.id.replace("-index", "index");
  const datedSlug = `${baseSlug}-${TODAY}`;
  const filePath = path.join(dirPath, `${datedSlug}.json`);

  if (fs.existsSync(filePath)) {
    console.log(`  SKIP (exists): ${filePath}`);
    return;
  }

  const contentForHash = job.description + job.responsibilities.join("");

  const hasContent = job.responsibilities.length > 0;

  const posting: JobTemplate = {
    id: job.id,
    category: job.category,
    subcategory: datedSlug,
    status: "active",
    batchDate: TODAY,
    replacedBy: [],
    title: job.title,
    datePosted: TODAY,
    validThrough: VALID_THROUGH,
    compensation: COMPENSATION,
    sharedBlocks: SHARED_BLOCKS,
    platforms: hasContent ? PLATFORMS : [],
    summary: job.summary,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: {
      skills: job.skills,
      experienceLevel: job.experienceLevel,
      ...REQUIREMENTS_BASE,
    },
    integrationSteps: hasContent ? HOW_TO_APPLY_STEPS : [],
    applicationProcess: hasContent ? APPLICATION_PROCESS : "",
    lastUpdated: TODAY,
    contentHash: hash(contentForHash),
  };

  fs.writeFileSync(filePath, JSON.stringify(posting, null, 2), "utf-8");
  console.log(`  WROTE: ${filePath}`);
}

// Main
console.log(`Generating job JSON files for batch: ${TODAY} (valid through: ${VALID_THROUGH})\n`);
for (const job of JOBS) {
  writeJob(job);
}
console.log(`\nDone. Generated ${JOBS.length} job definitions.`);
