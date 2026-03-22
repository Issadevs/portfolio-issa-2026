create table if not exists public.portfolio_settings (
  id text primary key,
  status text not null default 'OPEN',
  contract_type text not null default 'ALTERNANCE',
  available_from date,
  location text not null default 'Paris / Remote',
  show_contact_cta boolean not null default true,
  headline_fr text not null default 'Alternance dès février 2026',
  headline_en text not null default 'Apprenticeship from February 2026',
  note_fr text not null default '',
  note_en text not null default '',
  updated_at timestamptz not null default now(),
  constraint portfolio_settings_singleton check (id = 'default'),
  constraint portfolio_settings_status_check
    check (status in ('OPEN', 'SOON', 'NOT_LOOKING')),
  constraint portfolio_settings_contract_type_check
    check (contract_type in ('CDI', 'ALTERNANCE', 'STAGE', 'FREELANCE'))
);

insert into public.portfolio_settings (
  id,
  status,
  contract_type,
  available_from,
  location,
  show_contact_cta,
  headline_fr,
  headline_en,
  note_fr,
  note_en
)
values (
  'default',
  'OPEN',
  'ALTERNANCE',
  null,
  'Paris / Remote',
  true,
  'Alternance dès février 2026',
  'Apprenticeship from February 2026',
  '',
  ''
)
on conflict (id) do nothing;

alter table public.portfolio_settings enable row level security;

create policy "portfolio_settings_public_read"
on public.portfolio_settings
for select
to anon, authenticated
using (true);

create policy "portfolio_settings_admin_insert"
on public.portfolio_settings
for insert
to authenticated
with check (auth.email() = 'issa.kane@efrei.net');

create policy "portfolio_settings_admin_update"
on public.portfolio_settings
for update
to authenticated
using (auth.email() = 'issa.kane@efrei.net')
with check (auth.email() = 'issa.kane@efrei.net');
