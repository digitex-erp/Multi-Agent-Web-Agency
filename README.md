# Multi-Agent Web Agency Controller

Operator dashboard for a **programmatically orchestrated multi-agent web design agency** — a solo-operated pipeline that scouts local business leads, diagnoses site performance, generates React redesigns, produces walkthrough videos, and pitches prospects through compliant outreach.

**Repository:** [github.com/digitex-erp/Multi-Agent-Web-Agency](https://github.com/digitex-erp/Multi-Agent-Web-Agency)

---

## Project Vision

This project implements the control panel for an automated web agency built around six specialized agents orchestrated by **LangGraph**:

| Agent | Role |
|---|---|
| **Scout** | Harvest local business leads; run **Lighthouse** performance audits |
| **Diagnoser** | Generate personalized 3-problem consulting audits |
| **Builder** | Compile React/Next.js redesigns via Lovable / v0 |
| **Checker** | Playwright QA + Vision-Feedback self-correction loops |
| **Filmer** | HeyGen walkthrough videos (HITL-gated) |
| **Pitcher** | Compliant Comment-to-DM outreach via Meta Graph API |

Key design principles from the original feasibility study:

- **Human-in-the-Loop (HITL)** gates before expensive HeyGen video generation
- **Inbound-led outreach** (Comment-to-DM) — not unsolicited cold DMs
- **Realistic budget:** ~$2,360/mo at 1,000 leads (not the claimed $480/mo)
- **No payment gateway** — client billing handled offline ($400/mo retainer model)
- **Invoices:** Bank transfer / UPI details in [INVOICING.md](./INVOICING.md) · Ledger tab shows copy-ready details

For the full feasibility study, financial model, premortem analysis, and hardened architecture blueprint, see **[PROJECT-CONCEPT.md](./PROJECT-CONCEPT.md)**.

---

## Current Implementation Status

| Area | Status |
|---|---|
| Operator dashboard (Pipeline / Leads / Ledger / AI Reports) | ✅ UI complete |
| Simulated agent activity & live log stream | ✅ Demo behavior |
| HITL approve → HeyGen → outreach workflow | ✅ UI simulation |
| Gemini strategic reports (`POST /api/generate-report`) | ✅ **LangGraph** (Python `ChatNVIDIA` → TS LangGraph → fallback) |
| **Lighthouse** live audits (`POST /api/audit`) | ✅ No Google API key required |
| LangGraph orchestrator + Python agents | 🟡 **Core** — Diagnoser → Auditor live; full Scout→Pitcher pipeline next |
| Real lead scraping, HeyGen, Meta Graph | ⏳ Pending |
| Database persistence (Supabase) | ⏳ Pending |
| PDF audit export · SEO JSON-LD schema | ⏳ Pending |
| Payment gateway | ❌ Not planned |

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Lucide icons
- **Backend:** Express 4 (port 3000)
- **Speed audits:** Lighthouse CLI + headless Chrome (local, no Google key)
- **AI orchestration (core):** **LangChain + LangGraph**
  - **Python:** `agents/server.py` — `ChatNVIDIA` from `langchain-nvidia-ai-endpoints` (primary)
  - **TypeScript:** `src/agents/reportGraph.ts` — LangGraph on Vercel when Python service is unavailable
  - **Model:** Nvidia NIM via `NVIDIA_API_KEY`
- **Target persistence:** Supabase — optional until Phase 2

---

## Run Locally

**Prerequisites:** Node.js 18+ · **Google Chrome** installed (for Lighthouse audits)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):

   ```env
   NVIDIA_API_KEY="nvapi-..."
   AGENTS_PYTHON_URL="http://localhost:8001"   # optional — Python LangGraph heart
   ```

   Lighthouse audits work **without any API key**. For full LangChain orchestration, run the Python agents service (see [agents/README.md](./agents/README.md)).

3. *(Recommended)* Start the Python LangGraph orchestrator:

   ```bash
   cd agents
   pip install -r requirements.txt
   uvicorn server:app --port 8001
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
NODE_ENV=production npm start
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Express + Vite dev server |
| `npm run build` | Build client (`dist/`) and server bundle |
| `npm start` | Run production server |
| `npm run lint` | TypeScript type check |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/audit/status` | Lighthouse engine throttle/cooldown telemetry |
| `POST` | `/api/audit` | Live Lighthouse audit (Chrome required, no Google key) |
| `POST` | `/api/generate-report` | Strategic pipeline report via **LangGraph** (Python → TS → fallback) |
| `GET` | `/api/billing/payment-instructions` | Bank transfer / UPI details for client invoices (JSON + formatted blocks) |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NVIDIA_API_KEY` | For AI (Vercel + agents) | Nvidia NIM — powers LangChain `ChatNVIDIA` / TS LangGraph |
| `NVIDIA_MODEL` | Optional | Default `meta/llama-3.1-8b-instruct` |
| `AGENTS_PYTHON_URL` | Recommended | URL of Python LangGraph service (e.g. `http://localhost:8001`) |
| `CHROME_PATH` | Optional | Chrome binary for Lighthouse on Linux servers |
| `NODE_ENV` | Production only | Set to `production` for static file serving |
| `APP_URL` | Vercel deploy | Production URL for webhooks |
| `DISABLE_HMR` | Optional | Set to `true` to disable Vite HMR |

**Not used:** ~~`GEMINI_API_KEY`~~ · ~~`PAGESPEED_API_KEY`~~ (Lighthouse replaces Google PSI)

---

## AI Studio

Original prototype exported from Google AI Studio:
https://ai.studio/apps/2b70c44f-340d-4c1f-9d48-f53adfbb73ce

---

## Documentation

- **[PROJECT-CONCEPT.md](./PROJECT-CONCEPT.md)** — Full feasibility study, financial ledger, premortem, and hardened architecture blueprint (original project concept)
- **[PLAN.md](./PLAN.md)** — Cursor.ai handoff blueprint, Composer prompts, sprint order
- **[TODO.md](./TODO.md)** — Master work list, Miro-style phased roadmap
- **[INVOICING.md](./INVOICING.md)** — Client invoice bank transfer / UPI details
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Vercel env vars (`NVIDIA_API_KEY`) and Lighthouse notes

---

## License

Private — [digitex-erp](https://github.com/digitex-erp)
