// Topishmoqlar korpusini o'qish qatlami — FAQAT server tomonda ishlatiladi
// (app/api/**/route.ts ichida). Bu ataylab shunday: agar korpus (javoblar
// bilan birga) client komponentiga import qilinsa, brauzer tarmoq
// so'rovlarida barcha javoblar ko'rinib qoladi va o'yin ma'nosiz bo'lib
// qoladi. Klient hech qachon `javob` va `javob_variantlar` maydonlarini
// oldindan olmaydi — faqat /api/javob-tekshir orqali "to'g'ri/noto'g'ri"
// natijasini oladi.

import korpusMalumotlari from "@/data/topishmoqlar.json";

export type Topishmoq = {
  id: string;
  matn: string;
  javob: string;
  javob_variantlar: string[];
  toifa: string;
  daraja: number;
  ikonka: string;
  manba: string;
};

/** Klientga yuborish uchun xavfsiz shakl — javob va manba olib tashlanadi. */
export type OchiqTopishmoq = Pick<
  Topishmoq,
  "id" | "matn" | "toifa" | "daraja" | "ikonka"
>;

const KORPUS = korpusMalumotlari as Topishmoq[];

export function korpusniOl(): Topishmoq[] {
  return KORPUS;
}

export function idBoyichaTop(id: string): Topishmoq | undefined {
  return KORPUS.find((t) => t.id === id);
}

export function tasodifiyTopishmoq(tashqariId?: string | null): Topishmoq {
  const royxat = tashqariId
    ? KORPUS.filter((t) => t.id !== tashqariId)
    : KORPUS;
  const manba = royxat.length > 0 ? royxat : KORPUS;
  const indeks = Math.floor(Math.random() * manba.length);
  return manba[indeks];
}

export function ochiqShaklga(t: Topishmoq): OchiqTopishmoq {
  const { id, matn, toifa, daraja, ikonka } = t;
  return { id, matn, toifa, daraja, ikonka };
}
