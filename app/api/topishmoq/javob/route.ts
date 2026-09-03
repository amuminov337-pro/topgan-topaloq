// "Javobni ko'rsat" tugmasi uchun — foydalanuvchi o'zi ATAYLAB so'raganda
// haqiqiy javobni qaytaradi. MASTER_PROMPT 2-bo'lim: "Har bosqichda 'javobni
// ko'rsat' tugmasi mavjud — foydalanuvchi majburlanmaydi." Bu boshqa
// uchlardan farqli o'laroq ataylab javobni ochadi, chunki foydalanuvchi
// buni o'zi so'ragan.

import { NextRequest, NextResponse } from "next/server";
import { idBoyichaTop } from "@/lib/korpus";

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

  return NextResponse.json({ javob: topishmoq.javob, ikonka: topishmoq.ikonka });
}
