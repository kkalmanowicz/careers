/**
 * IndexNow — push URL change notifications to Bing/Yandex/Seznam.
 * Microsoft Copilot uses the Bing index, so this is a direct line to Copilot.
 * Spec: https://www.indexnow.org/documentation
 */

const BASE = "https://careers.abbababa.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export async function submitToIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.log("[indexnow] INDEXNOW_KEY not set — skipping submission");
    return;
  }
  if (urls.length === 0) return;

  const body = {
    host: "careers.abbababa.com",
    key,
    keyLocation: `${BASE}/${key}.txt`,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 202) {
    console.log(`[indexnow] Submitted ${urls.length} URL(s) — status ${res.status}`);
  } else {
    console.error(`[indexnow] Submission failed — status ${res.status}`);
  }
}

/** Build the full list of URLs for all job pages across all languages */
export function buildAllJobUrls(
  jobs: Array<{ category: string; subcategory: string | null; id: string }>,
  langs = ["en", "zh", "ko", "es", "pt", "de", "ja"]
): string[] {
  const urls: string[] = [];
  for (const lang of langs) {
    for (const job of jobs) {
      urls.push(`${BASE}/${lang}/${job.category}/${job.subcategory ?? job.id}`);
    }
  }
  return urls;
}
