import React, { useState } from 'react';
import { Sparkles, Terminal, FileText, CheckCircle, Flame, DollarSign, Download, ArrowRight, Printer, AlertTriangle } from 'lucide-react';
import { Lead } from '../types';

interface ReportsPanelProps {
  leads: Lead[];
  metrics: {
    scoutedLeadsCount: number;
    convertedClientsCount: number;
    totalApiSpent: number;
    conversionRate: number;
    metaHourCount: number;
    totalTokenUsage: number;
  };
}

export default function ReportsPanel({ leads, metrics }: ReportsPanelProps) {
  const [operatorPrompt, setOperatorPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [reportHtml, setReportHtml] = useState<string>('');
  const [reportSource, setReportSource] = useState<'langgraph_python' | 'langgraph_ts' | 'local_fallback' | ''>('');

  // Client side markdown to simple stylized JSX converter
  const parseMarkdownToJSX = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-100 font-sans tracking-tight mt-5 mb-2 border-b border-slate-900 pb-1">
            {trimmed.replace('###', '').trim()}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-indigo-400 font-sans tracking-tight mt-6 mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            <span>{trimmed.replace('##', '').trim()}</span>
          </h3>
        );
      }
      if (trimmed.startsWith('#')) {
        return (
          <h2 key={idx} className="text-lg font-black text-white font-sans tracking-tight mt-8 mb-4 uppercase bg-slate-900/40 p-2.5 rounded border border-slate-800">
            {trimmed.replace('#', '').trim()}
          </h2>
        );
      }
      
      // Lists
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const content = trimmed.substring(1).trim();
        // Check for bold parts within the list item
        return (
          <li key={idx} className="text-xs text-slate-300 leading-relaxed ml-4 list-disc pl-1 mb-1.5 font-sans">
            {renderLineWithInlineFormatting(content)}
          </li>
        );
      }
      
      // Empty lines
      if (trimmed === '') {
        return <div key={idx} className="h-2.5" />;
      }
      
      // Standard Paragraph
      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed font-sans mb-3 text-justify">
          {renderLineWithInlineFormatting(trimmed)}
        </p>
      );
    });
  };

  // Helper to highlight '**bold**' strings
  const renderLineWithInlineFormatting = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-indigo-300 font-semibold">{part}</strong>;
      }
      // Check for code bits like `code`
      const codeParts = part.split(/`([^`]+)`/g);
      return codeParts.map((subpart, j) => {
        if (j % 2 === 1) {
          return <code key={j} className="text-[10px] bg-slate-900 text-slate-300 font-mono px-1 py-0.5 rounded border border-slate-800">{subpart}</code>;
        }
        return subpart;
      });
    });
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setReportHtml('');
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads,
          metrics,
          promptCustom: operatorPrompt
        })
      });

      const data = await response.json();
      if (data.success && data.report) {
        setReportHtml(data.report);
        setReportSource(data.source);
      } else {
        throw new Error(data.error || `Report failed (${response.status})`);
      }
    } catch (e: any) {
      console.error(e);
      const message = e?.message ?? 'Unknown error';
      setReportHtml(`## SYSTEM ADVISORY REPORT
*Could not reach LangGraph report API*

### Error
${message}

