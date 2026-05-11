-- Favorite Spots in New Taipei / Fulbright Map
-- Run this in the Supabase SQL editor, then create a public storage bucket
-- named `fulbrightmap-pin-images`.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.pins (
  id uuid primary key default gen_random_uuid(),
  lat double precision not null,
  lng double precision not null,
  author_name text not null check (char_length(author_name) between 1 and 120),
  place_name text not null check (char_length(place_name) between 1 and 160),
  caption text not null check (char_length(caption) between 1 and 200),
  image_url text not null,
  anonymous_user_id text not null,
  delete_token_hash text,
  created_at timestamptz not null default now()
);

create index if not exists pins_created_at_idx on public.pins (created_at desc);
create index if not exists pins_anonymous_user_id_idx on public.pins (anonymous_user_id);

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'pins'
    )
  then
    alter publication supabase_realtime add table public.pins;
  end if;
end
$$;

alter table public.pins drop constraint if exists pins_caption_check;
alter table public.pins
  add constraint pins_caption_check
  check (char_length(caption) between 1 and 200);

alter table public.pins add column if not exists delete_token_hash text;

alter table public.pins enable row level security;

drop policy if exists "Anyone can read pins" on public.pins;
create policy "Anyone can read pins"
  on public.pins for select
  using (true);

drop policy if exists "Anonymous visitors can create pins" on public.pins;
create policy "Anonymous visitors can create pins"
  on public.pins for insert
  with check (
    anonymous_user_id is not null
    and char_length(caption) <= 200
    and delete_token_hash is not null
  );

drop policy if exists "Anonymous visitors can delete pins" on public.pins;

create or replace function public.delete_pin(
  pin_id uuid,
  delete_token text,
  requester_anonymous_user_id text default ''
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  deleted_count integer;
begin
  delete from public.pins
  where id = pin_id
    and (
      delete_token_hash = encode(extensions.digest(delete_token, 'sha256'), 'hex')
      or anonymous_user_id = requester_anonymous_user_id
    );

  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

grant execute on function public.delete_pin(uuid, text, text) to anon, authenticated;

-- Storage setup:
-- 1. In Supabase Dashboard > Storage, create a bucket named
--    `fulbrightmap-pin-images`.
-- 2. Make it public, or use the SQL below if your project permits it.
-- 3. The app uploads compressed JPGs to:
--    fulbrightmap-pin-images/{anonymous_user_id}/{uuid}.jpg

insert into storage.buckets (id, name, public)
values ('fulbrightmap-pin-images', 'fulbrightmap-pin-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can read map images" on storage.objects;
create policy "Anyone can read map images"
  on storage.objects for select
  using (bucket_id = 'fulbrightmap-pin-images');

drop policy if exists "Anonymous visitors can upload map images" on storage.objects;
create policy "Anonymous visitors can upload map images"
  on storage.objects for insert
  with check (bucket_id = 'fulbrightmap-pin-images');
