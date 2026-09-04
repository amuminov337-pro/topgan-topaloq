// F14 — Foydalanuvchi javobini tekshiradi (lib/javob.ts'dagi bir xil
// moslashuvchan taqqoslash). To'g'ri javob hech qachon klientga qaytmaydi —
// faqat { togri: true/false } natijasi.

import { NextRequest, NextResponse } from "next/server";
import { javobniTekshir } from "@/lib/dunyo";

export async function POST(sorov: NextRequest) {
  let govdasi: { id?: unknown; javob?: unknown };
  try {
    govdasi = await sorov.json();
  } catch {
    return NextResponse.json({ xato: "So'rov tanasi JSON emas." }, { status: 400 });
  }

  const { id, javob } = govdasi;
  if (typeof id !== "string" || typeof javob !== "string") {
    return NextResponse.json(
      { xato: "id va javob maydonlari matn (string) bo'lishi kerak." },
      { status: 400 }
    );
  }

  const togri = javobniTekshir(id, javob);
  if (togri === null) {
    return NextResponse.json({ xato: "Bunday id bilan topishmoq topilmadi." }, { status: 404 });
  }

  return NextResponse.json({ togri });
}
