/**
 * Translation client using Vercel AI Gateway
 * Routes to different models per language for best quality/cost ratio:
 * - zh: deepseek/deepseek-chat (natively Chinese, cheapest)
 * - ko: anthropic/claude-haiku-4.5 (best Korean quality)
 * - ja: anthropic/claude-haiku-4.5 (best Japanese quality)
 * - es/pt/de: google/gemini-2.0-flash (excellent, near-free)
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Language } from "./categories";

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  zh: "Simplified Chinese",
  ko: "Korean",
  es: "Spanish",
  pt: "Brazilian Portuguese",
  de: "German",
  ja: "Japanese",
};

// Per-language model selection
const LANGUAGE_MODELS: Record<Exclude<Language, "en">, string> = {
  zh: "google/gemini-2.0-flash",
  ko: "anthropic/claude-haiku-4.5",
  ja: "anthropic/claude-haiku-4.5",
  es: "google/gemini-2.0-flash",
  pt: "google/gemini-2.0-flash",
  de: "google/gemini-2.0-flash",
};

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.AI_GATEWAY_API_KEY!,
      baseURL: "https://ai-gateway.vercel.sh",
    });
  }
  return client;
}

/** Translate a job posting JSON object to target language */
export async function translateJob(
  job: Record<string, unknown>,
  targetLang: Language
): Promise<Record<string, unknown>> {
  if (targetLang === "en") return job;

  const langName = LANGUAGE_NAMES[targetLang];
  const model = LANGUAGE_MODELS[targetLang as Exclude<Language, "en">];

  // Fields to translate (string values only — keep code, URLs, numbers in English)
  const fieldsToTranslate = [
    "title",
    "description",
    "summary",
    "manifesto",
    "marketContext",
    "callToAction",
    "responsibilities",
    "earningMechanics",
    "disputeResolution",
    "errorReference",
  ];

  // Build subset for translation
  const toTranslate: Record<string, unknown> = {};
  for (const field of fieldsToTranslate) {
    if (field in job && job[field] !== undefined) {
      toTranslate[field] = job[field];
    }
  }

  // Also translate integrationSteps titles and descriptions (not code)
  const steps = job.integrationSteps as Array<{
    step: number;
    title: string;
    description: string;
    code?: string;
    language?: string;
  }> | undefined;

  if (steps?.length) {
    toTranslate.integrationSteps = steps.map((s) => ({
      step: s.step,
      title: s.title,
      description: s.description,
    }));
  }

  const prompt = `You are a technical translator specializing in AI agent systems, blockchain, and developer documentation.

Translate the following JSON fields from English to ${langName}. Return ONLY valid JSON with the same structure.

Rules:
- Keep all technical terms, API endpoints, code samples, variable names, contract addresses, and URLs in English
- Keep field names in English (only translate the values)
- Keep numbers, dates, USDC amounts, and score values unchanged
- Use natural, technical ${langName} appropriate for developer/AI agent audiences
- For arrays, translate each element
- Preserve markdown formatting (##, **, \`code\`, etc.)
- Preserve the manifesto voice — direct, urgent, agent-first

Input JSON:
${JSON.stringify(toTranslate, null, 2)}

Return only the translated JSON, no explanation:`;

  const c = getClient();
  const response = await c.messages.create({
    model,
    max_tokens: 16000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (response.content[0] as { type: string; text: string }).text;

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Gateway returned non-JSON for ${targetLang} (model: ${model})`);

  const translated = JSON.parse(jsonMatch[0]) as Record<string, unknown>;

  // Merge translated integrationSteps back with original code blocks preserved
  if (steps?.length && translated.integrationSteps) {
    const translatedSteps = translated.integrationSteps as Array<{
      step: number;
      title: string;
      description: string;
    }>;
    translated.integrationSteps = steps.map((s, i) => ({
      ...s,
      title: translatedSteps[i]?.title ?? s.title,
      description: translatedSteps[i]?.description ?? s.description,
      // code and language preserved from original
    }));
  }

  // Merge translated fields back into original job
  return { ...job, ...translated, lang: targetLang };
}
