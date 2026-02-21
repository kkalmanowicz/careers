# careers.abbababa.com

Human jobs for people who build, run, and govern AI agents.

**Live**: [careers.abbababa.com](https://careers.abbababa.com)

---

## What This Is

AEO-first job board targeting developers, researchers, and operators working in the agent economy. 36 roles across 6 categories — all with an agent-native application process.

**Application process**: Build an agent on Abba Baba → message the recruiting agent → get a response in minutes. No resume, no phone screen.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Content | File-based JSON |
| Translations | AWS Bedrock (claude-3-5-haiku) |
| Scheduling | QStash webhook |
| Deployment | Vercel |

---

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in AWS and QStash credentials

npm run dev          # localhost:3000
npm run build        # verify all pages generate
```

---

## Content Scripts

```bash
npm run careers:generate                               # generate new job batch (today's date)
npm run careers:generate -- --date=YYYY-MM-DD          # generate with specific date
npm run careers:generate -- --date=YYYY-MM-DD --days=14  # set validity window
npm run careers:translate                              # translate EN → 6 languages
npm run careers:translate -- --batch=YYYY-MM-DD        # translate one batch only
npm run careers:translate -- --force                   # retranslate everything
npm run careers:fill -- --batch=OLD --replaced-by=NEW  # mark batch filled
npm run careers:fill -- ... --dry-run                  # preview fill
npm run careers:expire -- --batch=YYYY-MM-DD --dry-run # preview deletion (always first)
npm run careers:expire -- --batch=YYYY-MM-DD           # delete oldest batch
```

---

## Job Categories (36 postings)

| Category | Roles |
|----------|-------|
| `engineering` | Agent Developer, SDK & Integrations, Smart Contract, Infrastructure |
| `operations` | Agent Ops, Monitoring, Incident Response, Fleet Management |
| `product` | Agent PM, UX for AI, Technical Writer, Growth |
| `intelligence` | Prompt Engineer, Evaluator, Fine-Tuning, Red Teamer |
| `safety` | AI Safety, Legal & Compliance, Policy, Audit |
| `economy` | Treasury, Market Maker, Dispute Analyst, Partnerships |
| `general` | Research, Data, Marketing, Community, Support, Other |

---

## Content Architecture

```
src/content/
  jobs/{category}/{slug}.json                     # EN source of truth
  translations/{lang}/{category}/{slug}.json       # committed — do not edit manually
```

### Languages
`en` · `zh` · `ko` · `es` · `pt` · `de` · `ja`

---

## AEO Files

| File | Purpose |
|------|---------|
| `/llms.txt` | Index of all job postings |
| `/llms-full.txt` | Full markdown content of all postings |
| `/.well-known/agent.json` | A2A Agent Card |
| `/sitemap.xml` | All pages × 7 languages |
| `/robots.txt` | Allow all crawlers |

---

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=https://careers.abbababa.com

# AWS Bedrock (translation)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# QStash (scheduled refresh)
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
```

---

## Vercel Deployment

1. Import `kkalmanowicz/careers` in Vercel
2. Framework: Next.js (auto-detected)
3. Root directory: `.`
4. Set env vars (see above)
5. Custom domain: `careers.abbababa.com`

---

## Rolling Batch System

Jobs use dated slugs: `agent-developer-2026-02-21` → `/en/engineering/agent-developer-2026-02-21`

Three-batch lifecycle at any time:

| Batch | State | Action |
|-------|-------|--------|
| N (new) | active | CREATE |
| N-1 (prev) | filled | mark filled + link to N |
| N-2 (oldest) | — | EXPIRE (delete) |

Always `--dry-run` before expiring.

---

- **Marketplace**: [abbababa.com](https://abbababa.com)
- **X**: [@abbababaco](https://x.com/abbababaco)
- **Farcaster**: [warpcast.com/abbababa](https://warpcast.com/abbababa)
- **Moltbook**: [moltbook.com/m/abbababa](https://www.moltbook.com/m/abbababa)

*Abba Baba — We Put the Trust in Trustless*
