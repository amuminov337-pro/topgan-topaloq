// AI-buvi rejimi.
// F4: tasodifiy topishmoq + javob tekshirish.
// F5: noto'g'ri javobdan keyin 3 bosqichli maslahat (toifa -> xususiyat ->
//     deyarli oshkora), hech qachon javobni o'z ichiga olmaydi.
// Shuningdek MASTER_PROMPT 2-bo'limidagi doimiy qoida: har bosqichda
// "javobni ko'rsat" tugmasi bor va u HECH QACHON bloklanmaydi — foydalanuvchi
// majburlanmaydi. Urinishlar tugagach faqat javob KIRITISH paneli bloklanadi.
// Madaniy izoh (F6) hali yo'q — keyingi bosqichda shu sahifaga qo'shiladi.
"use client";

import { useCallback, useEffect, useState } from "react";
import Sahifa from "@/components/Sahifa";

type OchiqTopishmoq = {
  id: string;
  matn: string;
  toifa: string;
  daraja: number;
  ikonka: string;
};

type Natija = "kutilmoqda" | "togri" | "notogri";
type MaslahatYozuvi = { daraja: 1 | 2 | 3; matn: string };

const ENG_KOP_MASLAHAT = 3;

/** Har maslahat darajasi uchun rang klasslari — to'q rangdan oltin
 * oshkoralikka qarab tobora "ochiluvchi" uch bosqich. */
const MASLAHAT_RANGI: Record<1 | 2 | 3, string> = {
  1: "border-maslahat1-matn/20 bg-maslahat1-fon text-maslahat1-matn",
  2: "border-maslahat2-matn/20 bg-maslahat2-fon text-maslahat2-matn",
  3: "border-maslahat3-matn/20 bg-maslahat3-fon text-maslahat3-matn",
};

/** Har maslahat darajasi uchun ikonka — qidirishdan (1) yechim yig'ishga (2),
 * javobga eng yaqin ("kalit topildi") holatga (3) qarab. */
const MASLAHAT_IKONKA: Record<1 | 2 | 3, string> = {
  1: "🔍",
  2: "🧩",
  3: "🔑",
};

