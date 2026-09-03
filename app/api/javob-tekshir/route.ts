// Foydalanuvchi javobini tekshiradi. Solishtirish serverda bo'ladi, shuning
// uchun to'g'ri javob hech qachon klientga JSON sifatida yuborilmaydi —
// faqat { togri: true/false } natijasi qaytadi.

import { NextRequest, NextResponse } from "next/server";
import { idBoyichaTop } from "@/lib/korpus";
import { javobTogrimi } from "@/lib/javob";

export async function POST(sorov: NextRequest) {
  let govdasi: { id?: unknown; javob?: unknown };
  try {
    govdasi = await sorov.json();
  } catch {
    return NextResponse.json(
      { xato: "So'rov tanasi JSON emas." },
      { status: 400 }
    );
  }

  const { id, javob } = govdasi;
  if (typeof id !== "string" || typeof javob !== "string") {
    return NextResponse.json(
      { xato: "id va javob maydonlari matn (string) bo'lishi kerak." },
      { status: 400 }
    );
  }

  const topishmoq = idBoyichaTop(id);
  if (!topishmoq) {
    return NextResponse.json(
      { xato: "Bunday id bilan topishmoq topilmadi." },
      { status: 404 }
    );
  }

  const togri = javobTogrimi(javob, topishmoq.javob, topishmoq.javob_variantlar);
  return NextResponse.json({ togri });
}
