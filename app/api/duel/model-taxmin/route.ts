// F13 — Topishmoq dueli: foydalanuvchi navbatida u bergan topishmoq matniga
// modelning taxminini qaytaradi. `id` emas, `matn` qabul qilinadi — chunki bu
// topishmoq korpusda bo'lishi shart emas (lib/duel.ts'dagi izohga qarang).

import { NextRequest, NextResponse } from "next/server";
import { modelTopishmoqniYech } from "@/lib/duel";

export async function POST(sorov: NextRequest) {
  let govdasi: { matn?: unknown };
  try {
    govdasi = await sorov.json();
  } catch {
    return NextResponse.json({ xato: "So'rov tanasi JSON emas." }, { status: 400 });
  }

  const { matn } = govdasi;
  if (typeof matn !== "string" || !matn.trim()) {
    return NextResponse.json(
      { xato: "matn (bo'sh bo'lmagan string) kerak." },
      { status: 400 }
    );
  }

  const natija = await modelTopishmoqniYech(matn.trim());
  if (natija.ok) {
    return NextResponse.json({ ok: true, javob: natija.javob });
  }
  return NextResponse.json({ ok: false, xabar: natija.xabar });
}
