// F7 — "O'zing yarat": foydalanuvchi yozgan topishmoqni baholash uchi.
// { matn, javob } qabul qiladi, lib/baho.ts orqali (Gemini + zaxira zanjiri)
// uch mezon bo'yicha ijobiy izoh va bitta taklif qaytaradi.

import { NextRequest, NextResponse } from "next/server";
import { topishmoqniBahola } from "@/lib/baho";

export async function POST(sorov: NextRequest) {
  let govdasi: { matn?: unknown; javob?: unknown };
  try {
    govdasi = await sorov.json();
  } catch {
    return NextResponse.json({ xato: "So'rov tanasi JSON emas." }, { status: 400 });
  }

  const { matn, javob } = govdasi;
  if (
    typeof matn !== "string" ||
    typeof javob !== "string" ||
    !matn.trim() ||
    !javob.trim()
  ) {
    return NextResponse.json(
      { xato: "Topishmoq matni va javobi bo'sh bo'lmasligi kerak." },
      { status: 400 }
    );
  }

  const natija = await topishmoqniBahola(matn.trim(), javob.trim());
  return NextResponse.json(natija);
}
