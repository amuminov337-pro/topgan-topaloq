// F6 — to'g'ri javobdan keyingi madaniy izoh. Foydalanuvchi allaqachon
// javobni topgan (yoki oshkor qilgan) bo'lgani uchun bu yerda F5'dagidek
// "javobni oshkor qilib qo'yish" xavfi yo'q — vazifa boshqacha: nega xalq
// aynan shu obraz orqali shu javobni "yashirgani" haqida qisqa, iliq
// izoh berish. Gemini ishlamasa yoki bo'sh javob qaytarsa, toifaga mos
// oldindan tayyorlangan zaxira izoh ko'rsatiladi — ilova hech qachon
// qulamaydi (MASTER_PROMPT: "Ilova AI'siz ham qulamasligi kerak").

import { geminiSorov } from "@/lib/gemini";
import type { Topishmoq } from "@/lib/korpus";

/** Har toifa uchun, AI ishlamasa ishlatiladigan, 2 gaplik zaxira izoh. */
const TOIFA_IZOH_ZAXIRASI: Record<string, (javob: string) => string> = {
  tabiat: (javob) =>
    `Xalq og'zaki ijodida tabiat hodisalari ko'pincha boshqa obraz orqali tasvirlanadi — shunday qilib bolalar ${javob} kabi hodisalarni yaxshiroq kuzatib, tabiatga qiziqishi oshgan. Bu — ajdodlarimizning kuzatuvchanligini avloddan-avlodga o'tkazish usuli bo'lgan.`,
  "odam-azolari": (javob) =>
    `Inson tanasi a'zolari haqidagi topishmoqlar bolalarga o'z tanasini o'ynoqi tarzda tanishtirish uchun yaratilgan. ${javob} haqidagi bu topishmoq ham xuddi shunday — kundalik narsa kutilmagan obraz orqali ko'rsatilib, diqqatni jamlashga o'rgatadi.`,
  hayvonot: (javob) =>
    `${javob} kabi hayvonlar haqidagi topishmoqlar ularning eng ko'zga tashlanadigan xususiyati yoki odatini boshqa obraz bilan yashirish orqali yaratiladi. Bu xalqning tabiatdagi jonzotlarni sinchkovlik bilan kuzatganidan dalolat beradi.`,
  qushlar: (javob) =>
    `Qushlar haqidagi topishmoqlar, jumladan ${javob} haqidagisi, ularning parvozi yoki ovozi kabi o'ziga xos belgisini boshqacha obraz orqali tasvirlaydi. Bu orqali bolalar atrofdagi qushlarni diqqat bilan kuzatishga o'rgangan.`,
  hasharotlar: (javob) =>
    `Kichik hasharotlar, masalan ${javob}, o'z mo''jazligiga qaramay xalq ijodida alohida o'rin egallagan — ularning harakati yoki shakli topishmoqqa aylantirilib, bolalarni tabiatning mayda tafsilotlariga e'tibor berishga chorlaydi.`,
  "o'simliklar": (javob) =>
    `${javob} kabi mevali daraxtlar haqidagi topishmoqlar dehqonchilik bilan bog'liq turmush tarzidan kelib chiqqan. Mevaning shakli, ta'mi yoki pishish jarayoni boshqa obraz orqali berilib, xalq donishmandligi shu tarzda yetkazilgan.`,
  "ekin-dala": (javob) =>
    `${javob} kabi dala ekinlari haqidagi topishmoqlar dehqon xalqning yerga bo'lgan mehri va kuzatuvchanligidan tug'ilgan. Ekinning o'sish jarayoni yoki ko'rinishi boshqacha obraz bilan yashirilib, mehnat ahamiyati singdirilgan.`,
  "poliz-sabzavot": (javob) =>
    `${javob} kabi poliz va sabzavot mahsulotlari haqidagi topishmoqlar hovli-dala hayotidan olingan. Ularning rangi, shakli yoki ichki tuzilishi kutilmagan obraz orqali berilib, kundalik ovqat mahsulotlariga e'tibor oshirilgan.`,
  "oziq-ovqat": (javob) =>
    `${javob} kabi taomlar haqidagi topishmoqlar dasturxon madaniyatining bir qismidir. Ovqatning tayyorlanish jarayoni yoki ko'rinishi boshqa obraz bilan yashirilib, mehmondo'stlik va farovonlik ramzi sifatida talqin qilingan.`,
  "mehnat-qurollari": (javob) =>
    `${javob} kabi mehnat qurollari haqidagi topishmoqlar mehnatsevar xalqimizning kundalik ish quroliga bo'lgan hurmatidan kelib chiqqan. Uning vazifasi boshqa obraz orqali berilib, mehnat ahamiyati yosh avlodga singdirilgan.`,
  "uy-joy": (javob) =>
    `${javob} kabi uy-joy bilan bog'liq narsalar haqidagi topishmoqlar issiq oila o'chog'i tushunchasidan tug'ilgan. Uning vazifasi yoki ko'rinishi boshqa obraz bilan tasvirlanib, uy-joyga bo'lgan e'tibor oshirilgan.`,
  "uy-jihozlari": (javob) =>
    `${javob} kabi uy jihozlari haqidagi topishmoqlar har kuni ko'rib yurgan buyumlarni yangicha ko'z bilan ko'rishga o'rgatadi. Uning shakli yoki vazifasi boshqa obraz orqali berilib, kuzatuvchanlik rivojlantirilgan.`,
  "kiyim-kechak": (javob) =>
    `${javob} kabi kiyim-kechak yoki taqinchoqlar haqidagi topishmoqlar xalqimizning liboslarga bo'lgan e'tibori va didi tushunchasidan kelib chiqqan. Uning shakli yoki ishlatilishi boshqa obraz bilan yashiringan.`,
  "kitob-yozuv": (javob) =>
    `${javob} kabi yozuv va bilim bilan bog'liq narsalar haqidagi topishmoqlar bilimga bo'lgan hurmatdan tug'ilgan. Uning vazifasi boshqa obraz orqali berilib, o'qish-yozishga qiziqish uyg'otilgan.`,
  "cholg'u-asboblari": (javob) =>
    `${javob} kabi cholg'u asboblari haqidagi topishmoqlar xalq musiqa madaniyatining bir qismidir. Uning ovoz chiqarish tarzi boshqa obraz bilan tasvirlanib, san'atga bo'lgan mehr singdirilgan.`,
  "o'yin-o'yinchoq": (javob) =>
    `${javob} kabi o'yinchoqlar haqidagi topishmoqlar bolalik quvonchini aks ettiradi. Uning harakati yoki ko'rinishi boshqa obraz orqali berilib, o'yin orqali tafakkurni charxlash maqsad qilingan.`,
  "transport-texnika": (javob) =>
    `${javob} kabi texnika va transport vositalari haqidagi topishmoqlar zamon bilan hamnafas xalqimizning yangiliklarga qiziqishidan kelib chiqqan. Uning harakati yoki tovushi boshqa obraz bilan tasvirlangan.`,
};

