// F14 — ISO 3166-1 alpha-2 davlat kodidan (masalan "jp") bayroq emojisini
// hisoblab chiqaradi. Sof funksiya, hech qanday ma'lumot importi yo'q —
// shuning uchun HAM server, HAM klient komponentlarida xavfsiz ishlatiladi
// (lib/dunyo.ts'dan farqli o'laroq, bu yerda hech qanday sirli javob yo'q).

/** Unicode "Regional Indicator Symbol" harflari 'A' dan boshlanadi (U+1F1E6);
 * oddiy lotin 'A' kodi (65) bilan orasidagi farq shu son. */
const OFFSET = 0x1f1e6 - 65;

export function bayroqEmoji(kod: string): string {
  return kod
    .toUpperCase()
    .split("")
    .map((harf) => String.fromCodePoint(harf.charCodeAt(0) + OFFSET))
    .join("");
}
