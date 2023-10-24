CREATE TYPE job_status AS ENUM ('Applied', 'Interviewing', 'Offered', 'Rejected');

create table jobs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  company text,
  title text,
  date timestamp with time zone,
  location text,
  status job_status,

  constraint company_length check (char_length(company) >= 3),
  constraint title_length check (char_length(title) >= 3),
  constraint location_length check (char_length(location) >= 3)
);

alter table jobs
  enable row level security;

create policy "Users can view jobs created by them" on jobs
  for select using (auth.uid() = user_id);

create policy "Everyone can create a job" on jobs
  for insert with check (true);

create policy "User can update their jobs" on jobs
  for update using (auth.uid() = user_id);

