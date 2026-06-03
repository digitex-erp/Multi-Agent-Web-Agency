import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Lead } from '../types.ts';

let adminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return false;
  if (url.includes('YOUR_') || key.includes('YOUR_')) return false;
  return true;
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (adminClient) return adminClient;

  adminClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  return adminClient;
}

type LeadRow = {
  id: string;
  business_name: string;
  city: string;
  niche: string;
  website: string;
  contact_email: string;
  status: Lead['status'];
  original_page_speed: number;
  new_page_speed: number | null;
  accessibility_score: number;
  audit_issues: string[];
  audit_fixes: string[];
  redesign_page_url: string | null;
  heygen_video_url: string | null;
  heygen_status: Lead['heyGenStatus'];
  heygen_cost: number;
  outreach_channel: Lead['outreachChannel'];
  conversion_status: Lead['conversionStatus'];
  comments: Lead['comments'];
  history: Lead['history'];
  assigned_to: string;
};

export function leadToRow(lead: Lead): LeadRow {
  return {
    id: lead.id,
    business_name: lead.businessName,
    city: lead.city,
    niche: lead.niche,
    website: lead.website,
    contact_email: lead.contactEmail,
    status: lead.status,
    original_page_speed: lead.originalPageSpeed,
    new_page_speed: lead.newPageSpeed ?? null,
    accessibility_score: lead.accessibilityScore,
    audit_issues: lead.auditIssues,
    audit_fixes: lead.auditFixes,
    redesign_page_url: lead.redesignPageUrl ?? null,
    heygen_video_url: lead.heyGenVideoUrl ?? null,
    heygen_status: lead.heyGenStatus,
    heygen_cost: lead.heyGenCost,
    outreach_channel: lead.outreachChannel,
    conversion_status: lead.conversionStatus,
    comments: lead.comments,
    history: lead.history,
    assigned_to: lead.assignedTo,
  };
}

export function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    businessName: row.business_name,
    city: row.city,
    niche: row.niche,
    website: row.website,
    contactEmail: row.contact_email,
    status: row.status,
    originalPageSpeed: row.original_page_speed,
    newPageSpeed: row.new_page_speed ?? undefined,
    accessibilityScore: row.accessibility_score,
    auditIssues: row.audit_issues ?? [],
    auditFixes: row.audit_fixes ?? [],
    redesignPageUrl: row.redesign_page_url ?? undefined,
    heyGenVideoUrl: row.heygen_video_url ?? undefined,
    heyGenStatus: row.heygen_status,
    heyGenCost: Number(row.heygen_cost ?? 0),
    outreachChannel: row.outreach_channel,
    conversionStatus: row.conversion_status,
    comments: row.comments ?? [],
    history: row.history ?? [],
    assignedTo: row.assigned_to ?? '',
  };
}
