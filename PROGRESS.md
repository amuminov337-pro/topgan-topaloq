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

**Jami:** 70 / 100 ball

**Dizayn eslatmasi (2026-09-03):** Loyiha egasining aniq roziligi bilan,
faqat dizaynga oid jihatlarda (ranglar) MASTER_PROMPT'ning qat'iy
palitrasidan chetga chiqishga ruxsat berilgan — bu shaxsiy tashabbus
sifatida belgilangan, boshqa qarorlarga (F tartibi, "Done when" shartlari,
texnik stack) taalluqli emas. Shu asosda `/buvi` sahifasiga qizil (xato) va
uch bosqichli maslahat (to'q ko'kdan oltinga) ranglari, havorang buvi paneli
qo'shildi. Yoqmasa "avvalgi holatga qaytar" buyrug'i bilan bekor qilinadi.
