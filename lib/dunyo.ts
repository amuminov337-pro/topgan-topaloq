// F14 — "Jumboqlar xaritasi" uchun ma'lumot qatlami — FAQAT server tomonda
// ishlatiladi (app/api/dunyo/**/route.ts va server komponentlarida). lib/korpus.ts
// bilan bir xil sabab: agar bu fayl (javoblar bilan birga) klient komponentiga
// import qilinsa, barcha davlatlarning barcha javoblari brauzer JS bundle'ida
// ko'rinib qoladi va o'yin ma'nosiz bo'lib qoladi. Klient hech qachon `javob`
// maydonini oldindan olmaydi — faqat shu fayldagi funksiyalar orqali, bosqichma-
// bosqich (maslahat darajasiga qarab) yoki "javobni ko'rsat"da oladi.

import dunyoMalumotlari from "@/data/dunyo-topishmoqlari.json";
import { javobTogrimi } from "@/lib/javob";

export type DunyoTopishmoq = {
  id: string;
  matn: string;
  javob: string;
  javob_variantlar: string[];
  manba: string;
};

export type Sovinir = { emoji: string; nomi: string };

export type Davlat = {
  kod: string;
  nomi: string;
  qita: string;
  sovinir: Sovinir;
  topishmoqlar: DunyoTopishmoq[];
};

/** Klientga xavfsiz yuborsa bo'ladigan shakl — topishmoqlar (demak javoblar
 * ham) butunlay olib tashlanadi, faqat soni qoladi. */
export type OchiqDavlat = {
  kod: string;
  nomi: string;
  qita: string;
  sovinir: Sovinir;
  soni: number;
};

const DAVLATLAR = dunyoMalumotlari as Davlat[];

function ochiqShaklga(d: Davlat): OchiqDavlat {
  return { kod: d.kod, nomi: d.nomi, qita: d.qita, sovinir: d.sovinir, soni: d.topishmoqlar.length };
}

/** `/xarita` sahifasidagi davlatlar ro'yxati uchun — javoblarsiz. */
export function barchaDavlatlarniOl(): OchiqDavlat[] {
  return DAVLATLAR.map(ochiqShaklga);
}

function davlatniTop(kod: string): Davlat | undefined {
  return DAVLATLAR.find((d) => d.kod === kod);
}

/** `/xarita/[kod]` sahifasi sarlavhasi uchun — javoblarsiz. */
export function davlatOchiqShaklda(kod: string): OchiqDavlat | undefined {
  const d = davlatniTop(kod);
  return d ? ochiqShaklga(d) : undefined;
}

/** Berilgan davlatdan tasodifiy topishmoq — javobsiz shaklda. Ixtiyoriy
 * `tashqariId` bilan oldingi topishmoq takrorlanmaydi. */
export function tasodifiyTopishmoq(
  kod: string,
  tashqariId?: string | null
): { id: string; matn: string } | undefined {
  const davlat = davlatniTop(kod);
  if (!davlat || davlat.topishmoqlar.length === 0) return undefined;

  const royxat = tashqariId
    ? davlat.topishmoqlar.filter((t) => t.id !== tashqariId)
    : davlat.topishmoqlar;
  const manba = royxat.length > 0 ? royxat : davlat.topishmoqlar;
  const tanlangan = manba[Math.floor(Math.random() * manba.length)];
  return { id: tanlangan.id, matn: tanlangan.matn };
}

function topishmoqVaDavlatniTop(
  id: string
): { topishmoq: DunyoTopishmoq; davlat: Davlat } | undefined {
  for (const davlat of DAVLATLAR) {
    const topishmoq = davlat.topishmoqlar.find((t) => t.id === id);
    if (topishmoq) return { topishmoq, davlat };
  }
  return undefined;
}

/** Foydalanuvchi javobini tekshiradi. Topishmoq topilmasa `null` qaytadi. */
export function javobniTekshir(id: string, foydalanuvchiJavobi: string): boolean | null {
  const natija = topishmoqVaDavlatniTop(id);
  if (!natija) return null;
  const { topishmoq } = natija;
  return javobTogrimi(foydalanuvchiJavobi, topishmoq.javob, topishmoq.javob_variantlar);
}

/**
 * Bosqichma-bosqich maslahat: javobning "maskasi" — har harf o'rniga "_",
 * bo'sh joylar saqlanadi. `daraja` oshgani sayin ko'proq harf ochiladi:
 *  1-daraja: faqat uzunlik (hammasi "_")
 *  2-daraja: + birinchi harf
 *  3-daraja: + oxirgi harf ham
 * Topishmoq topilmasa `null` qaytadi.
 */
export function maslahatMaskasi(id: string, daraja: 1 | 2 | 3): string | null {
  const natija = topishmoqVaDavlatniTop(id);
  if (!natija) return null;

  const harflar = [...natija.topishmoq.javob];
  const oxirgiIndeks = harflar.length - 1;

  return harflar
    .map((harf, i) => {
      if (harf === " ") return " ";
      if (daraja >= 2 && i === 0) return harf;
      if (daraja >= 3 && i === oxirgiIndeks) return harf;
      return "_";
    })
    .join("");
}

/**
 * To'liq javobni ochadi ("javobni ko'rsat" tugmasi yoki 4-urinish ham xato
 * bo'lganda). MASTER_PROMPT'ning doimiy qoidasi: bu tugma hech qachon
 * bloklanmaydi, foydalanuvchi majburlanmaydi. Topishmoq topilmasa `null`.
 */
export function toliqJavobniOch(
  id: string
): { javob: string; davlatKodi: string; sovinir: Sovinir } | null {
  const natija = topishmoqVaDavlatniTop(id);
  if (!natija) return null;
  return {
    javob: natija.topishmoq.javob,
    davlatKodi: natija.davlat.kod,
    sovinir: natija.davlat.sovinir,
  };
}
