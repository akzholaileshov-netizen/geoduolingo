-- GeoDuolingo schema. Run in the Supabase SQL editor.
-- The app uses the anon key with the signed-in user. RLS keeps each learner's progress private.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null,
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_active_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  module_id text not null,
  completed boolean not null default false,
  xp_earned integer not null default 0 check (xp_earned >= 0),
  mistakes integer not null default 0 check (mistakes >= 0),
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

create index if not exists profiles_xp_idx on public.profiles (xp desc);
create index if not exists lesson_progress_user_idx on public.lesson_progress (user_id);

create or replace view public.leaderboard
with (security_invoker = true) as
select id, display_name, xp, streak
from public.profiles;

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "profiles are readable" on public.profiles;
create policy "profiles are readable"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "users read own progress" on public.lesson_progress;
create policy "users read own progress"
  on public.lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "users insert own progress" on public.lesson_progress;
create policy "users insert own progress"
  on public.lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users update own progress" on public.lesson_progress;
create policy "users update own progress"
  on public.lesson_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.leaderboard to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.lesson_progress to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(coalesce(new.email, 'oquwshy'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
