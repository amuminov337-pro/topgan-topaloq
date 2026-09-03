// Natijalar sahifasi (F8). Bosh sahifadagi yashil panel faqat qisqacha
// xulosa ko'rsatadi — bu yerda esa barcha yechilgan topishmoqlarning to'liq
// tarixi, eng so'nggisidan boshlab, localStorage'dan o'qib ko'rsatiladi.
"use client";

import { useEffect, useState } from "react";
import Sahifa from "@/components/Sahifa";
import { barchaNatijalarniOl, type NatijaYozuvi } from "@/lib/saqlash";

// Ba'zi brauzerlarda "uz-UZ" lokali uchun to'liq ICU ma'lumoti yo'q va
// toLocaleDateString kutilmagan qisqartma ("M09 3" kabi) qaytarishi mumkin.
// Shu sababli sana qo'lda, mustaqil formatlanadi.
const OYLAR = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

function ozbekchaSana(vaqt: string): string {
  const sana = new Date(vaqt);
  if (Number.isNaN(sana.getTime())) return "";
  return `${sana.getDate()}-${OYLAR[sana.getMonth()]}`;
}

export default function NatijalarSahifa() {
  const [royxat, setRoyxat] = useState<NatijaYozuvi[] | null>(null);

  useEffect(() => {
    setRoyxat(barchaNatijalarniOl());
  }, []);

  return (
    <Sahifa sarlavha="Natijalar">
      {royxat === null && (
        <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-5 text-nofaol-matn">
          <p className="text-sm font-semibold">🤔 Yuklanmoqda...</p>
        </div>
      )}

      {royxat !== null && royxat.length === 0 && (
        <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-5 text-nofaol-matn">
          <p className="text-sm font-semibold">
            Hali birorta ham topishmoq yechilmagan. AI-buviga o'ting va birinchi
            topishmoqni yeching!
          </p>
        </div>
      )}

      {royxat !== null && royxat.length > 0 && (
        <>
          <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                🏆
              </span>
              <div className="leading-tight">
                <div className="text-3xl font-extrabold tabular-nums">{royxat.length}</div>
                <div className="text-sm font-semibold opacity-80">topishmoq yechilgan</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {royxat.map((y) => (
              <div
                key={y.id}
                className="flex items-center justify-between rounded-2xl border border-brend/10 bg-white px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-brend">
                  <span className="text-xl" aria-hidden>
                    {y.belgi}
                  </span>
                  {y.nom}
                </span>
                <span className="text-xs font-semibold text-brend/40">
                  {ozbekchaSana(y.vaqt)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Sahifa>
  );
}