const ZAXIRA_UMUMIY = (javob: string) =>
  `${javob} kundalik hayotimizda tez-tez uchraydigan narsa bo'lgani uchun xalq ijodkorlari uni boshqa obraz orqali "yashirib", tinglovchining tafakkurini charxlashni maqsad qilishgan. Shu tarzda bolalar o'z atrofidagi narsalarni yangicha ko'z bilan ko'rishga o'rgangan.`;

/**
 * Berilgan (allaqachon to'g'ri topilgan) topishmoq uchun 2-3 gaplik madaniy
 * izoh qaytaradi. Avval Gemini'dan so'raydi; javob bo'sh yoki xato bo'lsa,
 * toifaga mos zaxira izohga o'tadi.
 */
export async function izohOl(
  t: Topishmoq
): Promise<{ matn: string; manba: "ai" | "zaxira" }> {
  const tizimKorsatmasi =
    "Sen o'zbek xalq topishmoqlari ilovasidagi mehribon, bilimdon buvisan. " +
    "Foydalanuvchi hozirgina topishmoqqa to'g'ri javob topdi va sen unga shu " +
    "obraz haqida qisqa, qiziqarli madaniy hikoya aytib berasan. " +
    "QOIDA: javobni yana bir bor tabriqlamasdan, to'g'ridan-to'g'ri izohga o't. " +
    "Aynan 2-3 gapdan iborat, iliq va samimiy o'zbekcha matn yoz — " +
    "nega xalq bu narsani aynan shu topishmoqdagi obraz orqali tasvirlagani " +
    "yoki bu narsa xalq turmushida qanday o'rin tutgani haqida bo'lsin. " +
    "Topishmoq matnini so'zma-so'z takrorlama, qo'shimcha izoh yoki uzr so'rash yo'q.";

  const foydalanuvchiSorovi =
    `Topishmoq: "${t.matn}"\n` +
    `Javob: "${t.javob}"\n` +
    `Toifa: ${t.toifa}`;

  const natija = await geminiSorov(foydalanuvchiSorovi, tizimKorsatmasi);

  if (natija.ok) {
    const tozaMatn = natija.matn.trim();
    if (tozaMatn) {
      return { matn: tozaMatn, manba: "ai" };
    }
  }

  const zaxiraFunksiya = TOIFA_IZOH_ZAXIRASI[t.toifa] ?? ZAXIRA_UMUMIY;
  return { matn: zaxiraFunksiya(t.javob), manba: "zaxira" };
}
