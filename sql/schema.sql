-- Spusť tento skript jednou v databázi (Neon SQL editor), ať appka má kam ukládat objednávky.

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  so TEXT NOT NULL,
  so_manual BOOLEAN NOT NULL DEFAULT FALSE,
  konstrukce_id TEXT,
  konstrukce_nazev TEXT NOT NULL,
  staniceni TEXT,
  identifikace TEXT,
  termin DATE,
  manual BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'objednáno',
  zkousky JSONB NOT NULL,
  vytvoreno TIMESTAMPTZ NOT NULL DEFAULT now()
);
