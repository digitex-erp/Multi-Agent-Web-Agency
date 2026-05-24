import React, { useState } from 'react';
import { Network, Database, MessageSquare, Terminal, Eye, ShieldAlert, Cpu, CheckCircle2, ChevronRight, BookOpen, AlertTriangle } from 'lucide-react';
import { AgentLog, Lead } from '../types';

interface AgentPipelineProps {
  logs: AgentLog[];
  leads: Lead[];
  onAddLog: (log: AgentLog) => void;
}

interface AgentNode {
  id: string;
  name: string;
  role: string;
  technology: string;
  apiCost: string;
  currentTask: string;
  rateLimitConfig: string;
  preMortemRisk: string;
  mitigationStrategy: string;
}

const AGENT_NODES: AgentNode[] = [
  {
    id: "scout",
    name: "Scout Agent",
    role: "Lead Harvesting",
    technology: "Python + Managed Scraping API",
    apiCost: "$30.00 / 1k Detailed Contacts (Outscraper gridding)",
    currentTask: "Querying dental, salon, plumbing databases in Portland",
    rateLimitConfig: "PageSpeed Insights: Max 240 requests/min. Outscraper: Grid divisions of 1.2km radius.",
    preMortemRisk: "PSI concurrent audits crash after 450 sequential requests with HTTP 500 origin errors. Places API limits search results at 60.",
    mitigationStrategy: "Throttling parallel auditing processes to under 16 concurrent workers with randomized exponential backoff delays (1s to 180s)."
  },
  {
    id: "diagnoser",
    name: "Diagnoser Agent",
    role: "Visual & Performance Auditor",
    technology: "Claude 3.5 Sonnet / Gemini 1.5 Pro",
    apiCost: "$30.00 / 1k Audits (5,000 input, 1,000 output tokens avg)",
    currentTask: "Writing customizable 3-problem konsulting audits",
    rateLimitConfig: "TPM (Tokens Per Minute): 40,000 max. Rate pacing: 1 audit/second.",
    preMortemRisk: "High token consumption during deep site analysis. Risk of loose, generic boilerplate recommendations.",
    mitigationStrategy: "Pre-process PageSpeed numerical outputs into concise structural metrics before LLM context load. Strict Markdown schemas."
  },
  {
    id: "builder",
    name: "Builder Agent",
    role: "Dynamic React Builder",
    technology: "Vercel v0 SDK / Lovable API Engine",
    apiCost: "$250.00 / 1k Layout Generations (80k - 150k synchronize tokens)",
    currentTask: "Assembling customized hero sections with responsive flex templates",
    rateLimitConfig: "Project Sync Tokens: 10M tokens monthly plan limit. Multi-file payload pacing.",
    preMortemRisk: "\"Almost Right But Not Quite\" visual and logical gap: Redundant layout variables, broken flex grids on smaller viewports.",
    mitigationStrategy: "Compiling standalone modular files rather than massive consolidated code, paired with Checker's Vision-Feedback loop."
  },
  {
    id: "checker",
    name: "Checker Agent",
    role: "Automated QA & Refinement",
    technology: "Headless Browser (Playwright) + Gemini Multi-modal",
    apiCost: "$10.00 / 1k Checked Leads (Infra compute + visual tokens)",
    currentTask: "Analyzing Luxe Thread Salon desktop vs mobile screenshot layouts",
    rateLimitConfig: "Concurrency: Max 8 sandbox processes. Headless browser timeout limit: 30s.",
    preMortemRisk: "Silent frontend failures (build completes but visuals render overlapping texts or broken flex alignments).",
    mitigationStrategy: "Deploying a Vision-Feedback Loop that programmatically renders preview link, captures screenshot, compares layout ratios, and recursively edits CSS."
  },
  {
    id: "filmer",
    name: "Filmer Agent",
    role: "Walkthrough Video Creator",
    technology: "HeyGen Avatar API IV (1080p rendering)",
    apiCost: "$2,000.00 / 1k Videos ($4.00 per generated walkthrough minute)",
    currentTask: "Generating customized digital twin presentation videos",
    rateLimitConfig: "Rendering slot queues. HeyGen limits concurrent high-fidelity rendering to 5 slots.",
    preMortemRisk: "Extreme budget burn! Rendering high-cost avatars for cold leads that do not convert results in immediate financial loss.",
    mitigationStrategy: "Incorporate a Human-in-the-Loop (HITL) manual validation check where the Operator must approve the mockup BEFORE triggering the Filmer node."
  },
  {
    id: "pitcher",
    name: "Pitcher Agent",
    role: "Cold Outreach Dispatch",
    technology: "Instagram Graph API / Meta Graph Messenger",
    apiCost: "Free / Included in developer token allowances",
    currentTask: "Monitoring comment trigger keywords and dispatching queues",
    rateLimitConfig: "Rate Pacing limit: Max 200 automated messages per hour. Anti-spam thresholds.",
    preMortemRisk: "Meta account suspensions! Unsolicited automated messages trigger anti-spam heuristics, leading to permanent DMs bans.",
    mitigationStrategy: "Pivot completely from cold outbound to an organic inbound \"Comment-to-DM\" flow. Auto-replies safe-paced under 200/hr."
  }
];

