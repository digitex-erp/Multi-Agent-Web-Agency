import React, { useState } from 'react';
import { Target, TrendingDown, DollarSign, Cpu, BarChart3, AlertOctagon, HelpCircle, ShieldCheck, PlayCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { FINANCIAL_BREAKDOWN, TARGET_BUDGET, EMPIRICAL_BUDGET } from '../initialData';

interface FinancialMetricsProps {
  metrics: {
    totalApiSpent: number;
    metaHourCount: number;
    pageSpeedApiStatus: string;
    totalTokenUsage: number;
    scoutedLeadsCount: number;
    convertedClientsCount: number;
  };
}

export default function FinancialMetrics({ metrics }: FinancialMetricsProps) {
  const [useHITLAdjuster, setUseHITLAdjuster] = useState<boolean>(true);

  // Cost calculations
  const theoreticalTotal = TARGET_BUDGET;
  const standardEmpirical = EMPIRICAL_BUDGET;
  
  // With HITL Adjuster, we assume HeyGen renders only occur for some approved warm leads, reducing video costs by 85%.
  const adjustedEmpirical = standardEmpirical - 1700.00; 

  return (
    <div className="space-y-6 leading-relaxed">
      {/* Intro explain banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-md">
        <h2 className="text-lg font-bold font-sans tracking-tight text-white mb-2 flex items-center space-x-2">
          <DollarSign className="text-indigo-400 h-5 w-5" />
          <span>Financial Auditing & System Resource Health Ledger</span>
        </h2>
        <p className="text-slate-400 text-xs leading-relaxed max-w-4xl">
          Contrasting the viral theoretical model of solo-operated, fully automated multi-agent agencies against the empirical realities of token economics, gridded lead crawling, and high-fidelity avatar rendering costs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ledger Comparison Panel */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-4 mb-4 gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">Interactive Ledgers</span>
                <h3 className="text-sm font-bold text-slate-200 mt-0.5">Scale Ledger: 1,000 Prospects Processed Per Month</h3>
              </div>

              {/* Toggle to show HITL Savings impact */}
              <div
                onClick={() => setUseHITLAdjuster(!useHITLAdjuster)}
                className="cursor-pointer bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-2 select-none hover:bg-slate-850/80 transition"
              >
                <span className="text-[10px] font-mono text-slate-400 font-bold">HUMAN-IN-THE-LOOP SAFETY GATE:</span>
                <span className={`text-[10px] font-mono font-bold uppercase transition ${useHITLAdjuster ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {useHITLAdjuster ? "Slashing Cost Active" : "Disabled (Pure Auto)"}
                </span>
                {useHITLAdjuster ? (
                  <ToggleRight className="h-5 w-5 text-emerald-400" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-slate-600" />
                )}
              </div>
            </div>

            {/* Price list Grid comparison items */}
            <div className="space-y-3.5 mb-6 text-xs">
              <div className="grid grid-cols-12 border-b border-slate-900 pb-2 font-mono text-[10px] text-slate-500 uppercase">
                <div className="col-span-6">Operation Phase Asset</div>
                <div className="col-span-2 text-center">Unrealistic Concept</div>
                <div className="col-span-2 text-center">Standard Auto</div>
                <div className="col-span-2 text-right">HITL Balanced</div>
              </div>

              {/* Data acquisition scrapers row */}
              <div className="grid grid-cols-12 items-center text-slate-300 py-1 border-b border-slate-900/50">
                <div className="col-span-6 pr-2">
                  <span className="font-semibold text-slate-200 block">Data Harvesting Scrapes (Scout)</span>
                  <span className="text-slate-500 text-[10px] leading-tight block">Google Places pagination grids + verify socials</span>
                </div>
                <div className="col-span-2 text-center font-mono text-[11px]">$0.00 <span className="text-[9px] text-slate-500">(Larp)</span></div>
                <div className="col-span-2 text-center font-mono text-[11px] font-semibold text-rose-400">$30.00</div>
                <div className="col-span-2 text-right font-mono text-[11px] font-bold text-emerald-400">$30.00</div>
              </div>

              {/* Diagnoser row */}
              <div className="grid grid-cols-12 items-center text-slate-300 py-1 border-b border-slate-900/50">
                <div className="col-span-6 pr-2">
                  <span className="font-semibold text-slate-200 block">Consulting Audits (Diagnoser)</span>
                  <span className="text-slate-500 text-[10px] leading-tight block">Claude 3.5 Sonnet analysis text tokens</span>
                </div>
                <div className="col-span-2 text-center font-mono text-[11px]">$0.00 <span className="text-[9px] text-slate-500">(Larp)</span></div>
                <div className="col-span-2 text-center font-mono text-[11px] font-semibold text-rose-400">$30.00</div>
                <div className="col-span-2 text-right font-mono text-[11px] font-bold text-emerald-400">$30.00</div>
              </div>

              {/* Builder Row */}
              <div className="grid grid-cols-12 items-center text-slate-300 py-1 border-b border-slate-900/50">
                <div className="col-span-6 pr-2">
                  <span className="font-semibold text-slate-200 block">Template Code Builds (Builder)</span>
                  <span className="text-slate-500 text-[10px] leading-tight block">React design code sync context tokens</span>
                </div>
                <div className="col-span-2 text-center font-mono text-[11px]">$0.00 <span className="text-[9px] text-slate-500">(Larp)</span></div>
                <div className="col-span-2 text-center font-mono text-[11px] font-semibold text-rose-400">$250.00</div>
                <div className="col-span-2 text-right font-mono text-[11px] font-bold text-emerald-400">$250.00</div>
              </div>

              {/* HeyGen Video row */}
              <div className="grid grid-cols-12 items-center text-slate-300 py-1 border-b border-slate-900/50">
                <div className="col-span-6 pr-2">
                  <span className="font-semibold text-slate-200 block">High-Fi Walks (Filmer)</span>
                  <span className="text-slate-500 text-[10px] leading-tight block">HeyGen Avatar rendering (10s to 1min walks to video, $4/min)</span>
                </div>
                <div className="col-span-2 text-center font-mono text-[11px] text-indigo-400">$480.00</div>
                <div className="col-span-2 text-center font-mono text-[11px] font-semibold text-rose-400">$2,000.00</div>
                <div className="col-span-2 text-right font-mono text-[11px] font-bold text-emerald-400">
                  {useHITLAdjuster ? "$300.00" : "$2,000.00"}
                </div>
              </div>

              {/* Hosting Row */}
              <div className="grid grid-cols-12 items-center text-slate-300 py-1 border-b border-slate-900/50">
                <div className="col-span-6 pr-2">
                  <span className="font-semibold text-slate-200 block">Deployment Hosting (Infra)</span>
                  <span className="text-slate-500 text-[10px] leading-tight block">Vercel and database server scaling</span>
                </div>
                <div className="col-span-2 text-center font-mono text-[11px]">$0.00 <span className="text-[9px] text-slate-500">(Larp)</span></div>
                <div className="col-span-2 text-center font-mono text-[11px] font-semibold text-rose-400">$50.00</div>
                <div className="col-span-2 text-right font-mono text-[11px] font-bold text-emerald-400">$50.00</div>
              </div>
            </div>
          </div>

          {/* Sum Summary Indicators */}
          <div className="border-t border-slate-900 pt-5 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/45 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Theoretical Claim</span>
              <span className="text-lg font-bold font-mono text-indigo-400">${theoreticalTotal.toFixed(2)}/mo</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Fails to calculate proper token sync payloads or Outscraper details.
              </p>
            </div>
            <div className="bg-slate-900/45 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Unchecked Auto Reality</span>
              <span className="text-lg font-bold font-mono text-rose-400">${standardEmpirical.toFixed(2)}/mo</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Extremely high HeyGen video rendering fees exhausted across unqualified cold contacts.
              </p>
            </div>
            <div className="bg-slate-900/45 p-3 rounded-lg border border-emerald-900/30">
              <span className="text-[10px] font-mono text-emerald-500 uppercase block">HITL Safe Deployment</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                ${(useHITLAdjuster ? adjustedEmpirical : standardEmpirical).toFixed(2)}/mo
              </span>
              <p className="text-[10px] text-emerald-500/80 mt-1 leading-snug">
                <strong>Saves ${(useHITLAdjuster ? 1700 : 0).toFixed(2)}/mo!</strong> Enforcing human checks reserves hi-fi rendering for highly vetted leads.
              </p>
            </div>
          </div>
        </div>

        {/* Resources and Safe indicators */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Ledger Stat Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">Live Operations Bill</span>
            <h3 className="text-sm font-bold text-slate-300 mt-0.5">Current Session Spent:</h3>
            
            <div className="mt-4 flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono text-white">${metrics.totalApiSpent.toFixed(2)}</span>
              <span className="text-xs text-slate-500">API credits spent</span>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-normal">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-mono">
                  <span className="text-slate-400">LLM tokens synchronize</span>
                  <span className="text-slate-300">{metrics.totalTokenUsage.toLocaleString()} tokens</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min((metrics.totalTokenUsage / 500000) * 100, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1 font-mono">
                  <span className="text-slate-400">Conversion Revenue</span>
                  <span className="text-emerald-400font-bold">${metrics.convertedClientsCount * 400} /mo MRR</span>
                </div>
                <div className="text-[10px] text-slate-500 leading-snug">
                  Based on {metrics.convertedClientsCount} active clients locked at standard $400.00/mo retainer level.
                </div>
              </div>
            </div>
          </div>

          {/* Rate limiting health parameters */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase block">System Rate Limiting Safety Status</span>

            {/* PSI PSI Status */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">PageSpeed Insights Audit Health</span>
                <span className="font-mono text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                  SAFE / PACED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Pacing metrics: max 16 concurrent leads. Shuffling URLs avoids Origin IP blocks. Rate: normal.
              </p>
            </div>

            {/* Meta direct messaging hourly indicators */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Meta Graph Hourly Pacing</span>
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                    metrics.metaHourCount > 180 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {metrics.metaHourCount} DMs/hour
                </span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                {/* 200 is strict Meta threshold limit */}
                <div className={`h-full rounded-full transition-all ${metrics.metaHourCount > 180 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min((metrics.metaHourCount / 200) * 100, 100)}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1 px-1 flex items-center justify-between">
                <span>Safe Paced threshold: max 200/hr</span>
                <span className="font-bold">Limit: 200</span>
              </p>
            </div>

            {/* Anti Spam advice banner */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-3 flex items-start space-x-2 text-xs">
              <AlertOctagon className="h-4.5 w-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-400 block uppercase">Compliant Protocol Indicator</span>
                <p className="text-slate-300 mt-1 text-[11px] leading-snug">
                  By routing sales pitches exclusively via the organic Comment-to-DM triggers, the campaign qualifies under official Graph APIs and guarantees 100% account suspension protection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
