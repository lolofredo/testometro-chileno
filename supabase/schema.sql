create extension if not exists pgcrypto;

create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  instructions text,
  disclaimer text,
  version text not null default '1.0',
  status text not null default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  display_order integer not null,
  original_number text,
  question_text text not null,
  question_type text not null default 'boolean',
  points_yes integer not null default 1,
  points_no integer not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(test_id, display_order)
);

create table if not exists result_ranges (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  group_number integer not null,
  min_score integer not null,
  max_score integer,
  title text not null,
  short_label text,
  description text,
  share_text text,
  created_at timestamptz default now()
);

create table if not exists test_sessions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid references tests(id) on delete cascade,
  user_id uuid null,
  nickname text,
  is_public boolean default false,
  status text not null default 'in_progress',
  current_block integer default 1,
  current_question_order integer default 1,
  score integer default 0,
  result_range_id uuid references result_ranges(id),
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references test_sessions(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  answer_value text not null,
  points_awarded integer not null default 0,
  answered_at timestamptz default now(),
  unique(session_id, question_id)
);

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

alter table tests enable row level security;
alter table questions enable row level security;
alter table result_ranges enable row level security;
alter table test_sessions enable row level security;
alter table answers enable row level security;
alter table leaderboard_entries enable row level security;

create policy "Published tests are readable"
  on tests for select
  using (status = 'published');

create policy "Questions are readable"
  on questions for select
  using (true);

create policy "Result ranges are readable"
  on result_ranges for select
  using (true);

create policy "Public completed sessions are readable"
  on test_sessions for select
  using (status = 'completed' and is_public = true);

create policy "Anonymous sessions can be inserted"
  on test_sessions for insert
  with check (true);

create policy "Anonymous sessions can be updated"
  on test_sessions for update
  using (true)
  with check (true);

create policy "Answers can be inserted"
  on answers for insert
  with check (true);

create policy "Answers can be updated"
  on answers for update
  using (true)
  with check (true);

create policy "Leaderboard entries are readable"
  on leaderboard_entries for select
  using (true);

create policy "Anonymous users can publish leaderboard entries"
  on leaderboard_entries for insert
  with check (true);
