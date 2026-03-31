create table public.waitlist (
  id uuid default gen_random_uuid() not null primary key,
  email text unique not null,
  created_at timestamptz default now() not null
);

-- Optional: Enable Row Level Security (RLS)
alter table public.waitlist enable row level security;

-- Allow public inserts (so anyone can join the waitlist)
create policy "Allow public inserts"
on public.waitlist for insert
with check (true);