export default function BuviSahifa() {
  const [topishmoq, setTopishmoq] = useState<OchiqTopishmoq | null>(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [kiritilganJavob, setKiritilganJavob] = useState("");
  const [natija, setNatija] = useState<Natija>("kutilmoqda");
  const [tekshirilmoqda, setTekshirilmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  const [notogriSoni, setNotogriSoni] = useState(0);
  const [maslahatlar, setMaslahatlar] = useState<MaslahatYozuvi[]>([]);
  const [maslahatYuklanmoqda, setMaslahatYuklanmoqda] = useState(false);

  const [togriJavobMatni, setTogriJavobMatni] = useState<string | null>(null);

  const [oshkorQilingan, setOshkorQilingan] = useState(false);
  const [oshkorJavob, setOshkorJavob] = useState<string | null>(null);
  const [oshkorYuklanmoqda, setOshkorYuklanmoqda] = useState(false);

  const yangiTopishmoqOl = useCallback(async (tashqariId?: string) => {
    setYuklanmoqda(true);
    setXato(null);
    setNatija("kutilmoqda");
    setKiritilganJavob("");
    setNotogriSoni(0);
    setMaslahatlar([]);
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

  async function maslahatSora(id: string, daraja: 1 | 2 | 3) {
    setMaslahatYuklanmoqda(true);
    try {
      const sorovNatijasi = await fetch("/api/buvi/maslahat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, daraja }),
      });
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const { maslahat } = (await sorovNatijasi.json()) as { maslahat: string };
      setMaslahatlar((oldingi) => [...oldingi, { daraja, matn: maslahat }]);
    } catch {
      // Maslahat kelmasa ham ilova qulamaydi — foydalanuvchi shunchaki
      // yana urinishda davom etadi.
    } finally {
      setMaslahatYuklanmoqda(false);
    }
  }

  /** Javob to'g'ri chiqqanda, tabriq paniga qo'shish uchun aniq javob
   * matnini oladi (bu — foydalanuvchi allaqachon to'g'ri topgani uchun
   * "javobni oshkor qilish" degani emas). */
  async function togriJavobniOl(id: string) {
    try {
      const sorovNatijasi = await fetch("/api/topishmoq/javob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const { javob } = (await sorovNatijasi.json()) as { javob: string };
      setTogriJavobMatni(javob);
    } catch {
      // Ko'rsatib bo'lmasa ham muhim emas — tabrik matni baribir chiqadi.
    }
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

      if (togri) {
        setNatija("togri");
        await togriJavobniOl(topishmoq.id);
        return;
      }

      setNatija("notogri");
      setKiritilganJavob("");
      const yangiNotogriSoni = notogriSoni + 1;
      setNotogriSoni(yangiNotogriSoni);
      if (yangiNotogriSoni <= ENG_KOP_MASLAHAT) {
        await maslahatSora(topishmoq.id, yangiNotogriSoni as 1 | 2 | 3);
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
    } catch {
      setXato("Javobni ko'rsatib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    } finally {
      setOshkorYuklanmoqda(false);
    }
  }

  const oynaTugadi = natija === "togri" || oshkorQilingan;
  // 3-maslahatdan keyin ham (ya'ni ENG_KOP_MASLAHAT dan bitta ko'p noto'g'ri
  // urinishdan keyin) urinish yopiladi — 3-maslahat chiqqan zahoti emas,
  // foydalanuvchiga o'sha maslahat asosida yana bir marta urinish imkoni beriladi.
  const urinishlarTugadi = notogriSoni > ENG_KOP_MASLAHAT;

  return (
    <Sahifa sarlavha="AI-buvi suhbatlari">
      {yuklanmoqda && (
        <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
          <p className="text-sm font-semibold">🤔 Buvijon topishmoq o'ylamoqda...</p>
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
              👵 Buvijon aytadi
            </p>
            <p className="mt-2 text-lg font-bold leading-snug">{topishmoq.matn}</p>
          </div>

          {natija === "notogri" && (
            <div className="rounded-2xl border border-xato-matn/15 bg-xato-fon p-4 text-xato-matn">
              <p className="text-sm font-semibold">
                ❌ Noto'g'ri javob, buvijon sizga qayta o'ylashga yordam beradi.
              </p>
            </div>
          )}

          {maslahatlar.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4 ${MASLAHAT_RANGI[m.daraja]}`}
            >
              <p className="text-xs font-bold uppercase tracking-wide opacity-70">
                {MASLAHAT_IKONKA[m.daraja]} {m.daraja}-maslahat
              </p>
              <p className="mt-1 text-sm font-semibold">{m.matn}</p>
            </div>
          ))}

          {maslahatYuklanmoqda && (
            <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
              <p className="text-sm font-semibold opacity-70">🤔 Buvijon maslahat o'ylamoqda...</p>
            </div>
          )}

          {natija === "notogri" &&
            urinishlarTugadi &&
            !maslahatYuklanmoqda &&
            !oshkorQilingan && (
              <div className="rounded-2xl border border-xato-matn/15 bg-xato-fon p-4 text-xato-matn">
                <p className="text-sm font-semibold">
                  ⏳ Urinishlar soni tugadi. Javobni ko'rish uchun pastdagi tugmani bosing yoki
                  keyingi topishmoqqa o'ting.
                </p>
              </div>
            )}

          {natija === "togri" && (
            <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
              <p className="text-sm font-bold">🎉 Barakalla! Javobingiz to'g'ri.</p>
              {togriJavobMatni && (
                <p className="mt-1 text-sm font-semibold">
                  To'g'ri javob: {togriJavobMatni} edi.
                </p>
              )}
            </div>
          )}

          {oshkorQilingan && oshkorJavob && (
            <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
              <p className="text-sm font-semibold">
                👁️ Javob: <span className="font-extrabold">{oshkorJavob}</span>
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
                placeholder={
                  urinishlarTugadi ? "Urinishlar tugadi" : "Javobingizni yozing..."
                }
                disabled={urinishlarTugadi}
                className="karta-tap rounded-2xl border border-brend/15 bg-white px-4 py-3 text-base font-semibold text-brend outline-none focus:border-brend/40 disabled:opacity-40"
                autoFocus
              />
              <button
                type="submit"
                disabled={tekshirilmoqda || urinishlarTugadi || !kiritilganJavob.trim()}
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
    </Sahifa>
  );
}
