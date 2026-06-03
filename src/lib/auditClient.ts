import type { PageSpeedAuditResult, PageSpeedApiStatus } from './auditTypes.ts';

export interface AuditApiResponse {
  success: boolean;
  audit?: PageSpeedAuditResult;
  apiStatus?: PageSpeedApiStatus;
  error?: string;
}

export async function fetchLivePageSpeedAudit(
  url: string,
  strategy: 'mobile' | 'desktop' = 'mobile'
): Promise<AuditApiResponse> {
  const response = await fetch('/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, strategy }),
  });

  const payload = (await response.json()) as AuditApiResponse;
  if (!response.ok) {
    return {
      success: false,
      error: payload.error ?? `Audit request failed (${response.status})`,
      audit: payload.audit,
      apiStatus: payload.apiStatus,
    };
  }

  return payload;
}

export async function fetchPageSpeedApiStatus(): Promise<PageSpeedApiStatus | null> {
  try {
    const response = await fetch('/api/audit/status');
    if (!response.ok) return null;
    const payload = await response.json();
    return {
      status: payload.status,
      activeWorkers: payload.activeWorkers,
      maxWorkers: payload.maxWorkers,
      cooldownRemaining: payload.cooldownRemaining,
    };
  } catch {
    return null;
  }
}
