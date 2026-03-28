-- Profiles table to store user data (sync with NextAuth)
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  wallet_balance decimal(10,2) not null default 0,
  status text not null default 'pending',

  constraint username_length check (char_length(username) >= 3)
);

-- Enable Row Level Security
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Orders table to store service purchases
create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users,
  platform text not null,
  service text not null,
  quantity integer not null,
  target_username text not null,
  status text default 'pending' not null,
  total_price decimal(10, 2) not null
);

-- RLS for orders
alter table orders enable row level security;

create policy "Users can view their own orders." on orders
  for select using (auth.uid() = user_id);

create policy "Users can create their own orders." on orders
  for insert with check (auth.uid() = user_id);

-- Testimonials table
create table testimonials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users,
  body text not null,
  author_name text not null,
  author_handle text not null,
  author_image_url text not null,
  rating integer default 5
);

alter table testimonials enable row level security;

create policy "Testimonials are viewable by everyone." on testimonials
  for select using (true);

create policy "Authenticated users can insert own testimonials." on testimonials
  for insert with check (auth.uid() = user_id);

create policy "Anonymous users can insert testimonials." on testimonials
  for insert with check (user_id is null);

create policy "Users can update their own testimonials." on testimonials
  for update using (auth.uid() = user_id);

create policy "Users can delete their own testimonials." on testimonials
  for delete using (auth.uid() = user_id);
