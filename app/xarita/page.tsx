// F14 (qayta ishlangan versiya) — "Hikmat yo'li": topishmoq yechish orqali
// bosib o'tiladigan tarixiy-adabiy sayohat. Dunyo xaritasi va suvenirlar
// (eski versiya) butunlay bekor qilindi — foydalanuvchi buni yoqtirmadi.
//
// Yangi mexanika: topishmoqlar xuddi shu 170 ta korpusdan (mavjud
// /api/topishmoq/* endpoint'lari, xuddi AI-buvi rejimidagi kabi) keladi —
// yangi kontent manbai yo'q, shuning uchun aniqlik xavfi ham yo'q. Har 3 ta
// CHINDAN (oshkor qilinmagan) to'g'ri topilgan javobda "sayohatchi" belgisi
// xaritada keyingi tarixiy shaharga siljiydi. Xarita alohida oyna (modal)
// sifatida ochiladi: yangi bekatga yetganda avtomatik, yoki istalgan vaqtda
// "Xaritani ko'rish" tugmasi bilan qo'lda. Noto'g'ri javobda faqat qayta
// urinish beriladi — bosqichma-bosqich maslahat yoki cheklov yo'q (bu ataylab
// AI-buvi rejimidan farqli, sodda va bosqichlarga e'tiborni saqlash uchun).

"use client";

import { useCallback, useEffect, useState } from "react";
import Sahifa from "@/components/Sahifa";
import SayohatXaritasi from "@/components/SayohatXaritasi";
import { ikonkaEmoji } from "@/lib/ikonka";
import { MANZILLAR } from "@/lib/manzillar";
import { natijaniSaqla } from "@/lib/saqlash";
import {
  KERAKLI_SERIYA_SONI,
  sayohatHolatiniOl,
  sayohatTugaganmi,
  togriJavobHisoblansin,
  type SayohatHolati,
} from "@/lib/sayohat";

type OchiqTopishmoq = {
  id: string;
  matn: string;
  toifa: string;
  daraja: number;
  ikonka: string;
};

type Natija = "kutilmoqda" | "togri" | "notogri";

const BOSHLANGICH_HOLAT: SayohatHolati = { bosqich: 0, seriya: 0 };

