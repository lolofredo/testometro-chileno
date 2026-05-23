create extension if not exists pgcrypto;

create table if not exists leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  test_slug text not null,
  nickname text not null check (char_length(nickname) between 1 and 32),
  score integer not null check (score >= 0 and score <= 151),
  group_title text not null,
  completed_at timestamptz not null,
  created_at timestamptz default now()
);

alter table leaderboard_entries enable row level security;

drop policy if exists "Leaderboard entries are readable" on leaderboard_entries;
create policy "Leaderboard entries are readable"
  on leaderboard_entries for select
  using (true);

drop policy if exists "Anonymous users can publish leaderboard entries" on leaderboard_entries;
create policy "Anonymous users can publish leaderboard entries"
  on leaderboard_entries for insert
  with check (true);
