// F10 — "Jumboqlar xaritasi" va "Topishmoq dueli" kartalari MVP'da
// ishlamaydi (MASTER_PROMPT: coin/tanga tizimi kabi, muddatni yeydigan
// qo'shimcha funksiyalar keyingi versiyaga qoldirilgan), lekin bosilganda
// nima haqida ekanini tushuntiruvchi qisqa modal ko'rsatiladi — foydalanuvchi
// "bu tugma ishlamayapti" deb o'ylamasin.
"use client";

import { useState } from "react";
import BolimKarta from "@/components/BolimKarta";

type KelajakKaliti = "xarita" | "duel";

const IZOH: Record<KelajakKaliti, { sarlavha: string; ikonka: string; matn: string }> = {
  xarita: {
    sarlavha: "Jumboqlar xaritasi",
    ikonka: "🗺️",
    matn:
      "Bu bo'lim tez orada qo'shiladi: dunyo mamlakatlari kesimida joylashgan interaktiv xarita — har bir mamlakatni bosib, o'sha xalqning o'ziga xos topishmoqlarini o'rganish mumkin bo'ladi (O'zbekiston hududlari emas, balki butun dunyo bo'ylab sayohat).",
  },
  duel: {
    sarlavha: "Topishmoq dueli",
    ikonka: "⚔️",
    matn:
      "Bu bo'lim tez orada qo'shiladi: foydalanuvchi AI bilan navbatma-navbat topishmoq aytishib musobaqalashadi — kim tezroq va ko'proq to'g'ri topsa, o'sha g'olib chiqadi.",
  },
};

export default function KelajakKartalari() {
  const [ochiq, setOchiq] = useState<KelajakKaliti | null>(null);

  return (
    <>
      <BolimKarta
        sarlavha="Jumboqlar xaritasi"
        ikonka="🗺️"
        ohang="nofaol"
        onClick={() => setOchiq("xarita")}
      />
      <BolimKarta
        sarlavha="Topishmoq dueli"
        ikonka="⚔️"
        ohang="nofaol"
        onClick={() => setOchiq("duel")}
      />

      {ochiq && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-brend/40 px-6"
          onClick={() => setOchiq(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xs rounded-2xl border border-nofaol-matn/15 bg-white p-5 text-left shadow-lg"
            onClick={(hodisa) => hodisa.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-3xl" aria-hidden>
                {IZOH[ochiq].ikonka}
              </span>
              <button
                type="button"
                onClick={() => setOchiq(null)}
                aria-label="Yopish"
                className="karta-tap flex h-7 w-7 items-center justify-center rounded-full bg-nofaol-fon text-nofaol-matn"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-base font-extrabold text-brend">
              {IZOH[ochiq].sarlavha} — Tez orada
            </p>
            <p className="mt-2 text-sm font-semibold text-brend/70">{IZOH[ochiq].matn}</p>
          </div>
        </div>
      )}
    </>
  );
}
