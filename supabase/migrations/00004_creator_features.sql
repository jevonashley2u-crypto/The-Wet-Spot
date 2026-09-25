-- J–M: creator requests, posts + media, follows/likes/comments, direct messages.
-- Approved by Jevon 2026-09-25.

-- ---------------------------------------------------------------------------
-- J. Creator requests
-- ---------------------------------------------------------------------------
create table if not exists public.creator_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  message text check (char_length(message) <= 1000),
  status text not null default 'pending' check (status in ('pending','approved','denied')),
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists creator_requests_one_pending
  on public.creator_requests(user_id) where status = 'pending';
alter table public.creator_requests enable row level security;

drop policy if exists creator_requests_select on public.creator_requests;
create policy creator_requests_select on public.creator_requests
  for select to authenticated using (user_id = auth.uid() or public.is_staff());

drop policy if exists creator_requests_insert on public.creator_requests;
create policy creator_requests_insert on public.creator_requests
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and not public.is_creator());

-- Owner/partner approve or deny through this function (it also sets the role).
create or replace function public.review_creator_request(request_id uuid, approve boolean)
returns void language plpgsql security definer set search_path = public as $$
declare req public.creator_requests;
begin
  if not public.is_staff() then
    raise exception 'Only the owner or partner can review creator requests';
  end if;
  select * into req from public.creator_requests where id = request_id for update;
  if req.id is null then raise exception 'Request not found'; end if;
  if req.status <> 'pending' then raise exception 'Request already reviewed'; end if;

  update public.creator_requests
     set status = case when approve then 'approved' else 'denied' end,
         reviewed_by = auth.uid(), reviewed_at = now()
   where id = request_id;

  if approve then
    update public.users set role = 'creator' where id = req.user_id and role = 'fan';
  end if;
end $$;
revoke all on function public.review_creator_request(uuid, boolean) from public, anon;
grant execute on function public.review_creator_request(uuid, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- K. Posts + private media bucket
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.users(id) on delete cascade,
  caption text check (char_length(caption) <= 2200),
  media_path text,
  media_type text not null default 'image'
    check (media_type in ('text','image','video','image360','video360')),
  visibility text not null default 'public' check (visibility in ('public','followers')),
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now(),
  check (media_type = 'text' or media_path is not null)
);
create index if not exists posts_creator_created on public.posts(creator_id, created_at desc);
create index if not exists posts_created on public.posts(created_at desc);
create index if not exists posts_media_path on public.posts(media_path);
alter table public.posts enable row level security;

-- L (needed by post visibility). Follows
create table if not exists public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  creator_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, creator_id),
  check (follower_id <> creator_id)
);
create index if not exists follows_creator on public.follows(creator_id);
alter table public.follows enable row level security;

create or replace function public.can_view_post(p_creator uuid, p_visibility text)
returns boolean language sql stable security definer set search_path = public as $$
  select p_visibility = 'public'
      or p_creator = auth.uid()
      or public.is_staff()
      or exists (select 1 from public.follows f where f.creator_id = p_creator and f.follower_id = auth.uid())
$$;

drop policy if exists posts_select on public.posts;
create policy posts_select on public.posts
  for select to authenticated using (public.can_view_post(creator_id, visibility));

drop policy if exists posts_insert on public.posts;
create policy posts_insert on public.posts
  for insert to authenticated
  with check (creator_id = auth.uid() and public.is_creator()
              and likes_count = 0 and comments_count = 0);

drop policy if exists posts_update on public.posts;
create policy posts_update on public.posts
  for update to authenticated
  using (creator_id = auth.uid() or public.is_staff())
  with check (creator_id = auth.uid() or public.is_staff());

drop policy if exists posts_delete on public.posts;
create policy posts_delete on public.posts
  for delete to authenticated using (creator_id = auth.uid() or public.is_staff());

-- Counters can only change through triggers.
create or replace function public.guard_post_counters()
returns trigger language plpgsql as $$
begin
  if current_setting('app.counter_update', true) is distinct from 'on' then
    new.likes_count := old.likes_count;
    new.comments_count := old.comments_count;
  end if;
  new.creator_id := old.creator_id;
  return new;
end $$;
drop trigger if exists guard_post_counters on public.posts;
create trigger guard_post_counters before update on public.posts
  for each row execute function public.guard_post_counters();

-- Media bucket: private; files are served with short-lived signed links.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-media', 'post-media', false, 52428800,
        array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do nothing;

drop policy if exists "post media upload own" on storage.objects;
create policy "post media upload own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'post-media'
              and (storage.foldername(name))[1] = auth.uid()::text
              and public.is_creator());

drop policy if exists "post media read visible" on storage.objects;
create policy "post media read visible" on storage.objects
  for select to authenticated
  using (bucket_id = 'post-media' and (
          (storage.foldername(name))[1] = auth.uid()::text
          or exists (select 1 from public.posts p where p.media_path = storage.objects.name)));

drop policy if exists "post media delete own" on storage.objects;
create policy "post media delete own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'post-media'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff()));

