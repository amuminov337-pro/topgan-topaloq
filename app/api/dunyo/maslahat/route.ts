// F14 — Bosqichma-bosqich maslahat: javobning "maskasi" (harflar "_" bilan
// yashiringan, bo'sh joylar saqlangan). `daraja` oshgani sayin ko'proq harf
// ochiladi (lib/dunyo.ts'dagi maslahatMaskasi izohiga qarang). Bu — Gemini
// emas, sof dasturiy mantiq, shuning uchun internet yoki API kaliti bo'lmasa
// ham har doim ishlaydi.

import { NextRequest, NextResponse } from "next/server";
import { maslahatMaskasi } from "@/lib/dunyo";

export async function POST(sorov: NextRequest) {
  let govdasi: { id?: unknown; daraja?: unknown };
  try {
    govdasi = await sorov.json();
  } catch {
    return NextResponse.json({ xato: "So'rov tanasi JSON emas." }, { status: 400 });
  }

  const { id, daraja } = govdasi;
  if (typeof id !== "string" || (daraja !== 1 && daraja !== 2 && daraja !== 3)) {
    return NextResponse.json(
      { xato: "id (string) va daraja (1, 2 yoki 3) kerak." },
      { status: 400 }
    );
  }

  const maska = maslahatMaskasi(id, daraja);
  if (maska === null) {
    return NextResponse.json({ xato: "Bunday id bilan topishmoq topilmadi." }, { status: 404 });
  }

  return NextResponse.json({ maska });
}
