// Gemini qatlamining ishlayotganini tekshiruvchi uchi. F3 "Done when":
// GET so'rovi { ok: true, model } qaytaradi; kalit noto'g'ri/yo'q bo'lsa ham
// ilova qulamaydi — tushunarli xato bilan { ok: false, model, xato } qaytadi.

import { NextResponse } from "next/server";
import { geminiHolati, geminiSorov } from "@/lib/gemini";

export async function GET() {
  const { sozlangan, model } = geminiHolati();

  if (!sozlangan) {
    return NextResponse.json({
      ok: false,
      model,
      xato: "GEMINI_API_KEY .env.local faylida sozlanmagan.",
    });
  }

  const natija = await geminiSorov("Salom");

  if (!natija.ok) {
    return NextResponse.json({ ok: false, model, xato: natija.xabar });
  }

  return NextResponse.json({ ok: true, model });
}
