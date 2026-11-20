-- One-time admin invitation codes. Run once in the Supabase SQL editor of EACH project
-- (dev, test, production). Safe to re-run.
-- Only the server (service role) reads or writes this table. Codes are stored hashed.

create table if not exists public.admin_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code_hash text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz
);

create unique index if not exists admin_invites_one_open_per_email
  on public.admin_invites (email)
  where used_at is null and revoked_at is null;

alter table public.admin_invites enable row level security;
revoke all on public.admin_invites from anon, authenticated;