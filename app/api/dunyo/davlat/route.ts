// F14 — `/xarita/[kod]` sahifasi sarlavhasi (nomi, sovinir) uchun bitta
// davlatning javobsiz ma'lumotini qaytaradi.

import { NextRequest, NextResponse } from "next/server";
import { davlatOchiqShaklda } from "@/lib/dunyo";

export async function GET(sorov: NextRequest) {
  const kod = sorov.nextUrl.searchParams.get("kod");
  if (!kod) {
    return NextResponse.json({ xato: "kod parametri kerak." }, { status: 400 });
  }

  const davlat = davlatOchiqShaklda(kod);
  if (!davlat) {
    return NextResponse.json({ xato: "Bunday kod bilan davlat topilmadi." }, { status: 404 });
  }

  return NextResponse.json(davlat);
}
