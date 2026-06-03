import React, { useState } from 'react';
import { Lead, Comment, RemoteTeamMember, AgentLog } from '../types';
import { fetchLivePageSpeedAudit } from '../lib/auditClient';
import type { PageSpeedAuditResult } from '../lib/auditTypes';
import { Search, Filter, ShieldCheck, PlayCircle, Eye, Code, Send, User, Bot, AlertCircle, PlusCircle, Check, ArrowUpRight, HelpCircle, Laptop, Smartphone, Activity, Gauge, RefreshCw, Layers, ChevronRight, CheckCircle2, Sparkles, Terminal } from 'lucide-react';

interface LeadManagerProps {
  leads: Lead[];
  team: RemoteTeamMember[];
  onUpdateLead: (updatedLead: Lead) => void;
  onAddLog: (log: AgentLog) => void;
  onUpdateMetrics: (heyGenCost: number, tokenDelta: number, leadsConverted: number) => void;
}

export default function LeadManager({ leads, team, onUpdateLead, onAddLog, onUpdateMetrics }: LeadManagerProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'audit' | 'preview' | 'video' | 'comments'>('comments');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isViewingCode, setIsViewingCode] = useState<boolean>(false);

  // New Audit States for interactive Multi-Page Audit Reports
  const [selectedPage, setSelectedPage] = useState<'home' | 'booking' | 'services' | 'contact'>('home');
  const [scanRunningPage, setScanRunningPage] = useState<string | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scannedPages, setScannedPages] = useState<{[key: string]: boolean}>({});
  const [liveAuditsByLead, setLiveAuditsByLead] = useState<Record<string, PageSpeedAuditResult>>({});
  const [auditMode, setAuditMode] = useState<'live' | 'simulated'>('simulated');
  
  // States of clicking individual Friction / Fix rows for detailed popups or slide-open panel audits
  const [selectedFrictionIdx, setSelectedFrictionIdx] = useState<number | null>(null);
  const [selectedFixIdx, setSelectedFixIdx] = useState<number | null>(null);

  // New Comment Form states
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [commentAsAuthor, setCommentAsAuthor] = useState<string>('Alex Rivera'); // Admin human

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const getPagesAuditData = (lead: Lead) => {
    if (!lead) return null;
    const isDental = lead.niche.toLowerCase().includes('dentist') || lead.niche.toLowerCase().includes('dental');
    const isSalon = lead.niche.toLowerCase().includes('salon') || lead.niche.toLowerCase().includes('hair');
    const isPlumbing = lead.niche.toLowerCase().includes('plumb') || lead.niche.toLowerCase().includes('rooter');
    
    return {
      home: {
        title: "Main Landing Portal (Home Page)",
        score: lead.originalPageSpeed,
        newScore: lead.newPageSpeed || 89,
        fcp: isPlumbing ? "4.8s" : isDental ? "3.2s" : isSalon ? "2.6s" : "3.0s",
        optimizedFcp: "0.8s",
        cls: isSalon ? "0.38" : "0.15",
        optimizedCls: "0.01",
        seo: "65 / 100",
        optimizedSeo: "98 / 100",
        issues: [
          `Main hero background image is uncompressed (4.5MB), creating severe initial load contention on mobile viewports.`,
          `Flickering layout shifts of CSS elements occurred under sub-300ms intervals, worsening Core Web Vitals.`,
          `Lack of descriptive alt-attributes on main call-to-action indicators causing screen-reader accessibility faults.`
        ],
        fixes: [
          "Convert hero image into ultra-compressed 150KB WebP with browser lazy load thresholds.",
          "Coordinate element height constants to stabilize container sizing.",
          "Inject safe programmatic screen-reader aria-labels and descriptive text structures."
        ],
        code: `// React Optimization Suite (Home / Hero element)
import { motion } from 'motion/react';

export function OptimizedHero() {
  return (
    <div className="relative min-h-[480px] bg-slate-900 overflow-hidden rounded-2xl">
      <img 
        src="/assets/hero_progressive.webp" 
        alt="${lead.businessName} Performance Optimized Backdrop"
        className="absolute inset-0 w-full h-full object-cover opacity-75"
        loading="eager"
        decoding="async"
      />
      <div className="relative z-10 p-8 max-w-xl">
        <span className="text-emerald-400 text-xs font-mono font-bold tracking-widest bg-emerald-500/10 px-2 py-1 rounded">
          99%+ PageSpeed Score Achieved
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-4">
          Trusted Service in ${lead.city}
        </h2>
      </div>
    </div>
  );
}`
      },
      booking: {
        title: "Reservations & Booking Scheduler (Booking Page)",
        score: Math.min(lead.originalPageSpeed + 8, 58),
        newScore: lead.newPageSpeed ? Math.min(lead.newPageSpeed + 4, 98) : 94,
        fcp: isPlumbing ? "5.4s" : isDental ? "4.1s" : isSalon ? "3.5s" : "3.8s",
        optimizedFcp: "0.6s",
        cls: "0.08",
        optimizedCls: "0.00",
        seo: "58 / 100",
        optimizedSeo: "95 / 100",
        issues: [
          `Booking plugin loads massive third-party block scripts synchronously, halting page execution for 2.2 seconds.`,
          `Interactive scheduling buttons are under-sized (${isSalon ? "24px" : "30px"}), violating compliance touch boundaries of 44px.`,
          `Time-slot selectors lack keyboard focus indicators preventing accessibility validation.`
        ],
        fixes: [
          "Deferred external widget assets behind modern code-splitting suspense bounds.",
          "Inflated touch interactive boundaries to conform to a minimum safety standard of 46px.",
          "Wrote a focus management hook to ensure safe tab navigation."
        ],
        code: `// Keyboard Accessible Slot Selector Block
export function TimeSelector({ slots, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Available Time Slots">
      {slots.map((time) => (
        <button
          key={time}
          role="radio"
          aria-checked="false"
          tabIndex={0}
          className="min-h-[46px] bg-slate-50 border border-slate-200 text-slate-850 rounded-lg text-xs hover:border-indigo-500 hover:ring-2 hover:ring-indigo-50 transition font-medium"
          onClick={() => onSelect(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
}`
      },
      services: {
        title: "Custom Services & Pricing List (Services Page)",
        score: Math.min(lead.originalPageSpeed + 12, 60),
        newScore: lead.newPageSpeed ? Math.min(lead.newPageSpeed + 2, 95) : 91,
        fcp: "3.2s",
        optimizedFcp: "0.7s",
        cls: "0.14",
        optimizedCls: "0.01",
        seo: "72 / 100",
        optimizedSeo: "96 / 100",
        issues: [
          `Pricing catalog references un-cached vector nodes, triggering layout reflows on every window scroll.`,
          `Catalog text colors represent poor 3.1:1 color contrast ratios, violating modern WCAG AA criteria.`,
          isPlumbing ? "Relying on raw physical PDF download links instead of searchable rate tables." : "Catalog image thumbnails load simultaneously, causing severe page delay."
        ],
        fixes: [
          "Refactored catalog grid to utilize cached React state memory parameters, suppressing reflow triggers.",
          "Shifted contrast indices from mid gray to deep graphite slate-800 to fulfill contrast requirements.",
          isPlumbing ? "Rebuilt menu guides as clean responsive HTML templates, improving dynamic indexing." : "Implemented lazy progressive view-port threshold detection on thumbnail containers."
        ],
        code: `// Semantic, Accessible Rates Catalog Layout
export function ServicesGrid({ catalog }) {
  return (
    <div className="space-y-4">
      {catalog.map(service => (
        <article key={service.id} className="p-4 bg-white border border-slate-200 rounded-xl flex justify-between shadow-xs">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{service.name}</h4>
            <p className="text-slate-505 text-xs mt-1 leading-normal">{service.description}</p>
          </div>
          <span className="font-mono text-emerald-600 font-extrabold text-sm">\${service.price}</span>
        </article>
      ))}
    </div>
  );
}`
      },
      contact: {
        title: "Maps Locator & Phone Protocols (Contact Page)",
        score: Math.min(lead.originalPageSpeed - 4, 28),
        newScore: 92,
        fcp: "4.9s",
        optimizedFcp: "0.9s",
        cls: "0.24",
        optimizedCls: "0.02",
        seo: "60 / 100",
        optimizedSeo: "94 / 100",
        issues: [
          `Embed iframe maps component initializes synchronously, blocking the main thread execution line.`,
          `Agency contact listings lack active hyperlink href anchors (tel: and mailto: protocols) on mobile.`
        ],
        fixes: [
          "Deferred map widget loading behind on-hover or on-scroll intersection triggers.",
          "Wrapped listing telephone strings within active click browser hyperlink structures."
        ],
        code: `// Deferred Map View Component & Contact Hooks
export function ResponsiveContact() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {/* Safe tel: click protocol for mobile speed triggers */}
        <a href="tel:+13125550190" className="bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-700 flex items-center gap-1.5 hover:bg-indigo-100 transition">
          Call Business Directly
        </a>
      </div>
      <iframe 
        src="about:blank"
        data-src="https://maps.google.com/maps?q=..."
        className="w-full h-44 rounded-xl"
        loading="lazy"
        title="Interactive maps locator"
      />
    </div>
  );
}`
      }
    };
  };

  const runSimulatedPageScan = (pageKey: 'home' | 'booking' | 'services' | 'contact') => {
    if (scanRunningPage) return;
    setScanRunningPage(pageKey);
    setScanLogs([]);
    setAuditMode('simulated');
    
    const logsPool = [
      `[AI DIAGNOSER] Spawning headless browser diagnostics container for ${selectedLead.businessName}...`,
      `[STATS-ENGINE] Probing connection speed... First Contentful Paint: severe delay observed.`,
      `[SEO-SPIDER] Reading metadata... No crawlable local schema, missing title alt attributes.`,
      `[CONTRAST-SCAN] Testing color parameters... Low contrast ratio nodes identified on ${pageKey} view.`,
      `[BUILDER-AG] Generating optimized React replacement layout with responsive viewport guidelines.`,
      `[QA-VERIFY] Checking compiled bundle: expected PageSpeed index upgraded to 90+. Zero warnings.`,
      `[SUCCESS] COMPREHENSIVE CERTIFICATE ISSUED: ${pageKey.toUpperCase()} page audit verified!`
    ];

    let currentLogIdx = 0;
    setScanLogs([logsPool[0]]);
    
    const interval = setInterval(() => {
      currentLogIdx++;
      if (currentLogIdx < logsPool.length) {
        setScanLogs(prev => [...prev, logsPool[currentLogIdx]]);
      } else {
        clearInterval(interval);
        setScanRunningPage(null);
        setScannedPages(prev => ({ ...prev, [pageKey]: true }));
        onAddLog({
          id: "log_audit_" + Date.now(),
          agentName: "Diagnoser Agent",
          action: `Automated ${pageKey.toUpperCase()} page comprehensive audit simulated & verified.`,
          status: "success",
          timestamp: new Date().toLocaleTimeString(),
          details: `Compiled detailed page audits. PageSpeed verified, accessibility contrast checked. Certificate emitted.`
        });
      }
    }, 450);
  };

  const runPageAudit = async (pageKey: 'home' | 'booking' | 'services' | 'contact') => {
    if (scanRunningPage || !selectedLead) return;

    if (pageKey !== 'home') {
      runSimulatedPageScan(pageKey);
      return;
    }

    setScanRunningPage(pageKey);
    setScanLogs([
      `[SCOUT] Launching local Lighthouse audit for ${selectedLead.website}...`,
      `[LIGHTHOUSE] Strategy: mobile · queue active (no Google API key)...`,
    ]);

    const result = await fetchLivePageSpeedAudit(selectedLead.website, 'mobile');

    if (result.success && result.audit?.source === 'live') {
      const audit = result.audit;
      setLiveAuditsByLead(prev => ({ ...prev, [selectedLead.id]: audit }));
      setAuditMode('live');

      const opportunityTitles = audit.opportunities.slice(0, 3).map(o => o.title);
      const updatedLead: Lead = {
        ...selectedLead,
        originalPageSpeed: audit.performanceScore,
        accessibilityScore: audit.accessibilityScore,
        auditIssues: opportunityTitles.length > 0
          ? opportunityTitles
          : selectedLead.auditIssues,
        status: selectedLead.status === 'scouted' ? 'diagnosed' : selectedLead.status,
      };
      onUpdateLead(updatedLead);

      setScanLogs(prev => [
        ...prev,
        `[LIGHTHOUSE] Performance: ${audit.performanceScore} · Accessibility: ${audit.accessibilityScore} · SEO: ${audit.seoScore}`,
        `[CORE-VITALS] FCP ${audit.fcp} · LCP ${audit.lcp} · CLS ${audit.cls} · TBT ${audit.tbt}`,
        `[SUCCESS] Live Lighthouse audit complete for ${selectedLead.website}`,
      ]);
      setScannedPages(prev => ({ ...prev, [pageKey]: true }));
      onAddLog({
        id: "log_audit_live_" + Date.now(),
        agentName: "Scout Agent",
        action: `Live Lighthouse audit completed for ${selectedLead.businessName}.`,
        status: "success",
        timestamp: new Date().toLocaleTimeString(),
        details: `Performance ${audit.performanceScore} · FCP ${audit.fcp} · CLS ${audit.cls} · Source: Lighthouse CLI`,
      });
    } else {
      setScanLogs(prev => [
        ...prev,
        `[WARN] Live audit unavailable: ${result.error ?? 'Unknown error'}`,
        `[FALLBACK] Running simulated multi-page diagnosis scan...`,
      ]);
      setScanRunningPage(null);
      runSimulatedPageScan(pageKey);
      return;
    }

    setScanRunningPage(null);
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.niche.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scouted': return 'bg-slate-100 border-slate-200 text-slate-600 shadow-xs border';
      case 'diagnosed': return 'bg-teal-50 border-teal-200/60 text-teal-700 border';
      case 'building': return 'bg-amber-50 border-amber-200/60 text-amber-700 border';
      case 'qa_check': return 'bg-cyan-50 border-cyan-200/60 text-cyan-700 border';
      case 'filming': return 'bg-purple-50 border-purple-200/60 text-purple-700 border';
      case 'complete': return 'bg-emerald-50 border-emerald-200/60 text-emerald-700 border';
      default: return 'bg-slate-50 border-slate-200 text-slate-500 border';
    }
  };

  const getConversionBadgeClass = (conv: string) => {
    switch (conv) {
      case 'converted': return 'bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-bold';
      case 'replied_interested': return 'bg-indigo-50 border border-indigo-200/80 text-indigo-700';
      case 'unresponsive': return 'bg-slate-100 border border-slate-210 text-slate-500';
      default: return 'bg-slate-50 border border-slate-150 text-slate-600';
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const authorTeamMember = team.find(t => t.name === commentAsAuthor) || { type: 'human', role: 'Operator' };
    const systemTimestamp = new Date().toISOString();

    const newComment: Comment = {
      id: "comment_" + Date.now(),
      authorName: commentAsAuthor,
      authorType: authorTeamMember.type,
      authorRole: authorTeamMember.role,
      text: newCommentText.trim(),
      timestamp: systemTimestamp
    };

    const updatedLead = {
      ...selectedLead,
      comments: [...selectedLead.comments, newComment]
    };

    onUpdateLead(updatedLead);
    onAddLog({
      id: "log_" + Date.now(),
      agentName: authorTeamMember.type === 'agent' ? commentAsAuthor : "Operator Node",
      action: `Collaborated comment written for '${selectedLead.businessName}'`,
      status: "info",
      timestamp: new Date().toLocaleTimeString()
    });

    setNewCommentText('');
  };

  // Human-In-The-Loop Mockup Approved Action
  const handleApproveMockup = () => {
    if (!selectedLead) return;

    onAddLog({
      id: "log_" + Date.now(),
      agentName: "Operator Node",
      action: `[HITL CHECKPOINT] Approved React redesign for '${selectedLead.businessName}'`,
      status: "success",
      timestamp: new Date().toLocaleTimeString(),
      details: "Design quality, code parameters, and mobile responsive grids approved. Initiating Filmer walking render."
    });

    const updatedLead = {
      ...selectedLead,
      status: 'filming' as const,
      heyGenStatus: 'rendering' as const,
    };
    onUpdateLead(updatedLead);
    onUpdateMetrics(0, 40000, 0); // Triggers token consumption

    // Simulated Delayed Render Completion
    setTimeout(() => {
      onAddLog({
        id: "log_" + (Date.now() + 1),
        agentName: "Filmer Agent",
        action: `Render complete: Walkthrough video successfully compiled for '${selectedLead.businessName}'`,
        status: "success",
        timestamp: new Date().toLocaleTimeString(),
        details: "HeyGen Avatar walk initialized. Bound presenter presentation stream (Length: 30s). Cost: $2.00 API credits logged."
      });

      // Refetch and update
      const latestLeadState = {
        ...updatedLead,
        heyGenStatus: 'ready' as const,
        heyGenCost: 2.00,
        heyGenVideoUrl: `https://heygen.cdn.com/videos/${selectedLead.id}_walk.mp4`,
        status: 'qa_check' as const
      };
      onUpdateLead(latestLeadState);
      onUpdateMetrics(2.00, 0, 0); // Adds $2.00 budget overhead
    }, 4500);
  };

  // Dispatch Outreach Sequence Action
  const handleDispatchOutreach = () => {
    if (!selectedLead) return;

    onAddLog({
      id: "log_" + Date.now(),
      agentName: "Pitcher Agent",
      action: `Initiated outbound trigger pipeline for '${selectedLead.businessName}'`,
      status: "info",
      timestamp: new Date().toLocaleTimeString(),
      details: `Channel prioritized: Meta Graph API (Instagram DM). Speed auditing scores injected to prompt.`
    });

    // Simulated conversion chance after dispatch
    setTimeout(() => {
      const getsConverted = Math.random() > 0.4;
      const finalConversion = getsConverted ? ('converted' as const) : ('replied_interested' as const);

      onAddLog({
        id: "log_" + (Date.now() + 2),
        agentName: "Pitcher Agent",
        action: getsConverted 
          ? `SUCCESS: Lead '${selectedLead.businessName}' converted via Inbound feedback!` 
          : `Lead '${selectedLead.businessName}' replied to DM expressing interest. Scheduled discovery demo.`,
        status: "success",
        timestamp: new Date().toLocaleTimeString(),
        details: getsConverted 
          ? "Client approved landing proposal of $400.00 base. Triggering pipeline success metrics."
          : "Client clicked custom review link. Requested call back sequence."
      });

      const finishedLeadState = {
        ...selectedLead,
        status: 'complete' as const,
        conversionStatus: finalConversion
      };
      onUpdateLead(finishedLeadState);

      if (getsConverted) {
        onUpdateMetrics(0, 0, 1); // Increments global converted clients count!
      }
    }, 4000);
  };

  // Custom boilerplate code generation string to show visual developer craft
  const getMockupCode = (name: string, niche: string) => {
    return `import React, { useState } from 'react';
import { Sparkles, Phone, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

// Optimized Landing Page for ${name} (${city})
// Upstyled from baseline PageSpeed: ${selectedLead.originalPageSpeed} to optimized: ${selectedLead.newPageSpeed || 90}
// Generated via autonomous Builder Agent (Vite/Tailwind boilerplate bundle)

export default function RedesignedLanding() {
  const [submitting, setSubmitting] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col justify-between">
      {/* Dynamic Header */}
      <nav className="border-b border-slate-850 px-6 py-4 flex justify-between items-center bg-slate-950/80">
        <span className="font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="text-emerald-400 h-4 w-4" />
          ${name} Redesigned
        </span>
        <a href="tel:+13125550190" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition">
          <Phone className="h-3 w-3" />
          Immediate Booking
        </a>
      </nav>

      {/* Hero Section with compressed WebP assets */}
      <section className="flex-1 max-w-5xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center">
        <motion.div animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-2xl">
          <span className="text-xs bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-mono font-semibold uppercase">
            Performance Optimized • High Accessibility
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4 leading-tight">
            Comprehensive Digital Health & Patient Booking Platform
          </h2>
          <p className="text-slate-400 mt-4 text-sm leading-relaxed">
            Fast, accessible patient booking dashboard. Built cleanly with modular Tailwind CSS grids and pre-optimized assets to eliminate mobile bounce delays.
          </p>
        </motion.div>

        {/* Dynamic Booking Grid Component */}
        <div className="w-full max-w-md mt-10 bg-slate-950 border border-slate-800 rounded-xl p-5 text-left">
          <h3 className="text-sm font-semibold text-slate-200">Request Priority Reservation</h3>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <input type="text" placeholder="Your Name" className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" />
            <input type="tel" placeholder="Mobile Number" className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white" />
          </div>
          <button className="w-full bg-emerald-500 text-slate-950 font-bold text-xs py-2 rounded mt-3 hover:bg-emerald-400 transition">
            Instantly Schedule Audit Slot
          </button>
        </div>
      </section>
    </div>
  );
}`;
  };

  const city = selectedLead.city;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 leading-relaxed">
      {/* Left Sidebar: Leads List */}
      <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl flex flex-col max-h-[85vh] shadow-xs">
        {/* Search & Statistics Filter */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50 rounded-t-xl select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 font-sans tracking-wide">Prospect Pipeline</span>
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-150">
              {filteredLeads.length} Lead{filteredLeads.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city, niche, business..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-3 w-3 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-600 focus:outline-none focus:border-indigo-500 font-sans"
            >
              <option value="all">All Stages</option>
              <option value="scouted">Scouted (Scout)</option>
              <option value="diagnosed">Diagnosed (Diagnoser)</option>
              <option value="building">Building Redesign (Builder)</option>
              <option value="filming">Walkthrough rendering (Filmer)</option>
              <option value="qa_check">QA Verification (Checker)</option>
              <option value="complete">Outreach Completed (Pitcher)</option>
            </select>
          </div>
        </div>

        {/* Lead List Box */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No prospects match filters.
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <button
                key={lead.id}
                id={`lead-sidebar-item-${lead.id}`}
                onClick={() => {
                  setSelectedLeadId(lead.id);
                  setIsViewingCode(false);
                }}
                className={`w-full text-left p-4 hover:bg-slate-50 cursor-pointer block transition relative border-l-2 ${
                  selectedLeadId === lead.id ? 'bg-indigo-50/50 border-indigo-650' : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="truncate pr-2">
                    <h4 className="text-xs font-semibold text-slate-905 truncate font-sans">
                      {lead.businessName}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono italic block mt-0.5">
                      {lead.niche} • {lead.city}
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${getStatusBadgeClass(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  {/* PageSpeed audit compare */}
                  <div className="flex items-center space-x-2">
                    <span className="text-rose-600 font-mono font-bold" id={`lead-speed-badge-${lead.id}`}>
                      PSI: {lead.originalPageSpeed}
                    </span>
                    {lead.newPageSpeed ? (
                      <>
                        <span className="text-slate-400">→</span>
                        <span className="text-emerald-600 font-mono font-bold">
                          {lead.newPageSpeed}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 text-[10px] italic pr-1">unoptimized</span>
                    )}
                  </div>

                  {/* Conversation state info */}
                  {lead.conversionStatus !== 'pipeline' && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${getConversionBadgeClass(lead.conversionStatus)}`}>
                      {lead.conversionStatus === 'converted' ? 'CONVERTED' : 'INTERESTED'}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Content Area: Lead Inspector */}
      <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
        {!selectedLead ? (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <Search className="h-10 w-10 text-slate-300 animate-pulse mb-3" />
            <p className="text-xs">Select a dental or local lead in the pipeline to initiate operations.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Lead Brief Description header */}
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest block font-bold">Active Client Lead Card</span>
                <h2 className="text-lg font-bold font-sans tracking-tight text-slate-900 mt-0.5 flex items-center gap-2">
                  <span>{selectedLead.businessName}</span>
                  {selectedLead.conversionStatus === 'converted' && (
                    <span className="text-xs font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">
                      Converted ($400/mo Recurrent)
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Website: <a href={selectedLead.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{selectedLead.website}</a> | Region Contact: <span className="text-slate-600 font-mono">{selectedLead.contactEmail}</span>
                </p>
              </div>

              {/* ACTION: Manual Human In The Loop approval checkpoint */}
              <div className="flex items-center gap-2" id="hitl-approvals">
                {selectedLead.status === 'qa_check' && (
                  <button
                    onClick={handleDispatchOutreach}
                    className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm select-none"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Outreach DM (Instagram Direct)</span>
                  </button>
                )}

                {selectedLead.heyGenStatus === 'none' && selectedLead.status === 'building' && (
                  <button
                    onClick={handleApproveMockup}
                    className="cursor-pointer bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm select-none"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-350" />
                    <span>Approve Code Mockup & Spawn Walkthrough</span>
                  </button>
                )}

                {selectedLead.heyGenStatus === 'rendering' && (
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-mono text-indigo-600">
                    <span className="h-2 w-2 rounded-full bg-indigo-550 animate-ping" />
                    <span>HeyGen Rendering Avatar Walk...</span>
                  </div>
                )}

                {selectedLead.heyGenStatus === 'ready' && selectedLead.status !== 'complete' && selectedLead.status !== 'qa_check' && (
                  <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-150 text-emerald-700 px-3 py-2 rounded-lg text-xs">
                    <Check className="h-4 w-4" />
                    <span>Walkthrough Presentation Ready!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sub Tabs Container */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => { setActiveInspectorTab('comments'); setIsViewingCode(false); }}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition -mb-px flex items-center space-x-1.5 ${
                  activeInspectorTab === 'comments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>Human-Agent Slack Chat</span>
              </button>
              <button
                onClick={() => { setActiveInspectorTab('audit'); setIsViewingCode(false); }}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition -mb-px flex items-center space-x-1.5 ${
                  activeInspectorTab === 'audit' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Website Diagnosis Audit</span>
              </button>
              <button
                onClick={() => { setActiveInspectorTab('preview'); setIsViewingCode(false); }}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition -mb-px flex items-center space-x-1.5 ${
                  activeInspectorTab === 'preview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Responsive Frontend Builder</span>
              </button>
              <button
                onClick={() => { setActiveInspectorTab('video'); setIsViewingCode(false); }}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition -mb-px flex items-center space-x-1.5 ${
                  activeInspectorTab === 'video' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <PlayCircle className="h-3.5 w-3.5" />
                <span>Walkthrough Generator</span>
              </button>
            </div>

            {/* TAB CONTENT: Interactive Collaboration Slack Stream */}
            {activeInspectorTab === 'comments' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-slate-800 mb-2 font-mono uppercase">Hybrid Workgroup Conversation Feed:</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    AI and human team members collaborate directly on visual improvements, SEO optimization, and outreach timing. Operators can also comment on behalf of agent scripts to drive specific actions.
                  </p>
                </div>

                {/* List Comments */}
                <div className="space-y-3 max-h-[36vh] overflow-y-auto pr-1 scrollbar-thin">
                  {selectedLead.comments.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 italic text-[11px]">
                      No chat logs recorded yet. Type below to write operator directives or agent overrides.
                    </div>
                  ) : (
                    selectedLead.comments.map((comment) => (
                      <div
                        key={comment.id}
                        id={`comment-card-${comment.id}`}
                        className={`p-3 rounded-lg border text-xs leading-relaxed ${
                          comment.authorType === 'agent'
                            ? 'bg-indigo-50/40 border-slate-200 pl-4 border-l-2 border-l-indigo-600'
                            : 'bg-slate-50/50 border-slate-200 pl-4 border-l-2 border-l-cyan-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            {comment.authorType === 'agent' ? (
                              <Bot className="h-3.5 w-3.5 text-indigo-600" />
                            ) : (
                              <User className="h-3.5 w-3.5 text-cyan-600" />
                            )}
                            <span className="font-bold text-slate-800">{comment.authorName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({comment.authorRole})</span>
                          </div>
                          <span className="text-[10px] text-slate-405 font-mono">
                            {new Date(comment.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-700 font-sans">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Form to submit chat notes */}
                <form onSubmit={handlePostComment} className="border-t border-slate-100 pt-4 mt-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Choose Author dropdown */}
                    <div className="sm:w-1/4">
                      <label className="text-[10px] font-mono text-slate-500 block mb-1">COMMENT AS:</label>
                      <select
                        value={commentAsAuthor}
                        onChange={(e) => setCommentAsAuthor(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-750 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Alex Rivera">Alex Jenkins (Operator)</option>
                        <option value="Sarah Jenkins">Sarah Jenkins (Designer)</option>
                        <option value="Builder Agent">Builder Node (Agent)</option>
                        <option value="Checker Agent">Checker QA Node (Agent)</option>
                        <option value="Pitcher Agent">Pitcher Outreach Node (Agent)</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="text-[10px] font-mono text-slate-505 block mb-1">COLLABORATION MESSAGE:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Write comments to coordinate redesign triggers...`}
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50"
                        />
                        <button
                          type="submit"
                          className="cursor-pointer bg-indigo-50 hover:bg-indigo-120 text-indigo-650 font-mono font-bold text-xs px-4 py-1.5 rounded border border-indigo-150 flex items-center space-x-1"
                        >
                          <Send className="h-3 w-3" />
                          <span>Dispatch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* TAB CONTENT: Website Diagnosis Audit */}
            {activeInspectorTab === 'audit' && (() => {
              const pagesAudit = getPagesAuditData(selectedLead);
              if (!pagesAudit) return null;

              const liveAudit = liveAuditsByLead[selectedLead.id];
              const basePageData = pagesAudit[selectedPage];
              const activePageData = selectedPage === 'home' && liveAudit?.source === 'live'
                ? {
                    ...basePageData,
                    score: liveAudit.performanceScore,
                    fcp: liveAudit.fcp,
                    cls: liveAudit.cls,
                    issues: liveAudit.opportunities.length > 0
                      ? liveAudit.opportunities.map(o => `${o.title}${o.displayValue ? ` (${o.displayValue})` : ''}`)
                      : basePageData.issues,
                  }
                : basePageData;
              
              return (
                <div className="space-y-6">
                  {/* Top Header Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded border border-indigo-200/60 font-bold uppercase tracking-wider">
                          Autonomous Auditor Suite
                        </span>
                        {auditMode === 'live' && liveAudit?.source === 'live' ? (
                          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase">
                            Live Lighthouse
                          </span>
                        ) : null}
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 font-sans tracking-tight mt-1.5">
                        Multi-Page Consultative Redesign Diagnostic for {selectedLead.businessName}
                      </h3>
                      <p className="text-[11px] text-slate-600 leading-normal mt-0.5">
                        Our scraper parsed the live indicators of <strong className="text-slate-700 font-mono text-[10px] bg-slate-100 px-1 rounded">{selectedLead.website}</strong>. Click page buttons below to review detailed page audit reports.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-500">Global Scorecard:</span>
                      <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-150">
                        Baseline PSI: {selectedLead.originalPageSpeed}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-150">
                        Redesigned PSI: {selectedLead.newPageSpeed || 91}
                      </span>
                    </div>
                  </div>

                  {/* EACH BUTTON Selector Block - MULTI PAGE REPORT CONTROLS */}
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block mb-2.5">
                      1. SELECT PAGE DETAILED COMPREHENSIVE AUDIT REPORT:
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {(['home', 'booking', 'services', 'contact'] as const).map((pageKey) => {
                        const pageInfo = pagesAudit[pageKey];
                        const isSelected = selectedPage === pageKey;
                        const isScanned = scannedPages[pageKey];
                        
                        return (
                          <button
                            key={pageKey}
                            type="button"
                            onClick={() => {
                              setSelectedPage(pageKey);
                              setSelectedFrictionIdx(null);
                              setSelectedFixIdx(null);
                            }}
                            className={`cursor-pointer text-left p-3.5 rounded-xl border transition-all duration-200 select-none flex flex-col justify-between h-[115px] group active:scale-[0.98] ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md ring-2 ring-indigo-100'
                                : 'bg-white border-slate-200 text-slate-705 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <span className={`text-[10px] font-mono tracking-widest uppercase font-bold select-none ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                                {pageKey} View
                              </span>
                              {isScanned ? (
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${
                                  isSelected ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                }`}>
                                  <Check className="h-2.5 w-2.5" /> Checked
                                </span>
                              ) : (
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                  isSelected ? 'bg-indigo-700/50 border-indigo-500 text-indigo-200' : 'bg-slate-100 border-slate-200 text-slate-405'
                                }`}>
                                  Ready
                                </span>
                              )}
                            </div>

                            <div className="mt-2 block">
                              <span className={`text-xs font-bold leading-tight block line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                {pageInfo.title.replace(/\(.+\)/, '').trim()}
                              </span>
                              <div className="flex items-center gap-2 mt-1 font-mono text-[10px]">
                                <span className={isSelected ? 'text-rose-200' : 'text-rose-600'}>
                                  PSI: {pageInfo.score}
                                </span>
                                <span className={isSelected ? 'text-indigo-200' : 'text-slate-400'}>&rarr;</span>
                                <span className={`font-bold ${isSelected ? 'text-emerald-200' : 'text-emerald-600'}`}>
                                  PSI: {pageInfo.newScore}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Primary Page Audit Canvas split with live scan simulator */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Left Column: Metrics and Specific issue deep dives */}
                    <div className="md:col-span-8 space-y-5">
                      {/* Active Page Specs Overview Card */}
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                        <div className="flex sm:flex-row flex-col gap-3 justify-between items-start sm:items-center border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-[10px] font-mono tracking-widest text-indigo-600 block uppercase font-bold">
                              CURRENT COMPREHENSIVE PAGE STATUS:
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                              <Layers className="h-4 w-4 text-indigo-500" />
                              <span>{activePageData.title}</span>
                            </h4>
                          </div>

                          <button
                            onClick={() => runPageAudit(selectedPage)}
                            disabled={scanRunningPage !== null}
                            className={`cursor-pointer text-[11px] font-mono font-bold px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-xs ${
                              scanRunningPage === selectedPage
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 animate-pulse cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-750 hover:from-indigo-100 hover:to-indigo-200 border border-indigo-200 active:scale-95'
                            }`}
                          >
                            <RefreshCw className={`h-3 w-3 ${scanRunningPage === selectedPage ? 'animate-spin' : ''}`} />
                            <span>
                              {scanRunningPage === selectedPage
                                ? "Scanning..."
                                : selectedPage === 'home'
                                  ? "Run Live Lighthouse Audit"
                                  : "Run Simulated Page Diagnosis Scan"}
                            </span>
                          </button>
                        </div>

                        {/* Page Performance Indicators Comparatives */}
                        <div className="grid grid-cols-3 gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200 border-dashed">
                          <div className="text-center bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">Page Speed Loading</span>
                            <div className="flex items-center justify-center gap-1 mt-1 font-mono">
                              <span className="text-xs text-rose-600 line-through font-bold">{activePageData.score} PSI</span>
                              <span className="text-xs text-slate-400">&rarr;</span>
                              <span className="text-sm font-extrabold text-emerald-600 font-mono">{activePageData.newScore} PSI</span>
                            </div>
                          </div>

                          <div className="text-center bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">First Content Paint (FCP)</span>
                            <div className="flex items-center justify-center gap-1 mt-1 font-mono">
                              <span className="text-xs text-rose-600 line-through">{activePageData.fcp}</span>
                              <span className="text-xs text-slate-400">&rarr;</span>
                              <span className="text-sm font-extrabold text-emerald-600 font-mono">{activePageData.optimizedFcp}</span>
                            </div>
                          </div>

                          <div className="text-center bg-white p-2.5 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">Visual Shift (CLS)</span>
                            <div className="flex items-center justify-center gap-1 mt-1 font-mono">
                              <span className="text-xs text-rose-600 line-through">{activePageData.cls}</span>
                              <span className="text-xs text-slate-400">&rarr;</span>
                              <span className="text-sm font-extrabold text-emerald-600 font-mono">{activePageData.optimizedCls}</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive List Blocks for Page-Specific Friction / Fixes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {/* Friction Items */}
                          <div className="space-y-2.5">
                            <h5 className="text-[10px] font-mono font-bold text-rose-700 uppercase flex items-center gap-1.5 px-0.5">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                              <span>Friction Points Detected (Click Each for Report)</span>
                            </h5>
                            <div className="space-y-2">
                              {activePageData.issues.map((issue, idx) => {
                                const isSelected = selectedFrictionIdx === idx;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setSelectedFrictionIdx(isSelected ? null : idx);
                                      setSelectedFixIdx(null);
                                    }}
                                    className={`cursor-pointer w-full text-left p-3 rounded-lg border text-xs leading-normal transition-all duration-200 select-none block hover:scale-[1.01] ${
                                      isSelected
                                        ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-50'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-1.5Privacy">
                                      <div className="flex-1">
                                        <span className="text-[9px] font-mono font-extrabold text-rose-600 block uppercase">
                                          FRICTION NODE #{idx + 1}
                                        </span>
                                        <p className="text-slate-755 font-medium text-xs mt-1 leading-snug">{issue}</p>
                                      </div>
                                      <ChevronRight className={`h-3.5 w-3.5 mt-0.5 text-slate-450 flex-shrink-0 transition-transform ${isSelected ? 'transform rotate-90 text-rose-600 font-bold' : ''}`} />
                                    </div>
                                    
                                    {isSelected && (
                                      <div className="mt-3 pt-3 border-t border-rose-200/50 space-y-2 font-sans text-slate-650 leading-normal text-[11px]">
                                        <div className="bg-white p-2.5 rounded border border-rose-100">
                                          <strong className="text-[10px] font-semibold text-rose-700 block uppercase mb-1">Impact Level: Critical Red High-Alert</strong>
                                          This blocking element halts initial HTML loading on mobile browsers, forcing mobile patient search bounce rates to escalate by an estimated 15%-25%.
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-1.5 rounded flex justify-between">
                                          <span>Target DOM: selector-point-grid &lambda;-node</span>
                                          <span className="text-rose-600 font-bold">Severity Value: 9.4/10</span>
                                        </div>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Fix Checklist */}
                          <div className="space-y-2.5">
                            <h5 className="text-[10px] font-mono font-bold text-emerald-700 uppercase flex items-center gap-1.5 px-0.5">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Programmed Technical Remedies (Click Each Row)</span>
                            </h5>
                            <div className="space-y-2">
                              {activePageData.fixes.map((fix, idx) => {
                                const isSelected = selectedFixIdx === idx;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setSelectedFixIdx(isSelected ? null : idx);
                                      setSelectedFrictionIdx(null);
                                    }}
                                    className={`cursor-pointer w-full text-left p-3 rounded-lg border text-xs leading-normal transition-all duration-200 select-none block hover:scale-[1.01] ${
                                      isSelected
                                        ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-50'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-1.5">
                                      <div className="flex-1">
                                        <span className="text-[9px] font-mono font-extrabold text-emerald-700 block uppercase">
                                          OPTIMIZED SOLVER CODE #{idx + 1}
                                        </span>
                                        <p className="text-slate-800 font-medium text-xs mt-1 leading-snug flex items-start gap-1.5">
                                          <Check className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                          <span>{fix}</span>
                                        </p>
                                      </div>
                                      <ChevronRight className={`h-3.5 w-3.5 mt-0.5 text-slate-450 flex-shrink-0 transition-transform ${isSelected ? 'transform rotate-90 text-emerald-700 font-bold' : ''}`} />
                                    </div>

                                    {isSelected && (
                                      <div className="mt-3 pt-3 border-t border-emerald-200/50 space-y-2 font-sans text-slate-650 leading-normal text-[11px]">
                                        <div className="bg-white p-2.5 rounded border border-emerald-100">
                                          <strong className="text-[10px] font-semibold text-emerald-800 block uppercase mb-1">Coded Correction Impact:</strong>
                                          This programmatic fix replaces standard inline render blocking variables with modern asynchronous callbacks, driving FCP down into the safe green zone.
                                        </div>
                                        <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50/50 p-1.5 rounded flex justify-between font-bold">
                                          <span>Status: Code generated & compiled</span>
                                          <span>Remediation Uplift: +45% loadspeed</span>
                                        </div>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Code Diff and Live Terminal Simulator logs */}
                    <div className="md:col-span-4 space-y-5 flex flex-col justify-between">
                      {/* Live Diagnostic Terminal Simulation Card */}
                      <div className="bg-slate-900 border border-slate-950 rounded-xl p-4 flex flex-col justify-between text-indigo-100 min-h-[200px] shadow-lg">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Live Diagnostics Shell</span>
                          </span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="flex-1 font-mono text-[10px] overflow-y-auto space-y-1.5 px-0.5 text-indigo-300 max-h-[140px] scrollbar-thin">
                          {scanLogs.length === 0 ? (
                            <div className="text-slate-500 italic text-[11px] h-full flex items-center justify-center text-center p-3 select-none">
                              Click "Run Simulated Page Diagnosis Scan" button above to fire deep diagnostic thread testing.
                            </div>
                          ) : (
                            scanLogs.map((log, lidx) => (
                              <div key={lidx} className="leading-snug select-text">
                                <span className="text-[9px] text-slate-505 select-none mr-1.5">[{lidx+1}]</span>
                                <span className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[AI') ? 'text-indigo-200 font-semibold' : 'text-slate-300'}>
                                  {log}
                                </span>
                              </div>
                            ))
                          )}
                        </div>

                        {scanRunningPage === selectedPage && (
                          <div className="flex items-center space-x-1.5 text-[9px] font-mono text-indigo-400 pt-2 border-t border-white/5 animate-pulse mt-1.5 select-none">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
                            <span>Evaluating browser telemetry index stream...</span>
                          </div>
                        )}
                      </div>

                      {/* Code Block for Selected Page's programmed fix */}
                      <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex-1 flex flex-col min-h-[220px]">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                            <Code className="h-3.5 w-3.5 text-slate-400" />
                            <span>Remedial React Snippet</span>
                          </span>
                          <span className="text-[9px] font-mono tracking-widest text-indigo-300 bg-[#312e81]/30 border border-indigo-500/10 px-1.5 py-0.5 rounded font-bold">
                            Vite React Node
                          </span>
                        </div>

                        <div className="flex-1 font-mono text-[9px] text-indigo-100 overflow-y-auto p-2 bg-slate-900/60 rounded border border-slate-950 max-h-[160px] scrollbar-thin">
                          <pre className="whitespace-pre-wrap select-all">{activePageData.code}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TAB CONTENT: Responsive Frontend Mockup Builder */}
            {activeInspectorTab === 'preview' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-205 flex items-center justify-between text-xs sm:flex-row flex-col gap-2">
                  <div>
                    <span className="font-semibold text-slate-800">Stage: Builder Compilation Redesign Preview</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">Mocking CSS visual components compiled strictly via React with zero accessibility flags.</p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setDeviceViewport('desktop')}
                      className={`p-1.5 rounded transition ${deviceViewport === 'desktop' ? 'bg-indigo-50 text-indigo-605 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <Laptop className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeviceViewport('mobile')}
                      className={`p-1.5 rounded transition ${deviceViewport === 'mobile' ? 'bg-indigo-50 text-indigo-605 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsViewingCode(!isViewingCode)}
                      className={`text-[11px] font-mono px-2.5 py-1.5 rounded transition font-bold ${
                        isViewingCode ? 'bg-slate-100 text-slate-800 border border-slate-205' : 'bg-slate-50 text-indigo-600 border border-transparent hover:bg-indigo-50/50'
                      }`}
                    >
                      <Code className="h-3.5 w-3.5 inline mr-1" />
                      {isViewingCode ? "Show Mockup" : "Show TSX Code"}
                    </button>
                  </div>
                </div>

                {isViewingCode ? (
                  /* Monospace TypeScript compiler file viewer */
                  <div className="bg-slate-900 font-mono text-[10px] p-4 rounded-xl border border-slate-950 max-h-[46h] overflow-y-auto leading-relaxed text-indigo-100 select-all scrollbar-thin">
                    <pre className="whitespace-pre-wrap">{getMockupCode(selectedLead.businessName, selectedLead.niche)}</pre>
                  </div>
                ) : (
                  /* Visual dynamic layout design */
                  <div className="flex justify-center bg-slate-50 p-4 border border-slate-200 rounded-xl relative overflow-hidden min-h-[36vh]">
                    <div
                      className={`bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 w-full flex flex-col justify-between shadow-xs ${
                        deviceViewport === 'mobile' ? 'max-w-sm h-[400px]' : 'max-w-full h-[400px]'
                      }`}
                    >
                      {/* Inner Web Mockup Frame Header */}
                      <div className="bg-slate-50 px-3 py-1.5 flex items-center justify-between border-b border-slate-150 text-[10px] font-mono text-slate-500">
                        <div className="flex space-x-1.5">
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-slate-505 font-sans">
                          {selectedLead.businessName.toLowerCase().replace(/\s+/g, '')}.agentpreview.com
                        </span>
                        <HelpCircle className="h-3.5 w-3.5" />
                      </div>

                      {/* Web content */}
                      <div className="p-5 flex-1 bg-gradient-to-b from-slate-50 to-white overflow-y-auto text-left gap-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-150 text-[9px] w-max font-mono font-bold">
                            <span>OPTIMIZED HERO PAGE</span>
                          </div>

                          <h3 className="text-sm font-extrabold text-slate-900 mt-2 leading-tight">
                            Dental Hygiene Refocused for patients.
                          </h3>
                          <p className="text-slate-500 text-[11px] mt-1.5 leading-normal">
                            Ultra-rapid loading scheduling hub prioritizing accessibility and screen reading protocols perfectly.
                          </p>

                          <div className="mt-4 p-3 bg-slate-50 border border-slate-150 rounded text-[11px] space-y-1.5 font-sans">
                            <span className="font-bold text-slate-700">Dental Booking Direct:</span>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="bg-white border border-slate-100 px-2 py-1 rounded text-[10px] text-slate-550">Oral Hygiene Check</div>
                              <div className="bg-white border border-slate-100 px-2 py-1 rounded text-[10px] text-slate-550">Root Consultation</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-[10px] text-slate-500 font-mono">
                            PSI Expected Performance: 94%+ FCP: 0.8s
                          </span>
                          <button className="bg-indigo-600 text-white font-bold text-[10px] px-3 py-1 rounded hover:bg-indigo-500">
                            Reserve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Walkthrough video player */}
            {activeInspectorTab === 'video' && (
              <div className="space-y-4">
                {selectedLead.heyGenStatus === 'none' ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 border-dashed rounded-xl flex flex-col items-center justify-center space-y-3">
                    <Bot className="h-10 w-10 text-slate-400 animate-bounce" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">Walkthrough Video Presenter Not Spawned</h4>
                      <p className="text-slate-600 text-[11px] mt-1 max-w-md leading-normal">
                        To maintain operational budget rules and prevent HeyGen pricing overhead, video presentation renders are locked behind an explicit manual Human-In-The-Loop gate. Use the top checkpoint action to approve and compile.
                      </p>
                    </div>
                  </div>
                ) : selectedLead.heyGenStatus === 'rendering' ? (
                  <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-75" />
                      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-150" />
                      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-800">Synchronizing HeyGen digital twin avatar...</h4>
                      <p className="text-slate-500 text-[10px] mt-2 font-mono">API: Connecting to heygen.com Server slot 03. Rendering walkthrough audio and visuals.</p>
                    </div>
                  </div>
                ) : (
                  /* Rendering finished simulation video player */
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-4">
                    <div className="flex">
                      <span className="text-[10px] font-mono tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 uppercase font-bold">
                        Walkthrough render complete ($2.00 fee)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Movie player layout */}
                      <div className="md:col-span-12 lg:col-span-7 bg-slate-900 rounded-lg overflow-hidden flex flex-col justify-between p-4 min-h-[25vh]">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                          <span className="text-[11px] font-mono text-slate-400">HeyGen Avatar IV Presenter Walk</span>
                          <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 font-mono text-slate-400 rounded">1080p rendered</span>
                        </div>

                        <div className="flex items-center justify-center flex-col py-6">
                          <div className="bg-indigo-650/20 p-4 rounded-full border border-indigo-400/20 text-indigo-400 mb-2">
                            <Bot className="h-8 w-8 animate-pulse" />
                          </div>
                          <span className="text-white text-xs font-semibold">Avatar presenter Walker (Alex Twin)</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-1">Playing walkthrough sequence</span>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                          <span>Streaming walk links directly bound securely.</span>
                        </div>
                      </div>

                      {/* Presenter script transcription */}
                      <div className="md:col-span-12 lg:col-span-5 space-y-2">
                        <span className="text-[10px] font-mono text-slate-550 uppercase block font-bold">Speech Presentation Script:</span>
                        <div className="bg-white border border-slate-200 rounded p-3 text-[11px] text-slate-700 leading-normal font-sans italic max-h-[22vh] overflow-y-auto">
                          "Hello there, I'm Alex Jenkins, and I want to briefly guide you through how our performance engineering redesign for {selectedLead.businessName} increases booking speed audits!
                          We noticed {selectedLead.businessName}'s mobile speed scores sit at {selectedLead.originalPageSpeed}, costing patients bounce issues. 
                          Our React-compiled redesign secures speeds up to {selectedLead.newPageSpeed || 91} FCP within 0.8 seconds. 
                          I've sent your review link directly; let us know if you want our hybrid specialist to launch this today..."
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
