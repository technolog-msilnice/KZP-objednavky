import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!["objednáno", "protokol nahrán", "v deníku"].includes(status)) {
    return NextResponse.json({ error: "Neplatný stav." }, { status: 400 });
  }

  const result = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Nenalezeno." }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}
