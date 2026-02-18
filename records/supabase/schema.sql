-- Run this in Supabase Dashboard → SQL Editor.
-- It creates tables for bills + bill items, RLS policies, and an RPC to generate the next bill number.

-- Bills
create table if not exists public.bills (
  id text primary key,
  owner_id uuid not null default auth.uid(),
  bill_number text not null,
  bill_date date not null,
  bill_type text not null check (bill_type in ('customer', 'supplier')),
  name text not null,
  mobile text not null,
  village_city text not null,
  subtotal numeric not null,
  discount numeric not null,
  final_total numeric not null,
  created_at timestamptz not null default now()
);

-- Bill items
create table if not exists public.bill_items (
  id text primary key,
  bill_id text not null references public.bills(id) on delete cascade,
  owner_id uuid not null default auth.uid(),
  item_name text not null,
  quantity numeric not null,
  price_per_item numeric not null,
  total_price numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists bills_owner_date_idx on public.bills (owner_id, bill_date desc);
create index if not exists bill_items_bill_id_idx on public.bill_items (bill_id);

-- Bill counter (per owner)
create table if not exists public.bill_counters (
  owner_id uuid primary key,
  counter integer not null default 1000,
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.bills enable row level security;
alter table public.bill_items enable row level security;
alter table public.bill_counters enable row level security;

-- Policies: owner-only access
drop policy if exists "bills_owner_all" on public.bills;
create policy "bills_owner_all" on public.bills
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "bill_items_owner_all" on public.bill_items;
create policy "bill_items_owner_all" on public.bill_items
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "bill_counters_owner_all" on public.bill_counters;
create policy "bill_counters_owner_all" on public.bill_counters
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- RPC: next bill number (atomic per-owner increment)
create or replace function public.next_bill_number()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_counter integer;
begin
  insert into public.bill_counters (owner_id, counter)
  values (auth.uid(), 1000)
  on conflict (owner_id) do nothing;

  update public.bill_counters
  set counter = counter + 1,
      updated_at = now()
  where owner_id = auth.uid()
  returning counter into new_counter;

  return 'VS' || new_counter::text;
end;
$$;

revoke all on function public.next_bill_number() from public;
grant execute on function public.next_bill_number() to authenticated;
