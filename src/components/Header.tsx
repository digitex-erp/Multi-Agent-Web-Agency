import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Clock, Globe, Network, Users } from 'lucide-react';
import { RemoteTeamMember } from '../types';

interface HeaderProps {
  team: RemoteTeamMember[];
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

export default function Header({ team, currentSection, setCurrentSection }: HeaderProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const onlineHumans = team.filter(t => t.type === 'human' && t.status !== 'offline').length;
  const activeAgents = team.filter(t => t.type === 'agent' && t.status === 'processing').length;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Identity */}
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl border border-indigo-500/20 shadow-indigo-600/10 shadow-lg">
              <Network className="h-5 w-5 text-white" id="header-logo-icon" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold font-sans tracking-tight text-slate-900">
                  Multi-Agent Web Agency
                </h1>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded border border-slate-200">
                  v1.2.0-Orchestrator
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Stateful Hybrid Pipeline (LangGraph & HITL Gates)
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setCurrentSection('pipeline')}
              className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition ${
                currentSection === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Control Pipeline
            </button>
            <button
              onClick={() => setCurrentSection('leads')}
              className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition ${
                currentSection === 'leads'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Task Workspace
            </button>
            <button
              onClick={() => setCurrentSection('financials')}
              className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition flex items-center space-x-1 ${
                currentSection === 'financials'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>Ledger</span>
            </button>
            <button
              onClick={() => setCurrentSection('reports')}
              className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition flex items-center space-x-1 ${
                currentSection === 'reports'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="h-3 w-3 text-indigo-500 inline" />
              <span>AI Reports</span>
            </button>
          </nav>

          {/* Live System Status Dashboard */}
          <div className="flex items-center space-x-3 text-right">
            <div className="hidden lg:flex items-center space-x-4 pr-3 border-r border-slate-200">
              <div className="flex items-center space-x-1.5">
                <Users className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[11px] text-slate-600 font-medium font-sans">
                  {onlineHumans} Human{onlineHumans !== 1 ? 's' : ''} Online
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-slate-600 font-mono">
                  {activeAgents + 3} Autonomous Nodes
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-[11px] bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              <Clock className="h-3.5 w-3.5 text-indigo-500 hidden sm:block" />
              <span className="text-slate-705 text-slate-705">{time}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
