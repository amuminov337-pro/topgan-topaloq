// F10 — "Jumboqlar xaritasi" MVP'da ishlamaydi (MASTER_PROMPT: coin/tanga
// tizimi kabi, muddatni yeydigan qo'shimcha funksiyalar keyingi versiyaga
// qoldirilgan), lekin bosilganda nima haqida ekanini tushuntiruvchi qisqa
// modal ko'rsatiladi — foydalanuvchi "bu tugma ishlamayapti" deb o'ylamasin.
//
// F13: "Topishmoq dueli" endi bu yerda emas — u haqiqatan ishlaydigan
// bo'lgani uchun app/page.tsx'da oddiy faol BolimKarta (href="/duel")
// sifatida ko'rsatiladi.
"use client";

import { useState } from "react";
import BolimKarta from "@/components/BolimKarta";

export default function KelajakKartalari() {
  const [ochiq, setOchiq] = useState(false);

  return (
    <>
      <BolimKarta
        sarlavha="Jumboqlar xaritasi"
        ikonka="🗺️"
        ohang="nofaol"
        onClick={() => setOchiq(true)}
      />

      {ochiq && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-brend/40 px-6"
          onClick={() => setOchiq(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xs rounded-2xl border border-nofaol-matn/15 bg-white p-5 text-left shadow-lg"
            onClick={(hodisa) => hodisa.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-3xl" aria-hidden>
                🗺️
              </span>
              <button
                type="button"
                onClick={() => setOchiq(false)}
                aria-label="Yopish"
                className="karta-tap flex h-7 w-7 items-center justify-center rounded-full bg-nofaol-fon text-nofaol-matn"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-base font-extrabold text-brend">
              Jumboqlar xaritasi — Tez orada
            </p>
            <p className="mt-2 text-sm font-semibold text-brend/70">
              Bu bo&apos;lim tez orada qo&apos;shiladi: dunyo mamlakatlari kesimida
              joylashgan interaktiv xarita — har bir mamlakatni bosib, o&apos;sha
              xalqning o&apos;ziga xos topishmoqlarini o&apos;rganish mumkin bo&apos;ladi
              (O&apos;zbekiston hududlari emas, balki butun dunyo bo&apos;ylab sayohat).
            </p>
          </div>
        </div>
      )}
    </>
  );
}