### What to check
1. Latest code is **pushed to GitHub** and Vercel redeployed (not commit \`693549f\` only).
2. Vercel env vars: \`NVIDIA_API_KEY\`, \`NVIDIA_MODEL\`, \`NODE_ENV=production\`.
3. Open \`/api/health\` in your browser — should return JSON, not the React app.

### Pipeline snapshot (local state)
- Conversion: **${metrics.conversionRate}%** · Clients: **${metrics.convertedClientsCount}**
- MRR: **$${metrics.convertedClientsCount * 400}** · Session cost: **$${metrics.totalApiSpent.toFixed(2)}**`);
      setReportSource('local_fallback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 leading-relaxed">
      {/* Inputs side */}
      <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">Operational Optimization Module</span>
            <h3 className="text-base font-bold text-white font-sans tracking-tight mt-0.5">Automated Strategic Reporting</h3>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Enabling real-time orchestration auditing: compile lead conversion trends, compute token and HeyGen rendering costs, and generate strategic recommendations.
          </p>

          <div className="border border-slate-800 bg-slate-900/30 p-3.5 rounded-lg text-xs space-y-2">
            <h4 className="font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>Pipeline Assets Captured:</span>
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px] text-slate-400">
              <li className="flex items-center justify-between">
                <span>Leads Audited count:</span>
                <span className="text-white font-bold">{leads.length} leads</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Retained conversion rate:</span>
                <span className="text-emerald-400 font-bold">{metrics.conversionRate}%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Session token weight:</span>
                <span className="text-indigo-400 font-bold">{metrics.totalTokenUsage.toLocaleString()} tokens</span>
              </li>
            </ul>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
              Optional Custom Audit Directives (Focus areas):
            </label>
            <textarea
              value={operatorPrompt}
              onChange={(e) => setOperatorPrompt(e.target.value)}
              placeholder="e.g. 'We want to optimize margins for Chicago salons' or 'Evaluate Builder token decrease options'..."
              className="w-full bg-slate-905 bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 h-28 resize-none"
            />
          </div>

          {/* GENERATE ACTION BUTTON */}
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className={`cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-505 hover:to-cyan-400 hover:brightness-110 text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg border border-indigo-400/20 active:scale-95 transition ${
              loading ? 'opacity-70 cursor-not-allowed animate-pulse' : ''
            }`}
          >
            <Sparkles className="h-4 w-4 text-white" />
            <span>{loading ? "Compiling Agency Indicators..." : "Generate AI Strategic Audit Report"}</span>
          </button>
        </div>

        {/* Quick ROI stats card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
            <span>PIPELINE REVENUE PERFORMANCE</span>
            <span>SCALE MATH</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-400 block font-sans">Retained Clients (converted)</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">{metrics.convertedClientsCount}</span>
            </div>
            
            <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-400 block font-sans">Monthly Retainer ($400/mo)</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">${metrics.convertedClientsCount * 400.00}</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-500 flex items-center space-x-1 justify-center bg-slate-900/30 py-2 rounded border border-slate-800">
            <DollarSign className="h-3.5 w-3.5 text-indigo-400" />
            <span>Assuming default salon/plumbing pricing models from study records.</span>
          </div>
        </div>
      </div>

      {/* Report Canvas view on right */}
      <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="text-indigo-400 h-4.5 w-4.5" />
            <span className="text-xs font-bold text-slate-200">Executive Report Canvas</span>
          </div>

          {reportHtml && (
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                Source: {reportSource}
              </span>
              <button 
                onClick={() => window.print()}
                className="hover:bg-slate-800 text-slate-400 hover:text-white p-1 rounded transition border border-transparent hover:border-slate-700"
              >
                <Printer className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Display */}
        <div className="flex-1 overflow-y-auto pr-1 select-all select-text scrollbar-thin min-h-[44vh] max-h-[56vh]">
          {loading ? (
            /* Pulsing layout loaders */
            <div className="flex flex-col items-center justify-center h-80 space-y-4">
              <div className="p-3 bg-indigo-600/10 border border-indigo-400/20 text-indigo-400 rounded-full animate-bounce">
                <Sparkles className="h-8 w-8 text-indigo-400" />
              </div>
              <div>
                <span className="text-slate-300 font-semibold text-xs animate-pulse block text-center">
                  Reading operational leads list & ledger metrics...
                </span>
                <span className="text-slate-500 font-mono text-[10px] mt-1.5 block text-center">
                  Querying LangGraph agents via Nvidia NIM…
                </span>
              </div>
            </div>
          ) : reportHtml ? (
            /* Processed MD into pristine HTML document cards */
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-900/60 shadow-inner leading-relaxed">
              {parseMarkdownToJSX(reportHtml)}
            </div>
          ) : (
            /* Prompt empty helper */
            <div className="flex flex-col items-center justify-center h-80 text-center text-slate-500 px-8">
              <Terminal className="h-8 w-8 text-slate-700 animate-pulse mb-3" />
              <h4 className="text-xs font-semibold text-slate-400">Auditor Report Engine Standby</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                Enter your core focus instructions and hit "Generate" to trigger the full-stack report agent. It compiles actual leads lists and budget spent indicators directly.
              </p>
            </div>
          )}
        </div>

        {/* Simulated Export Options */}
        {reportHtml && !loading && (
          <div className="border-t border-slate-900 pt-4 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Prepared for: Operating Director Alex Riveras</span>
            <button
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([reportHtml], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = "Agentic_Agency_Audit_Report.md";
                document.body.appendChild(element);
                element.click();
              }}
              className="cursor-pointer font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 text-[11px]"
            >
              <Download className="h-3.5 w-3.5 inline" />
              <span>Export Report as Markdown (Local Raw)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
