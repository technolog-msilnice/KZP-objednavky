-- KROK A: KZP data v databázi (místo napevno v kódu appky)
-- Spusť tento skript v Neon SQL Editoru. Přepíše tabulku objednávek (staré testovací
-- objednávky se smažou - je to jen pilotní testovací data, nic se neztrácí).

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS zkousky;
DROP TABLE IF EXISTS konstrukce;
DROP TABLE IF EXISTS kzp;

CREATE TABLE kzp (
  id SERIAL PRIMARY KEY,
  so TEXT NOT NULL,
  cislo TEXT NOT NULL UNIQUE,
  nazev TEXT NOT NULL,
  vytvoreno TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE konstrukce (
  id SERIAL PRIMARY KEY,
  kzp_id INTEGER NOT NULL REFERENCES kzp(id) ON DELETE CASCADE,
  poradi INTEGER NOT NULL,
  nazev TEXT NOT NULL,
  material TEXT NOT NULL,
  technologicka_cast TEXT NOT NULL DEFAULT 'Zemní práce'
);

CREATE TABLE zkousky (
  id SERIAL PRIMARY KEY,
  konstrukce_id INTEGER NOT NULL REFERENCES konstrukce(id) ON DELETE CASCADE,
  poradi INTEGER NOT NULL,
  kratky TEXT NOT NULL,
  nazev TEXT NOT NULL,
  hodnota TEXT,
  norma TEXT,
  cetnost TEXT,
  pozadovano TEXT,
  provede TEXT,
  vystup TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  kzp_id INTEGER REFERENCES kzp(id),
  so TEXT NOT NULL,
  so_manual BOOLEAN NOT NULL DEFAULT FALSE,
  konstrukce_id INTEGER REFERENCES konstrukce(id),
  konstrukce_nazev TEXT NOT NULL,
  staniceni TEXT,
  identifikace TEXT,
  termin DATE,
  manual BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'objednáno',
  zkousky JSONB NOT NULL,
  vytvoreno TIMESTAMPTZ NOT NULL DEFAULT now()
);
