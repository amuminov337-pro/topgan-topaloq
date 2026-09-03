// O'zing yarat rejimi (F7).
// Foydalanuvchi o'z topishmog'ini va uning javobini kiritadi, AI uch mezon
// (metafora/istiora, ixchamlik, ohang/qofiya) bo'yicha ijobiy fikr va bitta
// aniq yaxshilash taklifini beradi. AI hech qachon kamsituvchi ohangda
// gapirmaydi — buni lib/baho.ts promptida qat'iy talab qilamiz.
"use client";

import { useState } from "react";
import Sahifa from "@/components/Sahifa";

type BahoNatijasi = {
  metafora: string;
  ixchamlik: string;
  ohang: string;
  taklif: string;
  manba: "ai" | "zaxira";
};

type MaydonXatolari = { matn?: string; javob?: string };

export default function YaratSahifa() {
  const [matn, setMatn] = useState("");
  const [javob, setJavob] = useState("");
  const [maydonXatolari, setMaydonXatolari] = useState<MaydonXatolari>({});
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [natija, setNatija] = useState<BahoNatijasi | null>(null);
  const [xato, setXato] = useState<string | null>(null);

  async function bahoSora(hodisa: React.FormEvent) {
    hodisa.preventDefault();

    const matnToza = matn.trim();
    const javobToza = javob.trim();
    const yangiXatolar: MaydonXatolari = {};
    if (!matnToza) yangiXatolar.matn = "Topishmoq matnini kiriting.";
    if (!javobToza) yangiXatolar.javob = "Javobni kiriting.";
    setMaydonXatolari(yangiXatolar);
    if (Object.keys(yangiXatolar).length > 0) return;

    setYuklanmoqda(true);
    setXato(null);
    setNatija(null);
    try {
      const sorovNatijasi = await fetch("/api/baho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matn: matnToza, javob: javobToza }),
      });
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const data = (await sorovNatijasi.json()) as BahoNatijasi;
      setNatija(data);
    } catch {
      setXato("Baholab bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    } finally {
      setYuklanmoqda(false);
    }
  }

  function yanaYoz() {
    setMatn("");
    setJavob("");
    setNatija(null);
    setXato(null);
    setMaydonXatolari({});
  }

  return (
    <Sahifa sarlavha="O'zing yarat">
      <div className="rounded-2xl border border-yarat-matn/15 bg-yarat-fon p-5 text-yarat-matn">
        <p className="text-xs font-bold uppercase tracking-wide opacity-60">
          ✏️ O'z topishmog'ingizni yozing
        </p>
        <p className="mt-1 text-sm font-semibold">
          Bir narsani boshqa obraz orqali yashiring — buvijon uni o'qib, fikr bildiradi.
        </p>
      </div>

      <form onSubmit={bahoSora} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <textarea
            value={matn}
            onChange={(hodisa) => setMatn(hodisa.target.value)}
            placeholder="Topishmoq matnini shu yerga yozing..."
            rows={4}
            className="karta-tap rounded-2xl border border-brend/15 bg-white px-4 py-3 text-base font-semibold text-brend outline-none focus:border-brend/40"
          />
          {maydonXatolari.matn && (
            <p className="rounded-xl border border-xato-matn/15 bg-xato-fon px-3 py-2 text-xs font-semibold text-xato-matn">
              ⚠️ {maydonXatolari.matn}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={javob}
            onChange={(hodisa) => setJavob(hodisa.target.value)}
            placeholder="Javobi..."
            className="karta-tap rounded-2xl border border-brend/15 bg-white px-4 py-3 text-base font-semibold text-brend outline-none focus:border-brend/40"
          />
          {maydonXatolari.javob && (
            <p className="rounded-xl border border-xato-matn/15 bg-xato-fon px-3 py-2 text-xs font-semibold text-xato-matn">
              ⚠️ {maydonXatolari.javob}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={yuklanmoqda}
          className="karta-tap rounded-2xl bg-brend px-4 py-3 text-sm font-extrabold text-white shadow-sm transition disabled:opacity-40"
        >
          {yuklanmoqda ? "Buvijon o'qimoqda..." : "Fikr so'rash"}
        </button>
      </form>

      {xato && (
        <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
          <p className="text-sm font-semibold">⚠️ {xato}</p>
        </div>
      )}

      {natija && (
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
            <p className="text-sm font-bold">🎉 Buvijon topishmog'ingizni o'qidi!</p>
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-sm">
                <span className="font-bold">🎭 Metafora:</span> {natija.metafora}
              </p>
              <p className="text-sm">
                <span className="font-bold">✂️ Ixchamlik:</span> {natija.ixchamlik}
              </p>
              <p className="text-sm">
                <span className="font-bold">🎵 Ohang:</span> {natija.ohang}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-yarat-matn/15 bg-yarat-fon p-4 text-yarat-matn">
            <p className="text-xs font-bold uppercase tracking-wide opacity-60">
              💡 Yaxshilash taklifi
            </p>
            <p className="mt-1 text-sm font-semibold">{natija.taklif}</p>
          </div>

          <button
            type="button"
            onClick={yanaYoz}
            className="karta-tap rounded-2xl border border-brend/10 bg-white px-4 py-3 text-sm font-bold text-brend/70"
          >
            Yana bir topishmoq yozish →
          </button>
        </div>
      )}
    </Sahifa>
  );
}
