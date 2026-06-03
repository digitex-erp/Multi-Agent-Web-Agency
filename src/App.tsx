import React, { useState, useEffect } from 'react';
import { INITIAL_LEADS, TEAM_MEMBERS, RECENT_LOGS } from './initialData';
import { Lead, AgentLog, RemoteTeamMember, SystemMetrics } from './types';
import Header from './components/Header';
import AgentPipeline from './components/AgentPipeline';
import LeadManager from './components/LeadManager';
import FinancialMetrics from './components/FinancialMetrics';
import ReportsPanel from './components/ReportsPanel';
import { Network, Sparkles, TrendingUp, DollarSign, Bot, Users, Cpu } from 'lucide-react';
import { fetchPageSpeedApiStatus } from './lib/auditClient';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [team, setTeam] = useState<RemoteTeamMember[]>(TEAM_MEMBERS);
  const [logs, setLogs] = useState<AgentLog[]>(RECENT_LOGS);
  const [currentSection, setCurrentSection] = useState<string>('pipeline');

  // Core Orchestration Metrics State
  const [metrics, setMetrics] = useState<SystemMetrics>({
    scoutedLeadsCount: 42,
    convertedClientsCount: 2, // Starts with Evergreen Dental and Bistro bistro complete
    totalApiSpent: 26.50, // Scraping ($15) + Tokens ($6.50) + HeyGen Renders ($5)
    conversionRate: 4.7,
    metaHourCount: 45, // Outbound DM limit meter helper
    totalTokenUsage: 1450000, // Total token synchronize weight
    pageSpeedApiStatus: 'online',
    pageSpeedCooldownRemaining: 0,
  });

  // Poll live PageSpeed API throttle/cooldown telemetry
  useEffect(() => {
    const syncPsiStatus = async () => {
      const status = await fetchPageSpeedApiStatus();
      if (!status) return;
      setMetrics(prev => ({
        ...prev,
        pageSpeedApiStatus: status.status,
        pageSpeedCooldownRemaining: status.cooldownRemaining,
      }));
    };

    syncPsiStatus();
    const interval = setInterval(syncPsiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulated running log generator for "real-time project progress tracking"
  useEffect(() => {
    const logPool = [
      { name: "Scout Agent", act: "Scanned Oregon hair dressing niches", detail: "Extracted 6 leads under PSI 45 speed threshold.", status: "success" as const },
      { name: "Scout Agent", act: "Filtered non-responsive DNS pointers on dental prospects", detail: "Purged 3 invalid staging URLs.", status: "info" as const },
      { name: "Diagnoser Agent", act: "Generating speed remediation advice for Atlanta Salons", detail: "Computed 3 layout accessibility repairs.", status: "success" as const },
      { name: "Builder Agent", act: "Synchronizing CSS assets with Lovable API workspace", detail: "Created 2 modular layout components in sandbox.", status: "info" as const },
      { name: "Checker Agent", act: "PageSpeed Insights Post-Audit complete", detail: "Performance index upgraded to 91 on active dental mockup.", status: "success" as const },
      { name: "Checker Agent", act: "Visual test passed on mobile screen grids", detail: "Flicker transitions cleared under Framer Motion thresholds.", status: "success" as const },
      { name: "Pitcher Agent", act: "Pacing comments dispatcher queue", detail: "Safe messaging: processed 3 organic trigger comments.", status: "info" as const }
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const logTime = new Date().toISOString().replace('T', ' ').substring(11, 19) + 'Z';
      
      const newLogItem: AgentLog = {
        id: "stream_" + Date.now(),
        agentName: randomLog.name,
        action: randomLog.act,
        status: randomLog.status,
        timestamp: logTime,
        details: randomLog.detail
      };

      setLogs(prev => [newLogItem, ...prev.slice(0, 40)]);

      // Mutate resource levels slightly to simulate real activity
      setMetrics(prev => {
        const tokenDelta = Math.floor(Math.random() * 8000) + 1500;
        const apiDelta = randomLog.name === 'Scout Agent' ? 0.05 : 0.02;
        const dmDelta = Math.random() > 0.6 ? 1 : 0;
        
        return {
          ...prev,
          totalTokenUsage: prev.totalTokenUsage + tokenDelta,
          totalApiSpent: prev.totalApiSpent + apiDelta,
          metaHourCount: Math.min(prev.metaHourCount + dmDelta, 200),
          scoutedLeadsCount: randomLog.name === 'Scout Agent' && Math.random() > 0.8 ? prev.scoutedLeadsCount + 1 : prev.scoutedLeadsCount
        };
      });
    }, 15000); // Trigger every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prevLeads => prevLeads.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  const handleAddLog = (newLog: AgentLog) => {
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const handleUpdateMetrics = (heyGenCost: number, tokenDelta: number, leadsConverted: number) => {
    setMetrics(prev => ({
      ...prev,
      totalApiSpent: prev.totalApiSpent + heyGenCost + (tokenDelta > 0 ? (tokenDelta / 1000000) * 3 : 0), // Claude input averages $3.00/1M tokens
      totalTokenUsage: prev.totalTokenUsage + tokenDelta,
      convertedClientsCount: prev.convertedClientsCount + leadsConverted,
      metaHourCount: leadsConverted > 0 ? prev.metaHourCount + 1 : prev.metaHourCount
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-805 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Premium Header */}
      <Header
        team={team}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Quick Hub Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs select-none">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">Conversion rate</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 block">
                {metrics.conversionRate}%
              </span>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 hidden sm:block">
              <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs select-none">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">Converted Clients</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 mt-1 block">
                {metrics.convertedClientsCount} secure
              </span>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 hidden sm:block">
              <Sparkles className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs select-none">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">Current Retainer (MRR)</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 block">
                ${metrics.convertedClientsCount * 400}.00
              </span>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 hidden sm:block">
              <DollarSign className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs select-none">
            <div>
              <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">Active Scrape Volume</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 mt-1 block">
                {metrics.scoutedLeadsCount} leads
              </span>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 hidden sm:block">
              <Users className="h-4 sm:h-5 w-4 sm:w-5" />
            </div>
          </div>
        </div>

        {/* Dynamic section rendering with fade entrance transitions */}
        <div className="transition duration-500">
          {currentSection === 'pipeline' && (
            <AgentPipeline
              logs={logs}
              leads={leads}
              onAddLog={handleAddLog}
            />
          )}

          {currentSection === 'leads' && (
            <LeadManager
              leads={leads}
              team={team}
              onUpdateLead={handleUpdateLead}
              onAddLog={handleAddLog}
              onUpdateMetrics={handleUpdateMetrics}
            />
          )}

          {currentSection === 'financials' && (
            <FinancialMetrics
              metrics={metrics}
            />
          )}

          {currentSection === 'reports' && (
            <ReportsPanel
              leads={leads}
              metrics={metrics}
            />
          )}
        </div>
      </main>

      {/* Simple Footer with zero margin clutter */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
          <span>&copy; 2026 Programmatically Orchestrated Multi-Agent Web Agency Controller. All Rights Reserved.</span>
          <div className="flex space-x-4">
            <span className="hover:text-slate-700 transition">Compliant Inbound Sales Mode</span>
            <span>•</span>
            <span className="hover:text-slate-700 transition">Budget Safe Guard Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
