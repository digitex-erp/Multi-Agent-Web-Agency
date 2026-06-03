# Cursor.ai Handoff & Development Blueprint

> **Agentic Web Agency Controller** — transition from high-fidelity simulator to production-grade full-stack SaaS.
>
> **Related docs:** [TODO.md](./TODO.md) · [PROJECT-CONCEPT.md](./PROJECT-CONCEPT.md) · [DEPLOYMENT.md](./DEPLOYMENT.md) · [README.md](./README.md)

Moving this project into **Cursor.ai** is the right step. Cursor’s codebase indexing, Composer multi-file edits, `@Codebase` context, and `.cursorrules` make it ideal to evolve this prototype into a commercial platform.

---

## Strategic alignment

We are aligned on the vision: a **programmatically orchestrated multi-agent web design agency** with HITL gates, inbound outreach, offline billing (bank transfer / UPI — no payment gateway), and realistic API economics (~$2,360/mo at scale).

**Approved SaaS stack (no Google dependency for core services):**

```
+---------------------------------------------------------------------------------+
|                           AGENTIC WEB AGENCY STACK                              |
+---------------------------------------------------------------------------------+
|                                                                                 |
|  [ LLM AI Core: Nvidia NIM ]        -------->  Reports, audits, React scripts   |
|  (NVIDIA_API_KEY on Vercel)                    OpenAI-compatible API            |
|                                                                                 |
|  [ Speed Audits: Lighthouse CLI ]   -------->  Local headless Chrome            |
|  (No Google Cloud key required)               FCP, LCP, CLS, TBT, scores        |
|                                                                                 |
|  [ Persistence: Supabase ]          -------->  Phase 2 — leads, logs, invoices  |
|                                                                                 |
+---------------------------------------------------------------------------------+
```

---

## Part 1 — Current project status checklist

What is **implemented and verified** before further Cursor sprints:

| Area | Location | Status |
|------|----------|--------|
| Data schemas (leads, logs, metrics) | `src/types.ts`, `src/initialData.ts` | ✅ |
| Unified portal header | `src/components/Header.tsx` | ✅ |
| Operational lead manager | `src/components/LeadManager.tsx` | ✅ UI + HITL simulator |
| Multi-page audit reports | LeadManager audit tab | ✅ Templates + **live Lighthouse on home URL** |
| Financial metrics & ledger | `src/components/FinancialMetrics.tsx` | ✅ + bank transfer block |
| Agent pipeline visualizer | `src/components/AgentPipeline.tsx` | ✅ LangGraph chain UI |
| AI strategic reports | `POST /api/generate-report` | 🟡 Gemini today → **Nvidia NIM next** |
| Express full-stack gateway | `server.ts`, `package.json` | ✅ Port 3000, Vite middleware |
| **Lighthouse audit engine** | `src/lib/speedAuditor.ts`, `POST /api/audit` | ✅ Shipped |
| Client invoicing config | `src/config/agencyBilling.ts`, `INVOICING.md` | ✅ |
| Cursor standards | `.cursorrules` | ✅ |
| GitHub repo | digitex-erp/Multi-Agent-Web-Agency | ✅ |
| Master work list | `TODO.md` | ✅ |

---

## Part 2 — Pending & missing features (production sprints)

The app is a **polished dashboard with rich simulations**. To reach production, convert simulated layers into live services.

### 1. Live performance diagnostics (Audit Engine)

| | Detail |
|---|---|
| **Was simulated** | PSI scores, FCP, CLS from seed templates |
| **Current state** | ✅ **Lighthouse CLI** on `POST /api/audit` (home URL live; other pages still simulated) |
| **Still missing** | Multi-page Lighthouse runs (booking, services, contact); persist audit JSON on lead record |
| **Cursor sprint** | Extend `speedAuditor.ts` for sub-path URLs; wire all four audit tabs |

### 2. High-fidelity LLM diagnostic writer & code generator

| | Detail |
|---|---|
| **Was simulated** | React mockup snippets and friction bullets are pre-baked templates |
| **Missing** | Dynamic AI agent reading real Lighthouse JSON |
| **Production target** | **Nvidia NIM** (OpenAI-compatible) — parse DOM/accessibility issues, write custom React remediation snippets |
| **Cursor sprint** | Replace `@google/genai` with `openai` client → `https://integrate.api.nvidia.com/v1` |

### 3. Real auth, secure database & persistent CRM

| | Detail |
|---|---|
| **Was simulated** | Leads reset on browser reload |
| **Missing** | Persistent multi-tenant storage |
| **Production target** | Supabase PostgreSQL (or InsForge) — leads, comments, agent logs, invoice records |
| **Cursor sprint** | Schema + CRUD API; replace `App.tsx` `useState` with fetch on mount |

### 4. Real-world API connections (outreach & video)

