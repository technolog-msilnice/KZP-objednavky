import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendOrderEmail } from "@/lib/email";

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM orders ORDER BY vytvoreno DESC"
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    so,
    soManual,
    konstrukceId,
    konstrukceNazev,
    staniceni,
    identifikace,
    termin,
    manual,
    zkousky,
  } = body;

  if (!konstrukceNazev || !Array.isArray(zkousky) || zkousky.length === 0) {
    return NextResponse.json(
      { error: "Chybí konstrukce nebo zkoušky." },
      { status: 400 }
    );
  }

  const result = await pool.query(
    `INSERT INTO orders (so, so_manual, konstrukce_id, konstrukce_nazev, staniceni, identifikace, termin, manual, status, zkousky)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'objednáno',$9)
     RETURNING *`,
    [
      so,
      !!soManual,
      konstrukceId || null,
      konstrukceNazev,
      staniceni || null,
      identifikace || null,
      termin || null,
      !!manual,
      JSON.stringify(zkousky),
    ]
  );

  const order = result.rows[0];

  try {
    await sendOrderEmail({
      id: order.id,
      so: order.so,
      konstrukceNazev: order.konstrukce_nazev,
      staniceni: order.staniceni,
      identifikace: order.identifikace,
      termin: order.termin,
      zkousky,
    });
  } catch (e) {
    console.error("Odeslání e-mailu selhalo:", e);
  }

  return NextResponse.json(order, { status: 201 });
}
