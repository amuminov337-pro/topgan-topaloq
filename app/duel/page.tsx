// F13 — Topishmoq dueli (MVP dan tashqari, qo'shimcha funksiya, foydalanuvchi
// aniq talabiga ko'ra qo'shilgan). 6 bosqichli, ball asosidagi duel:
// navbat "AI savol beradi" va "Foydalanuvchi savol beradi" tarzida almashinadi
// (3 martadan). Oxirida ko'proq ball to'plagan g'olib bo'ladi.
//
// AI navbatida: savol korpusdan (`data/topishmoqlar.json`) olinadi, javob
// mavjud "javob-tekshir" mantig'i bilan tekshiriladi — xuddi AI-buvi rejimidagi
// kabi.
//
// Foydalanuvchi navbatida: foydalanuvchi ISTALGAN topishmoqni yozadi (korpusda
// bo'lishi shart emas). Model bu topishmoqqa korpusdan emas, o'zining umumiy
// bilimidan foydalanib taxmin qiladi (lib/duel.ts). Bu topishmoqning to'g'ri
// javobi ilovada saqlanmagani uchun (foydalanuvchi o'zi to'qigan yoki
// boshqa manbadan olgan bo'lishi mumkin), taxmin to'g'ri yoki noto'g'riligini
// FOYDALANUVCHINING O'ZI hal qiladi — u haqiqiy javobni bilgan yagona taraf.
//
// Eslatma: duel natijalari hozircha localStorage'dagi umumiy "Natijalar"
// paneliga qo'shilmaydi — u yerdagi sxema (bitta topishmoq = bitta yozuv)
// duel g'alaba/mag'lubiyat tushunchasiga to'g'ri kelmaydi, shuning uchun
// duel holati faqat shu sahifada, sahifa yangilanguncha saqlanadi.
"use client";

import { useCallback, useEffect, useState } from "react";
import Sahifa from "@/components/Sahifa";
import { ikonkaEmoji } from "@/lib/ikonka";

type OchiqTopishmoq = {
  id: string;
  matn: string;
  toifa: string;
  daraja: number;
  ikonka: string;
};

type AiHolat = "yuklanmoqda" | "savol" | "togri" | "notogri" | "xato";
type FoydalanuvchiHolat = "kiritish" | "yuborilmoqda" | "hakamlik" | "yakunlandi";

/** 6 bosqich — 3 marta AI, 3 marta foydalanuvchi savol beradi, navbat bilan. */
const NAVBATLAR: ("ai" | "foydalanuvchi")[] = [
  "ai",
  "foydalanuvchi",
  "ai",
  "foydalanuvchi",
  "ai",
  "foydalanuvchi",
];

const BOSHLANGICH_BALL = { ai: 0, foydalanuvchi: 0 };