export default function XaritaSahifa() {
  const [topishmoq, setTopishmoq] = useState<OchiqTopishmoq | null>(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [kiritilganJavob, setKiritilganJavob] = useState("");
  const [natija, setNatija] = useState<Natija>("kutilmoqda");
  const [tekshirilmoqda, setTekshirilmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  const [togriJavobMatni, setTogriJavobMatni] = useState<string | null>(null);
  const [oshkorQilingan, setOshkorQilingan] = useState(false);
  const [oshkorJavob, setOshkorJavob] = useState<string | null>(null);
  const [oshkorYuklanmoqda, setOshkorYuklanmoqda] = useState(false);

  const [sayohat, setSayohat] = useState<SayohatHolati>(BOSHLANGICH_HOLAT);
  const [xaritaOchiq, setXaritaOchiq] = useState(false);
  // Modal ichida qaysi bosqich ko'rsatilishi kerak (yangi bekatga yetganda
  // avvalgi, hali ochilmagan holat emas, aynan yangi bosqich ko'rinsin).
  const [xaritaBosqichi, setXaritaBosqichi] = useState(0);
  const [yangiBekatMi, setYangiBekatMi] = useState(false);

  useEffect(() => {
    const holat = sayohatHolatiniOl();
    setSayohat(holat);
    setXaritaBosqichi(holat.bosqich);
  }, []);

  const yangiTopishmoqOl = useCallback(async (tashqariId?: string) => {
    setYuklanmoqda(true);
    setXato(null);
    setNatija("kutilmoqda");
    setKiritilganJavob("");
    setTogriJavobMatni(null);
    setOshkorQilingan(false);
    setOshkorJavob(null);
    try {
      const url = tashqariId
        ? `/api/topishmoq/tasodifiy?tashqari=${encodeURIComponent(tashqariId)}`
        : "/api/topishmoq/tasodifiy";
      const javob = await fetch(url);
      if (!javob.ok) throw new Error("server xatosi");
      const data: OchiqTopishmoq = await javob.json();
      setTopishmoq(data);
    } catch {
      setXato(
        "Topishmoqni yuklab bo'lmadi. Internet aloqasini tekshirib, sahifani yangilang."
      );
    } finally {
      setYuklanmoqda(false);
    }
  }, []);

  useEffect(() => {
    yangiTopishmoqOl();
  }, [yangiTopishmoqOl]);

  function xaritaniOchish(joriyBosqich: number, yangiMi: boolean) {
    setXaritaBosqichi(joriyBosqich);
    setYangiBekatMi(yangiMi);
    setXaritaOchiq(true);
  }

  async function javobniYubor(hodisa: React.FormEvent) {
    hodisa.preventDefault();
    if (!topishmoq || !kiritilganJavob.trim() || tekshirilmoqda) return;

    setTekshirilmoqda(true);
    setXato(null);
    try {
      const sorovNatijasi = await fetch("/api/javob-tekshir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: topishmoq.id, javob: kiritilganJavob }),
      });
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const { togri } = (await sorovNatijasi.json()) as { togri: boolean };

      if (!togri) {
        setNatija("notogri");
        setKiritilganJavob("");
        return;
      }

      setNatija("togri");

      try {
        const javobSorovi = await fetch("/api/topishmoq/javob", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: topishmoq.id }),
        });
        if (javobSorovi.ok) {
          const { javob: aniqJavob } = (await javobSorovi.json()) as { javob: string };
          setTogriJavobMatni(aniqJavob);
          natijaniSaqla({ id: topishmoq.id, belgi: ikonkaEmoji(topishmoq.ikonka), nom: aniqJavob });
        }
      } catch {
        // Aniq javob matnini ko'rsatib bo'lmasa ham, sayohat progressi
        // baribir hisoblanadi — bu faqat tabrik matni uchun bezak.
      }

      const { holat, yangiBekatgaYetdi } = togriJavobHisoblansin();
      setSayohat(holat);
      if (yangiBekatgaYetdi) {
        xaritaniOchish(holat.bosqich, true);
      }
    } catch {
      setXato("Javobni tekshirib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    } finally {
      setTekshirilmoqda(false);
    }
  }

  async function javobniKorsat() {
    if (!topishmoq || oshkorYuklanmoqda) return;
    setOshkorYuklanmoqda(true);
    try {
      const sorovNatijasi = await fetch("/api/topishmoq/javob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: topishmoq.id }),
      });
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const { javob } = (await sorovNatijasi.json()) as { javob: string };
      setOshkorJavob(javob);
      setOshkorQilingan(true);
      // MUHIM: bu yerda togriJavobHisoblansin() ATAYLAB chaqirilmaydi —
      // javobni o'zi so'rab ko'rgan urinish sayohat seriyasiga qo'shilmaydi.
    } catch {
      setXato("Javobni ko'rsatib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    } finally {
      setOshkorYuklanmoqda(false);
    }
  }

  const oynaTugadi = natija === "togri" || oshkorQilingan;
  const tugaganmi = sayohatTugaganmi(sayohat);
  const joriyManzil = MANZILLAR[sayohat.bosqich];
  const modalManzil = MANZILLAR[xaritaBosqichi];

  return (
    <Sahifa sarlavha="Hikmat yo'li">
      <div className="flex flex-col gap-3">
        {/* Sayohat progressi — doim ko'rinadi, xarita esa alohida oynada. */}
        <div className="rounded-2xl border border-oltin/25 bg-[#fbf3e0] p-4 text-brend">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide opacity-60">
                {tugaganmi ? "Sayohat yakunlandi" : `${sayohat.bosqich + 1}/${MANZILLAR.length}-bekat`}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-base font-extrabold">
                <span className="text-xl">{joriyManzil.ikonka}</span>
                {joriyManzil.nomi}
              </p>
            </div>
            <button
              type="button"
              onClick={() => xaritaniOchish(sayohat.bosqich, false)}
              className="karta-tap shrink-0 rounded-2xl border border-oltin/40 bg-white px-3 py-2 text-xs font-bold text-brend shadow-sm"
            >
              🗺️ Xaritani ko'rish
            </button>
          </div>

          {!tugaganmi && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-bold opacity-60">Seriya:</span>
              <div className="flex gap-1.5">
                {Array.from({ length: KERAKLI_SERIYA_SONI }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      "h-2.5 w-2.5 rounded-full transition " +
                      (i < sayohat.seriya ? "bg-oltin" : "bg-oltin/20")
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-semibold opacity-60">
                ({sayohat.seriya}/{KERAKLI_SERIYA_SONI} to'g'ri javob keyingi bekatgacha)
              </span>
            </div>
          )}
        </div>

        {yuklanmoqda && (
          <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
            <p className="text-sm font-semibold">🐫 Karvon yo'lda... topishmoq yuklanmoqda</p>
          </div>
        )}

        {!yuklanmoqda && xato && !topishmoq && (
          <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-5 text-nofaol-matn">
            <p className="text-sm font-semibold">⚠️ {xato}</p>
          </div>
        )}

        {!yuklanmoqda && topishmoq && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
              <p className="text-xs font-bold uppercase tracking-wide opacity-60">
                🧩 Topishmoq
              </p>
              <p className="mt-2 text-lg font-bold leading-snug">{topishmoq.matn}</p>
            </div>

            {natija === "notogri" && (
              <div className="rounded-2xl border border-xato-matn/15 bg-xato-fon p-4 text-xato-matn">
                <p className="text-sm font-semibold">
                  ❌ Noto'g'ri javob. Xafa bo'lmang, yana urinib ko'ring!
                </p>
              </div>
            )}

            {natija === "togri" && (
              <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
                <p className="text-sm font-bold">🎉 Barakalla! Javobingiz to'g'ri.</p>
                {togriJavobMatni && (
                  <p className="mt-2 flex items-center gap-2 text-base font-extrabold">
                    <span className="text-2xl">{ikonkaEmoji(topishmoq.ikonka)}</span>
                    {togriJavobMatni} edi.
                  </p>
                )}
              </div>
            )}

            {oshkorQilingan && oshkorJavob && (
              <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
                <p className="text-sm font-semibold">
                  👁️ Javob:{" "}
                  <span className="font-extrabold">
                    {ikonkaEmoji(topishmoq.ikonka)} {oshkorJavob}
                  </span>
                </p>
                <p className="mt-1 text-xs font-semibold opacity-70">
                  (Bu urinish sayohat seriyasiga qo'shilmaydi.)
                </p>
              </div>
            )}

            {xato && (
              <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
                <p className="text-sm font-semibold">⚠️ {xato}</p>
              </div>
            )}

            {!oynaTugadi && (
              <form onSubmit={javobniYubor} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={kiritilganJavob}
                  onChange={(hodisa) => setKiritilganJavob(hodisa.target.value)}
                  placeholder="Javobingizni yozing..."
                  className="karta-tap rounded-2xl border border-brend/15 bg-white px-4 py-3 text-base font-semibold text-brend outline-none focus:border-brend/40"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={tekshirilmoqda || !kiritilganJavob.trim()}
                  className="karta-tap rounded-2xl bg-brend px-4 py-3 text-sm font-extrabold text-white shadow-sm transition disabled:opacity-40"
                >
                  {tekshirilmoqda ? "Tekshirilmoqda..." : "Tekshirish"}
                </button>
                <button
                  type="button"
                  onClick={javobniKorsat}
                  disabled={oshkorYuklanmoqda}
                  className="karta-tap rounded-2xl border border-natija-matn/20 bg-natija-fon px-4 py-2.5 text-xs font-bold text-natija-matn disabled:opacity-40"
                >
                  👁️ {oshkorYuklanmoqda ? "Ko'rsatilmoqda..." : "Javobni ko'rsat"}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => yangiTopishmoqOl(topishmoq.id)}
              className="karta-tap rounded-2xl border border-brend/10 bg-white px-4 py-3 text-sm font-bold text-brend/70"
            >
              {oynaTugadi ? "Keyingi topishmoq →" : "Boshqasini so'rash →"}
            </button>
          </div>
        )}
      </div>

      {xaritaOchiq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brend/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setXaritaOchiq(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-sm flex-col gap-3 overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:max-w-md sm:p-5"
            onClick={(hodisa) => hodisa.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-brend">🗺️ Hikmat yo'li</h2>
              <button
                type="button"
                onClick={() => setXaritaOchiq(false)}
                aria-label="Yopish"
                className="karta-tap flex h-8 w-8 items-center justify-center rounded-full border border-brend/10 bg-white text-brend"
              >
                ✕
              </button>
            </div>

            {yangiBekatMi && (
              <div className="rounded-2xl border border-oltin/30 bg-[#fbf3e0] px-3 py-2 text-center text-sm font-extrabold text-[#a9761f]">
                ✨ Yangi bekatga yetdingiz!
              </div>
            )}

            <SayohatXaritasi joriyBosqich={xaritaBosqichi} yangiBekatMi={yangiBekatMi} />

            <div className="rounded-2xl border border-brend/10 bg-sahifa p-3">
              <p className="flex items-center gap-1.5 text-sm font-extrabold text-brend">
                <span className="text-lg">{modalManzil.ikonka}</span>
                {modalManzil.nomi}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-brend/80">{modalManzil.tavsif}</p>
            </div>

            {tugaganmi && xaritaBosqichi === sayohat.bosqich && (
              <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-3 text-center text-sm font-bold text-natija-matn">
                🏆 Butun sayohatni bosib o'tdingiz! Barakalla!
              </div>
            )}

            <button
              type="button"
              onClick={() => setXaritaOchiq(false)}
              className="karta-tap rounded-2xl bg-brend px-4 py-3 text-sm font-extrabold text-white shadow-sm"
            >
              Davom etish →
            </button>
          </div>
        </div>
      )}
    </Sahifa>
  );
}
