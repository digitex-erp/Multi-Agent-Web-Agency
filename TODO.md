# Multi-Agent Web Agency — Master TODO

> **Purpose:** Transition the dashboard from a high-fidelity simulator into a production-grade autonomous client-acquisition platform for local businesses (dental, plumbing, salon, etc.).
>
> **Vision doc:** [PROJECT-CONCEPT.md](./PROJECT-CONCEPT.md) · **Cursor blueprint:** [PLAN.md](./PLAN.md) · **Setup:** [README.md](./README.md)
>
> **No payment gateway** — client billing ($400/mo retainer) stays offline.

---

## Miro-Style Work Board (Step-by-Step)

Use this as your execution swimlane. Move left → right as each column completes.

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  BACKLOG    │ → │  IN DESIGN  │ → │ IN BUILD    │ → │  QA / HITL  │ → │  SHIPPED    │
│  (Plan)     │   │  (Spec)     │   │  (Code)     │   │  (Verify)   │   │  (Live)     │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

### Lane A — Data & Diagnostics (Scout + Diagnoser)

| Step | Task | Status | Owner | Notes |
|------|------|--------|-------|-------|
| A1 | Lighthouse CLI audit engine (`POST /api/audit`) | ✅ Shipped | Backend | `src/lib/speedAuditor.ts` — local Chrome, no Google key |
| A2 | Wire Lead Manager scan button to live Lighthouse (home URL) | ✅ Shipped | Frontend | Simulation fallback on failure |
| A3 | Lighthouse throttle + cooldown state in dashboard metrics | ✅ Shipped | Backend | `App.tsx` polls `/api/audit/status` |
| A4 | Lead scraping endpoint (`POST /api/scrape-leads` or `/api/leads/ingest`) | ⬜ Pending | Backend | Outscraper / Puppeteer Maps — see PLAN.md Part 2.5 |
| A5 | Managed scraper integration (Outscraper / Scrap.io) | ⬜ Pending | Backend | Bypass 60-result Places pagination wall |
| A6 | Background job runner for batch Lighthouse audits | ⬜ Pending | Backend | BullMQ / Inngest / cron worker |
| A7 | Multi-page URL Lighthouse audits (booking, services, contact) | ⬜ Pending | Backend | Extend beyond home URL only |

### Lane B — AI Diagnostics & Code (Diagnoser + Builder)

| Step | Task | Status | Owner | Notes |
|------|------|--------|-------|-------|
| B0 | **LangChain + LangGraph + Nvidia NIM** | 🟡 Deploy | Backend | Python `ChatNVIDIA` + TS LangGraph live — add keys & deploy `agents/` |
| B1 | Dynamic LLM audit writer from Lighthouse JSON | ⬜ Pending | Backend | Nvidia NIM — not Gemini |
| B2 | Replace template friction/fix bullets with AI output | ⬜ Pending | Full-stack | Store on lead record |
| B3 | React mockup code generator (Nvidia NIM / v0 / Lovable) | ⬜ Pending | Backend | DOM-aware component overrides |
| B4 | Vision-Feedback (VF) self-correction loop | ⬜ Pending | Backend | Playwright screenshots + multimodal QA |
| B5 | One-click staging deploy (Vercel API) | ⬜ Pending | Backend | `{slug}.rapidpreview.agency` temp URLs |
| B6 | Netlify deploy fallback | ⬜ Pending | Backend | Alternative to Vercel |

### Lane C — Video & Outreach (Filmer + Pitcher)

| Step | Task | Status | Owner | Notes |
|------|------|--------|-------|-------|
| C1 | HeyGen Video API proxy (`POST /api/walkthrough/generate`) | ⬜ Pending | Backend | HITL gate before call |
| C2 | HeyGen webhook listener for render completion | ⬜ Pending | Backend | Update lead → `qa_check` |
| C3 | Speech script compiler from audit + lead context | ⬜ Pending | Backend | Dental/salon niche templates |
| C4 | Meta Graph API Comment-to-DM trigger flow | ⬜ Pending | Backend | Compliant inbound-only outreach |
| C5 | SMTP / SendGrid / Resend email sequencer | ⬜ Pending | Backend | For email-channel leads |
| C6 | Domain warmup & reputation tracking | ⬜ Pending | Backend | Prevent spam folder placement |
| C7 | Outreach template customizer UI | ⬜ Pending | Frontend | Operator-editable pitch templates |
| C8 | Remove/replace cold DM simulator button | ⬜ Pending | Frontend | Only fire after HITL approval |
| C9 | Twilio SMS operator alerts (optional) | ⬜ Pending | Backend | Pitch summary to operator — PLAN.md |

