import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    "SELECT id, so, cislo, nazev FROM kzp ORDER BY so, cislo"
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { so, cislo, nazev, konstrukce } = body;

  if (!so || !cislo || !nazev || !Array.isArray(konstrukce) || konstrukce.length === 0) {
    return NextResponse.json({ error: "Neplatná nebo neúplná data KZP." }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const kzpRes = await client.query(
      "INSERT INTO kzp (so, cislo, nazev) VALUES ($1,$2,$3) RETURNING id",
      [so, cislo, nazev]
    );
    const kzpId = kzpRes.rows[0].id;

    for (let ki = 0; ki < konstrukce.length; ki++) {
      const k = konstrukce[ki];
      const kRes = await client.query(
        `INSERT INTO konstrukce (kzp_id, poradi, nazev, material, technologicka_cast)
         VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [kzpId, ki + 1, k.nazev, k.material, k.technologickaCast || "Zemní práce"]
      );
      const konstrukceId = kRes.rows[0].id;

      const zkousky = Array.isArray(k.zkousky) ? k.zkousky : [];
      for (let zi = 0; zi < zkousky.length; zi++) {
        const z = zkousky[zi];
        await client.query(
          `INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            konstrukceId,
            zi + 1,
            z.kratky || z.nazev || "",
            z.nazev || "",
            z.hodnota || "",
            z.norma || "",
            z.cetnost || "",
            z.pozadovano || "",
            z.provede || "",
            z.vystup || "",
          ]
        );
      }
    }

    await client.query("COMMIT");
    return NextResponse.json({ id: kzpId }, { status: 201 });
  } catch (e: any) {
    await client.query("ROLLBACK");
    const msg = e?.code === "23505" ? "KZP s tímto číslem už existuje." : e.message || "Uložení selhalo.";
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    client.release();
  }
}
