// F7 — "O'zing yarat": foydalanuvchi yozgan topishmoqni uch mezon bo'yicha
// (metafora/istiora, ixchamlik, ohang/qofiya) baholaydi va bitta aniq
// yaxshilash taklifini beradi. MASTER_PROMPT qoidasi: AI hech qachon
// kamsituvchi ohangda gapirmaydi — avval kuchli tomon, keyin bitta taklif.
// Gemini ishlamasa yoki formatga mos javob bermasa, oldindan tayyorlangan
// zaxira baho ko'rsatiladi — ilova hech qachon qulamaydi.

import { geminiSorov } from "@/lib/gemini";

export type BahoNatijasi = {
  metafora: string;
  ixchamlik: string;
  ohang: string;
  taklif: string;
  manba: "ai" | "zaxira";
};

/** Gemini javobi ba'zan ```json ... ``` bilan o'ralgan bo'lishi mumkin —
 * shuni tozalab, sof JSON qatorini qaytaradi. */
function jsonNiTozala(matn: string): string {
  return matn
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "")
    .trim();
}

/** AI ishlamasa yoki formatga mos javob bermasa ishlatiladigan, har doim
 * ijobiy ohangdagi zaxira baho. */
function zaxiraBaho(javob: string): Omit<BahoNatijasi, "manba"> {
  return {
    metafora: `"${javob}" so'zini bevosita aytmasdan, boshqa obraz orqali yashirishga urinish — bu aynan topishmoq janrining yuragi, va sizda shu urinish bor.`,
    ixchamlik: "Matningiz o'quvchiga fikrlash uchun yetarlicha joy qoldiradigan qisqa shaklda yozilgan.",
    ohang: "Gaplaringizda an'anaviy topishmoqlarga xos ohang sezilib turibdi.",
    taklif:
      "Yanada kuchliroq chiqishi uchun, oxirgi so'zlarni qofiyalanadigan tarzda tanlab ko'ring — bu topishmoqni yodda qolarli qiladi.",
  };
}

/**
 * Foydalanuvchi yozgan topishmoq matni va javobini uch mezon bo'yicha
 * baholaydi. Avval Gemini'dan so'raydi (qat'iy JSON formatda); javob
 * bo'sh, xato yoki formatga mos bo'lmasa, zaxira bahoga o'tadi.
 */
export async function topishmoqniBahola(
  matn: string,
  javob: string
): Promise<BahoNatijasi> {
  const tizimKorsatmasi =
    "Sen o'zbek xalq topishmoqlari bo'yicha mehribon, sabrli ustozsan. " +
    "Foydalanuvchi hozirgina o'zi topishmoq yozib, sendan fikr so'ramoqda. " +
    "QAT'IY QOIDA: hech qachon kamsituvchi yoki salbiy ohangda gapirma, " +
    "\"yomon\", \"zaif\", \"noto'g'ri\" kabi so'zlarni ishlatma — har doim " +
    "kuchli tomonini top va shuni ayt. Uch mezon bo'yicha ('metafora', " +
    "'ixchamlik', 'ohang') bittadan qisqa, ijobiy kuzatuv yoz — har biri " +
    "nima yaxshi chiqqanini ko'rsatsin. Keyin 'taklif' maydonida " +
    "topishmoqni yanada kuchliroq qiladigan BITTA aniq, amaliy g'oya ber " +
    "(masalan qaysi so'zni almashtirish yoki qofiyani qanday yaxshilash " +
    "mumkinligi). Faqat quyidagi JSON formatida javob ber, boshqa hech " +
    "qanday matn, izoh yoki ```json belgisi qo'shma: " +
    '{"metafora": "...", "ixchamlik": "...", "ohang": "...", "taklif": "..."}';

  const foydalanuvchiSorovi =
    `Foydalanuvchi yozgan topishmoq: "${matn}"\n` +
    `Javobi: "${javob}"\n` +
    "Mezonlar: 1) Metafora/istiora — yashiringan narsa boshqa obraz orqali " +
    "berilganmi? 2) Ixchamlik — janr talabiga mos qisqami? 3) Ohang/qofiya " +
    "— an'anaviy topishmoq ritmiga yaqinmi?";

  const natija = await geminiSorov(foydalanuvchiSorovi, tizimKorsatmasi);

  if (natija.ok) {
    try {
      const tozaJson = jsonNiTozala(natija.matn);
      const ajratilgan = JSON.parse(tozaJson) as Partial<
        Record<"metafora" | "ixchamlik" | "ohang" | "taklif", string>
      >;
      if (
        ajratilgan.metafora?.trim() &&
        ajratilgan.ixchamlik?.trim() &&
        ajratilgan.ohang?.trim() &&
        ajratilgan.taklif?.trim()
      ) {
        return {
          metafora: ajratilgan.metafora.trim(),
          ixchamlik: ajratilgan.ixchamlik.trim(),
          ohang: ajratilgan.ohang.trim(),
          taklif: ajratilgan.taklif.trim(),
          manba: "ai",
        };
      }
    } catch {
      // JSON emas yoki maydon yetishmayapti — zaxiraga o'tamiz.
    }
  }

  return { ...zaxiraBaho(javob), manba: "zaxira" };
}