### Lane D — Persistence & Auth (CRM Foundation)

| Step | Task | Status | Owner | Notes |
|------|------|--------|-------|-------|
| D1 | Supabase project + schema (leads, logs, comments) | ⬜ Pending | Infra | See PROJECT-CONCEPT premortem |
| D2 | Replace in-memory React state with API CRUD | ⬜ Pending | Full-stack | Survive browser reload |
| D3 | Operator auth (Supabase Auth or Clerk) | ⬜ Pending | Full-stack | Multi-tenant agency accounts |
| D4 | LangGraph orchestrator (Python service) | 🟡 In progress | Backend | Diagnoser → Auditor live; expand to Scout → Pitcher |
| D5 | Pydantic schema validation at agent handoffs | ⬜ Pending | Backend | Prevent silent JSON drift |

### Lane E — Exports & Documentation

| Step | Task | Status | Owner | Notes |
|------|------|--------|-------|-------|
| E1 | Branded PDF audit export (multi-page diagnostic deck) | ⬜ Pending | Full-stack | Puppeteer / react-pdf |
| E2 | SEO JSON-LD LocalBusiness schema generator | ⬜ Pending | Backend | Deliver as optimization gift |
| E3 | Export markdown report → PDF pipeline | ⬜ Pending | Full-stack | Extend ReportsPanel |
| E4 | API documentation (OpenAPI / README endpoints) | ⬜ Pending | Docs | All `/api/*` routes |
| E5 | **Client invoice PDF** with bank transfer / UPI block | 🟡 In Design | Full-stack | Config ✅ `agencyBilling.ts` · see [INVOICING.md](./INVOICING.md) |

### Lane F — Production Hardening

| Step | Task | Status | Owner | Notes |
|------|------|--------|-------|-------|
| F1 | `.cursorrules` project standards | ✅ Shipped | Docs | Root directory |
| F2 | Environment variable matrix (all integrations) | 🟡 In Build | Docs | `.env.example`, `DEPLOYMENT.md` |
| F3 | Error monitoring (Sentry) | ⬜ Pending | Infra | |
| F4 | CI: lint + build on push | ⬜ Pending | Infra | GitHub Actions |
| F5 | Production deploy (Vercel / Railway) | ⬜ Pending | Infra | `NODE_ENV=production` |
| F6 | Rate-limit middleware on all external proxies | ⬜ Pending | Backend | Protect API keys |
| F7 | **PLAN.md** Cursor handoff blueprint | ✅ Shipped | Docs | Full transition guide |

---

## Phase Roadmap (Recommended Order)

### Phase 0 — Foundation ✅ / 🟡
- [x] GitHub repo connected
- [x] README + PROJECT-CONCEPT documented
- [x] TODO.md master work list (this file)
- [x] PLAN.md Cursor handoff blueprint
- [x] `.cursorrules` for Cursor.ai development
- [x] `.env.example` updated for Nvidia NIM + Lighthouse

### Phase 1 — Live Audit Engine ✅
- [x] `src/lib/speedAuditor.ts` — **Lighthouse CLI** (no Google API)
- [x] `POST /api/audit` Express route
- [x] Lead Manager live scan for home URL (simulation fallback)
- [x] Throttle/cooldown UI wired to `SystemMetrics`
- [ ] Multi-page Lighthouse audits (booking, services, contact)
- [ ] Audit results persisted on lead object (Phase 2 + DB)

### Phase 1b — LangChain + Nvidia NIM ✅ (core orchestration)
- [ ] User adds `NVIDIA_API_KEY` to Vercel environment
- [x] **LangChain / LangGraph** — Python `ChatNVIDIA` in `agents/server.py`
- [x] **LangGraph TS** fallback in `src/agents/reportGraph.ts`
- [x] `POST /api/generate-report` priority: Python → TS LangGraph → local fallback
- [x] Removed `@google/genai` / Gemini from `package.json`
- [ ] Deploy Python agents service; set `AGENTS_PYTHON_URL` on Vercel

