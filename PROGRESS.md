# Topgan-topaloq — bajarilgan ishlar

| Sana | Feature | Ball | Holat | Izoh |
|---|---|---|---|---|
| 2026-09-03 | F1 — Loyiha skeleti va dizayn tizimi | 8 | ✅ | Next.js 15 + TS + Tailwind v4, rang tokenlari, bosh sahifa maketi va 4 ta ichki sahifa skeleti |
| 2026-09-03 | F2 — Topishmoqlar korpusi | 12 | ✅ | `scripts/korpus_yig.py` — M. Abdurahimov to'plamidan 170 ta topishmoq (Kirilldan lotinga o'girilgan, 17 toifa), `data/topishmoqlar.json`, validatsiya skripti bilan |
| 2026-09-03 | F3 — Gemini API qatlami | 8 | ✅ | `lib/gemini.ts` (`@google/genai`), `app/api/health/route.ts` — kalit yo'q/noto'g'ri bo'lganda ilova qulamaydi, tushunarli xato qaytaradi |
| 2026-09-03 | F4 — AI-buvi: topishmoq va javob tekshirish | 12 | ✅ | `lib/javob.ts` (moslashuvchan taqqoslash), `lib/korpus.ts`, `/api/topishmoq/tasodifiy` va `/api/javob-tekshir` (javob hech qachon klientga yuborilmaydi), `/buvi` sahifasi |
| 2026-09-03 | F5 — AI-buvi: bosqichma-bosqich maslahat | 10 | ✅ | `lib/maslahat.ts` (Gemini + zaxira zanjiri, javob oshkor bo'lmasligi dasturiy tekshiriladi), `/api/buvi/maslahat`, `/api/topishmoq/javob` ("javobni ko'rsat" tugmasi uchun), `/buvi` sahifasiga integratsiya |
| 2026-09-03 | F6 — AI-buvi: madaniy izoh va javob ikonkasi | 8 | ✅ | `lib/izoh.ts` (Gemini + 17 toifaga mos zaxira izoh zanjiri), `lib/ikonka.ts` (161 ta korpus ikonkasi uchun emoji jadvali), `/api/buvi/izoh`, to'g'ri javobdan keyin ikonka + 2-3 gaplik madaniy izoh `/buvi` sahifasida (shuningdek "javobni ko'rsat" orqali topganda ham) |
| 2026-09-03 | F7 — O'zing yarat: kiritish va AI baholash | 12 | ✅ | `lib/baho.ts` (Gemini qat'iy JSON formatda + har doim ijobiy zaxira baho), `/api/baho`, `/yarat` sahifasida topishmoq+javob kiritish, uch mezon (metafora/ixchamlik/ohang) bo'yicha ijobiy fikr va bitta taklif, bo'sh maydonda inline xato |
| 2026-09-03 | F8 — Natijalar paneli | 8 | ✅ | `lib/saqlash.ts` (localStorage, dublikatsiz), `components/NatijaHolati.tsx` (bosh sahifadagi yashil panelni to'ldiradi), `/natijalar` sahifasi (to'liq tarix), `/buvi`da to'g'ri topilgan javob avtomatik saqlanadi — sahifa qayta yuklangandan keyin ham son va chiplar saqlanib qoladi |
| 2026-09-03 | F9 — Dastur haqida sahifasi | 5 | ✅ | `/haqida` sahifasida maqsad, texnologiya, manba (M. Abdurahimov "O'zbek xalq topishmoqlari" to'plami — korpusdagi haqiqiy `manba` maydoniga mos) va muallif ma'lumoti |
| 2026-09-03 | F10 — Kelajak bo'limlari | 3 | ✅ | `components/KelajakKartalari.tsx` — "Jumboqlar xaritasi" va "Topishmoq dueli" kartalari bosilganda tegishli tushuntirish modali chiqadi (kulrang, "Tez orada" holatida qoladi) |
| 2026-09-03 | F11 — Mobil moslashuv va PWA | 7 | ✅ | `public/manifest.json` (nom, ranglar, 192/512px ikonkalar), `app/icon.png` + `app/apple-icon.png` + `public/icon-192.png` + `public/icon-512.png` + `app/favicon.ico` (brend chirog'i logotipidan), `public/sw.js` (asosiy sahifalarni keshlaydi, `/api/` so'rovlariga tegmaydi) + `components/SwRoyxatga.tsx` orqali ro'yxatdan o'tkaziladi, `app/layout.tsx`ga manifest/appleWebApp/themeColor qo'shildi. 375/768/1440px'da responsivlik Playwright orqali tekshirildi, service worker Playwright'da "activated" holatida ro'yxatdan o'tgani tasdiqlandi |
| 2026-09-03 | F12 — Vercel deploy va yakuniy sinov | 7 | ✅ | Loyiha Vercel'ga deploy qilindi (`topgan-topaloq-sand.vercel.app`), `GOOGLE_API_KEY` muhit o'zgaruvchisi sozlandi. Jonli havolada real Gemini bilan to'liq oqim tekshirildi: AI-buvi (xato javob → maslahat → "javobni ko'rsat" → javob + madaniy izoh) va O'zing yarat (topishmoq+javob → uch mezon bo'yicha AI fikri + taklif) — barchasi ishladi, brauzer konsolida xato yo'q, `/manifest.json` to'g'ri xizmat qilyapti |

**Jami:** 100 / 100 ball 🎉

**Yakuniy tasdiq (2026-09-03):** Loyiha egasi jonli havolani (`topgan-topaloq-sand.vercel.app`) o'z telefonida sinab, "Bosh ekranga qo'shish" va to'liq ekranli ochilishni tasdiqladi — F12 "Done when" sharti to'liq bajarildi. F1 → F12 barcha bosqichlar yakunlandi.

**Bugfix (2026-09-03, F11):** `lib/ikonka.ts`dagi 2020-2021 (Unicode 13-14) davrida qo'shilgan 17 ta emoji (igna va h.k.) ba'zi Windows qurilmalarida bo'sh katakcha bo'lib ko'rinishi aniqlandi — barchasi eskiroq, keng qo'llab-quvvatlanadigan muqobillarga almashtirildi.

**Bugfix (2026-09-03, F12):** Vercel build'da 58 ta "Module not found" xatosi chiqdi — sababi `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore` va uchta komponent fayli (`Logotip.tsx`, `NatijaPanel.tsx`, `Sahifa.tsx`) F1'dan beri hech qachon `git add` qilinmagani (har feature uchun faqat o'sha feature fayllari qo'shilgani sababli asosiy skelet fayllari e'tibordan chetda qolgan). Barcha fayllar qo'shilib, qayta push qilingandan keyin deploy muvaffaqiyatli o'tdi.

**Korpus auditi (2026-09-03):** Foydalanuvchi t133 topishmog'ida ("Kichkina filday...") mantiqsiz o'xshatish payqagach, barcha 170 ta topishmoq asl manba (`M.Abdurahimov (tuzuvchi). O'zbek topishmoqlari.md`) bilan qatordan-qator solishtirildi. Yana 3 ta transliteratsiya xatosi topildi va tuzatildi: **t164** (magnitafon) — "Joni bor" manbada aslida "Jonsiz" (ma'no teskari chiqqan edi); **t043** (sichqon) — "ezinam" (mavjud bo'lmagan so'z) manbada "yeznam" (qaynog'a, shevaviy so'z); **t023** (tish) — "o'ra" manbada "oxurcha" (em-xashak idishi). Qolgan 166 ta yozuv manbaga to'liq mos ekani tasdiqlandi.

**Qo'shimcha funksiya — F13: Topishmoq dueli (2026-09-04, MASTER_PROMPT F1→F12 dan tashqari):**
Loyiha egasining aniq talabiga ko'ra, F10'da "Tez orada" deb belgilangan ikkita
bo'limdan biri — **Topishmoq dueli** — endi to'liq ishlaydi ("Jumboqlar
xaritasi" hamon rejadagidek kulrang qolmoqda). 6 bosqichli, ball asosidagi
duel: navbat "AI savol beradi" / "Foydalanuvchi savol beradi" tarzida 3
martadan almashadi, oxirida ko'proq ball yig'gan g'olib bo'ladi.
- AI navbatida savol `data/topishmoqlar.json` korpusidan olinadi, mavjud
  javob tekshirish mantig'i bilan baholanadi (`/api/javob-tekshir`).
- Foydalanuvchi navbatida u ISTALGAN topishmoqni yozadi (korpusda bo'lishi
  shart emas) — yangi `lib/duel.ts` + `/api/duel/model-taxmin` orqali Gemini
  bu topishmoqqa korpusdan emas, o'z umumiy bilimidan foydalanib taxmin
  qiladi. Bu topishmoqning haqiqiy javobi ilovada saqlanmagani uchun,
  taxmin to'g'ri/noto'g'riligini foydalanuvchining o'zi hakamlik qilib
  belgilaydi. Gemini ishlamasa (kalit yo'q/kvota tugagan), bosqich
  avtomatik foydalanuvchi foydasiga hisoblanadi — ilova bu yerda ham qulamaydi.
- Duel natijalari hozircha umumiy "Natijalar" paneliga qo'shilmaydi (u yerdagi
  sxema g'alaba/mag'lubiyat tushunchasiga mos kelmaydi) — bu ataylab qilingan
  qaror, kelajakda kengaytirilishi mumkin.
- Playwright orqali to'liq 6 bosqichli o'yin (yutuq/yutqizish/durang holatlari,
  "Yana o'ynash" bilan qayta boshlash) va 375/768/1440px'da responsivlik
  tekshirildi — konsolida xato yo'q.
- Bu F1→F12 (100 ball) rejasidan tashqari, alohida so'ralgan qo'shimcha ish —
  yakuniy ball hisobiga ta'sir qilmaydi.

**Qo'shimcha funksiya — F14: Hikmat yo'li (2026-09-04, MASTER_PROMPT F1→F12 dan tashqari):**
F10'da "Tez orada" deb belgilangan ikkinchi bo'lim — "Jumboqlar xaritasi" —
avval dunyo xaritasi + 6 davlat + suvenir tizimi sifatida to'liq qurilib,
sinovdan o'tkazilgan edi (birinchi versiya). Loyiha egasi buni ko'rib,
konsepsiyani **butunlay yoqtirmadi** va aniq yangi talab bilan qayta
qurishni so'radi ("jumboqlar xaritasi menga yoqmadi butunlay ozgartiramiz").
Shu sabab birinchi versiyaning barcha fayllari (`data/dunyo-topishmoqlari.json`,
`lib/dunyo.ts`, `lib/sovinir.ts`, `lib/bayroq.ts`, `app/api/dunyo/**`,
`components/SovinirYigindisi.tsx`, `components/SovinirBelgisi.tsx`) o'chirildi
va o'rniga **"Hikmat yo'li"** — tarixiy-adabiy sayohat xaritasi — qurildi.
- **Kontent manbai:** yangi tashqi kontent yo'q — bu qaror ataylab qilindi,
  chunki loyiha egasi topishmoqlarning "170 ta bazadan" kelishini aniq
  so'radi. Xuddi shu tasdiqlangan F2 korpusi (`data/topishmoqlar.json`,
  170 ta) ishlatiladi, mavjud `/api/topishmoq/tasodifiy`,
  `/api/javob-tekshir`, `/api/topishmoq/javob` endpoint'lari orqali (xuddi
  AI-buvi rejimidagi kabi) — shuning uchun yangi manba/aniqlik xavfi yo'q.
- **Sayohat mexanikasi:** `lib/sayohat.ts` — localStorage'da
  `{bosqich, seriya}` saqlanadi. Har 3 ta CHINDAN (oshkor qilinmagan) to'g'ri
  topilgan javobda "seriya" nolga tushadi va "bosqich" bittaga oshadi —
  sayohatchi (🐫 belgisi) xaritada keyingi tarixiy bekatga siljiydi.
  "👁️ Javobni ko'rsat" orqali ko'rilgan javob seriyaga QO'SHILMAYDI (bu
  Playwright orqali 3 marta ketma-ket tekshirilib, seriya 0/3'da qolgani
  tasdiqlandi). Noto'g'ri javobda faqat oddiy qayta urinish beriladi — hech
  qanday jazolash yoki bosqichma-bosqich maslahat yo'q (bu ataylab AI-buvi
  rejimidan soddalashtirilgan, e'tiborni sayohat va xaritaga qaratish uchun).
- **Bekatlar:** `lib/manzillar.ts` — 8 ta haqiqiy o'zbek tarixiy-madaniy
  shahri (Toshkent → Samarqand → Buxoro → Xiva → Qo'qon → Marg'ilon →
  Termiz → Shahrisabz), har biriga 1-2 gaplik haqiqiy tarixiy-madaniy
  tavsif bilan — bu "adabiy-tarixiy xarita" talabiga mos, MASTER_PROMPT
  doirasidagi o'zbek madaniyati mavzusiga ham to'g'ri keladi.
- **Xarita ko'rinishi:** `components/SayohatXaritasi.tsx` — parxament
  uslubidagi fon, burama SVG yo'l chizig'i, kompas belgisi, hali
  yetilmagan bekatlar sirli "?" bilan (keyingi manzil oldindan oshkor
  bo'lmasligi uchun), yetib borilgan bekatlar haqiqiy ikonka+nom bilan,
  joriy bekatda CSS `transition` bilan yumshoq siljiydigan 🐫 belgisi va
  yangi bekatga yetganda oltin rangli `animate-ping` porlash effekti.
  Xarita `/xarita` sahifasida **alohida oyna (modal)** sifatida ochiladi —
  yangi bekatga yetilganda avtomatik, yoki istalgan vaqtda "🗺️ Xaritani
  ko'rish" tugmasi bilan qo'lda (loyiha egasining aniq talabiga mos).
- Playwright orqali to'liq oqim tekshirildi: 3 ta ketma-ket to'g'ri javobdan
  keyin xarita modali avtomatik ochilishi va yangi bekat nomi/tavsifini
  to'g'ri ko'rsatishi, noto'g'ri javobdan keyin oddiy qayta urinish
  ishlashi, "javobni ko'rsat" seriyaga ta'sir qilmasligi, "Xaritani ko'rish"
  tugmasi istalgan vaqtda ishlashi, va 375/768/1440px'da responsivlik —
  konsolida xato yo'q.
- Bu ham F1→F12 (100 ball) rejasidan tashqari, alohida so'ralgan qo'shimcha
  ish — yakuniy ball hisobiga ta'sir qilmaydi.

**Qo'shimcha ish — Android ilova (TWA/APK) (2026-09-04, MASTER_PROMPT F1→F12 dan tashqari):**
Veb-sahifa (`topgan-topaloq-sand.vercel.app`) o'zgarishsiz, alohida jonli holda
qoladi — loyiha egasining aniq talabiga ko'ra ("veb sahifa ham saqlab
qolinsin, ilova alohida"). Android ilovasi PWABuilder.com orqali TWA
(Trusted Web Activity) usulida, veb-sahifani o'zgartirmasdan "o'rab"
yasaldi — bu ma'noda alohida kodlash ishi qilinmadi, faqat quyidagi bitta
fayl loyihaga qo'shildi:
- `public/.well-known/assetlinks.json` — Google tomonidan talab qilinadigan
  "Digital Asset Links" fayli. Bu fayl PWA'ning saytga tegishli ekanini
  Android'ga isbotlaydi; aks holda ilova ochilganda brauzer manzil satri
  ko'rinib qoladi. PWABuilder paketlash jarayonida imzolash kaliti bilan
  birga avtomatik yaratildi.
- Imzolash kaliti (signing key): loyiha egasi bilan kelishilgan holda,
  PWABuilder o'zi yangi kalit yaratdi ("New" — Play Store'ga birinchi marta
  chiqarish uchun tavsiya etilgan usul). Yaratilgan `signing.keystore` va
  `signing-key-info.txt` fayllari **repozitoriyga qo'shilmaydi** — loyiha
  egasida alohida saqlanmoqda (kelajakda ilovani yangilash uchun zarur,
  yo'qolsa Play Store'da yangi versiyani chiqarib bo'lmaydi).
- PWABuilder paketi tarkibida ham `.apk` (sinov uchun to'g'ridan-to'g'ri
  o'rnatiladigan), ham `.aab` (Google Play Console'ga yuklash uchun Android
  App Bundle) fayllari bor.
- `assetlinks.json` `public/.well-known/` papkasiga joylashtirilgandan
  keyin, Next.js orqali `application/json` turi bilan to'g'ri xizmat
  qilishi lokal build+start orqali tasdiqlandi.
- Bu ish F1→F12 (100 ball) rejasidan ham, F13/F14 qo'shimcha
  funksiyalaridan ham tashqari — veb-ilovani boshqa formatga (Android)
  ko'chirish, kontentga yoki ballga ta'sir qilmaydi.

**Dizayn eslatmasi (2026-09-03):** Loyiha egasining aniq roziligi bilan,
faqat dizaynga oid jihatlarda (ranglar) MASTER_PROMPT'ning qat'iy
palitrasidan chetga chiqishga ruxsat berilgan — bu shaxsiy tashabbus
sifatida belgilangan, boshqa qarorlarga (F tartibi, "Done when" shartlari,
texnik stack) taalluqli emas. Shu asosda `/buvi` sahifasiga qizil (xato) va
uch bosqichli maslahat (to'q ko'kdan oltinga) ranglari, havorang buvi paneli
qo'shildi. Yoqmasa "avvalgi holatga qaytar" buyrug'i bilan bekor qilinadi.
