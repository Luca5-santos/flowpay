create table public.profiles (
 user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
 company_name text not null default 'Minha empresa' check(char_length(company_name) between 1 and 120),
 contact_email text not null default '', phone text not null default '', created_at timestamptz not null default now()
);
create table public.clients (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 name text not null check(char_length(name) between 1 and 160), email text not null default '', phone text not null default '',
 notes text not null default '', created_at timestamptz not null default now(), unique(user_id,id)
);
create table public.opportunities (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 client_id uuid not null, title text not null check(char_length(title) between 1 and 200),
 value_cents bigint not null default 0 check(value_cents between 0 and 100000000000),
 stage text not null default 'Novo contato' check(stage in ('Novo contato','Em preparação','Enviado','Em negociação','Aprovado','Perdido')),
 notes text not null default '', created_at timestamptz not null default now(),
 foreign key(user_id,client_id) references public.clients(user_id,id), unique(user_id,id)
);
create table public.quotes (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 client_id uuid not null, title text not null check(char_length(title) between 1 and 200),
 items jsonb not null, discount_cents bigint not null default 0 check(discount_cents >= 0),
 total_cents bigint not null default 0 check(total_cents between 0 and 100000000000),
 status text not null default 'Rascunho' check(status in ('Rascunho','Enviado','Aprovado','Recusado')),
 valid_until date not null, notes text not null default '', created_at timestamptz not null default now(),
 foreign key(user_id,client_id) references public.clients(user_id,id)
);
create table public.followups (
 id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 client_id uuid not null, title text not null check(char_length(title) between 1 and 200),
 due_date date not null, done boolean not null default false, notes text not null default '',
 created_at timestamptz not null default now(), foreign key(user_id,client_id) references public.clients(user_id,id)
);
create function public.calculate_quote() returns trigger language plpgsql security invoker set search_path = '' as $$
declare item jsonb; subtotal numeric := 0; qty numeric; price numeric;
begin
 if jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) not between 1 and 100 then
  raise exception 'Informe de 1 a 100 itens'; end if;
 for item in select value from jsonb_array_elements(new.items) loop
  if jsonb_typeof(item->'description') is distinct from 'string' or length(trim(item->>'description')) not between 1 and 200
   or jsonb_typeof(item->'quantity') is distinct from 'number' or jsonb_typeof(item->'unit_price_cents') is distinct from 'number'
   then raise exception 'Item inválido'; end if;
  qty := (item->>'quantity')::numeric; price := (item->>'unit_price_cents')::numeric;
  if qty <> trunc(qty) or qty not between 1 and 1000000 or price <> trunc(price) or price not between 0 and 1000000000 then
   raise exception 'Quantidade ou preço inválido'; end if;
  subtotal := subtotal + qty * price;
 end loop;
 if new.discount_cents > subtotal then raise exception 'Desconto maior que o subtotal'; end if;
 new.total_cents := subtotal - new.discount_cents;
 return new;
end $$;
revoke all on function public.calculate_quote() from public, anon, authenticated;
create trigger calculate_quote before insert or update on public.quotes for each row execute function public.calculate_quote();
alter table public.profiles enable row level security;
revoke all on public.profiles from anon;
grant select,insert,update on public.profiles to authenticated;
create policy own_select on public.profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy own_insert on public.profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_update on public.profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter table public.clients enable row level security;
revoke all on public.clients from anon;
grant select,insert,update on public.clients to authenticated;
create policy own_select on public.clients for select to authenticated using ((select auth.uid()) = user_id);
create policy own_insert on public.clients for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_update on public.clients for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create index clients_user_id_idx on public.clients(user_id);
alter table public.opportunities enable row level security;
revoke all on public.opportunities from anon;
grant select,insert,update on public.opportunities to authenticated;
create policy own_select on public.opportunities for select to authenticated using ((select auth.uid()) = user_id);
create policy own_insert on public.opportunities for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_update on public.opportunities for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create index opportunities_user_id_idx on public.opportunities(user_id);
alter table public.quotes enable row level security;
revoke all on public.quotes from anon;
grant select,insert,update on public.quotes to authenticated;
create policy own_select on public.quotes for select to authenticated using ((select auth.uid()) = user_id);
create policy own_insert on public.quotes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_update on public.quotes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create index quotes_user_id_idx on public.quotes(user_id);
alter table public.followups enable row level security;
revoke all on public.followups from anon;
grant select,insert,update on public.followups to authenticated;
create policy own_select on public.followups for select to authenticated using ((select auth.uid()) = user_id);
create policy own_insert on public.followups for insert to authenticated with check ((select auth.uid()) = user_id);
create policy own_update on public.followups for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create index followups_user_id_idx on public.followups(user_id);
