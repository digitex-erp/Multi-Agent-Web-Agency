import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

function getDistPath(): string {
  // Bundled to dist/server.cjs — static assets live in the same folder on Vercel
  return typeof __dirname !== "undefined"
    ? __dirname
    : path.join(process.cwd(), "dist");
}

// REST route for health check (must stay lightweight for Vercel cold start)
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    runtime: process.env.VERCEL ? "vercel" : "node",
  });
});

// Lighthouse audit engine status (throttle / cooldown telemetry)
app.get("/api/audit/status", async (_req, res) => {
  try {
    const { getPageSpeedApiStatus } = await import("./src/lib/speedAuditor.ts");
    res.json({ success: true, engine: "lighthouse", ...getPageSpeedApiStatus() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Audit status unavailable";
    res.status(503).json({ success: false, error: message });
  }
});

// Live Lighthouse audit (local Chrome — no Google API key)
app.post("/api/audit", async (req, res) => {
  try {
    const { getPageSpeedApiStatus, runPageSpeedAudit } = await import("./src/lib/speedAuditor.ts");
    const { url, strategy = "mobile" } = req.body ?? {};

    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, error: "Missing required field: url" });
    }

    const normalizedStrategy = strategy === "desktop" ? "desktop" : "mobile";
    const audit = await runPageSpeedAudit(url, normalizedStrategy);
    const apiStatus = getPageSpeedApiStatus();

    if (audit.source === "fallback" && audit.error) {
      return res.status(503).json({
        success: false,
        error: audit.error,
        audit,
        apiStatus,
      });
    }

    return res.json({ success: true, audit, apiStatus });
  } catch (error: unknown) {
    console.error("Error in /api/audit:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ success: false, error: message });
  }
});

// Client invoice payment instructions (bank transfer / UPI — no payment gateway)
app.get("/api/billing/payment-instructions", async (_req, res) => {
  const { AGENCY_BILLING } = await import("./src/config/agencyBilling.ts");
  const {
    formatInvoicePaymentHtml,
    formatInvoicePaymentMarkdown,
    formatInvoicePaymentPlainText,
  } = await import("./src/lib/invoicePaymentBlock.ts");

  res.json({
    success: true,
    billing: AGENCY_BILLING,
    formatted: {
      plainText: formatInvoicePaymentPlainText(),
      markdown: formatInvoicePaymentMarkdown(),
      html: formatInvoicePaymentHtml(),
    },
  });
});

