-- Phase 2: Lead CRM persistence for Multi-Agent Web Agency
-- Run in Supabase SQL Editor or via: supabase db push

create table if not exists public.leads (
  id text primary key,
  business_name text not null,
  city text not null,
  niche text not null,
  website text not null default '',
  contact_email text not null default '',
  status text not null default 'scouted',
  original_page_speed integer not null default 0,
  new_page_speed integer,
  accessibility_score integer not null default 0,
  audit_issues jsonb not null default '[]'::jsonb,
  audit_fixes jsonb not null default '[]'::jsonb,
  redesign_page_url text,
  heygen_video_url text,
  heygen_status text not null default 'none',
  heygen_cost numeric not null default 0,
  outreach_channel text not null default 'email',
  conversion_status text not null default 'pipeline',
  comments jsonb not null default '[]'::jsonb,
  history jsonb not null default '[]'::jsonb,
  assigned_to text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_updated_at_idx on public.leads (updated_at desc);

alter table public.leads enable row level security;

-- Server uses service_role key (bypasses RLS). Block anonymous direct access.
create policy "Deny anon access to leads"
  on public.leads
  for all
  to anon
  using (false)
  with check (false);

create or replace function public.set_leads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_leads_updated_at();
