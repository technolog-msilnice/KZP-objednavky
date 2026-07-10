import { NextRequest, NextResponse } from "next/server";
import { extractKzpFromPdf } from "@/lib/anthropic-extract";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Chybí soubor." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");

  try {
    const extracted = await extractKzpFromPdf(base64);
    return NextResponse.json(extracted);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Zpracování PDF selhalo." },
      { status: 500 }
    );
  }
}
