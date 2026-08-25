-- BCSO Portal production database schema for Supabase/Postgres.
-- Run this in Supabase SQL Editor, then deploy the Edge Functions in supabase/functions.
create extension if not exists pgcrypto;

do $$ begin create type public.app_role as enum ('ranger','supervisor','admin'); exception when duplicate_object then null; end $$;
do $$ begin create type public.report_type as enum ('weapon_discharge','arrest','citation','pursuit'); exception when duplicate_object then null; end $$;
do $$ begin create type public.priority_level as enum ('normal','important','urgent'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null,
 callsign text unique not null,
 role public.app_role not null default 'ranger',
 rank text not null,
 subdivision text,
 phone text,
 email text,
 strikes integer not null default 0 check (strikes >= 0),
 active boolean not null default true,
 locked_until timestamptz,
 last_login_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.subdivisions (
 id uuid primary key default gen_random_uuid(),
 name text unique not null,
 code text unique not null,
 icon text,
 description text,
 leader_id uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now()
);
create table if not exists public.subdivision_members (
 subdivision_id uuid references public.subdivisions(id) on delete cascade,
 profile_id uuid references public.profiles(id) on delete cascade,
 assigned_at timestamptz not null default now(),
 primary key(subdivision_id, profile_id)
);

create table if not exists public.reports (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references public.profiles(id) on delete restrict,
 type public.report_type not null,
 title text not null,
 incident_date timestamptz,
 location text,
 involved text,
 narrative text not null,
 status text not null default 'submitted' check(status in ('draft','submitted','reviewed','closed')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.announcements (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references public.profiles(id) on delete restrict,
 title text not null,
 body text not null,
 priority public.priority_level not null default 'normal',
 created_at timestamptz not null default now()
);
create table if not exists public.sops (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 category text,
 version text not null default '1.0',
 content text not null,
 published boolean not null default true,
 updated_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.strikes (
 id uuid primary key default gen_random_uuid(),
 profile_id uuid not null references public.profiles(id) on delete cascade,
 issued_by uuid not null references public.profiles(id) on delete restrict,
 reason text not null,
 severity integer not null default 1 check(severity between 1 and 3),
 created_at timestamptz not null default now()
);
create table if not exists public.login_attempts (
 id bigint generated always as identity primary key,
 callsign text not null,
 success boolean not null,
 attempted_at timestamptz not null default now()
);

insert into public.subdivisions(name,code,icon,description) values
('Major Crimes Unit','MCU','🔍','Investigations'),('K9 Division','K9','🐕','Canine operations'),('Game Warden','GW','🦌','Game and wildlife enforcement'),('Aviation Bureau','AIR','🚁','Air support'),('Field Training Officer','FTO','📋','Training'),('Dispatch','DISPATCH','🎧','Communications'),('Special Operations Group','SOG','⚡','Tactical operations')
on conflict (name) do nothing;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin' and active=true); $$;
create or replace function public.is_supervisor() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from profiles where id=auth.uid() and role in ('supervisor','admin') and active=true); $$;

create or replace function public.dashboard_stats() returns json language sql stable security definer set search_path=public as $$
select json_build_object(
 'my_reports',(select count(*) from reports where author_id=auth.uid()),
 'my_strikes',(select strikes from profiles where id=auth.uid()),
 'total_reports',(select count(*) from reports),
 'active_staff',(select count(*) from profiles where active=true),
 'my_subdivision',(select coalesce(p.subdivision,'Unassigned') from profiles p where p.id=auth.uid())
); $$;

alter table public.profiles enable row level security;
alter table public.subdivisions enable row level security;
alter table public.subdivision_members enable row level security;
alter table public.reports enable row level security;
alter table public.announcements enable row level security;
alter table public.sops enable row level security;
alter table public.strikes enable row level security;
alter table public.login_attempts enable row level security;

drop policy if exists profiles_read on public.profiles; create policy profiles_read on public.profiles for select to authenticated using (true);
drop policy if exists profiles_admin_write on public.profiles; create policy profiles_admin_write on public.profiles for all to authenticated using (public.is_admin()) with check(public.is_admin());
drop policy if exists subdivisions_read on public.subdivisions; create policy subdivisions_read on public.subdivisions for select to authenticated using (true);
drop policy if exists subdivisions_admin on public.subdivisions; create policy subdivisions_admin on public.subdivisions for all to authenticated using (public.is_admin()) with check(public.is_admin());
drop policy if exists members_read on public.subdivision_members; create policy members_read on public.subdivision_members for select to authenticated using (true);
drop policy if exists members_admin on public.subdivision_members; create policy members_admin on public.subdivision_members for all to authenticated using (public.is_admin()) with check(public.is_admin());
drop policy if exists reports_read on public.reports; create policy reports_read on public.reports for select to authenticated using (author_id=auth.uid() or public.is_supervisor());
drop policy if exists reports_insert on public.reports; create policy reports_insert on public.reports for insert to authenticated with check(author_id=auth.uid());
drop policy if exists reports_update on public.reports; create policy reports_update on public.reports for update to authenticated using(author_id=auth.uid() or public.is_supervisor()) with check(author_id=auth.uid() or public.is_supervisor());
drop policy if exists reports_delete on public.reports; create policy reports_delete on public.reports for delete to authenticated using(public.is_admin());
drop policy if exists ann_read on public.announcements; create policy ann_read on public.announcements for select to authenticated using(true);
drop policy if exists ann_admin on public.announcements; create policy ann_admin on public.announcements for all to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists sops_read on public.sops; create policy sops_read on public.sops for select to authenticated using(published=true or public.is_admin());
drop policy if exists sops_admin on public.sops; create policy sops_admin on public.sops for all to authenticated using(public.is_admin()) with check(public.is_admin());
drop policy if exists strikes_read on public.strikes; create policy strikes_read on public.strikes for select to authenticated using(profile_id=auth.uid() or public.is_supervisor());
drop policy if exists strikes_admin on public.strikes; create policy strikes_admin on public.strikes for all to authenticated using(public.is_supervisor()) with check(public.is_supervisor());
drop policy if exists login_none on public.login_attempts; create policy login_none on public.login_attempts for all to authenticated using(false) with check(false);

create or replace function public.add_strike(target uuid, why text, sev integer default 1) returns void language plpgsql security definer set search_path=public as $$ begin if not public.is_supervisor() then raise exception 'forbidden'; end if; insert into strikes(profile_id,issued_by,reason,severity) values(target,auth.uid(),why,sev); update profiles set strikes=strikes+sev,updated_at=now() where id=target; end; $$;
