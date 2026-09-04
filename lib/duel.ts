// F13 — Topishmoq dueli (MVP dan tashqari, qo'shimcha funksiya). Foydalanuvchi
// o'zi xohlagan ISTALGAN topishmoqni beradi — bu topishmoq `data/topishmoqlar.json`
// korpusida bo'lishi shart emas (o'zbek yoki boshqa xalq topishmog'i, kitobdan,
// internetdan yoki foydalanuvchining o'zi to'qigani bo'lishi mumkin). Shuning
// uchun bu yerda korpusga MUROJAAT QILINMAYDI — model faqat o'zining umumiy
// bilimidan foydalanib taxmin qiladi. Gemini ishlamasa (kalit yo'q, kvota
// tugagan, tarmoq xatosi), { ok: false } qaytadi va duel sahifasi bu holatni
// "model bu safar javob topa olmadi" sifatida ko'rsatib, o'yinni davom ettiradi
// — ilova bu yerda ham qulamaydi.

import { geminiSorov } from "@/lib/gemini";

export type ModelTaxmini = { ok: true; javob: string } | { ok: false; xabar: string };

const TIZIM_KORSATMASI =
  "Sen 'Topishmoq dueli' o'yinida ishtirok etayotgan zukko sun'iy intellektsan. " +
  "Foydalanuvchi senga o'zi tanlagan ISTALGAN topishmoqni beradi — bu o'zbek yoki " +
  "boshqa xalq topishmog'i, kitobdan, internetdan olingan yoki foydalanuvchining " +
  "o'zi to'qigani bo'lishi mumkin. Sen hech qanday tayyor ro'yxat yoki bazaga " +
  "cheklanmaysan — o'zingning umumiy bilimingdan va mantiqiy fikrlashdan " +
  "foydalanib, eng ehtimoliy javobni top. " +
  "QOIDA: FAQAT taxmin qilingan javobni yoz — bitta so'z yoki juda qisqa ibora " +
  "(eng ko'pi bilan 2-3 so'z). Hech qanday qo'shimcha izoh, tushuntirish, " +
  "\"taxminim:\" kabi old so'z yoki uzr so'rash yozma — faqat javobning o'zi.";

/**
 * Foydalanuvchi bergan topishmoq matniga modelning taxminini qaytaradi.
 * Duel sahifasida bu javob to'g'ridan-to'g'ri foydalanuvchiga ko'rsatiladi —
 * foydalanuvchi o'zi (haqiqiy javobni bilgani uchun) uni "to'g'ri" yoki
 * "noto'g'ri" deb hakamlik qiladi, chunki bu topishmoq korpusda yo'q va
 * dasturiy ravishda solishtirib bo'lmaydi.
 */
export async function modelTopishmoqniYech(
  topishmoqMatni: string
): Promise<ModelTaxmini> {
  const natija = await geminiSorov(topishmoqMatni, TIZIM_KORSATMASI);

  if (natija.ok) {
    const tozaMatn = natija.matn.trim();
    if (tozaMatn) {
      return { ok: true, javob: tozaMatn };
    }
    return { ok: false, xabar: "Model bo'sh javob qaytardi." };
  }

  return { ok: false, xabar: natija.xabar };
}
