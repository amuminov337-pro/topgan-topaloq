// F14 (qayta ishlangan versiya) — "Hikmat yo'li" sayohat progressi.
// Backend baza yo'q, shuning uchun brauzer localStorage'da saqlanadi
// (lib/saqlash.ts'dagi bir xil naqsh). Har 3 ta CHINDAN to'g'ri topilgan
// (oshkor qilinmagan) javobda foydalanuvchi keyingi bekatga o'tadi.

import { MANZILLAR } from "@/lib/manzillar";

const KALIT = "topgan-topaloq:hikmat-yoli";
const ENG_KOP_BOSQICH = MANZILLAR.length - 1;
const KERAKLI_SERIYA = 3;

export type SayohatHolati = { bosqich: number; seriya: number };

const BOSHLANGICH: SayohatHolati = { bosqich: 0, seriya: 0 };

function xavfsizOl(): SayohatHolati {
  if (typeof window === "undefined") return BOSHLANGICH;
  try {
    const xom = window.localStorage.getItem(KALIT);
    if (!xom) return BOSHLANGICH;
    const ajratilgan: unknown = JSON.parse(xom);
    if (
      typeof ajratilgan === "object" &&
      ajratilgan !== null &&
      typeof (ajratilgan as SayohatHolati).bosqich === "number" &&
      typeof (ajratilgan as SayohatHolati).seriya === "number"
    ) {
      const h = ajratilgan as SayohatHolati;
      return {
        bosqich: Math.min(Math.max(h.bosqich, 0), ENG_KOP_BOSQICH),
        seriya: Math.min(Math.max(h.seriya, 0), KERAKLI_SERIYA - 1),
      };
    }
    return BOSHLANGICH;
  } catch {
    return BOSHLANGICH;
  }
}

function xavfsizSaqla(holat: SayohatHolati) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KALIT, JSON.stringify(holat));
  } catch {
    // localStorage to'lgan yoki brauzer tomonidan o'chirilgan bo'lishi mumkin —
    // bu holat ham ilovani qulatmasligi kerak.
  }
}

export function sayohatHolatiniOl(): SayohatHolati {
  return xavfsizOl();
}

export function sayohatTugaganmi(holat: SayohatHolati): boolean {
  return holat.bosqich >= ENG_KOP_BOSQICH;
}

/**
 * Chindan to'g'ri topilgan javobni hisobga oladi. Agar bu 3-seriyani
 * to'ldirsa (va sayohat hali tugamagan bo'lsa), bosqich bittaga oshadi va
 * `yangiBekatgaYetdi: true` qaytadi — sahifa buni xarita modalini avtomatik
 * ochish uchun ishlatadi.
 */
export function togriJavobHisoblansin(): {
  holat: SayohatHolati;
  yangiBekatgaYetdi: boolean;
} {
  const joriy = xavfsizOl();

  if (sayohatTugaganmi(joriy)) {
    return { holat: joriy, yangiBekatgaYetdi: false };
  }

  const yangiSeriya = joriy.seriya + 1;
  if (yangiSeriya >= KERAKLI_SERIYA) {
    const yangiHolat: SayohatHolati = { bosqich: joriy.bosqich + 1, seriya: 0 };
    xavfsizSaqla(yangiHolat);
    return { holat: yangiHolat, yangiBekatgaYetdi: true };
  }

  const yangiHolat: SayohatHolati = { bosqich: joriy.bosqich, seriya: yangiSeriya };
  xavfsizSaqla(yangiHolat);
  return { holat: yangiHolat, yangiBekatgaYetdi: false };
}

export function sayohatniQaytaBoshlash(): SayohatHolati {
  xavfsizSaqla(BOSHLANGICH);
  return BOSHLANGICH;
}

export const KERAKLI_SERIYA_SONI = KERAKLI_SERIYA;
