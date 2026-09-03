# Topgan-topaloq — bajarilgan ishlar

| Sana | Feature | Ball | Holat | Izoh |
|---|---|---|---|---|
| 2026-09-03 | F1 — Loyiha skeleti va dizayn tizimi | 8 | ✅ | Next.js 15 + TS + Tailwind v4, rang tokenlari, bosh sahifa maketi va 4 ta ichki sahifa skeleti |
| 2026-09-03 | F2 — Topishmoqlar korpusi | 12 | ✅ | `scripts/korpus_yig.py` — M. Abdurahimov to'plamidan 170 ta topishmoq (Kirilldan lotinga o'girilgan, 17 toifa), `data/topishmoqlar.json`, validatsiya skripti bilan |
| 2026-09-03 | F3 — Gemini API qatlami | 8 | ✅ | `lib/gemini.ts` (`@google/genai`), `app/api/health/route.ts` — kalit yo'q/noto'g'ri bo'lganda ilova qulamaydi, tushunarli xato qaytaradi |
| 2026-09-03 | F4 — AI-buvi: topishmoq va javob tekshirish | 12 | ✅ | `lib/javob.ts` (moslashuvchan taqqoslash), `lib/korpus.ts`, `/api/topishmoq/tasodifiy` va `/api/javob-tekshir` (javob hech qachon klientga yuborilmaydi), `/buvi` sahifasi |
| 2026-09-03 | F5 — AI-buvi: bosqichma-bosqich maslahat | 10 | ✅ | `lib/maslahat.ts` (Gemini + zaxira zanjiri, javob oshkor bo'lmasligi dasturiy tekshiriladi), `/api/buvi/maslahat`, `/api/topishmoq/javob` ("javobni ko'rsat" tugmasi uchun), `/buvi` sahifasiga integratsiya |

**Jami:** 50 / 100 ball
