// Dastur haqida sahifasi (F9). Loyiha maqsadi, texnologiyasi, manbalari va
// muallif ma'lumoti. MUHIM: manbalar aynan data/topishmoqlar.json dagi
// haqiqiy `manba` maydoniga mos — hech narsa o'ylab topilmagan (halollik
// MASTER_PROMPT'ning "Done when" shartida alohida talab qilingan).

import Sahifa from "@/components/Sahifa";

export default function HaqidaSahifa() {
  return (
    <Sahifa sarlavha="Dastur haqida">
      <div className="rounded-2xl border border-brend/10 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brend/50">
          🎯 Maqsad
        </p>
        <p className="mt-2 text-sm font-semibold text-brend/80">
          Topgan-topaloq — o'zbek xalq topishmoqlarini sun'iy intellekt bilan
          suhbat shaklida taqdim etuvchi interaktiv veb-ilova. "AI-buvi"
          rejimida foydalanuvchi bilan topishmoq aytishib, bosqichma-bosqich
          maslahat va madaniy izoh beradi; "O'zing yarat" rejimida esa
          foydalanuvchi o'z topishmog'ini yozib, AI'dan iliq fikr oladi.
        </p>
        <p className="mt-2 text-sm font-semibold text-brend/80">
          Ilova yoshlar, o'quvchilar va o'zbek tilini o'rganuvchilar uchun
          mo'ljallangan bo'lib, "Jonajon o'zbek tilim" tanlovining "eng yaxshi
          dasturiy mahsulot" yo'nalishi uchun yaratilgan.
        </p>
      </div>

      <div className="rounded-2xl border border-brend/10 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brend/50">
          🛠️ Texnologiya
        </p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-semibold text-brend/80">
          <li>Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 — frontend</li>
          <li>Google Gemini API — sun'iy intellekt, faqat server tomonda ishlaydi</li>
          <li>Statik JSON korpus — vektor baza yoki alohida server shart emas</li>
          <li>Brauzer localStorage — yechilgan topishmoqlar shu yerda saqlanadi</li>
          <li>Vercel — joylashtirish (deploy)</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-brend/10 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brend/50">
          📚 Manbalar
        </p>
        <p className="mt-2 text-sm font-semibold text-brend/80">
          Korpusdagi barcha 170 ta topishmoq bitta manbadan olingan:
        </p>
        <p className="mt-1 text-sm font-bold text-brend">
          M. Abdurahimov, "O'zbek xalq topishmoqlari" to'plami (ziyouz.com kutubxonasi)
        </p>
        <p className="mt-2 text-sm font-semibold text-brend/80">
          Matnlar asl to'plamdagi Kirill yozuvidan lotin yozuviga o'girilgan,
          har bir topishmoqning manbasi korpus faylida (`data/topishmoqlar.json`)
          alohida ko'rsatilgan.
        </p>
      </div>

      <div className="rounded-2xl border border-brend/10 bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-brend/50">
          👤 Muallif
        </p>
        <p className="mt-2 text-sm font-bold text-brend">Azizbek Muminov</p>
        <ul className="mt-2 flex flex-col gap-1 text-sm font-semibold text-brend/80">
          <li>✉️ amuminov337@gmail.com</li>
          <li>💬 Telegram: @A_Muminov1401</li>
          <li>📞 +998 90 911 43 21</li>
        </ul>
      </div>
    </Sahifa>
  );
}