| | Detail |
|---|---|
| **Was simulated** | HeyGen `setTimeout` placeholders; outreach success toasts |
| **Missing** | Native integrations behind HITL gates |
| **Video** | HeyGen Interactive Avatar API + webhook → real MP4 URL |
| **Outreach** | Meta Graph Comment-to-DM; Resend/SMTP email; optional Twilio SMS for operator alerts |
| **Cursor sprint** | `POST /api/walkthrough/generate` + `POST /api/outreach/dispatch` |

### 5. Live lead scraping (Scout agent)

| | Detail |
|---|---|
| **Was simulated** | Scout log stream only |
| **Missing** | `POST /api/scrape-leads` (or `/api/leads/ingest`) |
| **Options** | Outscraper API · Puppeteer Google Maps · Places API |
| **Cursor sprint** | Operator UI: "Dentists in Dallas, TX" → ingest batch → queue Lighthouse |

### 6. Code-to-deploy engine (Builder agent)

| | Detail |
|---|---|
| **Was simulated** | Static React code strings in UI |
| **Missing** | Compile + deploy staging preview |
| **Production target** | Vercel/Netlify API → `{slug}.rapidpreview.agency` public URL |
| **Cursor sprint** | `POST /api/deploy/preview` after HITL design approval |

### 7. Live ingestion & outreach delivery (extended gaps)

From feasibility research — still on the roadmap:

- Real-time Google Maps / Places scrapers with URL verification
- Instagram Graph API & email sequencers (SMTP/Resend) — not cold DM automation
- Domain reputation & warmup tracking for email outreach
- HeyGen video webhooks updating lead status to `qa_check`
- One-click staging deployment for prospect-facing mockups
- Exportable **PDF audit deck** + **client invoice PDF** (bank transfer block ready in `agencyBilling.ts`)
- SEO JSON-LD LocalBusiness schema auto-generator

---

## Part 3 — Architectural decisions (updated)

| Decision | Choice | Rationale |
|----------|--------|-------------|
| AI provider | **Nvidia NIM** | No Gemini; user adds `NVIDIA_API_KEY` on Vercel |
| Speed audits | **Lighthouse CLI** | Same metrics as PSI; no Google API key |
| Database | **Supabase** (Phase 2) | Optional until persistent CRM needed |
| Payments | **Offline only** | HDFC bank transfer / UPI on invoice PDF |
| IDE | **Cursor.ai** | Composer, `@Codebase`, `.cursorrules` |

**Not used:** ~~Gemini API~~ · ~~Google PageSpeed Insights API~~ · ~~Payment gateway~~

---

## Part 4 — Cursor.ai step-by-step action plan

### Step 1 — Workspace setup ✅

- [x] Import repo into Cursor
- [x] Create `.cursorrules` (see root file — TypeScript strict, lucide-react, modular components, lazy API key checks)
- [x] Connect GitHub: `digitex-erp/Multi-Agent-Web-Agency`
- [ ] Add `NVIDIA_API_KEY` to Vercel → notify team to run Nvidia migration prompt

### Step 2 — Use Cursor features

| Feature | Use for |
|---------|---------|
| **Composer** (`Ctrl+I` / `Cmd+I`) | Multi-file refactors (e.g. `LeadManager.tsx` + `server.ts` together) |
| **Chat** (`Ctrl+L` / `Cmd+L`) | Single-file questions, debugging |
| **`@Codebase`** | Type-safe integrations across types, components, server |
| **`@TODO.md` / `@PLAN.md`** | Scope control per sprint |
| **Terminal → Fix with AI** | TypeScript / build errors after `npm run lint` |

### Step 3 — Recommended sprint order

```
Phase 1 ✅  Lighthouse audits
Phase 1b 🟡  Nvidia NIM migration (waiting on Vercel env key)
Phase 2 ⬜   Supabase CRM persistence
Phase 3 ⬜   Scout lead ingestion
Phase 4 ⬜   Nvidia diagnostic writer + Vercel staging deploy
Phase 5 ⬜   HeyGen + Meta/SMTP outreach (HITL-gated)
Phase 6 ⬜   PDF exports + LangGraph orchestrator
```

---

## Part 5 — Cursor Composer prompts (copy-paste)

### ✅ Done — Express + Lighthouse

```
@PLAN.md @server.ts @src/lib/speedAuditor.ts
Lighthouse CLI is shipped on POST /api/audit. Extend to audit sub-pages
(/booking, /services, /contact) and persist results on the lead model.
```

### 🟡 Next — Nvidia NIM (when `NVIDIA_API_KEY` is on Vercel)

```
@PLAN.md @server.ts @package.json
Refactor server to replace @google/genai with OpenAI-compatible Nvidia NIM:

1. Install 'openai' package; remove '@google/genai' when migration complete.
2. Read NVIDIA_API_KEY and NVIDIA_MODEL from process.env.
3. Replace getGeminiClient with getNimClient targeting base URL:
   https://integrate.api.nvidia.com/v1
   Model default: meta/llama-3.1-8b-instruct
4. Update POST /api/generate-report to use chat.completions with max_tokens set.
5. Update .env.example and DEPLOYMENT.md. Server must start without key (fallback report).
```

