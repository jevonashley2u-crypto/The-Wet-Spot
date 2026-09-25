-- A–E (approved by Jevon 2026-09-25): roles, profile fields, profile security,
-- public profile view, closing the open profiles policy. Plus the profile-media bucket.
-- Applied directly to the live project; kept here as a record.

alter table public.users
  add column if not exists role text not null default 'fan'
  check (role in ('owner','partner','creator','fan'));
alter table public.users
  add column if not exists bio text,
  add column if not exists banner_url text,
  add column if not exists social_links jsonb not null default '{}'::jsonb;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'owner' from public.users where id = auth.uid()), false)
$$;
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('owner','partner') from public.users where id = auth.uid()), false)
$$;

-- guard_user_protected_fields(): see 00003 for the current version.

drop policy if exists users_select_own_or_staff on public.users;
create policy users_select_own_or_staff on public.users
  for select to authenticated using (id = auth.uid() or public.is_staff());
drop policy if exists users_update_own_or_staff on public.users;
create policy users_update_own_or_staff on public.users
  for update to authenticated
  using (id = auth.uid() or public.is_staff())
  with check (id = auth.uid() or public.is_staff());

drop policy if exists admin_all on public.profiles;
create policy profiles_own_or_staff on public.profiles
  for all to authenticated
  using (id = auth.uid() or public.is_staff())
  with check (id = auth.uid() or public.is_staff());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-media', 'profile-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;
create policy "profile media upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "profile media update own" on storage.objects for update to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "profile media delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = auth.uid()::text);
