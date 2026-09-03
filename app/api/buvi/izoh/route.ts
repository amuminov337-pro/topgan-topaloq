// F6 — to'g'ri javobdan keyingi madaniy izoh uchi. { id } qabul qiladi,
// lib/izoh.ts orqali (Gemini + zaxira zanjiri) izoh matnini qaytaradi.
// MUHIM: bu uch faqat foydalanuvchi topishmoqqa ALLAQACHON to'g'ri javob
// bergan yoki javobni o'zi so'rab ko'rgan holatda klient tomonidan
// chaqiriladi (xuddi /api/topishmoq/javob kabi) — izoh matni javobni
// o'z ichiga oladi, chunki bu bosqichda uni yashirishning hojati yo'q.

import { NextRequest, NextResponse } from "next/server";
import { idBoyichaTop } from "@/lib/korpus";
import { izohOl } from "@/lib/izoh";

export async function POST(sorov: NextRequest) {
  let govdasi: { id?: unknown };
  try {
    govdasi = await sorov.json();
  } catch {
    return NextResponse.json({ xato: "So'rov tanasi JSON emas." }, { status: 400 });
  }

  const { id } = govdasi;
  if (typeof id !== "string") {
    return NextResponse.json({ xato: "id (string) kerak." }, { status: 400 });
  }

  const topishmoq = idBoyichaTop(id);
  if (!topishmoq) {
    return NextResponse.json({ xato: "Bunday id bilan topishmoq topilmadi." }, { status: 404 });
  }

  const { matn, manba } = await izohOl(topishmoq);
  return NextResponse.json({ izoh: matn, manba });
}