export default function DuelSahifa() {
  const [turIndex, setTurIndex] = useState(0);
  const [ball, setBall] = useState(BOSHLANGICH_BALL);
  const [oldingiId, setOldingiId] = useState<string | null>(null);

  // --- AI navbati holati ---
  const [aiTopishmoq, setAiTopishmoq] = useState<OchiqTopishmoq | null>(null);
  const [aiHolat, setAiHolat] = useState<AiHolat>("yuklanmoqda");
  const [aiJavobKiritilgan, setAiJavobKiritilgan] = useState("");
  const [aiTekshirilmoqda, setAiTekshirilmoqda] = useState(false);
  const [aiTogriJavobMatni, setAiTogriJavobMatni] = useState<string | null>(null);
  const [aiXato, setAiXato] = useState<string | null>(null);

  // --- Foydalanuvchi navbati holati ---
  const [fMatn, setFMatn] = useState("");
  const [fAslJavob, setFAslJavob] = useState("");
  const [fHolat, setFHolat] = useState<FoydalanuvchiHolat>("kiritish");
  const [fModelJavob, setFModelJavob] = useState<string | null>(null);
  const [fModelXabar, setFModelXabar] = useState<string | null>(null);
  const [fXato, setFXato] = useState<string | null>(null);

  const navbat = NAVBATLAR[turIndex];
  const duelTugadi = turIndex >= NAVBATLAR.length;

  const aiSavolniYukla = useCallback(async (tashqariId: string | null) => {
    setAiHolat("yuklanmoqda");
    setAiJavobKiritilgan("");
    setAiTogriJavobMatni(null);
    setAiXato(null);
    try {
      const url = tashqariId
        ? `/api/topishmoq/tasodifiy?tashqari=${encodeURIComponent(tashqariId)}`
        : "/api/topishmoq/tasodifiy";
      const sorovNatijasi = await fetch(url);
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const data: OchiqTopishmoq = await sorovNatijasi.json();
      setAiTopishmoq(data);
      setAiHolat("savol");
    } catch {
      setAiHolat("xato");
      setAiXato(
        "Topishmoqni yuklab bo'lmadi. Internet aloqasini tekshirib, qayta urinib ko'ring."
      );
    }
  }, []);

  // Har safar navbat "ai" ga o'tganda yangi savol yuklanadi.
  useEffect(() => {
    if (!duelTugadi && navbat === "ai") {
      aiSavolniYukla(oldingiId);
    }
    // turIndex o'zgarganda ishga tushishi kifoya — oldingiId shu paytda
    // allaqachon to'g'ri qiymatga ega bo'ladi (keyingiBosqichgaOtish uni
    // navbatni o'zgartirishdan OLDIN yangilaydi).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turIndex]);

  async function aiJavobniYubor(hodisa: React.FormEvent) {
    hodisa.preventDefault();
    if (!aiTopishmoq || !aiJavobKiritilgan.trim() || aiTekshirilmoqda) return;

    setAiTekshirilmoqda(true);
    setAiXato(null);
    try {
      const sorovNatijasi = await fetch("/api/javob-tekshir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: aiTopishmoq.id, javob: aiJavobKiritilgan }),
      });
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const { togri } = (await sorovNatijasi.json()) as { togri: boolean };

      if (togri) {
        setAiHolat("togri");
        setBall((oldingi) => ({ ...oldingi, foydalanuvchi: oldingi.foydalanuvchi + 1 }));
        return;
      }

      // Noto'g'ri bo'lsa duel tezligini saqlash uchun darhol javobni ochamiz
      // (AI-buvi rejimidagi kabi 3 bosqichli maslahat bermaymiz — bu duel,
      // musobaqa tezligi muhim).
      const oshkorNatijasi = await fetch("/api/topishmoq/javob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: aiTopishmoq.id }),
      });
      if (oshkorNatijasi.ok) {
        const { javob } = (await oshkorNatijasi.json()) as { javob: string };
        setAiTogriJavobMatni(javob);
      }
      setAiHolat("notogri");
      setBall((oldingi) => ({ ...oldingi, ai: oldingi.ai + 1 }));
    } catch {
      setAiXato("Javobni tekshirib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    } finally {
      setAiTekshirilmoqda(false);
    }
  }

  async function fSavolniYubor(hodisa: React.FormEvent) {
    hodisa.preventDefault();
    if (!fMatn.trim() || fHolat === "yuborilmoqda") return;

    setFHolat("yuborilmoqda");
    setFXato(null);
    try {
      const sorovNatijasi = await fetch("/api/duel/model-taxmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matn: fMatn.trim() }),
      });
      if (!sorovNatijasi.ok) throw new Error("server xatosi");
      const natija = (await sorovNatijasi.json()) as
        | { ok: true; javob: string }
        | { ok: false; xabar: string };

      if (natija.ok) {
        setFModelJavob(natija.javob);
        setFModelXabar(null);
        setFHolat("hakamlik");
      } else {
        // Model texnik sababga ko'ra javob bera olmadi — bu foydalanuvchining
        // aybi emas, shuning uchun bosqich avtomatik foydalanuvchi foydasiga
        // hisoblanadi va hakamlik so'ralmaydi.
        setFModelJavob(null);
        setFModelXabar(natija.xabar);
        setBall((oldingi) => ({ ...oldingi, foydalanuvchi: oldingi.foydalanuvchi + 1 }));
        setFHolat("yakunlandi");
      }
    } catch {
      setFXato("Modelga ulanib bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
      setFHolat("kiritish");
    }
  }

  function hakamQarori(modelTogriTopdi: boolean) {
    setBall((oldingi) =>
      modelTogriTopdi
        ? { ...oldingi, ai: oldingi.ai + 1 }
        : { ...oldingi, foydalanuvchi: oldingi.foydalanuvchi + 1 }
    );
    setFHolat("yakunlandi");
  }

  function keyingiBosqichgaOtish() {
    if (navbat === "ai" && aiTopishmoq) {
      setOldingiId(aiTopishmoq.id);
    }
    setTurIndex((oldingi) => oldingi + 1);
    setFMatn("");
    setFAslJavob("");
    setFHolat("kiritish");
    setFModelJavob(null);
    setFModelXabar(null);
    setFXato(null);
  }

  function qaytaBoshlash() {
    setTurIndex(0);
    setBall(BOSHLANGICH_BALL);
    setOldingiId(null);
    setFMatn("");
    setFAslJavob("");
    setFHolat("kiritish");
    setFModelJavob(null);
    setFModelXabar(null);
    setFXato(null);
  }

  const golib =
    ball.foydalanuvchi > ball.ai
      ? "foydalanuvchi"
      : ball.ai > ball.foydalanuvchi
        ? "ai"
        : "durang";

  return (
    <Sahifa sarlavha="Topishmoq dueli">
      <div className="flex items-center justify-between rounded-2xl border border-brend/10 bg-white px-4 py-3 text-sm font-bold text-brend">
        <span>🧑 Siz: {ball.foydalanuvchi}</span>
        <span className="text-xs font-semibold text-brend/50">
          {duelTugadi ? "Yakunlandi" : `${turIndex + 1} / ${NAVBATLAR.length}-bosqich`}
        </span>
        <span>🤖 AI: {ball.ai}</span>
      </div>

      {!duelTugadi && (
        <div className="mt-3 flex flex-col gap-3">
          {navbat === "ai" && (
            <>
              {aiHolat === "yuklanmoqda" && (
                <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
                  <p className="text-sm font-semibold">🤔 AI sizga topishmoq tayyorlamoqda...</p>
                </div>
              )}

              {aiHolat === "xato" && aiXato && (
                <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
                  <p className="text-sm font-semibold">⚠️ {aiXato}</p>
                  <button
                    type="button"
                    onClick={() => aiSavolniYukla(oldingiId)}
                    className="karta-tap mt-3 rounded-2xl bg-brend px-4 py-2.5 text-xs font-extrabold text-white"
                  >
                    Qayta urinish
                  </button>
                </div>
              )}

              {aiTopishmoq && aiHolat !== "yuklanmoqda" && aiHolat !== "xato" && (
                <>
                  <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-5 text-buvi-matn">
                    <p className="text-xs font-bold uppercase tracking-wide opacity-60">
                      🤖 AI savoli
                    </p>
                    <p className="mt-2 text-lg font-bold leading-snug">{aiTopishmoq.matn}</p>
                  </div>

                  {aiHolat === "savol" && (
                    <form onSubmit={aiJavobniYubor} className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={aiJavobKiritilgan}
                        onChange={(hodisa) => setAiJavobKiritilgan(hodisa.target.value)}
                        placeholder="Javobingizni yozing..."
                        className="karta-tap rounded-2xl border border-brend/15 bg-white px-4 py-3 text-base font-semibold text-brend outline-none focus:border-brend/40"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={aiTekshirilmoqda || !aiJavobKiritilgan.trim()}
                        className="karta-tap rounded-2xl bg-brend px-4 py-3 text-sm font-extrabold text-white shadow-sm transition disabled:opacity-40"
                      >
                        {aiTekshirilmoqda ? "Tekshirilmoqda..." : "Tekshirish"}
                      </button>
                      {aiXato && (
                        <p className="text-xs font-semibold text-xato-matn">{aiXato}</p>
                      )}
                    </form>
                  )}

                  {aiHolat === "togri" && (
                    <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-4 text-natija-matn">
                      <p className="text-sm font-bold">🎉 Barakalla! Siz to&apos;g&apos;ri topdingiz — +1 ball.</p>
                    </div>
                  )}

                  {aiHolat === "notogri" && (
                    <div className="rounded-2xl border border-xato-matn/15 bg-xato-fon p-4 text-xato-matn">
                      <p className="text-sm font-bold">
                        ❌ Noto&apos;g&apos;ri. To&apos;g&apos;ri javob:{" "}
                        <span className="font-extrabold">
                          {ikonkaEmoji(aiTopishmoq.ikonka)} {aiTogriJavobMatni}
                        </span>{" "}
                        edi — AI&apos;ga +1 ball.
                      </p>
                    </div>
                  )}

                  {(aiHolat === "togri" || aiHolat === "notogri") && (
                    <button
                      type="button"
                      onClick={keyingiBosqichgaOtish}
                      className="karta-tap rounded-2xl bg-brend px-4 py-3 text-sm font-extrabold text-white shadow-sm"
                    >
                      Keyingi bosqich →
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {navbat === "foydalanuvchi" && (
            <>
              <div className="rounded-2xl border border-yarat-matn/15 bg-yarat-fon p-4 text-yarat-matn">
                <p className="text-xs font-bold uppercase tracking-wide opacity-70">
                  ✏️ Sizning navbatingiz
                </p>
                <p className="mt-1 text-sm font-semibold">
                  AI&apos;ga istalgan topishmoqni bering — u faqat shu ilova bazasidan emas,
                  o&apos;zining umumiy bilimidan foydalanib javob topishga harakat qiladi.
                </p>
              </div>

              {fHolat === "kiritish" || fHolat === "yuborilmoqda" ? (
                <form onSubmit={fSavolniYubor} className="flex flex-col gap-2">
                  <textarea
                    value={fMatn}
                    onChange={(hodisa) => setFMatn(hodisa.target.value)}
                    placeholder="Topishmoqningizni shu yerga yozing..."
                    rows={3}
                    disabled={fHolat === "yuborilmoqda"}
                    className="karta-tap resize-none rounded-2xl border border-brend/15 bg-white px-4 py-3 text-base font-semibold text-brend outline-none focus:border-brend/40 disabled:opacity-40"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={fAslJavob}
                    onChange={(hodisa) => setFAslJavob(hodisa.target.value)}
                    placeholder="To'g'ri javob (ixtiyoriy, faqat sizga eslatma uchun)"
                    disabled={fHolat === "yuborilmoqda"}
                    className="karta-tap rounded-2xl border border-brend/10 bg-white px-4 py-2.5 text-sm font-semibold text-brend/70 outline-none focus:border-brend/30 disabled:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={fHolat === "yuborilmoqda" || !fMatn.trim()}
                    className="karta-tap rounded-2xl bg-brend px-4 py-3 text-sm font-extrabold text-white shadow-sm transition disabled:opacity-40"
                  >
                    {fHolat === "yuborilmoqda" ? "AI o'ylamoqda..." : "AI'ga yubor"}
                  </button>
                  {fXato && <p className="text-xs font-semibold text-xato-matn">{fXato}</p>}
                </form>
              ) : (
                <>
                  {fAslJavob.trim() && (
                    <div className="rounded-2xl border border-brend/10 bg-white p-3 text-xs font-semibold text-brend/60">
                      Sizning javobingiz: <span className="font-bold text-brend">{fAslJavob}</span>
                    </div>
                  )}

                  {fModelJavob && (
                    <div className="rounded-2xl border border-buvi-matn/10 bg-buvi-fon p-4 text-buvi-matn">
                      <p className="text-xs font-bold uppercase tracking-wide opacity-60">
                        🤖 AI&apos;ning taxmini
                      </p>
                      <p className="mt-1 text-lg font-bold">{fModelJavob}</p>
                    </div>
                  )}

                  {fModelXabar && (
                    <div className="rounded-2xl border border-nofaol-matn/15 bg-nofaol-fon p-4 text-nofaol-matn">
                      <p className="text-sm font-semibold">
                        🤖 AI bu safar javob topa olmadi ({fModelXabar}) — sizga +1 ball.
                      </p>
                    </div>
                  )}

                  {fHolat === "hakamlik" && (
                    <div className="flex flex-col gap-2">
                      <p className="text-center text-xs font-bold text-brend/50">
                        Haqiqiy javobni faqat siz bilasiz — AI to&apos;g&apos;ri topdimi?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => hakamQarori(true)}
                          className="karta-tap flex-1 rounded-2xl bg-xato-fon px-4 py-3 text-sm font-extrabold text-xato-matn"
                        >
                          ✅ Ha, AI to&apos;g&apos;ri topdi
                        </button>
                        <button
                          type="button"
                          onClick={() => hakamQarori(false)}
                          className="karta-tap flex-1 rounded-2xl bg-natija-fon px-4 py-3 text-sm font-extrabold text-natija-matn"
                        >
                          ❌ Yo&apos;q, adashdi
                        </button>
                      </div>
                    </div>
                  )}

                  {fHolat === "yakunlandi" && (
                    <button
                      type="button"
                      onClick={keyingiBosqichgaOtish}
                      className="karta-tap rounded-2xl bg-brend px-4 py-3 text-sm font-extrabold text-white shadow-sm"
                    >
                      Keyingi bosqich →
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {duelTugadi && (
        <div className="mt-3 flex flex-col gap-3">
          <div className="rounded-2xl border border-natija-matn/10 bg-natija-fon p-5 text-center text-natija-matn">
            <p className="text-3xl">
              {golib === "foydalanuvchi" ? "🏆" : golib === "ai" ? "🤖" : "🤝"}
            </p>
            <p className="mt-2 text-lg font-extrabold">
              {golib === "foydalanuvchi"
                ? "Siz g'olib bo'ldingiz!"
                : golib === "ai"
                  ? "Bu safar AI g'olib bo'ldi."
                  : "Durang!"}
            </p>
            <p className="mt-1 text-sm font-semibold opacity-80">
              Yakuniy hisob: siz {ball.foydalanuvchi} — {ball.ai} AI
            </p>
          </div>
          <button
            type="button"
            onClick={qaytaBoshlash}
            className="karta-tap rounded-2xl bg-brend px-4 py-3 text-sm font-extrabold text-white shadow-sm"
          >
            Yana o'ynash
          </button>
        </div>
      )}
    </Sahifa>
  );
}
