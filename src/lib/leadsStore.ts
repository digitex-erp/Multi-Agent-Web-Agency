import { INITIAL_LEADS } from '../initialData.ts';
import type { Lead } from '../types.ts';
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  leadToRow,
  rowToLead,
} from './supabaseAdmin.ts';

/** In-memory fallback when Supabase env vars are not set (local dev). */
let memoryLeads: Lead[] | null = null;

function getMemoryLeads(): Lead[] {
  if (!memoryLeads) {
    memoryLeads = structuredClone(INITIAL_LEADS);
  }
  return memoryLeads;
}

export function getLeadsStorageMode(): 'supabase' | 'memory' {
  return isSupabaseConfigured() ? 'supabase' : 'memory';
}

export async function listLeads(): Promise<{ leads: Lead[]; storage: 'supabase' | 'memory' }> {
  const storage = getLeadsStorageMode();

  if (storage === 'memory') {
    return { leads: getMemoryLeads(), storage };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { leads: getMemoryLeads(), storage: 'memory' };
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    const seedRows = INITIAL_LEADS.map(leadToRow);
    const { error: seedError } = await supabase.from('leads').upsert(seedRows);
    if (seedError) {
      throw new Error(seedError.message);
    }
    return { leads: structuredClone(INITIAL_LEADS), storage };
  }

  return { leads: data.map((row) => rowToLead(row as never)), storage };
}

export async function createLead(lead: Lead): Promise<Lead> {
  const storage = getLeadsStorageMode();

  if (storage === 'memory') {
    const leads = getMemoryLeads();
    leads.unshift(lead);
    return lead;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase client unavailable');

  const { data, error } = await supabase
    .from('leads')
    .insert(leadToRow(lead))
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return rowToLead(data as never);
}

export async function updateLead(lead: Lead): Promise<Lead> {
  const storage = getLeadsStorageMode();

  if (storage === 'memory') {
    const leads = getMemoryLeads();
    const idx = leads.findIndex((l) => l.id === lead.id);
    if (idx === -1) {
      leads.unshift(lead);
    } else {
      leads[idx] = lead;
    }
    return lead;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase client unavailable');

  const { data, error } = await supabase
    .from('leads')
    .upsert(leadToRow(lead))
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return rowToLead(data as never);
}
