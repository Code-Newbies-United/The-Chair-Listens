-- Admins table for Supabase Auth. Run once in the Supabase SQL editor of EACH project
-- (dev, test, production). Safe to re-run. Also included in schema.sql.
-- Only the server (service role) ever reads or writes this table.

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
