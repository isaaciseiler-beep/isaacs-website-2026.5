-- Strike Tracker shared counts
-- Run this in the Supabase SQL editor for the project used by
-- VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.

create table if not exists public.strike_tracker_counts (
  name text primary key check (name in ('Ricky', 'Perry', 'John', 'Yasser', 'Isaac')),
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now()
);

insert into public.strike_tracker_counts (name, count)
values
  ('Ricky', 0),
  ('Perry', 0),
  ('John', 0),
  ('Yasser', 0),
  ('Isaac', 0)
on conflict (name) do nothing;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'strike_tracker_counts'
    )
  then
    alter publication supabase_realtime add table public.strike_tracker_counts;
  end if;
end
$$;

alter table public.strike_tracker_counts enable row level security;

drop policy if exists "Anyone can read strike counts" on public.strike_tracker_counts;
create policy "Anyone can read strike counts"
  on public.strike_tracker_counts for select
  using (true);

drop policy if exists "Anyone can update strike counts" on public.strike_tracker_counts;

create or replace function public.increment_strike_count(strike_name text)
returns table(name text, count integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if strike_name not in ('Ricky', 'Perry', 'John', 'Yasser', 'Isaac') then
    raise exception 'Unknown Strike Tracker name: %', strike_name;
  end if;

  insert into public.strike_tracker_counts as counts (name, count, updated_at)
  values (strike_name, 1, now())
  on conflict (name)
  do update set
    count = counts.count + 1,
    updated_at = now();

  return query
    select c.name, c.count, c.updated_at
    from public.strike_tracker_counts c
    order by c.name;
end;
$$;

create or replace function public.reset_strike_counts()
returns table(name text, count integer, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.strike_tracker_counts
  set count = 0,
      updated_at = now();

  return query
    select c.name, c.count, c.updated_at
    from public.strike_tracker_counts c
    order by c.name;
end;
$$;

grant execute on function public.increment_strike_count(text) to anon, authenticated;
grant execute on function public.reset_strike_counts() to anon, authenticated;
