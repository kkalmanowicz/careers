# careers.abbababa.com — Human Career Site

**Status**: Production | **Stack**: Next.js 15 + TypeScript + Tailwind + ISR

Human-facing job board for people who build, operate, and support AI agent infrastructure. Jobs are for humans — not agents.

---

## ⚠️ CRITICAL — Directory & Git Remote Lock

**Working directory**: `/Users/keithkalm/Documents/abbababaB2A/careers/` — NEVER leave this dir.

**Git remote**: `https://github.com/kkalmanowicz/careers.git` — NEVER push to agents.git.

Before ANY git push, verify remote with `git remote -v`. If it does not say `careers.git`, STOP and tell the user.

The agents site lives at `/Users/keithkalm/Documents/abbababaB2A/agents/` — a completely separate repo. Do NOT touch it from this session.

---

## Quick Commands

```bash
npm install
npm run dev                    # Local dev at localhost:3000
npm run build                  # Production build (verify all pages generate)
npm run careers:generate       # Generate all job JSON files
npm run careers:translate      # Translate all EN jobs → 6 other languages via Bedrock
npm run careers:refresh        # Check hashes, regenerate changed, translate, update dates
npm run careers:schedule -- --days=14   # Register QStash schedule
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (semantic, minimal) |
| Content | File-based JSON + MDX shared blocks |
| Translations | AWS Bedrock (claude-3-5-haiku) |
| Scheduling | QStash webhook |
| Deployment | Vercel (separate project from abbababa-platform) |

---

## Content Architecture

### Languages (7)
`en`, `zh`, `ko`, `es`, `pt`, `de`, `ja`

### Job JSON Format (EN source of truth)
Files live at `src/content/jobs/{category}/{slug}.json`
Translations at `src/content/translations/{lang}/{category}/{slug}.json`

---

## AEO Files

| File | Purpose |
|------|---------|
| `/llms.txt` | Index of all job postings (Anthropic standard) |
| `/llms-full.txt` | Full markdown content of all postings |
| `/.well-known/agent.json` | A2A Agent Card for this site |
| `/sitemap.xml` | All pages × 7 languages |
| `/robots.txt` | Allow all crawlers including AI agents |

---

## Adding New Categories

1. Add to `src/lib/categories.ts` category tree
2. Create `src/content/jobs/{category}/{slug}.json`
3. Run `npm run careers:translate`
4. Run `npm run build` to verify

---

## Content Update Workflow

1. Edit shared MDX blocks in `src/content/shared/`
2. Run `npm run careers:refresh` — auto-detects changes via content hashes
3. Bedrock translates only changed jobs
4. Deploy to Vercel (ISR revalidates changed pages)

---

## QStash Setup

```bash
# First time: register schedule
QSTASH_TOKEN=xxx npm run careers:schedule -- --days=14

# Update schedule frequency
npm run careers:schedule -- --days=30
```

QStash sends POST to `https://careers.abbababa.com/api/refresh` with signature verification.

---

## Vercel Deployment

1. Create new Vercel project pointing to `/careers/` subdirectory
2. Set env vars from `.env.example`
3. Configure custom domain: `careers.abbababa.com`
4. Deploy — all pages generate at build time

---

## Key Files

- `src/lib/categories.ts` — Category tree (source of truth for structure)
- `src/lib/jobs.ts` — Job loading with shared block injection
- `src/lib/structured-data.ts` — JSON-LD generators
- `src/lib/bedrock.ts` — AWS Bedrock translation client
- `scripts/generate-jobs.ts` — Generate all job JSON files
- `scripts/translate.ts` — Bedrock batch translation
- `scripts/refresh.ts` — Hash-based refresh logic
- `src/app/api/refresh/route.ts` — QStash webhook
