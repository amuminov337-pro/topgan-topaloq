// F14 (qayta ishlangan versiya) — "Hikmat yo'li": topishmoqlarni yechish
// orqali bosib o'tiladigan tarixiy-adabiy sayohat xaritasining bekatlari.
// Bu sof ma'lumot fayli (hech qanday sir yo'q), shuning uchun ham server,
// ham klient komponentlarida bemalol import qilinadi.
//
// 8 ta bekat — O'zbekistonning eng taniqli tarixiy-madaniy shaharlari,
// taxminiy "Buyuk Ipak yo'li" yo'nalishida joylashtirilgan. `x`/`y` —
// SayohatXaritasi komponentidagi 100x146 o'lchamli maydonda foizli
// koordinata (xarita chizig'ini shakllantirish uchun).

export type Manzil = {
  id: string;
  nomi: string;
  ikonka: string;
  tavsif: string;
  x: number;
  y: number;
};

export const MANZILLAR: Manzil[] = [
  {
    id: "toshkent",
    nomi: "Toshkent",
    ikonka: "🏙️",
    tavsif:
      "Sayohatimiz boshlanadigan joy — O'zbekiston poytaxti, qadimiy va zamonaviy uyg'unlashgan shahar.",
    x: 22,
    y: 10,
  },
  {
    id: "samarqand",
    nomi: "Samarqand",
    ikonka: "🕌",
    tavsif:
      "Registon maydoni va ko'k gumbazlari bilan mashhur, Amir Temur davrining ilm-fan va me'morchilik markazi bo'lgan.",
    x: 78,
    y: 28,
  },
  {
    id: "buxoro",
    nomi: "Buxoro",
    ikonka: "🕋",
    tavsif:
      "Ming yildan ortiq tarixga ega, Kalon minorasi bilan tanilgan, Buyuk Ipak yo'lining muhim savdo va ilm dargohi.",
    x: 22,
    y: 46,
  },
  {
    id: "xiva",
    nomi: "Xiva",
    ikonka: "🏰",
    tavsif:
      "Ichan Qal'a — devor bilan o'ralgan qadimiy shahar, Xorazm vohasining ming yillik me'morchilik yodgorligi.",
    x: 78,
    y: 64,
  },
  {
    id: "qoqon",
    nomi: "Qo'qon",
    ikonka: "👑",
    tavsif:
      "Qo'qon xonligining poytaxti bo'lgan, Xudoyorxon o'rdasi bilan mashhur Farg'ona vodiysining tarixiy shahri.",
    x: 22,
    y: 82,
  },
  {
    id: "margilon",
    nomi: "Marg'ilon",
    ikonka: "🧵",
    tavsif:
      "O'zbek atlas va shoyi to'qish san'atining qadimiy markazi, hunarmandchilik an'analari bugungacha davom etmoqda.",
    x: 78,
    y: 100,
  },
  {
    id: "termiz",
    nomi: "Termiz",
    ikonka: "🏺",
    tavsif:
      "Amudaryo bo'yidagi qadimiy shahar — buddaviylik davridan qolgan Fayoztepa kabi noyob yodgorliklarga ega.",
    x: 22,
    y: 118,
  },
  {
    id: "shahrisabz",
    nomi: "Shahrisabz",
    ikonka: "🏯",
    tavsif:
      "Amir Temurning tug'ilgan shahri, ulkan Oqsaroy qoldiqlari bilan sayohatimiz yakunlanadigan manzil.",
    x: 60,
    y: 136,
  },
];
