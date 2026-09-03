// Gemini API uchun yagona chaqiruv qatlami. Ilovaning boshqa hech bir joyi
// to'g'ridan-to'g'ri @google/genai'ni chaqirmaydi — barchasi shu fayl orqali
// o'tadi, shuning uchun xato ushlash va zaxira javob mantiqi bir joyda.
//
// MUHIM: bu fayl faqat server tomonda import qilinadi (app/api/**/route.ts
// ichida). API kaliti hech qachon mijoz (brauzer) tomoniga chiqmaydi.

import { GoogleGenAI } from "@google/genai";

const API_KALIT = process.env.GEMINI_API_KEY;
const MODEL_NOMI = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

let mijoz: GoogleGenAI | null = null;

function mijozniOl(): GoogleGenAI {
  if (!API_KALIT) {
    throw new Error("GEMINI_API_KEY sozlanmagan");
  }
  if (!mijoz) {
    mijoz = new GoogleGenAI({ apiKey: API_KALIT });
  }
  return mijoz;
}

export type GeminiNatija =
  | { ok: true; matn: string }
  | { ok: false; xabar: string };

/**
 * Gemini'ga bitta so'rov yuboradi. Hech qachon exception tashlamaydi —
 * xato bo'lsa ham { ok: false, xabar } qaytaradi, shunda chaqiruvchi tomon
 * (masalan AI-buvi sahifasi) zaxira matnni ko'rsata oladi va ilova qulamaydi.
 */
export async function geminiSorov(
  prompt: string,
  tizimKorsatmasi?: string
): Promise<GeminiNatija> {
  if (!API_KALIT) {
    return {
      ok: false,
      xabar: "GEMINI_API_KEY .env.local faylida sozlanmagan.",
    };
  }

  try {
    const ai = mijozniOl();
    const response = await ai.models.generateContent({
      model: MODEL_NOMI,
      contents: prompt,
      ...(tizimKorsatmasi
        ? { config: { systemInstruction: tizimKorsatmasi } }
        : {}),
    });

    const matn = response.text;
    if (!matn) {
      return { ok: false, xabar: "Gemini bo'sh javob qaytardi." };
    }
    return { ok: true, matn };
  } catch (xato) {
    return { ok: false, xabar: xatoniUzbekchaga(xato) };
  }
}

/** Gemini/tarmoq xatosini foydalanuvchiga tushunarli o'zbekcha xabarga aylantiradi. */
function xatoniUzbekchaga(xato: unknown): string {
  const asl = xato instanceof Error ? xato.message : String(xato);

  if (/API key not valid|API_KEY_INVALID|PERMISSION_DENIED/i.test(asl)) {
    return "Gemini API kaliti noto'g'ri yoki ruxsat yo'q. .env.local faylini tekshiring.";
  }
  if (/quota|RESOURCE_EXHAUSTED|rate limit|429/i.test(asl)) {
    return "Gemini kvotasi vaqtincha tugagan. Birozdan keyin qayta urinib ko'ring.";
  }
  if (/fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(asl)) {
    return "Internetga yoki Gemini serveriga ulanib bo'lmadi.";
  }
  return "Gemini bilan bog'lanishda kutilmagan xatolik yuz berdi.";
}

/** API kaliti sozlanganini tekshiradi — /api/health uchun. */
export function geminiHolati(): { sozlangan: boolean; model: string } {
  return { sozlangan: Boolean(API_KALIT), model: MODEL_NOMI };
}
