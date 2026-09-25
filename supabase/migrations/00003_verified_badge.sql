-- F–I: Paid verified badge (monthly, like Meta Verified). Approved by Jevon 2026-09-25.

alter table public.users
  add column if not exists verified_until timestamptz,
  add column if not exists verified_since timestamptz,
  add column if not exists stripe_verification_subscription_id text;

create or replace function public.has_verified_badge(u public.users)
returns boolean language sql stable as $$
  select u.role in ('owner','partner') or (u.verified_until is not null and u.verified_until > now())
$$;

create or replace function public.is_creator()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('creator','owner','partner') from public.users where id = auth.uid()), false)
$$;

-- Protected fields. Owner can change any role; partner can move people between fan and creator only.
create or replace function public.guard_user_protected_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    return new;
  end if;
  if new.role is distinct from old.role and not (
       public.is_owner()
    or (public.is_staff() and old.role in ('fan','creator') and new.role in ('fan','creator'))
  ) then
    raise exception 'Not allowed to change this role';
  end if;
  if not public.is_staff() and (
       new.subscription_tier is distinct from old.subscription_tier
    or new.subscription_expires_at is distinct from old.subscription_expires_at
    or new.is_grandfathered is distinct from old.is_grandfathered
    or new.total_spend is distinct from old.total_spend
    or new.daily_streak is distinct from old.daily_streak
    or new.watch_streak is distinct from old.watch_streak
    or new.engagement_streak is distinct from old.engagement_streak
    or new.invited_by is distinct from old.invited_by
    or new.verified_until is distinct from old.verified_until
    or new.verified_since is distinct from old.verified_since
    or new.stripe_verification_subscription_id is distinct from old.stripe_verification_subscription_id
  ) then
    raise exception 'Protected field';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop view if exists public.public_profiles;
create view public.public_profiles as
  select u.id, u.handle, u.name, u.avatar_url, u.banner_url, u.bio, u.social_links, u.role, u.created_at,
         public.has_verified_badge(u) as is_verified
  from public.users u;
grant select on public.public_profiles to anon, authenticated;