-- ---------------------------------------------------------------------------
-- L. Follows, likes, comments
-- ---------------------------------------------------------------------------
drop policy if exists follows_select on public.follows;
create policy follows_select on public.follows for select to authenticated using (true);
drop policy if exists follows_insert on public.follows;
create policy follows_insert on public.follows for insert to authenticated
  with check (follower_id = auth.uid());
drop policy if exists follows_delete on public.follows;
create policy follows_delete on public.follows for delete to authenticated
  using (follower_id = auth.uid());

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table public.post_likes enable row level security;
drop policy if exists post_likes_select on public.post_likes;
create policy post_likes_select on public.post_likes for select to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id));
drop policy if exists post_likes_insert on public.post_likes;
create policy post_likes_insert on public.post_likes for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.posts p where p.id = post_id));
drop policy if exists post_likes_delete on public.post_likes;
create policy post_likes_delete on public.post_likes for delete to authenticated
  using (user_id = auth.uid());

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists post_comments_post on public.post_comments(post_id, created_at);
alter table public.post_comments enable row level security;
drop policy if exists post_comments_select on public.post_comments;
create policy post_comments_select on public.post_comments for select to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id));
drop policy if exists post_comments_insert on public.post_comments;
create policy post_comments_insert on public.post_comments for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.posts p where p.id = post_id));
drop policy if exists post_comments_delete on public.post_comments;
create policy post_comments_delete on public.post_comments for delete to authenticated
  using (user_id = auth.uid() or public.is_staff()
         or exists (select 1 from public.posts p where p.id = post_id and p.creator_id = auth.uid()));

-- Keep counts on posts in sync.
create or replace function public.bump_post_counter()
returns trigger language plpgsql security definer set search_path = public as $$
declare col text := case when tg_table_name = 'post_likes' then 'likes_count' else 'comments_count' end;
declare pid uuid := coalesce(new.post_id, old.post_id);
declare delta int := case when tg_op = 'INSERT' then 1 else -1 end;
begin
  perform set_config('app.counter_update', 'on', true);
  execute format('update public.posts set %I = greatest(0, %I + $1) where id = $2', col, col)
    using delta, pid;
  perform set_config('app.counter_update', 'off', true);
  return null;
end $$;
drop trigger if exists post_likes_count on public.post_likes;
create trigger post_likes_count after insert or delete on public.post_likes
  for each row execute function public.bump_post_counter();
drop trigger if exists post_comments_count on public.post_comments;
create trigger post_comments_count after insert or delete on public.post_comments
  for each row execute function public.bump_post_counter();

-- ---------------------------------------------------------------------------
-- M. Direct messages
-- ---------------------------------------------------------------------------
create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  check (sender_id <> receiver_id)
);
create index if not exists dm_pair on public.direct_messages(sender_id, receiver_id, created_at desc);
create index if not exists dm_receiver on public.direct_messages(receiver_id, created_at desc);
alter table public.direct_messages enable row level security;

drop policy if exists dm_select on public.direct_messages;
create policy dm_select on public.direct_messages for select to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid());
drop policy if exists dm_insert on public.direct_messages;
create policy dm_insert on public.direct_messages for insert to authenticated
  with check (sender_id = auth.uid() and read_at is null);
drop policy if exists dm_update on public.direct_messages;
create policy dm_update on public.direct_messages for update to authenticated
  using (receiver_id = auth.uid()) with check (receiver_id = auth.uid());

-- Receivers may only mark messages read.
create or replace function public.guard_dm_update()
returns trigger language plpgsql as $$
begin
  if new.body is distinct from old.body or new.sender_id is distinct from old.sender_id
     or new.receiver_id is distinct from old.receiver_id or new.created_at is distinct from old.created_at then
    raise exception 'Messages cannot be edited';
  end if;
  return new;
end $$;
drop trigger if exists guard_dm_update on public.direct_messages;
create trigger guard_dm_update before update on public.direct_messages
  for each row execute function public.guard_dm_update();

-- Live delivery of new messages.
do $$ begin
  alter publication supabase_realtime add table public.direct_messages;
exception when duplicate_object then null; when undefined_object then null;
end $$;

-- Hardening (applied after the linter run)
alter function public.guard_post_counters() set search_path = public;
alter function public.guard_dm_update() set search_path = public;
alter function public.handle_new_user() set search_path = public;
alter function public.has_verified_badge(public.users) set search_path = public;
revoke execute on function public.bump_post_counter() from public, anon, authenticated;
revoke execute on function public.guard_user_protected_fields() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;
revoke execute on function public.guard_post_counters() from public, anon, authenticated;
revoke execute on function public.guard_dm_update() from public, anon, authenticated;
revoke execute on function public.is_owner() from public, anon;
revoke execute on function public.is_staff() from public, anon;
revoke execute on function public.is_creator() from public, anon;
revoke execute on function public.can_view_post(uuid, text) from public, anon;
grant execute on function public.is_owner(), public.is_staff(), public.is_creator(),
  public.can_view_post(uuid, text) to authenticated;
