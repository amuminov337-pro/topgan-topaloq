// Bosh sahifa — MASTER_PROMPT 3-bo'limidagi maketga asoslangan: sarlavha,
// asosiy kartalar, 2 ta ikkilamchi karta va yashil natijalar paneli.
// F8: natijalar paneli endi localStorage'dan (NatijaHolati orqali) keladi.
// F13 (MVP dan tashqari qo'shimcha funksiya): "Topishmoq dueli" — /duel
// sahifasiga olib boruvchi faol karta.
// F14 (MVP dan tashqari qo'shimcha funksiya): "Jumboqlar xaritasi" ham endi
// faol — /xarita sahifasiga olib boradi. F10'da ikkalasi ham "Tez orada"
// kulrang holatida edi (KelajakKartalari komponenti orqali); ikkalasi ham
// endi haqiqiy feature bo'lgani uchun o'sha komponent bu sahifada
// ishlatilmaydi (fayl o'chirildi).

import BolimKarta from "@/components/BolimKarta";
import Logotip from "@/components/Logotip";
import NatijaHolati from "@/components/NatijaHolati";

export default function BoshSahifa() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-4 pb-10 pt-8 sm:my-8 sm:min-h-0 sm:max-w-xl sm:gap-6 sm:rounded-3xl sm:border sm:border-brend/10 sm:bg-white sm:px-8 sm:pb-12 sm:pt-10 sm:shadow-xl lg:max-w-2xl lg:gap-7 lg:px-12 lg:pb-14 lg:pt-12">
      <header className="flex flex-col items-center gap-2 text-center">
        <Logotip olcham={76} />
        <h1 className="text-3xl font-extrabold tracking-tight text-brend">
          Topgan-topaloq
        </h1>
        <p className="text-sm font-semibold text-brend/60">
          Har topishmoqda bir hikmat yashiringan
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <BolimKarta
          sarlavha="AI-buvi suhbatlari"
          tavsif="Buvijon topishmoq aytadi"
          ikonka="💬"
          ohang="buvi"
          href="/buvi"
        />
        <BolimKarta
          sarlavha="O'zing yarat"
          tavsif="Topishmoqingni baholaymiz"
          ikonka="✏️"
          ohang="yarat"
          href="/yarat"
        />

        <BolimKarta
          sarlavha="Jumboqlar xaritasi"
          tavsif="Dunyo bo'ylab topishmoq safari"
          ikonka="🗺️"
          ohang="ikkilamchi"
          href="/xarita"
        />
        <BolimKarta
          sarlavha="Topishmoq dueli"
          tavsif="AI bilan ball uchun bellashing"
          ikonka="⚔️"
          ohang="ikkilamchi"
          href="/duel"
        />

        <BolimKarta
          sarlavha="Dastur haqida"
          ikonka="ℹ️"
          ohang="ikkilamchi"
          href="/haqida"
          kichik
        />
        <BolimKarta
          sarlavha="Natijalar"
          ikonka="📊"
          ohang="ikkilamchi"
          href="/natijalar"
          kichik
        />
      </div>

      <NatijaHolati />

      <footer className="mt-auto pt-4 text-center text-xs font-medium text-brend/40">
        O'zbek xalq og'zaki ijodi asosida · 2026
      </footer>
    </main>
  );
}
