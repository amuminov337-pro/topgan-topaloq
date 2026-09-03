// AI-buvi rejimi — F4: tasodifiy topishmoq ko'rsatiladi, foydalanuvchi javob
// yozadi, /api/javob-tekshir orqali moslashuvchan taqqoslash bilan
// tekshiriladi. Bosqichma-bosqich maslahat (F5) va madaniy izoh (F6) hali
// yo'q — ular keyingi bosqichlarda shu sahifaga qo'shiladi.
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

export default function BuviSahifa() {
  const [topishmoq, setTopishmoq] = useState<OchiqTopishmoq | null>(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [kiritilganJavob, setKiritilganJavob] = useState("");
  const [natija, setNatija] = useState<Natija>("kutilmoqda");
  const [tekshirilmoqda, setTekshirilmoqda] = useState(false);
  const [xato, setXato] = useState<string | null>(null);

  const yangiTopishmoqOl = useCallback(async (tashqariId?: string) => {
    setYuklanmoqda(true);
    setXato(null);
    setNatija("kutilmoqda");
    setKiritilganJavob("");
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
      setNatija(togri ? "togri" : "notogri");
    } catch {
      setXato("Javobni tekshirib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    } finally {
      setTekshirilmoqda(false);
    }
  }

  return (
    <Sahifa sarlavha="AI-buvi suhbatlari">
      {yuklanmoqda && (
        <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
          <p className="text-sm font-semibold">Buvijon topishmoq o'ylamoqda...</p>
        </div>
      )}

      {!yuklanmoqda && xato && !topishmoq && (
        <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-5 text-nofaol-matn">
          <p className="text-sm font-semibold">{xato}</p>
        </div>
      )}

      {!yuklanmoqda && topishmoq && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
            <p className="text-xs font-bold uppercase tracking-wide opacity-60">
              Buvijon aytadi
            </p>
            <p className="mt-2 text-lg font-bold leading-snug">
              {topishmoq.matn}
            </p>
          </div>

          {natija === "togri" && (
            <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
              <p className="text-sm font-bold">
                Barakalla! Javobingiz to'g'ri. 🎉
              </p>
            </div>
          )}

          {natija === "notogri" && (
            <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
              <p className="text-sm font-semibold">
                Hali unday emas, yana urinib ko'ring.
              </p>
            </div>
          )}

          {xato && (
            <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
              <p className="text-sm font-semibold">{xato}</p>
            </div>
          )}

          {natija !== "togri" && (
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
            </form>
          )}

          <button
            type="button"
            onClick={() => yangiTopishmoqOl(topishmoq.id)}
            className="karta-tap rounded-2xl border border-brend/10 bg-white px-4 py-3 text-sm font-bold text-brend/70"
          >
            {natija === "togri" ? "Keyingi topishmoq →" : "Boshqasini so'rash →"}
          </button>
        </div>
      )}
    </Sahifa>
  );
}
