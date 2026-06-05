create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamp with time zone not null default now()
);

alter table public.site_content enable row level security;

create policy "site_content_select_main"
on public.site_content
for select
to anon
using (id = 'main');

create policy "site_content_insert_main"
on public.site_content
for insert
to anon
with check (id = 'main');

create policy "site_content_update_main"
on public.site_content
for update
to anon
using (id = 'main')
with check (id = 'main');