### Phase 2 — Persistent CRM
- [ ] Supabase schema migration
- [ ] Lead CRUD API routes
- [ ] Comments + history stored in DB
- [ ] Dashboard loads from API on mount

### Phase 3 — Lead Ingestion (Scout)
- [ ] `POST /api/scrape-leads` — city + niche search
- [ ] Outscraper / Puppeteer Maps integration
- [ ] Operator search UI: "Dentists in Dallas, TX"
- [ ] Batch Lighthouse queue
- [ ] Auto-filter performance score < 60

### Phase 4 — AI Builder + Staging
- [ ] Nvidia NIM diagnostic writer from live Lighthouse JSON
- [ ] Code generation endpoint
- [ ] Vercel preview deploy integration
- [ ] HITL approval gate in UI (already simulated — wire real pause)

### Phase 5 — Video + Outreach
- [ ] HeyGen API + webhooks (HITL-gated)
- [ ] Meta Comment-to-DM integration
- [ ] Email sequencer (Resend/SendGrid)
- [ ] Outreach template customizer

### Phase 6 — Exports & Enterprise Polish
- [ ] PDF audit deck generator
- [ ] Client invoice PDF (bank transfer block ready — `agencyBilling.ts`)
- [ ] JSON-LD SEO schema module
- [ ] LangGraph Python orchestrator
- [ ] Multi-tenant auth

---

## Cursor.ai transition checklist (from PLAN.md)

- [x] Import codebase into Cursor
- [x] `.cursorrules` created
- [x] Lighthouse CLI audit engine shipped
- [x] PLAN.md handoff document
- [ ] `NVIDIA_API_KEY` added to Vercel → run NIM migration
- [ ] Supabase CRM wired
- [ ] Scout scraping live
- [ ] HeyGen + outreach APIs (HITL-gated)
- [ ] PDF audit + invoice export

---

## Implemented vs simulated (status check)

| Component | File | Live? |
|-----------|------|-------|
| Lead schemas & seed data | `initialData.ts`, `types.ts` | Seed only |
| Header / pipeline UI | `Header.tsx`, `AgentPipeline.tsx` | UI ✅ |
| Lead manager + HITL simulator | `LeadManager.tsx` | Partial — Lighthouse home ✅ |
| Financial ledger + bank details | `FinancialMetrics.tsx` | UI ✅ |
| Lighthouse audits | `speedAuditor.ts`, `/api/audit` | ✅ Live |
| AI strategic reports | `/api/generate-report` | **LangGraph** (Python → TS → fallback) |
| HeyGen video | LeadManager video tab | Simulated |
| Outreach dispatch | LeadManager | Simulated |
| Persistence | `App.tsx` state | Simulated — resets on reload |

---

## Critical Gaps: Simulator vs Production

| Area | Today (Simulator) | Production Target |
|------|-------------------|-------------------|
| Lead data | Static `initialData.ts` | Live scrape / Outscraper ingestion |
| Speed audits | Home URL Lighthouse ✅; other pages simulated | Full multi-page Lighthouse CLI |
| Audit friction/fixes | Niche templates | Nvidia NIM from Lighthouse JSON |
| HeyGen video | `setTimeout` placeholder | HeyGen API + webhook |
| Outreach | Success toast | Meta Graph Comment-to-DM or SMTP |
| Staging URL | Fake preview link | Vercel/Netlify deploy API |
| Persistence | Browser memory | Supabase PostgreSQL |
| Orchestration | Random log interval | LangGraph state machine |
| AI reports | Gemini SDK | **LangChain LangGraph + ChatNVIDIA** |
| Payments | N/A (not planned) | Offline bank transfer / UPI on invoice PDF |

---

## Cursor.ai implementation prompts

