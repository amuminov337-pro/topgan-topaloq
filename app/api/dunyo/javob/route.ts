// F14 — To'liq javobni ochadi: "javobni ko'rsat" tugmasi (hech qachon
// bloklanmaydi — loyihaning doimiy qoidasi) YOKI 4-urinish ham xato bo'lganda
// avtomatik chaqiriladi. Davlat kodi va suvenir ma'lumotini ham qaytaradi —
// klient buni "chindan topilgan" holatlarda albomga qo'shish uchun ishlatadi
// (bu route orqali kelgan javob "oshkor qilingan" hisoblanadi, sovg'a
// berilmaydi — bu qaror klient tomonda qabul qilinadi, xuddi AI-buvi
// rejimidagi "javobni ko'rsat" bilan bir xil mantiq).

import { NextRequest, NextResponse } from "next/server";
import { toliqJavobniOch } from "@/lib/dunyo";

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

  const natija = toliqJavobniOch(id);
  if (!natija) {
    return NextResponse.json({ xato: "Bunday id bilan topishmoq topilmadi." }, { status: 404 });
  }

  return NextResponse.json(natija);
}
