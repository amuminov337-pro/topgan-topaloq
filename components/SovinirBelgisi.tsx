// F14 — Har bir davlat kartasining burchagidagi kichik belgi: suvenir
// ochilganmi (✓) yoki hali yo'qmi. localStorage'ga bog'liq bo'lgani uchun
// "use client" — atrofidagi karta esa oddiy <Link> bo'lib qolaveradi.
"use client";

import { useEffect, useState } from "react";
import { sovinirOchilganmi } from "@/lib/sovinir";

export default function SovinirBelgisi({ kod }: { kod: string }) {
  const [ochilgan, setOchilgan] = useState(false);

  useEffect(() => {
    setOchilgan(sovinirOchilganmi(kod));
  }, [kod]);

  if (!ochilgan) return null;

  return (
    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-natija-fon text-xs text-natija-matn">
      ✓
    </span>
  );
}