Full prompt library: **[PLAN.md — Part 5](./PLAN.md#part-5--cursor-composer-prompts-copy-paste)**

Copy these into **Cursor Chat** (`Ctrl+L`) or **Composer** (`Ctrl+I`):

### Prompt 1 — Lighthouse multi-page (Phase 1 extension) ✅ partial
```
@PLAN.md @TODO.md @src/lib/speedAuditor.ts @src/components/LeadManager.tsx
Extend Lighthouse audits to booking, services, and contact sub-pages.
Remove simulation fallback when live audit succeeds on all tabs.
```

### Prompt 2 — Nvidia NIM migration (Phase 1b) — **NEXT when key on Vercel**
```
@PLAN.md @server.ts @package.json
Replace @google/genai with OpenAI client → https://integrate.api.nvidia.com/v1
Use NVIDIA_API_KEY and NVIDIA_MODEL from env. Update /api/generate-report.
Install 'openai' package. Server must start without key (fallback report).
```

### Prompt 3 — Lead scraping / Scout (Phase 3)
```
@PLAN.md @TODO.md @server.ts
Create POST /api/scrape-leads accepting { city, niche, limit }.
Integrate Outscraper or Puppeteer Maps. Map to Lead schema. Queue Lighthouse.
```

### Prompt 4 — Supabase CRM (Phase 2)
```
@PLAN.md @TODO.md @src/types.ts
Design Supabase schema for leads, comments, agent_logs. Replace App.tsx useState with API fetch on mount.
```

### Prompt 5 — HeyGen walkthrough (Phase 5)
```
@PLAN.md @src/components/LeadManager.tsx @server.ts
Replace simulated HeyGen timeline with POST /api/walkthrough/generate + webhook handler.
Enforce HITL: only run after lead status passes human approval.
```

### Prompt 6 — PDF audit + invoice export (Phase 6)
```
@PLAN.md @src/lib/invoicePaymentBlock.ts @src/components/LeadManager.tsx
Add Export PDF Audit from live Lighthouse data.
Add client invoice PDF with formatInvoicePaymentHtml() bank transfer block.
```

### Prompt 7 — Outreach gateway (Phase 5)
```
@PLAN.md @TODO.md
Build outreach template customizer with Resend SMTP. Meta Comment-to-DM only.
Optional Twilio SMS for operator notifications. No cold IG DMs.
```

### Prompt 8 — Express server (reference — already done)
```
@package.json @server.ts
Express on port 3000 with Vite middleware dev mode and production static serve.
See existing server.ts — extend with new routes only.
```

---

## Environment Variables Checklist

| Variable | Phase | Required | Purpose |
|----------|-------|----------|---------|
| `NVIDIA_API_KEY` | AI | Yes (live AI reports) | Nvidia NIM — add to Vercel when ready |
| `NVIDIA_MODEL` | AI | Optional | Default `meta/llama-3.1-8b-instruct` |
| `CHROME_PATH` | 1 | Optional | Chrome binary path for Lighthouse (Linux) |
| `LIGHTHOUSE_MAX_CONCURRENT` | 1 | Optional | Default `4` |
| `APP_URL` | Deploy | Recommended | Vercel production URL |
| `OUTSCRAPER_API_KEY` | 3 | Optional | Managed scraping |
| `SUPABASE_URL` | 2 | For persistence | Database |
| `SUPABASE_ANON_KEY` | 2 | For persistence | Client access |
| `SUPABASE_SERVICE_ROLE_KEY` | 2 | Server only | Admin writes |
| `HEYGEN_API_KEY` | 5 | For video | Walkthrough generation |
| `META_GRAPH_TOKEN` | 5 | For outreach | Comment-to-DM |
| `RESEND_API_KEY` | 5 | For email | Cold email sequences |
| `VERCEL_TOKEN` | 4 | For staging | Preview deploys |
| `APP_URL` | 4 | Webhooks | Callback base URL |

---

## Definition of Done (Platform Launch)

- [x] Lighthouse live audits (home URL)
- [ ] Nvidia NIM for all AI endpoints
- [ ] Operator can search a city/niche and ingest live leads
- [ ] Lighthouse audits on all key pages with throttling
- [ ] LLM writes real audits from Lighthouse data
- [ ] Staging preview deploys to a public URL
- [ ] HITL gate blocks HeyGen until human approves
- [ ] Outreach sends via compliant Meta or SMTP channel
- [ ] All state persists across sessions (Supabase)
- [ ] PDF audit + invoice export with bank transfer block
- [ ] LangGraph orchestrator manages agent handoffs
- [x] No payment gateway in app (billing offline)

---

## Changelog

| Date | Update |
|------|--------|
| 2026-06-02 | Created TODO.md; started Phase 1 (Lighthouse audit engine) |
| 2026-06-02 | Lighthouse CLI shipped; Nvidia NIM + PLAN.md Cursor handoff added |
