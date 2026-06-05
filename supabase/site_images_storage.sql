insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-images',
  'site-images',
  true,
  3145728,
  array['image/webp', 'image/png', 'image/jpeg', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read site images" on storage.objects;
drop policy if exists "Anon upload site images" on storage.objects;
drop policy if exists "Anon update site images" on storage.objects;

create policy "Public read site images"
on storage.objects
for select
to public
using (bucket_id = 'site-images');

create policy "Anon upload site images"
on storage.objects
for insert
to anon
with check (bucket_id = 'site-images');

create policy "Anon update site images"
on storage.objects
for update
to anon
using (bucket_id = 'site-images')
with check (bucket_id = 'site-images');
