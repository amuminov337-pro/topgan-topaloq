// Bosh sahifa — MASTER_PROMPT 3-bo'limidagi maket: sarlavha, 2 ta faol karta,
// 2 ta "Tez orada" kartasi, 2 ta ikkilamchi karta va yashil natijalar paneli.
// F8: natijalar paneli endi localStorage'dan (NatijaHolati orqali) keladi.

import BolimKarta from "@/components/BolimKarta";
import Logotip from "@/components/Logotip";
import NatijaHolati from "@/components/NatijaHolati";

export default function BoshSahifa() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-4 pb-10 pt-8">
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
          ikonka="🗺️"
          ohang="nofaol"
        />
        <BolimKarta sarlavha="Topishmoq dueli" ikonka="⚔️" ohang="nofaol" />

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
