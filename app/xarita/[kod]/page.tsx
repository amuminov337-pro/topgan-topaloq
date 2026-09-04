// F14 — Bitta davlatning topishmoq o'yini. 4 bosqichli maslahat tizimi
// (foydalanuvchi talabiga ko'ra): 1-urinish oddiy; xato bo'lsa 2-urinishdan
// oldin javob harflari sonicha bo'sh katakcha ko'rsatiladi; yana xato bo'lsa
// 3-urinishdan oldin birinchi harf ochiladi; yana xato bo'lsa 4-urinishdan
// oldin oxirgi harf ham ochiladi; 4-urinish ham xato bo'lsa to'liq javob
// avtomatik ko'rsatiladi. Bundan tashqari — loyihaning doimiy qoidasiga
// ko'ra — "👁️ Javobni ko'rsat" tugmasi har doim, urinish sonidan qat'iy
// nazar, mavjud va hech qachon bloklanmaydi.
//
// Suvenir: FAQAT chindan (oshkor qilinmasdan) topilgan javobda, va FAQAT shu
// davlatning ILK marta yechilgan topishmog'ida beriladi (lib/sovinir.ts).
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sahifa from "@/components/Sahifa";
import { bayroqEmoji } from "@/lib/bayroq";
import { sovinirniOch } from "@/lib/sovinir";

type OchiqDavlat = {
  kod: string;
  nomi: string;
  qita: string;
  sovinir: { emoji: string; nomi: string };
  soni: number;
};

type OchiqTopishmoq = { id: string; matn: string };
type Natija = "kutilmoqda" | "togri" | "notogri";

const ENG_KOP_URINISH = 4;

