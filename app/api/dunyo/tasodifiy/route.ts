// F14 — Berilgan davlatdan tasodifiy topishmoq qaytaradi, javob va manba
// MAYDONLARISIZ (lib/korpus.ts'dagi bir xil sabab: javob brauzer tarmoq
// tabiga tushib qolmasligi kerak). Ixtiyoriy ?tashqari=<id> bilan oldingi
// topishmoq takrorlanmaydi.

import { NextRequest, NextResponse } from "next/server";
import { tasodifiyTopishmoq } from "@/lib/dunyo";

export async function GET(sorov: NextRequest) {
  const kod = sorov.nextUrl.searchParams.get("kod");
  const tashqariId = sorov.nextUrl.searchParams.get("tashqari");
  if (!kod) {
    return NextResponse.json({ xato: "kod parametri kerak." }, { status: 400 });
  }

  const topishmoq = tasodifiyTopishmoq(kod, tashqariId);
  if (!topishmoq) {
    return NextResponse.json(
      { xato: "Bunday davlat topilmadi yoki topishmoqlari yo'q." },
      { status: 404 }
    );
  }

  return NextResponse.json(topishmoq);
}
