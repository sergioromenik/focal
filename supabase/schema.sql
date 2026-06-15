-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists public.segments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null,
  created_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  notes text,
  segment text not null,
  priority text not null check (priority in ('Alta','Média','Baixa')),
  due_date date,
  due_time time,
  subtasks jsonb not null default '[]'::jsonb,
  done boolean not null default false,
  created_at timestamptz default now()
);

alter table public.segments enable row level security;
alter table public.tasks enable row level security;

create policy "segments_select_own" on public.segments
  for select using (auth.uid() = user_id);
create policy "segments_insert_own" on public.segments
  for insert with check (auth.uid() = user_id);
create policy "segments_update_own" on public.segments
  for update using (auth.uid() = user_id);
create policy "segments_delete_own" on public.segments
  for delete using (auth.uid() = user_id);

create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = user_id);

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists segments_user_id_idx on public.segments(user_id);
