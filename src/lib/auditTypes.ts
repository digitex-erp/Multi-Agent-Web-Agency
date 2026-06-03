export type AuditStrategy = 'mobile' | 'desktop';

export interface AuditOpportunity {
  id: string;
  title: string;
  score: number | null;
  displayValue?: string;
  description?: string;
}

export interface PageSpeedAuditResult {
  url: string;
  strategy: AuditStrategy;
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  bestPracticesScore: number;
  fcp: string;
  lcp: string;
  cls: string;
  tbt: string;
  speedIndex: string;
  screenshotThumbnail?: string;
  opportunities: AuditOpportunity[];
  diagnostics: AuditOpportunity[];
  source: 'live' | 'fallback';
  fetchedAt: string;
  error?: string;
}

export interface PageSpeedApiStatus {
  status: 'online' | 'throttled' | 'cooldown';
  activeWorkers: number;
  maxWorkers: number;
  cooldownRemaining: number;
}