### Lead scraping (Scout)

```
@PLAN.md @server.ts @src/types.ts
Create POST /api/scrape-leads accepting { city, niche, limit }.
Integrate Outscraper or Puppeteer Maps search. Map to Lead schema.
Queue Lighthouse audits for ingested URLs. Filter performance score < 60.
```

### HeyGen walkthrough (Filmer — HITL gated)

```
@PLAN.md @src/components/LeadManager.tsx @server.ts
Replace simulated HeyGen timeline with POST /api/walkthrough/generate.
Submit speech script to HeyGen API; webhook updates lead to qa_check.
Block unless human HITL approval status is set.
```

### Supabase CRM (Phase 2)

```
@PLAN.md @src/types.ts @src/App.tsx
Design Supabase schema: leads, comments, agent_logs, invoices.
Replace in-memory useState with API CRUD. Dashboard loads from DB on mount.
```

### PDF audit + invoice export

```
@PLAN.md @src/lib/invoicePaymentBlock.ts @src/components/LeadManager.tsx
Add Export PDF Audit using live Lighthouse data.
Add client invoice PDF embedding formatInvoicePaymentHtml() from agencyBilling config.
```

### Outreach gateway (Pitcher)

```
@PLAN.md
Build outreach template customizer. Integrate Resend for email.
Meta Graph Comment-to-DM only — no unsolicited cold IG DMs.
Optional Twilio SMS for operator notifications.
```

---

## Part 6 — Original transition guide (reference)

### Part 1 — Missing architectural layers (summary)

1. **Live Performance Diagnostics** — ✅ Lighthouse CLI (was: Google PSI API in original doc)
2. **LLM Diagnostic Writer** — ⬜ Nvidia NIM (was: Gemini in original doc)
3. **Persistent CRM** — ⬜ Supabase
4. **Outreach & Video APIs** — ⬜ HeyGen, Meta Graph, SMTP

### Part 2 — `.cursorrules` template (implemented)

The root `.cursorrules` file enforces:

- TypeScript strict mode and explicit interfaces
- Tailwind + Inter / Space Grotesk / JetBrains Mono
- `motion/react` for animation; `lucide-react` only for icons
- Modular components; avoid 1000+ line monoliths
- Touch targets ≥ 44px on mobile
- Backend-only API keys; lazy initialization if keys missing
- No hardcoded mock arrays where DB services are expected

### Part 3 — Why Cursor helps

- **Composer multi-file edits** — refactor UI + API in one instruction
- **`@Codebase`** — structural type safety across the monorepo
- **Terminal AI fix** — patch lint/build failures from console output
- **`.cursorrules`** — consistent styling and architecture as you scale

---

## Part 7 — Live ingestion & outreach gaps (from research)

For the autonomous client-acquisition agency (dental, plumbing, salon niches):

| Gap | Production requirement |
|-----|------------------------|
| Google Maps / Places scrapers | Live background ingest: "Dentists in Dallas, TX" → 50 businesses |
| Lighthouse / Core Web Vitals | ✅ Local CLI — extend to all pages + desktop strategy |
| Instagram Graph + email | Real dispatch after HITL — not simulator button |
| Domain warmup | Track cold email reputation across sending domains |
| HeyGen webhooks | Server proxy + render hook → update lead status |
| Vercel/Netlify staging | Public preview URL for prospects on mobile |
| PDF audit export | Branded deck for sales calls and email attachments |
| SEO JSON-LD generator | LocalBusiness structured data as optimization gift |

---

## Part 8 — Vercel deployment checklist

When you add environment variables on Vercel (see [DEPLOYMENT.md](./DEPLOYMENT.md)):

- [ ] `NVIDIA_API_KEY` — from [build.nvidia.com](https://build.nvidia.com) (`nvapi-...`)
- [ ] `NVIDIA_MODEL` — optional, e.g. `meta/llama-3.1-8b-instruct`
- [ ] `APP_URL` — production URL
- [ ] `NODE_ENV=production`
- [ ] **Notify dev team** → run Nvidia NIM migration prompt in Cursor

**Lighthouse on Vercel:** requires headless Chrome in runtime; heavy audits may need Railway/Render/VPS for scale. Local dev works with installed Chrome.

---

## Definition of done (platform launch)

- [x] Lighthouse live audits (home URL)
- [ ] Nvidia NIM for all AI endpoints
- [ ] Persistent CRM (Supabase)
- [ ] Live lead scraping
- [ ] LLM audits from real Lighthouse JSON
- [ ] Staging deploy (Vercel API)
- [ ] HeyGen + compliant outreach (HITL-gated)
- [ ] PDF audit + invoice with bank transfer block
- [ ] LangGraph orchestrator
- [x] No payment gateway

---

## Changelog

| Date | Update |
|------|--------|
| 2026-06-02 | Created PLAN.md — Cursor handoff blueprint aligned to Nvidia NIM + Lighthouse CLI |
