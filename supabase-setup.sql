-- Ejecutar en el SQL Editor de tu proyecto Supabase

-- Tabla principal del álbum (una sola fila compartida por toda la familia)
create table if not exists album_state (
  id text primary key default 'family',
  collected jsonb not null default '{}',
  duplicates jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Fila inicial
insert into album_state (id, collected, duplicates)
values ('family', '{}', '{}')
on conflict (id) do nothing;

-- Tabla de sugerencias
create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  text text not null,
  created_at timestamptz not null default now()
);

-- Habilitar Realtime en ambas tablas
alter publication supabase_realtime add table album_state;
alter publication supabase_realtime add table suggestions;

-- Políticas RLS: acceso público sin login (álbum familiar compartido)
alter table album_state enable row level security;
alter table suggestions enable row level security;

create policy "Lectura pública album_state"
  on album_state for select using (true);

create policy "Escritura pública album_state"
  on album_state for all using (true) with check (true);

create policy "Lectura pública suggestions"
  on suggestions for select using (true);

create policy "Escritura pública suggestions"
  on suggestions for insert with check (true);
