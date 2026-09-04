// F14 — "/xarita" sahifasi tepasidagi sayohat albomi xulosasi: nechta
// suvenir yig'ilgani va ularning emojilari. localStorage'dan o'qigani uchun
// "use client" — server render paytida bo'sh holatda ko'rinadi, brauzerda
// darhol to'g'ri holatga yangilanadi.
"use client";

import { useEffect, useState } from "react";
import { ochilganKodlarRoyxati } from "@/lib/sovinir";

type Props = {
  davlatlar: { kod: string; sovinir: { emoji: string; nomi: string } }[];
};

export default function SovinirYigindisi({ davlatlar }: Props) {
  const [ochilganKodlar, setOchilganKodlar] = useState<string[]>([]);

  useEffect(() => {
    setOchilganKodlar(ochilganKodlarRoyxati());
  }, []);

  return (
    <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
      <p className="text-sm font-bold">
        🎒 Sayohat albomi: {ochilganKodlar.length} / {davlatlar.length} suvenir
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {davlatlar.map((d) => {
          const ochilgan = ochilganKodlar.includes(d.kod);
          return (
            <span
              key={d.kod}
              title={ochilgan ? d.sovinir.nomi : "Hali topilmagan"}
              className={
                "flex h-9 w-9 items-center justify-center rounded-full text-lg " +
                (ochilgan ? "bg-white" : "bg-white/50 grayscale opacity-40")
              }
            >
              {ochilgan ? d.sovinir.emoji : "🔒"}
            </span>
          );
        })}
      </div>
    </div>
  );
}