export default function AgentPipeline({ logs, leads }: AgentPipelineProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('scout');
  const selectedAgent = AGENT_NODES.find(a => a.id === selectedAgentId) || AGENT_NODES[0];

  const getStatusColor = (agentId: string) => {
    switch (agentId) {
      case 'scout': return 'bg-emerald-500';
      case 'diagnoser': return 'bg-teal-500';
      case 'builder': return 'bg-amber-500';
      case 'checker': return 'bg-cyan-500';
      case 'filmer': return 'bg-purple-500';
      case 'pitcher': return 'bg-pink-500';
      default: return 'bg-slate-500';
    }
  };

  const getBorderColor = (agentId: string) => {
    if (selectedAgentId === agentId) {
      switch (agentId) {
        case 'scout': return 'border-emerald-600 bg-white ring-4 ring-emerald-100/80';
        case 'diagnoser': return 'border-teal-600 bg-white ring-4 ring-teal-100/80';
        case 'builder': return 'border-amber-600 bg-white ring-4 ring-amber-100/80';
        case 'checker': return 'border-cyan-600 bg-white ring-4 ring-cyan-100/80';
        case 'filmer': return 'border-purple-600 bg-white ring-4 ring-purple-100/80';
        case 'pitcher': return 'border-pink-600 bg-white ring-4 ring-pink-100/80';
        default: return 'border-indigo-600';
      }
    }
    return 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 hover:shadow-2xs';
  };

  const getAgentStat = (agentId: string) => {
    switch (agentId) {
      case 'scout':
        return `${leads.length} Leads Active`;
      case 'diagnoser':
        return `${leads.filter(l => l.status !== 'scouted').length} Audits Compiled`;
      case 'builder':
        return `${leads.filter(l => ['building', 'filming', 'qa_check', 'complete'].includes(l.status)).length} React Mockups`;
      case 'checker':
        return `${leads.filter(l => ['qa_check', 'filming', 'complete'].includes(l.status)).length} QA Passes`;
      case 'filmer':
        return `${leads.filter(l => l.heyGenStatus === 'ready').length} Rendered Walks`;
      case 'pitcher':
        return `${leads.filter(l => l.status === 'complete').length} Outreach Sent`;
      default:
        return 'Idle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-lg font-bold font-sans tracking-tight text-slate-900 mb-2 flex items-center space-x-2 animate-fade-in">
          <Network className="text-indigo-600 h-5 w-5" />
          <span>Interactive State Orchestration (LangGraph Flow)</span>
        </h2>
        <p className="text-slate-600 text-xs leading-relaxed max-w-4xl">
          Data hops between autonomous containers using strictly enforced database boundaries and validated edge contracts. 
          To protect valuable APIs and outreach credentials, the flow implements system checkpoints and 
          <strong> Human-in-the-Loop (HITL)</strong> gates. Click on any orchestrator node to trace rate limits & remedial strategies.
        </p>
      </div>

      {/* Visual Pipeline Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div className="mb-4">
            <span className="text-xs font-semibold font-mono tracking-wider text-indigo-600 uppercase">Interactive Network Map</span>
            <h3 className="text-sm text-slate-800 font-sans mt-0.5">Click any node to run an operations diagnostic:</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-stretch relative">
            {/* Arrows simulation */}
            {AGENT_NODES.map((node, idx) => {
              const activeCount = leads.filter(l => {
                if (node.id === 'scout') return l.status === 'scouted';
                if (node.id === 'diagnoser') return l.status === 'diagnosed';
                if (node.id === 'builder') return l.status === 'building';
                if (node.id === 'checker') return l.status === 'qa_check';
                if (node.id === 'filmer') return l.status === 'filming';
                if (node.id === 'pitcher') return l.status === 'complete';
                return false;
              }).length;

              return (
                <button
                  key={node.id}
                  id={`agent-node-${node.id}`}
                  onClick={() => setSelectedAgentId(node.id)}
                  className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer group shadow-2xs ${getBorderColor(node.id)}`}
                >
                  {/* Active Indicator Pulse */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(node.id)}`} />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {node.name}
                      </span>
                    </div>
                    {activeCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-mono font-bold">
                        {activeCount} Active
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-slate-505 block tracking-tight">
                      {node.role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {node.technology}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-2 mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono text-[10px]">
                      {getAgentStat(node.id)}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6">
            <h4 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase mb-2.5">
              LangGraph Stateful Orchestration Controls
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-indigo-600 font-sans font-semibold text-xs mb-1">
                  <Database className="h-4 w-4" />
                  <span>State variable: Pydantic</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Data contracts enforced at edge thresholds. Schema drift triggers instant reversion alerts.
                </p>
              </div>
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-indigo-600 font-sans font-semibold text-xs mb-1">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Budget Safe Lock: Active</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Filmer avatar renderings are blocked from spawning autonomously without human authorization checks.
                </p>
              </div>
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-indigo-600 font-sans font-semibold text-xs mb-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Inbound triggers: Safe</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Pitcher queue listens only to Instagram Comment triggers, preserving outbound compliance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Panel Sidebar */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex-1 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-indigo-600 uppercase">Operational Diagnostic</span>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
                    {selectedAgent.name}
                  </h3>
                </div>
                <div className="bg-indigo-50 p-1.5 rounded-lg border border-indigo-100 text-indigo-600">
                  <Cpu className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Functional Vector:</span>
                  <p className="text-slate-700 mt-0.5 leading-snug">{selectedAgent.role}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Core Stack & Integration:</span>
                  <p className="text-slate-800 mt-0.5 font-mono text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-150 inline-block">{selectedAgent.technology}</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Pricelist Rate Ledger:</span>
                  <p className="text-rose-600 font-semibold font-mono mt-0.5 leading-snug bg-rose-50 border border-rose-100/50 px-2.5 py-0.5 rounded inline-block">{selectedAgent.apiCost}</p>
                </div>

                <div className="bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase mb-1">Pacing and Rate Limiters:</span>
                  <p className="text-slate-600 leading-normal text-[11px]">{selectedAgent.rateLimitConfig}</p>
                </div>

                <div className="border border-rose-100 bg-rose-50/40 p-3 rounded-lg flex items-start space-x-2 shadow-2xs">
                  <AlertTriangle className="h-4 w-4 text-rose-550 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-rose-705 font-mono uppercase block">System Premortem Point of Failure</span>
                    <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{selectedAgent.preMortemRisk}</p>
                  </div>
                </div>

                <div className="border border-emerald-100 bg-emerald-50/40 p-3 rounded-lg flex items-start space-x-2 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-705 font-mono uppercase block font-sans">Hardened Architectural Resolution</span>
                    <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{selectedAgent.mitigationStrategy}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="flex items-center space-x-2 text-[10px] text-slate-550 font-mono bg-slate-50 p-2 rounded-lg justify-center border border-slate-200">
                <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                <span>Reference: Feasibility Study Premortem 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Live logs preview */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-200 select-none">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-slate-700" />
            <span className="text-xs font-mono font-bold text-slate-700 font-sans">Agent Container Telemetry Logs</span>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-mono px-2 py-0.5 rounded border border-emerald-100">
            ● FEED STREAMING LIVE
          </span>
        </div>

        <div className="p-4 bg-slate-900 font-mono text-[11px] space-y-2 max-h-56 overflow-y-auto leading-relaxed text-slate-300 select-all scrollbar-thin rounded-b-xl border-t border-slate-950">
          {logs.map((log) => {
            const getLogColor = (status: string) => {
              if (status === 'success') return 'text-emerald-400';
              if (status === 'warning') return 'text-amber-405';
              if (status === 'error') return 'text-rose-405';
              return 'text-sky-450';
            };

            return (
              <div key={log.id} id={`log-item-${log.id}`} className="flex items-start hover:bg-slate-800/40 py-1 px-1 rounded transition">
                <span className="text-indigo-400 mr-2 flex-shrink-0">[{log.timestamp}]</span>
                <span className={`font-semibold mr-1.5 flex-shrink-0 ${getLogColor(log.status)}`}>
                  {log.agentName} »
                </span>
                <div className="flex-1">
                  <span>{log.action}</span>
                  {log.details && (
                    <span className="text-slate-505 block text-[10px] mt-0.5 pl-3 border-l border-slate-800">
                      Info: {log.details}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
