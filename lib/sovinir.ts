// F14 — "Sayohat albomi": har bir davlatning ILK to'g'ri (oshkor qilinmagan)
// javobida o'sha davlatga xos bitta noyob suvenir ochiladi. Keyingi to'g'ri
// javoblar takroriy sovg'a bermaydi (MASTER_PROMPT: "Coin/tanga tizimi
// qo'shilmaydi" — bu ataylab CHEKSIZ TO'PLANADIGAN emas, balki davlat boshiga
// BITTA marta ochiladigan yodgorlik sifatida qilingan). Backend baza yo'q
// (lib/saqlash.ts'dagi kabi), shuning uchun faqat brauzer localStorage'da
// saqlanadi.

const KALIT = "topgan-topaloq:sovinirlar";

function xavfsizKodlarniOl(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const xom = window.localStorage.getItem(KALIT);
    if (!xom) return [];
    const ajratilgan: unknown = JSON.parse(xom);
    if (!Array.isArray(ajratilgan)) return [];
    return ajratilgan.filter((k): k is string => typeof k === "string");
  } catch {
    return [];
  }
}

function xavfsizSaqla(kodlar: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KALIT, JSON.stringify(kodlar));
  } catch {
    // localStorage to'lgan yoki brauzer tomonidan o'chirilgan bo'lishi mumkin —
    // bu holat ham ilovani qulatmasligi kerak.
  }
}

/** Berilgan davlat kodining suveniri albomda bormi? */
export function sovinirOchilganmi(kod: string): boolean {
  return xavfsizKodlarniOl().includes(kod);
}

/**
 * Davlat suvenirini ochishga urinadi. Qaytadigan `true` — bu ENDI birinchi
 * marta ochilganini bildiradi (albomga qo'shildi); `false` — bu suvenir
 * allaqachon albomda bor edi (takroriy to'g'ri javob — yangi sovg'a yo'q).
 */
export function sovinirniOch(kod: string): boolean {
  const kodlar = xavfsizKodlarniOl();
  if (kodlar.includes(kod)) return false;
  xavfsizSaqla([...kodlar, kod]);
  return true;
}

/** Bosh sahifa/xarita sahifasidagi umumiy hisoblagich uchun. */
export function ochilganSovinirlarSoni(): number {
  return xavfsizKodlarniOl().length;
}

export function ochilganKodlarRoyxati(): string[] {
  return xavfsizKodlarniOl();
}
