-- ============================================================
-- CheaperRx — Initial Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users — created automatically on signup
-- ============================================================
create table public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  email                   text not null,
  full_name               text,
  city                    text default 'Calgary',
  province                text default 'AB',
  role                    text not null default 'free' check (role in ('free', 'pro', 'admin')),
  stripe_customer_id      text,
  stripe_subscription_id  text,
  subscription_status     text,
  created_at              timestamptz default now()
);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- DRUGS
-- ============================================================
create table public.drugs (
  id            uuid primary key default uuid_generate_v4(),
  din           text,
  brand_name    text not null,
  generic_name  text not null,
  strength      text not null,
  dosage_form   text not null default 'tablet',
  drug_class    text,
  is_generic    boolean not null default false,
  brand_drug_id uuid references public.drugs(id),
  created_at    timestamptz default now()
);

create index idx_drugs_brand_name   on public.drugs using gin(to_tsvector('english', brand_name));
create index idx_drugs_generic_name on public.drugs using gin(to_tsvector('english', generic_name));
create index idx_drugs_is_generic   on public.drugs(is_generic);

-- ============================================================
-- PHARMACIES
-- ============================================================
create table public.pharmacies (
  id                          uuid primary key default uuid_generate_v4(),
  name                        text not null,
  chain                       text,
  address                     text not null,
  city                        text not null default 'Calgary',
  province                    text not null default 'AB',
  postal_code                 text,
  phone                       text,
  accepts_odb                 boolean default false,
  accepts_alberta_blue_cross  boolean default false,
  accepts_bc_pharmacare       boolean default false,
  has_delivery                boolean default false,
  delivery_fee                decimal(6,2),
  is_featured                 boolean default false,
  created_at                  timestamptz default now()
);

create index idx_pharmacies_city on public.pharmacies(city, province);

-- ============================================================
-- PRICES
-- ============================================================
create table public.prices (
  id           uuid primary key default uuid_generate_v4(),
  drug_id      uuid not null references public.drugs(id) on delete cascade,
  pharmacy_id  uuid not null references public.pharmacies(id) on delete cascade,
  price        decimal(8,2) not null,
  quantity     integer not null default 30,
  source       text not null default 'manual',
  verified     boolean default true,
  last_updated timestamptz default now()
);

create index idx_prices_drug_id     on public.prices(drug_id);
create index idx_prices_pharmacy_id on public.prices(pharmacy_id);
create unique index idx_prices_drug_pharmacy on public.prices(drug_id, pharmacy_id);

-- ============================================================
-- PRICE HISTORY
-- ============================================================
create table public.price_history (
  id           uuid primary key default uuid_generate_v4(),
  drug_id      uuid not null references public.drugs(id) on delete cascade,
  pharmacy_id  uuid not null references public.pharmacies(id) on delete cascade,
  price        decimal(8,2) not null,
  recorded_at  timestamptz default now()
);

create index idx_price_history_drug on public.price_history(drug_id, recorded_at desc);

-- ============================================================
-- SAVED MEDICATIONS (Pro feature)
-- ============================================================
create table public.saved_medications (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  drug_id         uuid not null references public.drugs(id) on delete cascade,
  family_member   text not null default 'You',
  nickname        text,
  refill_reminder boolean default false,
  refill_day      integer check (refill_day between 1 and 31),
  created_at      timestamptz default now()
);

create index idx_saved_medications_user on public.saved_medications(user_id);

-- ============================================================
-- PRICE ALERTS (Pro feature)
-- ============================================================
create table public.price_alerts (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  drug_id        uuid not null references public.drugs(id) on delete cascade,
  target_price   decimal(8,2) not null,
  is_active      boolean default true,
  last_triggered timestamptz,
  created_at     timestamptz default now()
);

create index idx_price_alerts_user   on public.price_alerts(user_id);
create index idx_price_alerts_active on public.price_alerts(is_active) where is_active = true;

-- ============================================================
-- PRICE SUBMISSIONS (crowdsourced)
-- ============================================================
create table public.price_submissions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles(id) on delete set null,
  drug_id      uuid not null references public.drugs(id) on delete cascade,
  pharmacy_id  uuid not null references public.pharmacies(id) on delete cascade,
  price_paid   decimal(8,2) not null,
  verified     boolean default false,
  submitted_at timestamptz default now()
);

create index idx_price_submissions_unverified on public.price_submissions(verified) where verified = false;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles           enable row level security;
alter table public.drugs              enable row level security;
alter table public.pharmacies         enable row level security;
alter table public.prices             enable row level security;
alter table public.price_history      enable row level security;
alter table public.saved_medications  enable row level security;
alter table public.price_alerts       enable row level security;
alter table public.price_submissions  enable row level security;

-- Profiles: users can only read/update their own row
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Drugs: public read, admin write
create policy "Anyone can view drugs"
  on public.drugs for select
  using (true);

create policy "Admin can manage drugs"
  on public.drugs for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Pharmacies: public read, admin write
create policy "Anyone can view pharmacies"
  on public.pharmacies for select
  using (true);

create policy "Admin can manage pharmacies"
  on public.pharmacies for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Prices: public read, admin write
create policy "Anyone can view prices"
  on public.prices for select
  using (true);

create policy "Admin can manage prices"
  on public.prices for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Price history: public read
create policy "Anyone can view price history"
  on public.price_history for select
  using (true);

-- Saved medications: users see only their own
create policy "Users can manage own saved medications"
  on public.saved_medications for all
  using (auth.uid() = user_id);

-- Price alerts: users see only their own
create policy "Users can manage own price alerts"
  on public.price_alerts for all
  using (auth.uid() = user_id);

-- Price submissions: authenticated users can submit
create policy "Authenticated users can submit prices"
  on public.price_submissions for insert
  with check (auth.uid() is not null);

create policy "Admin can manage price submissions"
  on public.price_submissions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get the cheapest price for a drug in a city
create or replace function public.get_cheapest_prices(
  p_drug_id   uuid,
  p_city      text,
  p_limit     integer default 10
)
returns table (
  pharmacy_id   uuid,
  pharmacy_name text,
  chain         text,
  address       text,
  city          text,
  phone         text,
  has_delivery  boolean,
  delivery_fee  decimal,
  accepts_alberta_blue_cross boolean,
  accepts_odb   boolean,
  price         decimal,
  quantity      integer,
  last_updated  timestamptz
) as $$
begin
  return query
  select
    ph.id,
    ph.name,
    ph.chain,
    ph.address,
    ph.city,
    ph.phone,
    ph.has_delivery,
    ph.delivery_fee,
    ph.accepts_alberta_blue_cross,
    ph.accepts_odb,
    pr.price,
    pr.quantity,
    pr.last_updated
  from public.prices pr
  join public.pharmacies ph on ph.id = pr.pharmacy_id
  where pr.drug_id = p_drug_id
    and lower(ph.city) = lower(p_city)
    and pr.verified = true
  order by pr.price asc
  limit p_limit;
end;
$$ language plpgsql security definer;
