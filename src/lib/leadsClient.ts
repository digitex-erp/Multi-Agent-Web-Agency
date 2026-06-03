import type { Lead } from '../types.ts';

export interface LeadsListResponse {
  success: boolean;
  leads: Lead[];
  storage: 'supabase' | 'memory';
  error?: string;
}

export async function fetchLeads(): Promise<LeadsListResponse> {
  const response = await fetch('/api/leads');
  const data = (await response.json()) as LeadsListResponse;
  if (!response.ok || !data.success) {
    throw new Error(data.error ?? `Failed to load leads (${response.status})`);
  }
  return data;
}

export async function saveLead(lead: Lead): Promise<Lead> {
  const response = await fetch(`/api/leads/${encodeURIComponent(lead.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  const data = (await response.json()) as { success: boolean; lead?: Lead; error?: string };
  if (!response.ok || !data.success || !data.lead) {
    throw new Error(data.error ?? `Failed to save lead (${response.status})`);
  }
  return data.lead;
}

export async function createLead(lead: Lead): Promise<Lead> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  const data = (await response.json()) as { success: boolean; lead?: Lead; error?: string };
  if (!response.ok || !data.success || !data.lead) {
    throw new Error(data.error ?? `Failed to create lead (${response.status})`);
  }
  return data.lead;
}
