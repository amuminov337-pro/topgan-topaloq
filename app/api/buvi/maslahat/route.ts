// F5 — bosqichma-bosqich maslahat uchi. { id, daraja: 1|2|3 } qabul qiladi,
// lib/maslahat.ts orqali (Gemini + zaxira zanjiri) maslahat matnini qaytaradi.
// Javobning o'zi hech qachon qaytarilmaydi.

import { NextRequest, NextResponse } from "next/server";
import { idBoyichaTop } from "@/lib/korpus";
import { maslahatOl, type MaslahatDarajasi } from "@/lib/maslahat";

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

  const topishmoq = idBoyichaTop(id);
  if (!topishmoq) {
    return NextResponse.json({ xato: "Bunday id bilan topishmoq topilmadi." }, { status: 404 });
  }

  const { matn, manba } = await maslahatOl(topishmoq, daraja as MaslahatDarajasi);
  return NextResponse.json({ maslahat: matn, manba });
}
