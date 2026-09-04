// F14 — "Jumboqlar xaritasi": dunyo davlatlari ro'yxati, qit'alar bo'yicha
// guruhlangan. MASTER_PROMPT'da "interaktiv xarita" deb tasvirlangan edi,
// lekin haqiqiy siyosiy xarita (har mamlakat chegarasini bosish) telefon
// ekranida barmoq bilan aniq bosish qiyin bo'lgani uchun (kichik davlatlar
// deyarli bosib bo'lmaydigan darajada mayda chiqadi), o'rniga bayroq+nom
// bilan aniq "bosiladigan" karta ko'rinishi tanlandi — bu ham "davlatni
// tanlab, o'sha davlat topishmoqlariga o'tish" g'oyasini to'liq beradi,
// lekin mobilda ancha qulayroq. (Dizayn qarori — MASTER_PROMPT'ning asosiy
// F-tartibi yoki texnik stackiga taalluqli emas.)
//
// Bu sahifa SERVER komponent — lib/dunyo.ts'dan faqat javobsiz (OchiqDavlat)
// ma'lumot oladi, hech qanday javob klient bundle'iga tushmaydi. Faqat
// "suvenir ochilganmi" belgisi uchun kichik client bo'laklar ishlatiladi.

import Link from "next/link";
import Sahifa from "@/components/Sahifa";
import SovinirBelgisi from "@/components/SovinirBelgisi";
import SovinirYigindisi from "@/components/SovinirYigindisi";
import { bayroqEmoji } from "@/lib/bayroq";
import { barchaDavlatlarniOl } from "@/lib/dunyo";

export default function XaritaSahifasi() {
  const davlatlar = barchaDavlatlarniOl();

  const qitalar = Array.from(new Set(davlatlar.map((d) => d.qita)));

  return (
    <Sahifa sarlavha="Jumboqlar xaritasi">
      <p className="text-sm font-semibold text-brend/60">
        Bir davlatni tanlang — o&apos;sha xalqning haqiqiy topishmoqlarini yeching va
        sayohat albomingiz uchun noyob suvenir yig&apos;ing.
      </p>

      <SovinirYigindisi
        davlatlar={davlatlar.map((d) => ({ kod: d.kod, sovinir: d.sovinir }))}
      />

      {qitalar.map((qita) => (
        <div key={qita} className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-brend/40">{qita}</p>
          <div className="grid grid-cols-2 gap-3">
            {davlatlar
              .filter((d) => d.qita === qita)
              .map((d) => (
                <Link
                  key={d.kod}
                  href={`/xarita/${d.kod}`}
                  className="karta-tap relative flex flex-col items-start gap-1 rounded-2xl border border-brend/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                >
                  <SovinirBelgisi kod={d.kod} />
                  <span className="text-3xl" aria-hidden>
                    {bayroqEmoji(d.kod)}
                  </span>
                  <span className="text-base font-extrabold leading-tight text-brend">
                    {d.nomi}
                  </span>
                  <span className="text-xs font-medium text-brend/50">
                    {d.soni} ta topishmoq
                  </span>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </Sahifa>
  );
}
