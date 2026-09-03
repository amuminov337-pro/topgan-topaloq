// Foydalanuvchi javobini topishmoq javobiga moslashuvchan taqqoslash.
// Qoidalar (MASTER_PROMPT F4):
//  - katta-kichik harf farqi hisobga olinmaydi
//  - javob_variantlar ro'yxatidagi har qanday shakl qabul qilinadi
//  - kichik imlo xatosi kechiriladi (Levenshtein masofasi <= 1)
//  - qo'shimchali shakllar (lampochka, lampochkani) qabul qilinadi

// O'zbek matnida uchraydigan turli tutuq/apostrof belgilarini bittasiga
// keltiradi (klaviaturaga qarab foydalanuvchi turlicha belgi bosishi mumkin).
const APOSTROF_VARIANTLARI = /[‘’ʻʼ`´]/g;

export function normallashtir(matn: string): string {
  return matn
    .toLowerCase()
    .replace(APOSTROF_VARIANTLARI, "'")
    .replace(/[^a-z0-9'\s]/gi, "")
    .trim()
    .replace(/\s+/g, " ");
}

/** "lampochka" -> "lampochkani" kabi qo'shimchali shakllarni qabul qiladi. */
function qoshimchaliShaklmi(uzunroq: string, qisqaroq: string): boolean {
  if (!uzunroq.startsWith(qisqaroq)) return false;
  const qoldiq = uzunroq.length - qisqaroq.length;
  return qoldiq > 0 && qoldiq <= 4;
}

/** Ikki matn orasidagi Levenshtein tahrirlash masofasi. */
function levenshteinMasofasi(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let oldQator = Array.from({ length: n + 1 }, (_, i) => i);
  let yangiQator = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    yangiQator[0] = i;
    for (let j = 1; j <= n; j++) {
      const narx = a[i - 1] === b[j - 1] ? 0 : 1;
      yangiQator[j] = Math.min(
        oldQator[j] + 1, // o'chirish
        yangiQator[j - 1] + 1, // qo'shish
        oldQator[j - 1] + narx // almashtirish
      );
    }
    [oldQator, yangiQator] = [yangiQator, oldQator];
  }
  return oldQator[n];
}

/**
 * Foydalanuvchi javobi to'g'rimi? `togriJavob` va `javobVariantlar`dan
 * har biriga qarshi tekshiriladi: aniq mos kelish, qo'shimchali shakl,
 * so'ngra (faqat 4+ harfli so'zlar uchun) Levenshtein <= 1.
 */
export function javobTogrimi(
  foydalanuvchiJavobi: string,
  togriJavob: string,
  javobVariantlar: string[]
): boolean {
  const kiritilgan = normallashtir(foydalanuvchiJavobi);
  if (!kiritilgan) return false;

  const nomzodlar = Array.from(
    new Set([togriJavob, ...javobVariantlar].map(normallashtir))
  ).filter(Boolean);

  return nomzodlar.some((nomzod) => {
    if (kiritilgan === nomzod) return true;
    if (qoshimchaliShaklmi(kiritilgan, nomzod)) return true;
    if (qoshimchaliShaklmi(nomzod, kiritilgan)) return true;

    const kichikUzunlik = Math.min(nomzod.length, kiritilgan.length);
    if (kichikUzunlik >= 4 && levenshteinMasofasi(kiritilgan, nomzod) <= 1) {
      return true;
    }
    return false;
  });
}
