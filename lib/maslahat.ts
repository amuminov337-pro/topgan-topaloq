// F5 — bosqichma-bosqich maslahat. Uch daraja: 1) toifa, 2) xususiyat,
// 3) deyarli oshkora. QAT'IY QOIDA: maslahat hech qachon javob so'zini yoki
// uning shaklini o'z ichiga olmaydi — bu shu faylda dasturiy ravishda
// tekshiriladi (Gemini "shumlik qilib" javobni aytib qo'yishi mumkin bo'lgani
// uchun). Gemini ishlamasa yoki javobni oshkor qilib qo'ysa, oldindan
// tayyorlangan zaxira maslahat ko'rsatiladi — ilova hech qachon qulamaydi.

import { geminiSorov } from "@/lib/gemini";
import { normallashtir } from "@/lib/javob";
import type { Topishmoq } from "@/lib/korpus";

export type MaslahatDarajasi = 1 | 2 | 3;

/** Har toifa uchun 1-darajali (umumiy toifa) zaxira maslahat. */
const TOIFA_TAVSIFI: Record<string, string> = {
  tabiat: "Bu — tabiatda uchraydigan narsa yoki hodisa.",
  "odam-azolari": "Bu — inson tanasining bir qismi.",
  hayvonot: "Bu — bir hayvon.",
  qushlar: "Bu — bir qush turi.",
  hasharotlar: "Bu — kichkina bir hasharot.",
  "o'simliklar": "Bu — mevali daraxt yoki uning mevasi.",
  "ekin-dala": "Bu — dalada ekiladigan ekin turi.",
  "poliz-sabzavot": "Bu — poliz yoki sabzavot turi.",
  "oziq-ovqat": "Bu — ovqat yoki ichimlik turi.",
  "mehnat-qurollari": "Bu — mehnatda ishlatiladigan asbob.",
  "uy-joy": "Bu — uy yoki hovli bilan bog'liq narsa.",
  "uy-jihozlari": "Bu — uyda ishlatiladigan buyum.",
  "kiyim-kechak": "Bu — kiyim yoki taqinchoq turi.",
  "kitob-yozuv": "Bu — yozuv yoki kitob bilan bog'liq narsa.",
  "cholg'u-asboblari": "Bu — bir cholg'u asbobi.",
  "o'yin-o'yinchoq": "Bu — bolalar o'ynaydigan narsa.",
  "transport-texnika": "Bu — zamonaviy texnika yoki qurilma.",
};

/** AI ishlamasa ishlatiladigan, hech qachon javobni oshkor qilmaydigan zaxira zanjiri. */
function zaxiraMaslahat(t: Topishmoq, daraja: MaslahatDarajasi): string {
  if (daraja === 1) {
    return TOIFA_TAVSIFI[t.toifa] ?? "Bu — kundalik hayotda uchraydigan narsa.";
  }
  if (daraja === 2) {
    const uzunlik = normallashtir(t.javob).replace(/\s/g, "").length;
    return `Javob so'zi ${uzunlik} ta harfdan iborat.`;
  }
  const birinchiHarf = normallashtir(t.javob).trim()[0]?.toUpperCase() ?? "?";
  return `Javob so'zi "${birinchiHarf}" harfi bilan boshlanadi.`;
}

/** Matn ichida taqiqlangan so'zlardan (javob va uning variantlaridan) birortasi bormi? */
function javobOshkorQilinganmi(matn: string, taqiqlanganShakllar: string[]): boolean {
  const matnSozlari = normallashtir(matn).split(" ").filter(Boolean);
  const taqiqlangan = taqiqlanganShakllar
    .flatMap((s) => normallashtir(s).split(" "))
    .filter((s) => s.length > 0);

  return matnSozlari.some((soz) =>
    taqiqlangan.some((taqiq) => {
      if (soz === taqiq) return true;
      if (soz.startsWith(taqiq) && soz.length - taqiq.length <= 4) return true;
      if (taqiq.startsWith(soz) && taqiq.length - soz.length <= 4) return true;
      return false;
    })
  );
}

const DARAJA_YONALISHI: Record<MaslahatDarajasi, string> = {
  1: "Faqat UMUMIY TOIFANI ayt — bu qanday narsalar turkumiga oid ekanini (masalan hayvonmi, uy buyumimi, tabiat hodisasimi). Juda umumiy bo'lsin.",
  2: "Endi javobning XUSUSIYATINI ayt — u qanday ko'rinishda, nima uchun ishlatiladi yoki qachon kerak bo'lishi haqida bitta aniqroq belgi ber.",
  3: "Endi DEYARLI OSHKORA maslahat ber — javobga juda yaqin, kuchli bir ishora ber, lekin baribir javobning o'zini yoki sinonimlarini aytma.",
};

/**
 * Berilgan topishmoq va daraja uchun maslahat matnini qaytaradi. Avval
 * Gemini'dan so'raydi; javob bo'sh, xato yoki javobni oshkor qilib qo'ysa,
 * zaxira maslahatga o'tadi.
 */
export async function maslahatOl(
  t: Topishmoq,
  daraja: MaslahatDarajasi
): Promise<{ matn: string; manba: "ai" | "zaxira" }> {
  const taqiqlangan = [t.javob, ...t.javob_variantlar];

  const tizimKorsatmasi =
    "Sen o'zbek xalq topishmoqlari ilovasidagi mehribon, sabrli buvisan. " +
    "Foydalanuvchi topishmoqqa noto'g'ri javob berdi va sendan maslahat so'ramoqda. " +
    "QAT'IY QOIDA: javob so'zini, uning birorta shaklini yoki sinonimini HECH QACHON aytma. " +
    "Faqat bitta qisqa, samimiy o'zbekcha jumla yoz — tushuntirish, uzr so'rash yoki qo'shimcha izoh yo'q.";

  const foydalanuvchiSorovi =
    `Topishmoq: "${t.matn}"\n` +
    `Haqiqiy javob (FAQAT SENING ma'lumoting uchun, buni aytma): "${t.javob}"\n` +
    `Vazifa: ${DARAJA_YONALISHI[daraja]}`;

  const natija = await geminiSorov(foydalanuvchiSorovi, tizimKorsatmasi);

  if (natija.ok) {
    const tozaMatn = natija.matn.trim();
    if (tozaMatn && !javobOshkorQilinganmi(tozaMatn, taqiqlangan)) {
      return { matn: tozaMatn, manba: "ai" };
    }
  }

  return { matn: zaxiraMaslahat(t, daraja), manba: "zaxira" };
}
