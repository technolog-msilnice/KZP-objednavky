import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const kzpRes = await pool.query("SELECT * FROM kzp WHERE id = $1", [id]);
  if (kzpRes.rows.length === 0) {
    return NextResponse.json({ error: "Nenalezeno." }, { status: 404 });
  }

  const konstrukceRes = await pool.query(
    "SELECT * FROM konstrukce WHERE kzp_id = $1 ORDER BY poradi",
    [id]
  );

  const konstrukceIds = konstrukceRes.rows.map((k) => k.id);
  let zkouskyRows: any[] = [];
  if (konstrukceIds.length > 0) {
    const zkouskyRes = await pool.query(
      "SELECT * FROM zkousky WHERE konstrukce_id = ANY($1) ORDER BY konstrukce_id, poradi",
      [konstrukceIds]
    );
    zkouskyRows = zkouskyRes.rows;
  }

  const konstrukce = konstrukceRes.rows.map((k) => ({
    id: k.id,
    nazev: k.nazev,
    material: k.material,
    technologickaCast: k.technologicka_cast,
    zkousky: zkouskyRows
      .filter((z) => z.konstrukce_id === k.id)
      .map((z) => ({
        id: z.id,
        kratky: z.kratky,
        nazev: z.nazev,
        hodnota: z.hodnota,
        norma: z.norma,
        cetnost: z.cetnost,
        pozadovano: z.pozadovano,
        provede: z.provede,
        vystup: z.vystup,
      })),
  }));

  return NextResponse.json({
    id: kzpRes.rows[0].id,
    so: kzpRes.rows[0].so,
    cislo: kzpRes.rows[0].cislo,
    nazev: kzpRes.rows[0].nazev,
    konstrukce,
  });
}
