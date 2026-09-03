// F8 — bosh sahifadagi yashil panelni localStorage'dagi haqiqiy natija bilan
// to'ldiradi. NatijaPanel o'zi sof taqdimot komponenti bo'lib qoladi (prop
// orqali ishlaydi) — localStorage bilan ishlash mantig'i shu "use client"
// o'ramda izolyatsiya qilingan, shunda app/page.tsx server komponent bo'lib
// qolaveradi.
"use client";

import { useEffect, useState } from "react";
import NatijaPanel from "@/components/NatijaPanel";
import { natijaXulosasiniOl } from "@/lib/saqlash";

export default function NatijaHolati() {
  const [holat, setHolat] = useState<{
    soni: number;
    songgiJavoblar: { belgi: string; nom: string }[];
  }>({ soni: 0, songgiJavoblar: [] });

  useEffect(() => {
    setHolat(natijaXulosasiniOl());
  }, []);

  return <NatijaPanel soni={holat.soni} songgiJavoblar={holat.songgiJavoblar} />;
}
