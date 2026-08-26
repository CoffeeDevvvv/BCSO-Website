-- BCSO portal upgrade: official ranks + one-time deputy activation codes
create table if not exists public.rank_definitions (
  id bigint generated always as identity primary key,
  rank_name text unique not null,
  rank_order integer unique not null,
  command_tier text not null,
  can_issue_strike boolean not null default false,
  vehicle_permissions text,
  created_at timestamptz not null default now()
);

insert into public.rank_definitions(rank_name,rank_order,command_tier,can_issue_strike,vehicle_permissions) values
('Sheriff',1,'Department Head',true,'Department Head'),
('Undersheriff',2,'Department Head',true,'Department Head'),
('Assistant Sheriff',3,'Department Head',true,'Training Bureau & Field Services'),
('Chief Deputy',4,'Department Head',true,'Technology & Support / Recruitment'),
('Colonel',5,'High Command',true,'Unmarked & Slicktop'),
('Major',6,'High Command',true,'Unmarked & Slicktop'),
('Captain',7,'High Command',true,'Unmarked & Slicktop'),
('Lieutenant',8,'Mid Command',true,'Unmarked & Slicktop'),
('Master Sergeant',9,'Mid Command',true,'Unmarked & Slicktop'),
('Sergeant',10,'Mid Command',true,'Unmarked & Slicktop'),
('Master Corporal',11,'Low Command',false,'Unmarked & Slicktop'),
('Corporal',12,'Low Command',false,'Ghosted or Supervisor Livery Only'),
('Master Deputy',13,'Field Personnel',false,'Slicktop and Pushbar'),
('Senior Deputy',14,'Field Personnel',false,'Ghost Livery with Lightbar and Pushbar'),
('Deputy 2',15,'Field Personnel',false,'Standard Patrol'),
('Deputy 1',16,'Field Personnel',false,'Standard Patrol'),
('Cadet',17,'Field Personnel',false,'Cadet Authorized Vehicles')
on conflict (rank_name) do update set rank_order=excluded.rank_order,command_tier=excluded.command_tier,can_issue_strike=excluded.can_issue_strike,vehicle_permissions=excluded.vehicle_permissions;

create table if not exists public.account_activation_codes (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  callsign text not null,
  full_name text not null,
  rank text not null,
  district text,
  subdivision text,
  code_hash text not null,
  expires_at timestamptz not null default (now() + interval '72 hours'),
  used_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.rank_definitions enable row level security;
alter table public.account_activation_codes enable row level security;

drop policy if exists rank_definitions_read on public.rank_definitions;
create policy rank_definitions_read on public.rank_definitions for select to authenticated using (true);

drop policy if exists activation_admin_all on public.account_activation_codes;
create policy activation_admin_all on public.account_activation_codes for all to authenticated using (public.is_admin()) with check (public.is_admin());

create index if not exists activation_codes_username_idx on public.account_activation_codes(username);
create index if not exists activation_codes_expiry_idx on public.account_activation_codes(expires_at);
