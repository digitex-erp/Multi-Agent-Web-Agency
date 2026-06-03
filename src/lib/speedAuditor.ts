import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import type { AuditOpportunity, AuditStrategy, PageSpeedApiStatus, PageSpeedAuditResult } from './auditTypes.ts';

/** Local Lighthouse runs are CPU-heavy — lower default than remote PSI API */
const MAX_CONCURRENT = Number(process.env.LIGHTHOUSE_MAX_CONCURRENT ?? 4);
const COOLDOWN_SECONDS = 60;
const LIGHTHOUSE_TIMEOUT_MS = Number(process.env.LIGHTHOUSE_TIMEOUT_MS ?? 120_000);

let activeWorkers = 0;
let cooldownUntil = 0;
const waitQueue: Array<() => void> = [];

function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function readAuditMetric(audits: Record<string, any> | undefined, id: string, fallback = 'n/a'): string {
  const audit = audits?.[id];
  if (!audit) return fallback;
  return audit.displayValue || fallback;
}

function readCategoryScore(categories: Record<string, any> | undefined, id: string): number {
  const score = categories?.[id]?.score;
  if (typeof score !== 'number') return 0;
  return Math.round(score * 100);
}

function extractOpportunities(lhr: { audits?: Record<string, any> }): AuditOpportunity[] {
  const audits = lhr.audits ?? {};
  return Object.entries(audits)
    .filter(([, audit]) => audit.details?.type === 'opportunity' && typeof audit.score === 'number' && audit.score < 0.9)
    .slice(0, 8)
    .map(([id, audit]) => ({
      id,
      title: audit.title ?? id,
      score: typeof audit.score === 'number' ? Math.round(audit.score * 100) : null,
      displayValue: audit.displayValue,
      description: audit.description,
    }));
}

function extractDiagnostics(lhr: { audits?: Record<string, any> }): AuditOpportunity[] {
  const audits = lhr.audits ?? {};
  return Object.entries(audits)
    .filter(([, audit]) => audit.score === 0 && audit.title)
    .slice(0, 6)
    .map(([id, audit]) => ({
      id,
      title: audit.title ?? id,
      score: 0,
      displayValue: audit.displayValue,
      description: audit.description,
    }));
}

function releaseWorker(): void {
  activeWorkers = Math.max(0, activeWorkers - 1);
  const next = waitQueue.shift();
  if (next) next();
}

async function acquireWorker(): Promise<void> {
  const now = Date.now();
  if (cooldownUntil > now) {
    await new Promise((resolve) => setTimeout(resolve, cooldownUntil - now));
  }

  if (activeWorkers < MAX_CONCURRENT) {
    activeWorkers += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    waitQueue.push(() => {
      activeWorkers += 1;
      resolve();
    });
  });
}

function triggerCooldown(): void {
  cooldownUntil = Date.now() + COOLDOWN_SECONDS * 1000;
}

function buildFallbackResult(url: string, strategy: AuditStrategy, error?: string): PageSpeedAuditResult {
  return {
    url,
    strategy,
    performanceScore: 0,
    accessibilityScore: 0,
    seoScore: 0,
    bestPracticesScore: 0,
    fcp: 'n/a',
    lcp: 'n/a',
    cls: 'n/a',
    tbt: 'n/a',
    speedIndex: 'n/a',
    opportunities: [],
    diagnostics: [],
    source: 'fallback',
    fetchedAt: new Date().toISOString(),
    error: error ?? 'Lighthouse audit failed. Ensure Chrome is installed on the server.',
  };
}

function lighthouseConfig(strategy: AuditStrategy) {
  const mobile = strategy === 'mobile';
  return {
    extends: 'lighthouse:default' as const,
    settings: {
      formFactor: strategy,
      screenEmulation: mobile
        ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 2.625, disabled: false }
        : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
      throttlingMethod: 'simulate' as const,
      maxWaitForLoad: LIGHTHOUSE_TIMEOUT_MS,
    },
  };
}

export function getPageSpeedApiStatus(): PageSpeedApiStatus {
  const now = Date.now();
  const cooldownRemaining = cooldownUntil > now ? Math.ceil((cooldownUntil - now) / 1000) : 0;
  let status: PageSpeedApiStatus['status'] = 'online';

  if (cooldownRemaining > 0) status = 'cooldown';
  else if (activeWorkers >= MAX_CONCURRENT) status = 'throttled';

  return {
    status,
    activeWorkers,
    maxWorkers: MAX_CONCURRENT,
    cooldownRemaining,
  };
}

/** Run a local Lighthouse audit (no Google API key required) */
export async function runPageSpeedAudit(
  rawUrl: string,
  strategy: AuditStrategy = 'mobile'
): Promise<PageSpeedAuditResult> {
  const url = normalizeUrl(rawUrl);
  await acquireWorker();

  let chrome: chromeLauncher.LaunchedChrome | undefined;

  try {
    const chromeFlags = ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'];
    chrome = await chromeLauncher.launch(
      process.env.CHROME_PATH
        ? { chromePath: process.env.CHROME_PATH, chromeFlags }
        : { chromeFlags }
    );

    const runnerResult = await lighthouse(
      url,
      {
        port: chrome.port,
        logLevel: 'error',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
      },
      lighthouseConfig(strategy)
    );

    if (!runnerResult?.lhr) {
      triggerCooldown();
      return buildFallbackResult(url, strategy, 'Lighthouse returned no result.');
    }

    const lhr = runnerResult.lhr;
    const audits = lhr.audits ?? {};
    const categories = lhr.categories ?? {};

    const screenshotDetails = audits['final-screenshot']?.details as { data?: string } | undefined;
    const screenshotThumbnail =
      typeof screenshotDetails?.data === 'string' ? screenshotDetails.data : undefined;

    return {
      url,
      strategy,
      performanceScore: readCategoryScore(categories, 'performance'),
      accessibilityScore: readCategoryScore(categories, 'accessibility'),
      seoScore: readCategoryScore(categories, 'seo'),
      bestPracticesScore: readCategoryScore(categories, 'best-practices'),
      fcp: readAuditMetric(audits, 'first-contentful-paint'),
      lcp: readAuditMetric(audits, 'largest-contentful-paint'),
      cls: readAuditMetric(audits, 'cumulative-layout-shift'),
      tbt: readAuditMetric(audits, 'total-blocking-time'),
      speedIndex: readAuditMetric(audits, 'speed-index'),
      screenshotThumbnail,
      opportunities: extractOpportunities(lhr),
      diagnostics: extractDiagnostics(lhr),
      source: 'live',
      fetchedAt: new Date().toISOString(),
    };
  } catch (error: unknown) {
    triggerCooldown();
    const message = error instanceof Error ? error.message : 'Unknown Lighthouse audit failure';
    return buildFallbackResult(url, strategy, message);
  } finally {
    if (chrome) {
      try {
        chrome.kill();
      } catch {
        // ignore chrome cleanup errors
      }
    }
    releaseWorker();
  }
}
