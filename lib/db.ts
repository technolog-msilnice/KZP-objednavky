import { Pool } from "pg";

// Vercel/Neon posílá connection string v proměnné DATABASE_URL (nastavíme v kroku "Databáze").
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;