// --- Phase 2: Lead CRM persistence (Supabase + in-memory fallback) ---
app.get("/api/leads", async (_req, res) => {
  try {
    const { listLeads, getLeadsStorageMode } = await import("./src/lib/leadsStore.ts");
    const { leads, storage } = await listLeads();
    res.json({ success: true, leads, storage: storage ?? getLeadsStorageMode() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load leads";
    res.status(500).json({ success: false, error: message });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    const { createLead } = await import("./src/lib/leadsStore.ts");
    const lead = await createLead(req.body);
    res.status(201).json({ success: true, lead });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create lead";
    res.status(500).json({ success: false, error: message });
  }
});

app.put("/api/leads/:id", async (req, res) => {
  try {
    const { updateLead } = await import("./src/lib/leadsStore.ts");
    const lead = await updateLead({ ...req.body, id: req.params.id });
    res.json({ success: true, lead });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update lead";
    res.status(500).json({ success: false, error: message });
  }
});

// Prompt-driven report generator endpoint
app.post("/api/generate-report", async (req, res) => {
  try {
    const { runStrategicReportGraph } = await import("./src/agents/reportGraph.ts");
    const { getNimModel } = await import("./src/agents/nimChatModel.ts");
    const { generateReportViaPythonAgents } = await import("./src/lib/pythonAgentsClient.ts");

    const { leads = [], metrics = {}, promptCustom = "" } = req.body;

    const formattedMetrics = JSON.stringify(metrics, null, 2);
    const leadsSummarized = leads.slice(0, 10).map((l: any) => ({
      name: l.businessName,
      niche: l.niche,
      initialPSI: l.originalPageSpeed,
      newPSI: l.newPageSpeed || "Pending",
      heyGenStatus: l.heyGenStatus,
      heyGenCost: l.heyGenCost,
      status: l.status,
      conversion: l.conversionStatus,
    }));

    const systemPrompt = `You are the lead Operations Auditor and Strategic Analyst for 'Agentic Web Agency'—a digital agency completely automated by a multi-agent LangGraph orchestrator consisting of Scout, Diagnoser, Builder, Filmer, Pitcher, and Checker agents.

Your task is to analyze the operational logs, pipeline metrics, and current lead list, then compile a highly professional, comprehensive "Strategic Optimization & Pipeline Report".

The target audience is the agency principal/operator. Write in a sophisticated, objective tone utilizing bulletproof technical and operational design principles inspired by the "Feasibility Study & System Premortem" guidelines.

Focus your response on these core sections:
1. EXECUTIVE SUMMARY: High-level overview of the pipeline health and conversion rates.
2. FINANCIAL ANALYSIS: Break down the actual cost of operation ($2,360/mo actual based on token costs, HeyGen video, data harvesting) vs. the unrealistic theoretical model ($480/mo). Detail where leakages occur.
3. CRITICAL BOTTLENECK REMEDIATIONS: 
   - Propose solid mitigations for Lighthouse audit queue pacing (max concurrent workers, cooldowns) and Meta Platform DM limits (comment-to-DM triggers vs outbound cold outreach).
   - Address the 'Last 30% Problem' in Frontend Redesign builds (Vision-Feedback self-correction loops & headless screenshot validation).
4. HUMAN-IN-THE-LOOP (HITL) WORKFLOW AUDIT: Explain how placing a human gate before HeyGen code-to-video generation cuts HeyGen costs by up to 90% and ensures pristine design quality.
5. STRATEGIC RECOMMENDATIONS: 3 actionable items to maximize ROI and protect outreach accounts from suspensions.

Structure your report using beautiful Markdown formatting. Paint a realistic but optimistic path about running a stable, highly profitable automated agency. Keep it concise, professional, and free of sales pitch clichés.`;

    const userPromptContent = `Here is the current operational data of our remote agency:
METRICS:
${formattedMetrics}

RECENT LEADS IN PIPELINE:
${JSON.stringify(leadsSummarized, null, 2)}

CUSTOM OPERATOR FOCUS:
${promptCustom || "None provided. Analyze general operational health and report recommendations."}

Please generate the Strategic Optimization & Pipeline Report based on this data.`;

    const pythonResult = await generateReportViaPythonAgents({
      systemPrompt,
      userPrompt: userPromptContent,
      leads: leadsSummarized,
      metrics,
    });

    if (pythonResult?.success && pythonResult.report) {
      console.log(`Report from Python LangGraph (ChatNVIDIA) — ${pythonResult.model ?? "nvidia"}`);
      return res.json({
        success: true,
        report: pythonResult.report,
        source: "langgraph_python",
        model: pythonResult.model ?? getNimModel(),
      });
    }

    const graphResult = await runStrategicReportGraph(systemPrompt, userPromptContent);

    if (graphResult.report) {
      return res.json({
        success: true,
        report: graphResult.report,
        source: "langgraph_ts",
        model: getNimModel(),
      });
    }

    console.log("Using local static/template report generator...");
    const fallbackReport = `## STRATEGIC OPTIMIZATION & PIPELINE REPORT
*Generated by the Local Fallback Operations Audit Engine*

### 1. Executive Summary
The Agentic Web Agency pipeline shows active progress. Current lead volume is tracked at **${leads.length} leads**, with an estimated conversion rate of **${metrics.conversionRate || "4.7"}%**. While the pipeline is functional, there are substantial budget leakages and platform risks that threaten continuous operation. Transitioning to a hybrid human-agent architecture is critical to maintain service delivery.

### 2. Financial Analysis & Budget Realities
The theoretical model of a multi-agent agency claim of **$480.00/mo** is mathematically impossible under scale.
A breakdown of the actual and projected empirical costs per 1,000 processed leads reveals:
- **Data Acquisition (Scout):** $30.00 (managed proxy scraper vs Google restriction wall)
- **Diagnostic Audits (LLM Sonnet):** $30.00
- **Code Generation (Builder):** $250.00 (large token synchronizations for multi-file Vite layouts)
- **Walkthrough Videos (Filmer):** $2,000.00 ($4.00 per minute on HeyGen Avatar IV)
- **Infrastructure:** $50.00 (Supabase and Vercel compute)
- **Total Real Cost:** **$2,360.00/mo**

Using a Human-in-the-Loop (HITL) checkpoint reduces computed HeyGen video renders only to vetted, approved leads, immediately saving **up to 85% ($1,700/mo)** of the operations budget.

### 3. Critical Bottleneck Remediations
#### PageSpeed Insights Throttling
Querying over 450 leads concurrently triggers Google's origin-level rate limits, resulting in HTTP 500 errors.
*   **Fix:** Implement a throttled execution queue of max 16 parallel workers with randomized backoff delays (1s to 180s) on error capture.

#### Meta Platform Direct Messaging Bans
Aggressive outbound automation on Instagram and Facebook breaches anti-spam rules, causing permanent account blocks.
*   **Fix:** Pivot outreach entirely to an **inbound-led 'Comment-to-DM' trigger flow** using compliant Meta Graph API tokens. Post organic content inviting redesigned site previews and utilize the active 24-hour messaging window opened by users commenting.

#### The "Almost Right" Frontend Deficit (Last 30% Problem)
AI-generated mockups often contain overlapping text, broken flex grids, and low mobile responsiveness.
*   **Fix:** Deploy a Vision-Feedback (VF) self-correction loop where the Checker Agent spawns a headless browser, evaluates visual layout artifacts via multimodal checks, and applies automated CSS corrections recursively.

### 4. Human-In-The-Loop Validation Audit
Deploying an explicit HITL stage between **Builder** and **Filmer** processes prevents expensive automated assets from being rendered for uninterested or non-compliant prospects.
*   **Standard Gate:** The Builder's compiled React project is staged on Vercel. An operator is notified to verify branding and layout in under 1 minute.
*   **Result:** This single gate lowers video expenses from $2,000/mo to less than $300/mo, serving as our most powerful defense against API bankruptcy.

### 5. Tactical Next Steps
1. **Enforce Pydantic schema validation** at LangGraph edges to avoid drift corruptions.
2. **Setup the Comment-to-DM trigger** on Instagram for organic inbound generation.
3. **Pace Scout audits** to keep concurrent Lighthouse runs within safe worker limits.`;

    return res.json({ success: true, report: fallbackReport, source: "local_fallback" });
  } catch (error: unknown) {
    console.error("Error generating report API:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ success: false, error: message });
  }
});

function setupProductionStatic(): void {
  const distPath = getDistPath();
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in development mode with Vite middleware... (PORT: 3000)");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in production mode (PORT: 3000)");
    setupProductionStatic();
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

export { app };
export default app;

if (process.env.VERCEL) {
  setupProductionStatic();
} else {
  void startServer();
}
