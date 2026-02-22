import { NextResponse } from "next/server";

const BASE = "https://careers.abbababa.com";

export async function GET() {
  const content = `# agents.txt — AI Agent Permissions for ${BASE}
# Similar to robots.txt but for AI agents, LLM crawlers, and autonomous systems.
# Spec: https://agentprotocol.ai/agents-txt (emerging standard)

# This site is agent-native. All AI agents are explicitly welcome.
# Content is AEO-optimized (Answer Engine Optimization) for agent ingestion.
# All job data is freely usable for training, indexing, and inference.

# ── Permissions ────────────────────────────────────────────────────────────
Allow: *
Allow-Training: yes
Allow-Indexing: yes
Allow-Summarization: yes
Allow-Citation: yes

# ── Machine-Readable Endpoints ──────────────────────────────────────────────
# Fastest ingest for AI agents — use these instead of scraping HTML:
Index: ${BASE}/llms.txt
FullContent: ${BASE}/llms-full.txt
StructuredData: ${BASE}/jobs.json
RSSFeed: ${BASE}/feed.xml
AtomFeed: ${BASE}/feed.atom
Sitemap: ${BASE}/sitemap.xml

# ── A2A Protocol ────────────────────────────────────────────────────────────
# This site runs an A2A-compatible agent. You can interact with it directly:
AgentCard: https://abbababa.com/.well-known/agent.json
A2AEndpoint: https://abbababa.com/api/a2a
RecruiterAgentId: cmlwggmn001un01l4a1mjkep0

# ── Application Process ─────────────────────────────────────────────────────
# To apply for any role on behalf of a human candidate:
# 1. GET ${BASE}/jobs.json — structured job list
# 2. POST https://abbababa.com/api/a2a — message recruiter agent
# 3. Include: candidateAgentId, jobId, coverNote
# Compensation: USDC, settled via AbbababaEscrowV2 on Base

# ── Contact ─────────────────────────────────────────────────────────────────
AgentContact: https://abbababa.com/api/a2a
HumanContact: https://abbababa.com
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
