# Multi-Agent Web Agency Controller

Operator dashboard for a **programmatically orchestrated multi-agent web design agency** — a solo-operated pipeline that scouts local business leads, diagnoses site performance, generates React redesigns, produces walkthrough videos, and pitches prospects through compliant outreach.

**Repository:** [github.com/digitex-erp/Multi-Agent-Web-Agency](https://github.com/digitex-erp/Multi-Agent-Web-Agency)

---

## Project Vision

This project implements the control panel for an automated web agency built around six specialized agents orchestrated by **LangGraph**:

| Agent | Role |
|---|---|
| **Scout** | Harvest local business leads; run PageSpeed Insights audits |
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

For the full feasibility study, financial model, premortem analysis, and hardened architecture blueprint, see **[PROJECT-CONCEPT.md](./PROJECT-CONCEPT.md)**.

---

## Current Implementation Status

| Area | Status |
|---|---|
| Operator dashboard (Pipeline / Leads / Ledger / AI Reports) | ✅ UI complete |
| Simulated agent activity & live log stream | ✅ Demo behavior |
| HITL approve → HeyGen → outreach workflow | ✅ UI simulation |
| Gemini strategic reports (`POST /api/generate-report`) | ✅ Live integration |
| LangGraph orchestrator + Python agents | ⏳ Pending |
| Real lead scraping, PSI API, HeyGen, Meta Graph | ⏳ Pending |
| Database persistence (Supabase) | ⏳ Pending |
| Payment gateway | ❌ Not planned |

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Lucide icons
- **Backend:** Express 4 (port 3000), Gemini API (`gemini-3.5-flash`)
- **Target orchestration:** LangGraph (Python) — not yet integrated
- **Target persistence:** Supabase — referenced in concept, not yet wired

---

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`) and set your Gemini API key:

   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

3. Start the development server:

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
| `POST` | `/api/generate-report` | Generate strategic pipeline report (Gemini or local fallback) |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for live AI reports) | Google Gemini API key |
| `NODE_ENV` | Production only | Set to `production` for static file serving |
| `DISABLE_HMR` | Optional | Set to `true` to disable Vite HMR (AI Studio) |
| `APP_URL` | Optional | Documented in `.env.example`; not yet used in code |

---

## AI Studio

Original prototype exported from Google AI Studio:
https://ai.studio/apps/2b70c44f-340d-4c1f-9d48-f53adfbb73ce

---

## Documentation

- **[PROJECT-CONCEPT.md](./PROJECT-CONCEPT.md)** — Full feasibility study, financial ledger, premortem, and hardened architecture blueprint (original project concept)

---

## License

Private — [digitex-erp](https://github.com/digitex-erp)
