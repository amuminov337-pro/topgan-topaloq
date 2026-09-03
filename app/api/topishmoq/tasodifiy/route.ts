// Tasodifiy topishmoq qaytaradi — javob va manba MAYDONLARISIZ, chunki bu
// javob brauzerga (Network tabiga) tushib qolmasligi kerak. Ixtiyoriy
// ?tashqari=<id> parametri bilan oldingi topishmoq takrorlanmaydi.

import { NextRequest, NextResponse } from "next/server";
import { ochiqShaklga, tasodifiyTopishmoq } from "@/lib/korpus";

export async function GET(sorov: NextRequest) {
  const tashqariId = sorov.nextUrl.searchParams.get("tashqari");
  const topishmoq = tasodifiyTopishmoq(tashqariId);
  return NextResponse.json(ochiqShaklga(topishmoq));
}
