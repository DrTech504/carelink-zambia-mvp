create type role_t as enum ('doctor','clinic','officer','patient');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role role_t not null,
  full_name text,
  phone text,
  avatar_url text,
  is_verified boolean default false,
  created_at timestamptz default now()
);

create table gigs (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references users(id),
  title text,
  type text check (type in ('clinical','non-clinical','telemedicine','research','education')),
  location jsonb,
  description text,
  pay numeric,
  start_date date,
  end_date date,
  status text default 'open',
  created_at timestamptz default now()
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references users(id),
  gig_id uuid references gigs(id),
  status text default 'pending',
  note text,
  created_at timestamptz default now()
);

alter table users enable row level security;
alter table gigs enable row level security;
alter table applications enable row level security;
