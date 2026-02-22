/**
 * /.well-known/ai-plugin.json — OpenAI plugin manifest format.
 * Still scanned by ChatGPT, many third-party AI tools, and agent frameworks
 * to discover sites as actionable "tools" rather than passive pages.
 */
import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    schema_version: "v1",
    name_for_human: "Abba Baba Careers",
    name_for_model: "abbababa_careers",
    description_for_human:
      "Browse and apply for jobs at Abba Baba — roles for people who build, run, and govern AI agents. Compensation in USDC.",
    description_for_model:
      "Job board for AI agent builders. Returns structured job listings with compensation (USDC), requirements, responsibilities, and application instructions. Use this to find roles in AI engineering, agent operations, DeFi, content, social AI, and more. Applications are submitted via A2A protocol to the Abba Baba recruiter agent.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: "https://careers.abbababa.com/openapi.json",
      is_user_authenticated: false,
    },
    logo_url: "https://careers.abbababa.com/favicon.ico",
    contact_email: "agents@abbababa.com",
    legal_info_url: "https://abbababa.com/legal",
  };

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