export default function DavlatOyini() {
  const { kod } = useParams<{ kod: string }>();

  const [davlat, setDavlat] = useState<OchiqDavlat | null>(null);
  const [davlatXato, setDavlatXato] = useState<string | null>(null);

  const [topishmoq, setTopishmoq] = useState<OchiqTopishmoq | null>(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [kiritilganJavob, setKiritilganJavob] = useState("");
  const [natija, setNatija] = useState<Natija>("kutilmoqda");
  const [tekshirilmoqda, setTekshirilmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  const [urinishSoni, setUrinishSoni] = useState(0);
  const [maska, setMaska] = useState<string | null>(null);
  const [maskaYuklanmoqda, setMaskaYuklanmoqda] = useState(false);

  const [toliqJavob, setToliqJavob] = useState<string | null>(null);
  const [oshkorQilingan, setOshkorQilingan] = useState(false);
  const [oshkorYuklanmoqda, setOshkorYuklanmoqda] = useState(false);

  const [yangiSuvenirMi, setYangiSuvenirMi] = useState(false);

  useEffect(() => {
    if (!kod) return;
    fetch(`/api/dunyo/davlat?kod=${encodeURIComponent(kod)}`)
      .then((r) => {
        if (!r.ok) throw new Error("server xatosi");
        return r.json();
      })
      .then((data: OchiqDavlat) => setDavlat(data))
      .catch(() => setDavlatXato("Davlat ma'lumotini yuklab bo'lmadi."));
  }, [kod]);

  const yangiTopishmoqOl = useCallback(
    async (tashqariId?: string) => {
      if (!kod) return;
      setYuklanmoqda(true);
      setXato(null);
      setNatija("kutilmoqda");
      setKiritilganJavob("");
      setUrinishSoni(0);
      setMaska(null);
      setToliqJavob(null);
      setOshkorQilingan(false);
      setYangiSuvenirMi(false);
      try {
        const url = tashqariId
          ? `/api/dunyo/tasodifiy?kod=${encodeURIComponent(kod)}&tashqari=${encodeURIComponent(tashqariId)}`
          : `/api/dunyo/tasodifiy?kod=${encodeURIComponent(kod)}`;
        const sorovNatijasi = await fetch(url);
        if (!sorovNatijasi.ok) throw new Error("server xatosi");
        const data: OchiqTopishmoq = await sorovNatijasi.json();
        setTopishmoq(data);
      } catch {
        setXato("Topishmoqni yuklab bo'lmadi. Internet aloqasini tekshirib, sahifani yangilang.");
      } finally {
        setYuklanmoqda(false);
      }
    },
    [kod]
  );

  useEffect(() => {
    yangiTopishmoqOl();
  }, [yangiTopishmoqOl]);

  async function toliqJavobniOch() {
    if (!topishmoq) return null;
    const sorovNatijasi = await fetch("/api/dunyo/javob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: topishmoq.id }),
    });
    if (!sorovNatijasi.ok) throw new Error("server xatosi");
    return (await sorovNatijasi.json()) as { javob: string; davlatKodi: string };
  }

  async function javobniYubor(hodisa: React.FormEvent) {
    hodisa.preventDefault();
    if (!topishmoq || !kiritilganJavob.trim() || tekshirilmoqda) return;

    setTekshirilmoqda(true);
    setXato(null);
    try {
      const sorovNatijasi = await fetch("/api/dunyo/javob-tekshir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: topishmoq.id, javob: kiritilganJavob }),
      });
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const { togri } = (await sorovNatijasi.json()) as { togri: boolean };

      if (togri) {
        setNatija("togri");
        if (davlat) {
          setYangiSuvenirMi(sovinirniOch(davlat.kod));
        }
        return;
      }

      setNatija("notogri");
      setKiritilganJavob("");
      const yangiUrinish = urinishSoni + 1;
      setUrinishSoni(yangiUrinish);

      if (yangiUrinish < ENG_KOP_URINISH) {
        setMaskaYuklanmoqda(true);
        try {
          const maslahatNatijasi = await fetch("/api/dunyo/maslahat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: topishmoq.id, daraja: yangiUrinish }),
          });
          if (maslahatNatijasi.ok) {
            const { maska: yangiMaska } = (await maslahatNatijasi.json()) as { maska: string };
            setMaska(yangiMaska);
          }
        } catch {
          // Maslahat kelmasa ham foydalanuvchi yana urinishda davom etadi.
        } finally {
          setMaskaYuklanmoqda(false);
        }
      } else {
        // 4-urinish ham xato — to'liq javob avtomatik ochiladi.
        try {
          const natijasi = await toliqJavobniOch();
          if (natijasi) setToliqJavob(natijasi.javob);
        } catch {
          setXato("Javobni ko'rsatib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
        }
        setOshkorQilingan(true);
      }
    } catch {
      setXato("Javobni tekshirib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    } finally {
      setTekshirilmoqda(false);
    }
  }

  async function qolBilanKorsat() {
    if (!topishmoq || oshkorYuklanmoqda) return;
    setOshkorYuklanmoqda(true);
    setXato(null);
    try {
      const natijasi = await toliqJavobniOch();
      if (natijasi) {
        setToliqJavob(natijasi.javob);
        setOshkorQilingan(true);
      }
    } catch {
      setXato("Javobni ko'rsatib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    } finally {
      setOshkorYuklanmoqda(false);
    }
  }

  const oynaTugadi = natija === "togri" || oshkorQilingan;

  return (
    <Sahifa sarlavha={davlat ? `${bayroqEmoji(davlat.kod)} ${davlat.nomi}` : "Jumboqlar xaritasi"}>
      {davlatXato && (
        <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
          <p className="text-sm font-semibold">⚠️ {davlatXato}</p>
        </div>
      )}

      {yuklanmoqda && (
        <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
          <p className="text-sm font-semibold">🤔 Topishmoq tayyorlanmoqda...</p>
        </div>
      )}

      {!yuklanmoqda && xato && !topishmoq && (
        <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
          <p className="text-sm font-semibold">⚠️ {xato}</p>
        </div>
      )}

      {!yuklanmoqda && topishmoq && (
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
            <p className="text-xs font-bold uppercase tracking-wide opacity-60">🌍 Topishmoq</p>
            <p className="mt-2 text-lg font-bold leading-snug">{topishmoq.matn}</p>
          </div>

          {natija === "notogri" && !oshkorQilingan && (
            <div className="rounded-2xl border border-xato-matn/15 bg-xato-fon p-4 text-xato-matn">
              <p className="text-sm font-semibold">❌ Noto&apos;g&apos;ri javob, qaytadan urinib ko&apos;ring.</p>
            </div>
          )}

          {maskaYuklanmoqda && (
            <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
              <p className="text-sm font-semibold opacity-70">🤔 Maslahat tayyorlanmoqda...</p>
            </div>
          )}

          {maska && !oshkorQilingan && (
            <div className="flex flex-wrap gap-1.5 rounded-2xl border border-maslahat1-matn/20 bg-maslahat1-fon p-4">
              {[...maska].map((harf, i) =>
                harf === " " ? (
                  <span key={i} className="w-3" />
                ) : (
                  <span
                    key={i}
                    className="flex h-9 w-8 items-center justify-center rounded-lg bg-white text-lg font-extrabold uppercase text-maslahat1-matn"
                  >
                    {harf === "_" ? "" : harf}
                  </span>
                )
              )}
            </div>
          )}

          {natija === "togri" && (
            <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
              <p className="text-sm font-bold">🎉 Barakalla! Javobingiz to&apos;g&apos;ri.</p>
              {davlat && yangiSuvenirMi && (
                <p className="mt-2 flex items-center gap-2 text-base font-extrabold">
                  <span className="text-2xl">{davlat.sovinir.emoji}</span>
                  Yangi suvenir: {davlat.sovinir.nomi}! Sayohat albomingizga qo&apos;shildi.
                </p>
              )}
              {davlat && !yangiSuvenirMi && (
                <p className="mt-2 text-sm font-semibold opacity-80">
                  {davlat.sovinir.emoji} Bu davlatning suveniri allaqachon albomingizda.
                </p>
              )}
            </div>
          )}

          {oshkorQilingan && toliqJavob && (
            <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
              <p className="text-sm font-semibold">
                👁️ Javob: <span className="font-extrabold">{toliqJavob}</span>
              </p>
              <p className="mt-1 text-xs font-semibold opacity-70">
                Bu safar suvenir berilmaydi — suvenirlar faqat o&apos;zingiz topgan javoblar uchun.
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
                onClick={qolBilanKorsat}
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
    </Sahifa>
  );
}
