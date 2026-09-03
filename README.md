# Topgan-topaloq

> Har topishmoqda bir hikmat yashiringan

O'zbek xalq topishmoqlarini sun'iy intellekt yordamida interaktiv, suhbat
shaklida taqdim etuvchi veb-ilova.

## Ishga tushirish

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Brauzerda: http://localhost:3000

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Google Gemini API (faqat server tomonda, `app/api/**/route.ts`)
- Ma'lumot: `data/topishmoqlar.json` (statik korpus)
- Holat: brauzer `localStorage`
- Deploy: Vercel

## Papka tuzilishi

```
app/          sahifalar va API route'lar
components/   qayta ishlatiladigan UI bo'laklari
data/         topishmoqlar korpusi
lib/          AI qatlami, javob tekshirish, localStorage
scripts/      korpus tayyorlash skriptlari
```

## Qoidalar

- `.env.local` hech qachon commit qilinmaydi
- Gemini kaliti faqat server tomonda ishlatiladi
- Korpusdagi har topishmoqda `manba` ko'rsatiladi

Bosqichlar va ball taqsimoti: `MASTER_PROMPT.md`, bajarilgan ishlar: `PROGRESS.md`.
