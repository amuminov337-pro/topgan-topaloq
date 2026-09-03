// F8 — Natijalar paneli. Backend baza yo'q (MASTER_PROMPT: "Holat —
// localStorage"), shuning uchun yechilgan topishmoqlar shu yerda, faqat
// brauzerda saqlanadi. Bu fayl faqat klient komponentlaridan chaqiriladi,
// lekin server tomonda (SSR/build) ham import qilinsa qulamasligi uchun
// `window` mavjudligi har doim tekshiriladi.

const KALIT = "topgan-topaloq:natijalar";
/** Bosh sahifadagi yashil panelda ko'rsatiladigan so'nggi javob chiplari soni. */
const CHIP_SONI = 6;

export type NatijaYozuvi = {
  id: string;
  belgi: string;
  nom: string;
  vaqt: string;
};

function xavfsizOl(): NatijaYozuvi[] {
  if (typeof window === "undefined") return [];
  try {
    const xom = window.localStorage.getItem(KALIT);
    if (!xom) return [];
    const ajratilgan: unknown = JSON.parse(xom);
    if (!Array.isArray(ajratilgan)) return [];
    return ajratilgan.filter(
      (y): y is NatijaYozuvi =>
        typeof y === "object" &&
        y !== null &&
        typeof (y as NatijaYozuvi).id === "string" &&
        typeof (y as NatijaYozuvi).belgi === "string" &&
        typeof (y as NatijaYozuvi).nom === "string" &&
        typeof (y as NatijaYozuvi).vaqt === "string"
    );
  } catch {
    return [];
  }
}

function xavfsizSaqla(royxat: NatijaYozuvi[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KALIT, JSON.stringify(royxat));
  } catch {
    // localStorage to'lgan yoki brauzer tomonidan o'chirilgan bo'lishi
    // mumkin — bu holat ham ilovani qulatmasligi kerak.
  }
}

/**
 * Yangi yechilgan topishmoqni ro'yxatning eng oldiga qo'shadi. Xuddi shu
 * `id` allaqachon mavjud bo'lsa, ikkilanmaydi — eskisi olib tashlanib,
 * yangi vaqt bilan eng oldinga ko'chiriladi (shu bilan "so'nggi javoblar"
 * har doim haqiqatan ham eng so'nggi urinishlarni ko'rsatadi).
 */
export function natijaniSaqla(yozuv: { id: string; belgi: string; nom: string }) {
  const royxat = xavfsizOl().filter((y) => y.id !== yozuv.id);
  royxat.unshift({ ...yozuv, vaqt: new Date().toISOString() });
  xavfsizSaqla(royxat);
}

/** To'liq tarix — eng yangisidan boshlab. `/natijalar` sahifasi uchun. */
export function barchaNatijalarniOl(): NatijaYozuvi[] {
  return xavfsizOl();
}

/** Bosh sahifadagi yashil panel uchun qisqacha xulosa: jami son va so'nggi
 * bir nechta javob chipi. */
export function natijaXulosasiniOl(): {
  soni: number;
  songgiJavoblar: { belgi: string; nom: string }[];
} {
  const royxat = xavfsizOl();
  return {
    soni: royxat.length,
    songgiJavoblar: royxat
      .slice(0, CHIP_SONI)
      .map((y) => ({ belgi: y.belgi, nom: y.nom })),
  };
}
