#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
korpus_yig.py — Topgan-topaloq uchun topishmoqlar korpusini tayyorlash skripti.

Manba: M. Abdurahimov (tuzuvchi), "O'zbek xalq topishmoqlari" to'plami
(ziyouz.com kutubxonasi). Kitob Kirill yozuvida; quyida SEED_KORPUS ro'yxati —
kitobdan qo'lda tanlab, lotin yozuviga o'girilgan, aniq va bahssiz javobli
~170 topishmoq. Har biri MASTER_PROMPT.md dagi sxemaga mos.

Nega qo'lda tanlash: kitobda ko'plab topishmoqlarning javobi bir nechta so'z
birikmasidan iborat ("Осмон, юлдузлар", "Ҳўкиз, омоч" kabi) — bular F4 dagi
aniq javob solishtirish uchun noqulay va bahsli. Shu sabab faqat BITTA aniq
javobli topishmoqlar tanlandi (qoida: "javobi noaniq yoki bahsli topishmoqlar
korpusga kiritilmaydi").

Skript ikki vazifani bajaradi:
1. cyrillic_to_latin() — kelajakda kitobdan yana topishmoq qo'shish kerak
   bo'lsa, Kirill matnni lotinga tez o'girish uchun yordamchi funksiya.
2. validate() — data/topishmoqlar.json faylini MASTER_PROMPT sxemasiga va
   F2 "Done when" shartlariga (>=120 yozuv, unique id/matn, majburiy
   maydonlar, >=3 toifa) qarshi tekshiradi.

Ishga tushirish:
    python3 scripts/korpus_yig.py          # JSON yozadi + statistikani chiqaradi
    python3 scripts/korpus_yig.py --check  # faqat mavjud JSON ni tekshiradi
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHIQISH_FAYLI = ROOT / "data" / "topishmoqlar.json"

MANBA = "M. Abdurahimov, \"O'zbek xalq topishmoqlari\" to'plami (ziyouz.com kutubxonasi)"

# ---------------------------------------------------------------------------
# 1) Kirill -> lotin transliteratsiya yordamchisi (kelajakda korpusni
#    kengaytirish uchun). O'zbek Kirill alifbosidagi har bir harfga rasmiy
#    lotin muqobili biriktirilgan.
# ---------------------------------------------------------------------------

_KIRILL_LOTIN = {
    "А": "A", "а": "a", "Б": "B", "б": "b", "В": "V", "в": "v",
    "Г": "G", "г": "g", "Д": "D", "д": "d", "Е": "E", "е": "e",
    "Ё": "Yo", "ё": "yo", "Ж": "J", "ж": "j", "З": "Z", "з": "z",
    "И": "I", "и": "i", "Й": "Y", "й": "y", "К": "K", "к": "k",
    "Л": "L", "л": "l", "М": "M", "м": "m", "Н": "N", "н": "n",
    "О": "O", "о": "o", "П": "P", "п": "p", "Р": "R", "р": "r",
    "С": "S", "с": "s", "Т": "T", "т": "t", "У": "U", "у": "u",
    "Ф": "F", "ф": "f", "Х": "X", "х": "x", "Ц": "Ts", "ц": "ts",
    "Ч": "Ch", "ч": "ch", "Ш": "Sh", "ш": "sh", "Щ": "Sh", "щ": "sh",
    "Ъ": "'", "ъ": "'", "Ы": "I", "ы": "i", "Ь": "", "ь": "",
    "Э": "E", "э": "e", "Ю": "Yu", "ю": "yu", "Я": "Ya", "я": "ya",
    "Ў": "O'", "ў": "o'", "Қ": "Q", "қ": "q", "Ғ": "G'", "ғ": "g'",
    "Ҳ": "H", "ҳ": "h",
}


def cyrillic_to_latin(matn: str) -> str:
    """O'zbek Kirill matnini lotin yozuviga o'giradi (harf-ma-harf)."""
    return "".join(_KIRILL_LOTIN.get(harf, harf) for harf in matn)


# ---------------------------------------------------------------------------
# 2) Qo'lda tanlangan va tekshirilgan korpus — MASTER_PROMPT sxemasi bo'yicha.
#    Har bir yozuv: (matn, javob, javob_variantlar, toifa, daraja, ikonka)
# ---------------------------------------------------------------------------

SEED_KORPUS: list[tuple[str, str, list[str], str, int, str]] = [
    # --- tabiat ---
    ("Ko'k ko'ylakka qo'l yetmas.", "osmon", ["osmon"], "tabiat", 1, "sky"),
    ("Oppoq sandiq ochildi, olamga nur sochildi.", "quyosh", ["quyosh", "oftob"], "tabiat", 2, "sun"),
    ("Suvda yotar — suv ichmas, yurganini odam bilmas.", "quyosh", ["quyosh", "oftob"], "tabiat", 3, "sun"),
    ("Kecha tomda bir patir ko'rdim, erta qarasam — yo'q.", "oy", ["oy"], "tabiat", 2, "moon"),
    ("Kichkinadir o'zi, yiltir-yiltir ko'zi.", "yulduz", ["yulduz"], "tabiat", 1, "star"),
    ("Zar gilam, zar-zar gilam, ko'taray desam, og'ir gilam.", "yer", ["yer", "zamin"], "tabiat", 2, "earth"),
    ("Uzun terak, soyasi yo'q.", "suv", ["suv"], "tabiat", 2, "water-drop"),
    ("Ko'zga ko'rinmas, qo'lga tutilmas.", "havo", ["havo"], "tabiat", 2, "wind"),
    ("Oyog'i yo'q, qochadi, qanoti yo'q, uchadi.", "bulut", ["bulut"], "tabiat", 2, "cloud"),
    ("Oppoqqina dasturxon, yer yuzini qoplagan.", "qor", ["qor"], "tabiat", 1, "snow"),
    ("Ariqdan oyna oldim.", "muz", ["muz"], "tabiat", 2, "ice"),
    ("Qo'lsiz, oyoqsiz eshik ochar.", "shamol", ["shamol", "yel"], "tabiat", 2, "wind"),
    ("Tebranadi, joni yo'q.", "zilzila", ["zilzila"], "tabiat", 2, "earthquake"),
    ("Chopsa, chopilmas, kessa, kesilmas.", "soya", ["soya"], "tabiat", 2, "shadow"),

    # --- odam-azolari ---
    ("Bir tepalikda yetti teshik.", "bosh", ["bosh", "yuz"], "odam-azolari", 2, "head"),
    ("Uy ustida sara yoy.", "qosh", ["qosh"], "odam-azolari", 1, "eyebrow"),
    ("Tom ustida qo'sh chiroq.", "ko'z", ["ko'z"], "odam-azolari", 1, "eye"),
    ("Qarichdan yaqin, osmondan uzoq.", "ko'z", ["ko'z"], "odam-azolari", 3, "eye"),
    ("Ustida ikki darcha, o'rtasida bir kunda.", "burun", ["burun"], "odam-azolari", 2, "nose"),
    ("Bir teshikda hamma olam.", "quloq", ["quloq"], "odam-azolari", 2, "ear"),
    ("G'aznadir, to'lmas, bir kun bo'sh bo'lmas.", "og'iz", ["og'iz"], "odam-azolari", 2, "mouth"),
    ("Temir qo'rg'on ichida, qizil toychoq o'ynaydi.", "til", ["til"], "odam-azolari", 2, "tongue"),
    ("Kichkina o'ra, ichi to'la mixcha.", "tish", ["tish", "tishlar"], "odam-azolari", 1, "tooth"),
    ("Besh otim, beshovi ham qashqa otim.", "barmoqlar", ["barmoq", "barmoqlar"], "odam-azolari", 1, "finger"),
    ("Beshta botir, orqasi yaltir.", "tirnoq", ["tirnoq", "tirnoqlar"], "odam-azolari", 2, "nail"),
    ("Ikki otim bor, bir-biridan chopog'on.", "oyoq", ["oyoq", "oyoqlar"], "odam-azolari", 1, "leg"),
    ("Bir nafasda olamni kezar.", "fikr", ["fikr", "o'y", "xayol"], "odam-azolari", 3, "thought"),

    # --- hayvonot ---
    ("To'rt oyoqli, temir tuyoqli.", "ot", ["ot"], "hayvonot", 1, "horse"),
    ("Quyon emas, uzun quloq, ot emas, to'rtta tuyoq.", "eshak", ["eshak"], "hayvonot", 2, "donkey"),
    ("O'zi katta, dumi kalta.", "tuya", ["tuya"], "hayvonot", 1, "camel"),
    ("Boraveradi, boraveradi, bo'yradek yerni olib yotadi.", "sigir", ["sigir"], "hayvonot", 2, "cow"),
    ("Yerdan chiqadi qoziq, isi juda sassiq.", "yumronqoziq", ["yumronqoziq"], "hayvonot", 3, "gopher"),
    ("Soqoli bor, aqli yo'q.", "echki", ["echki"], "hayvonot", 1, "goat"),
    ("Kichkintoygina bo'yi bor, aylantirgan to'ni bor.", "qo'y", ["qo'y"], "hayvonot", 2, "sheep"),
    ("El yotsa ham, shalpangquloq yotmaydi.", "it", ["it"], "hayvonot", 2, "dog"),
    ("Mo'ylovi bor, soqoli yo'q.", "mushuk", ["mushuk"], "hayvonot", 1, "cat"),
    ("Uydek joyni olar, sichqondan qo'rqar.", "fil", ["fil"], "hayvonot", 2, "elephant"),
    ("Yo'l-yo'l to'ni bor, odam qo'rqar turqi bor.", "yo'lbars", ["yo'lbars"], "hayvonot", 2, "tiger"),
    ("Dalama-dala qidiradi, qo'y bilan echki oh uradi.", "bo'ri", ["bo'ri"], "hayvonot", 2, "wolf"),
    ("Kechasi ovda, kunduzi uyda.", "tulki", ["tulki"], "hayvonot", 2, "fox"),
    ("O'zi yo'rtiq, labi tirtiq.", "quyon", ["quyon"], "hayvonot", 2, "rabbit"),
    ("Yer tagida qubba igna.", "tipratikan", ["tipratikan"], "hayvonot", 2, "hedgehog"),
    ("Yer tagida ezinam oti kishnaydi.", "sichqon", ["sichqon"], "hayvonot", 3, "mouse"),
    ("Qanotli, sut beradi.", "ko'rshapalak", ["ko'rshapalak"], "hayvonot", 2, "bat"),
    ("Qishda bir joyda, yozda ming joyda.", "baliq", ["baliq"], "hayvonot", 3, "fish"),
    ("Sassiq ko'lda it hurar.", "baqa", ["baqa", "qurbaqa"], "hayvonot", 2, "frog"),
    ("Yer ustida o'rmalar, chopay desa chopolmas.", "toshbaqa", ["toshbaqa"], "hayvonot", 2, "turtle"),
    ("Yer tagida yog'li qamchi.", "ilon", ["ilon"], "hayvonot", 2, "snake"),
    ("Qoragina popish, devolga yopish.", "kaltakesak", ["kaltakesak"], "hayvonot", 2, "lizard"),

    # --- qushlar ---
    ("Erta turadi, jar chaqiradi.", "xo'roz", ["xo'roz"], "qushlar", 1, "rooster"),
    ("Boshi taroq, dumi o'roq.", "xo'roz", ["xo'roz"], "qushlar", 2, "rooster"),
    ("Mening bir o'tovim bor, oynasi, eshigi yo'q.", "tuxum", ["tuxum"], "qushlar", 2, "egg"),
    ("Kasbi doim taqir-tuqur, qayda ilon ko'rsa cho'qir.", "laylak", ["laylak"], "qushlar", 2, "stork"),
    ("Boyning o'g'li ko'kka qarab yig'laydi.", "boyo'g'li", ["boyo'g'li"], "qushlar", 3, "owl"),
    ("Yozda keladi, qishda ketadi.", "zag'izg'on", ["zag'izg'on"], "qushlar", 2, "magpie"),
    ("Gul ustida olifta ashulachi.", "bulbul", ["bulbul"], "qushlar", 2, "nightingale"),
    ("Zuv-zuv boragay, tomdan qarag'ay, cho'p-loy cho'qig'ay, savat to'qig'ay.", "qaldirg'och", ["qaldirg'och"], "qushlar", 3, "swallow"),
    ("Kichkina juvonmarg, tom boshidan o'tin tashlaydi.", "chumchuq", ["chumchuq"], "qushlar", 2, "sparrow"),

    # --- hasharotlar ---
    ("Kichkina mitti, shoxini tirab suv ichdi.", "ari", ["ari"], "hasharotlar", 2, "bee"),
    ("Tutdan bizga ko'ylak to'qir.", "ipak qurti", ["ipak qurti"], "hasharotlar", 3, "silkworm"),
    ("Qanoti bor, qoni yo'q, tuxum qo'yar, soni yo'q.", "kapalak", ["kapalak"], "hasharotlar", 2, "butterfly"),
    ("O'tirishi o'ymoqday, baqirishi toyloqday.", "chigirtka", ["chigirtka"], "hasharotlar", 2, "grasshopper"),
    ("O'zi qora, qanotli, shoxlari bor, tirnoqli.", "qo'ng'iz", ["qo'ng'iz"], "hasharotlar", 2, "beetle"),
    ("Bir otim bor ajabgina, dumlari bor gajakkina.", "chayon", ["chayon"], "hasharotlar", 2, "scorpion"),
    ("Beli qilday, boshi xumday.", "chumoli", ["chumoli"], "hasharotlar", 1, "ant"),
    ("U yoqqa boradi, bu yoqqa boradi, bo'z to'qiydi.", "o'rgimchak", ["o'rgimchak"], "hasharotlar", 2, "spider"),
    ("Kichkina-mitti, qo'limga olsam, qovurg'asi sinib ketdi.", "chivin", ["chivin"], "hasharotlar", 2, "fly"),

    # --- o'simliklar (mevali daraxtlar) ---
    ("Kichkina qozon, jingla palov.", "yong'oq", ["yong'oq"], "o'simliklar", 2, "walnut"),
    ("Ikki tog'ning orasida bir tup yantoq.", "bodom", ["bodom"], "o'simliklar", 2, "almond"),
    ("Osh ichida tosh, tosh ichida osh.", "o'rik", ["o'rik"], "o'simliklar", 2, "apricot"),
    ("O'zi ko'm-ko'k, yuzi qip-qizil.", "olma", ["olma"], "o'simliklar", 1, "apple"),
    ("O'zi shirin, tukligina, mazasi bor, totligina.", "shaftoli", ["shaftoli"], "o'simliklar", 1, "peach"),
    ("Dum-dumaloq bo'yi bor, palovda obro'yi bor.", "behi", ["behi"], "o'simliklar", 2, "quince"),
    ("Qirq hujrada qizil qizlar.", "anor", ["anor"], "o'simliklar", 2, "pomegranate"),
    ("Otasi bukri xo'ja, onasi yoyma chalpak, bolasi shirin-shakar.", "uzum", ["uzum"], "o'simliklar", 3, "grape"),
    ("Gulsiz bo'lar mevasi, shirin-shirin donasi.", "anjir", ["anjir"], "o'simliklar", 2, "fig"),
    ("Bir qop un, ichida ustun.", "jiyda", ["jiyda"], "o'simliklar", 2, "jida"),

    # --- ekin-dala ---
    ("Chopsang kular, chopmasang o'lar.", "paxta", ["paxta"], "ekin-dala", 2, "cotton"),
    ("Hamma yog'i qiltiq, hamma unga intiq.", "bug'doy", ["bug'doy"], "ekin-dala", 2, "wheat"),
    ("Solaman qizil, chiqaraman oq.", "bug'doy", ["bug'doy", "un"], "ekin-dala", 3, "wheat"),
    ("Kichkina qiz, qo'lida bigiz.", "sholi", ["sholi", "guruch"], "ekin-dala", 2, "rice"),
    ("Yerdan chiqar taranib, zarrin dastor o'ranib.", "makkajo'xori", ["makkajo'xori", "jo'xori"], "ekin-dala", 2, "corn"),
    ("Bo'yi bir qarich, soqoli ikki qarich.", "makkajo'xori", ["makkajo'xori"], "ekin-dala", 2, "corn"),
    ("Uzun-uzun ko'chalar, ichi to'la bachchalar.", "loviya", ["loviya"], "ekin-dala", 2, "beans"),
    ("O'zi pishiq, burni qiyshiq.", "no'xat", ["no'xat"], "ekin-dala", 2, "chickpea"),
    ("Qora-qora qo'g'irmoch.", "mosh", ["mosh"], "ekin-dala", 2, "mung-bean"),
    ("Kunga qarab tolmaydi, kundan ko'zni olmaydi.", "kungaboqar", ["kungaboqar"], "ekin-dala", 1, "sunflower"),

    # --- poliz-sabzavot ---
    ("Xo'ppa semiz, bir tuki yo'q.", "tarvuz", ["tarvuz"], "poliz-sabzavot", 1, "watermelon"),
    ("Zar-zar to'ni bor, zarbdan panohi bor.", "qovun", ["qovun"], "poliz-sabzavot", 2, "melon"),
    ("Oppoq, semiz, moyi yo'q, terisi qalin, juni yo'q.", "oshqovoq", ["oshqovoq", "qovoq"], "poliz-sabzavot", 2, "pumpkin"),
    ("Pishmaganda mazali, pishganda mazasiz.", "bodring", ["bodring"], "poliz-sabzavot", 2, "cucumber"),
    ("Qat-qat to'nli, qarich bo'yli.", "karam", ["karam"], "poliz-sabzavot", 1, "cabbage"),
    ("Yer tagida oltin bosh.", "sholg'om", ["sholg'om"], "poliz-sabzavot", 2, "turnip"),
    ("Yer tagida chaksa go'sht.", "lavlagi", ["lavlagi"], "poliz-sabzavot", 2, "beet"),
    ("Yer tagida oltin qoziq.", "sabzi", ["sabzi"], "poliz-sabzavot", 1, "carrot"),
    ("Past-past bo'yi bor, yetti qavat to'ni bor.", "piyoz", ["piyoz"], "poliz-sabzavot", 1, "onion"),
    ("Bir barmoqcha bo'yi bor, qizil baxmal to'ni bor.", "garmdori", ["garmdori"], "poliz-sabzavot", 2, "pepper"),

    # --- oziq-ovqat ---
    ("Xom soldim, pishiq oldim.", "non", ["non"], "oziq-ovqat", 1, "bread"),
    ("Bir qozondan qirq tuya suv ichar.", "chuchvara", ["chuchvara"], "oziq-ovqat", 3, "dumpling"),
    ("Suv emas, suyuq, qor emas, oq.", "sut", ["sut"], "oziq-ovqat", 1, "milk"),
    ("Oltmish ikki aybni oq yopar.", "qatiq", ["qatiq"], "oziq-ovqat", 3, "yogurt"),
    ("O'zi oppoq, qor emas, non bo'lmaydi, un emas.", "shakar", ["shakar", "qand"], "oziq-ovqat", 2, "sugar"),
    ("Bir o'rdakka bir chimdim.", "choy", ["choy"], "oziq-ovqat", 2, "tea"),
    ("Chaynaladi, chaynaladi, yutilmaydi.", "saqich", ["saqich", "jevachka"], "oziq-ovqat", 1, "gum"),
    ("Qorong'i uyda shivir-shivir.", "shovla", ["shovla"], "oziq-ovqat", 3, "porridge"),

    # --- mehnat-qurollari ---
    ("Urdim, gup etdi, yer tagiga kirib ketdi.", "ketmon", ["ketmon"], "mehnat-qurollari", 2, "hoe"),
    ("G'it-g'it deydi, ishlaydi, yerga kukun tashlaydi.", "arra", ["arra"], "mehnat-qurollari", 2, "saw"),
    ("Tushgan yerini uzar.", "ombur", ["ombur"], "mehnat-qurollari", 2, "pliers"),
    ("Guv-guv etadi, marg'ilon ketadi.", "urchuq", ["urchuq"], "mehnat-qurollari", 3, "spindle"),
    ("Bizning uyda to'rt kampir, to'rtovi ham mard kampir.", "savag'ich", ["savag'ich"], "mehnat-qurollari", 3, "wool-comb"),
    ("Yer ostida g'olton guldiraydi.", "tegirmon", ["tegirmon"], "mehnat-qurollari", 2, "mill"),
    ("Tap-tap etadi, tagidan karvon o'tadi.", "elak", ["elak"], "mehnat-qurollari", 2, "sieve"),
    ("Ko'p yeydi, tez yeydi, mayda chaynaydi, o'zi yuta olmaydi, o'zgalarni to'ydiradi.", "tegirmon", ["tegirmon"], "mehnat-qurollari", 3, "mill"),

    # --- uy-joy ---
    ("Kunduzi tashqari, kechasi ichkari.", "eshik", ["eshik"], "uy-joy", 1, "door"),
    ("Qoravoy buvam eshik qo'rir.", "qulf", ["qulf"], "uy-joy", 2, "lock"),
    ("Olisdan jangir-jungir, yaqindan oddiy temir.", "kalit", ["kalit"], "uy-joy", 2, "key"),
    ("Uzun bo'yli, qora to'nli.", "mo'ri", ["mo'ri"], "uy-joy", 2, "chimney"),
    ("O'zi katta, sarpo'shi yo'q.", "hovuz", ["hovuz"], "uy-joy", 2, "pool"),
    ("Osmondan osilgan, yerdan qazilgan.", "quduq", ["quduq"], "uy-joy", 2, "well"),
    ("Tepdim, tepdim, terakka chiqdim.", "narvon", ["narvon"], "uy-joy", 1, "ladder"),
    ("Kunduzi yig'iladi, kechasi yoyiladi.", "ko'rpa", ["ko'rpa"], "uy-joy", 2, "blanket"),
    ("Tursa tuyaday, yig'ilsa kichkintoy.", "pashshaxona", ["pashshaxona"], "uy-joy", 3, "mosquito-net"),

    # --- uy-jihozlari ---
    ("Kechasi oftobdek, kunduzi koptokdek.", "lampochka", ["lampa", "chiroq", "lampochka"], "uy-jihozlari", 1, "bulb"),
    ("Og'zi do'ppidek, ichi qizil, xumdek.", "tandir", ["tandir"], "uy-jihozlari", 2, "tandoor"),
    ("O'zi bitta, qulog'i to'rtta.", "qozon", ["qozon"], "uy-jihozlari", 1, "pot"),
    ("Laylak uyada, dumi ziyoda.", "cho'mich", ["cho'mich"], "uy-jihozlari", 2, "ladle"),
    ("Hakka uyada, quyrug'i ziyoda.", "qoshiq", ["qoshiq"], "uy-jihozlari", 2, "spoon"),
    ("Bozorda sariq ayg'ir kishnaydi.", "samovar", ["samovar"], "uy-jihozlari", 2, "samovar"),
    ("O'zi turar jimgina, qulog'i bor birgina.", "choynak", ["choynak"], "uy-jihozlari", 1, "teapot"),
    ("Hamma kishini ko'rganda labini o'pkay.", "piyola", ["piyola"], "uy-jihozlari", 2, "cup"),
    ("Borishda och minar, kelishda to'q.", "ko'za", ["ko'za"], "uy-jihozlari", 3, "jug"),
    ("Kichkinadir, minadir, unga odam ishonadir.", "qulf", ["qulf"], "uy-jihozlari", 3, "lock"),
    ("Kichkina filday, menga qarab kuldi.", "oyna", ["oyna", "ko'zgu"], "uy-jihozlari", 2, "mirror"),
    ("Kunu tun yuradi, doim bir joyda turadi.", "soat", ["soat"], "uy-jihozlari", 2, "clock"),
    ("Kichkinagina sandiqcha, ichi to'la mixcha.", "gugurt", ["gugurt"], "uy-jihozlari", 2, "matches"),
    ("O'zining badanini o'zi yeydi.", "sham", ["sham"], "uy-jihozlari", 2, "candle"),

    # --- kiyim-kechak ---
    ("Otdim, osmonga chiqdi.", "do'ppi", ["do'ppi"], "kiyim-kechak", 2, "tubeteika"),
    ("Kunduzi himoya qiladi, kechasi qoziqda turadi.", "kiyim", ["kiyim"], "kiyim-kechak", 2, "clothes"),
    ("Bir tug'ishgan ikki do'st, bo'ylari tizdan, saqlaydi qor, muzdan.", "etik", ["etik"], "kiyim-kechak", 2, "boots"),
    ("Besh og'ayni, qo'rasi bor, xonasi boshqa.", "qo'lqop", ["qo'lqop"], "kiyim-kechak", 2, "gloves"),
    ("Mush-mush, mushukkina, qo'lida ushuqqina.", "uzuk", ["uzuk"], "kiyim-kechak", 2, "ring"),
    ("Ikki botir qilichlashar.", "qaychi", ["qaychi"], "kiyim-kechak", 2, "scissors"),
    ("Hammaga to'n tikaman, o'zim yalang'och.", "igna", ["igna"], "kiyim-kechak", 2, "needle"),
    ("O'zi kumush, dumi uzun.", "ip", ["ip"], "kiyim-kechak", 3, "thread"),

    # --- kitob-yozuv ---
    ("Tilsiz, aql o'rgatar.", "kitob", ["kitob"], "kitob-yozuv", 1, "book"),
    ("Tog'dan tayladim sinmadi, suvga tayladim sindi.", "qog'oz", ["qog'oz"], "kitob-yozuv", 3, "paper"),
    ("Sirti tayoq, ichi bo'yoq.", "qalam", ["qalam"], "kitob-yozuv", 2, "pencil"),
    ("Tili po'lat shovvoz, so'zlay olmas beqog'oz.", "ruchka", ["ruchka"], "kitob-yozuv", 2, "pen"),
    ("Qo'l bilan ekiladi, ko'z bilan teriladi, og'iz bilan o'riladi.", "yozuv", ["yozuv", "daftar"], "kitob-yozuv", 3, "notebook"),

    # --- cholg'u-asboblari ---
    ("Uch ayg'ir, haydadim tekis yo'lga.", "dutor", ["dutor"], "cholg'u-asboblari", 3, "dutar"),
    ("Tomda turib gilam qoqdim, changi jahonga ketdi.", "nog'ora", ["nog'ora", "doira"], "cholg'u-asboblari", 2, "drum"),
    ("O'zi mitti, ovozi olamga yetdi.", "surnay", ["surnay"], "cholg'u-asboblari", 2, "horn"),
    ("Joni yo'q, ursa yig'laydi.", "qo'ng'iroq", ["qo'ng'iroq"], "cholg'u-asboblari", 1, "bell"),
    ("Hasan dorozi bir bukur, hovliga soladi zikir.", "karnay", ["karnay"], "cholg'u-asboblari", 3, "trumpet"),

    # --- o'yin-o'yinchoq ---
    ("Uzun terak, uchi mening qo'limda.", "varrak", ["varrak"], "o'yin-o'yinchoq", 2, "kite"),
    ("Ukamga o'xshar o'zi, aslo yumilmas ko'zi.", "qo'g'irchoq", ["qo'g'irchoq"], "o'yin-o'yinchoq", 2, "doll"),
    ("Tap-tap etadi, ursam uchib ketadi.", "koptok", ["koptok", "to'p"], "o'yin-o'yinchoq", 1, "ball"),

    # --- transport-texnika ---
    ("Po'lat qushim uchdi-ketdi, bir zum o'tmay oyga yetdi.", "raketa", ["raketa"], "transport-texnika", 2, "rocket"),
    ("Suv emas, simda oqar, o't emas, chiroq yoqar.", "elektr toki", ["elektr toki", "tok", "elektr"], "transport-texnika", 2, "electricity"),
    ("Uyga osdik bitta nok, yop-yorug' bo'ldi har yoq.", "lampochka", ["lampa", "chiroq", "lampochka"], "transport-texnika", 1, "bulb"),
    ("Tashqari yoz, dim-olov, uychamizda muz, qirov.", "muzlatgich", ["muzlatgich", "xolodilnik"], "transport-texnika", 2, "fridge"),
    ("Tinmas bitta, tinglar mingta.", "radio", ["radio"], "transport-texnika", 2, "radio"),
    ("Katta quti, ko'zi bor, ko'p tomosha, so'zi bor.", "televizor", ["televizor"], "transport-texnika", 1, "tv"),
    ("Joni bor, tinglaydi, qo'lsiz, yozadi, tilsiz, so'zlaydi.", "magnitafon", ["magnitafon"], "transport-texnika", 3, "tape-recorder"),
    ("Gurillashi tegirmonday, lekin tegirmon emas, uchishlari g'ajirday, lekin g'ajir emas.", "samolyot", ["samolyot"], "transport-texnika", 2, "airplane"),
    ("Cho'zilib yotar narvon, undan o'tar uy-karvon.", "temir yo'l", ["temir yo'l", "poyezd"], "transport-texnika", 3, "train"),
    ("Ko'zi yaltiraydi, ichi qaltiraydi.", "avtomashina", ["avtomashina", "mashina"], "transport-texnika", 2, "car"),
    ("Yozda toycha, qishda xurjun.", "velosiped", ["velosiped"], "transport-texnika", 3, "bicycle"),
    ("Sen ichida tursang tikka, olib chiqar yuksaklikka.", "lift", ["lift"], "transport-texnika", 1, "elevator"),
    ("Uyimiz nurdan, o'rganish bizdan, o'rgatish sizdan.", "maktab", ["maktab"], "transport-texnika", 2, "school"),
]


def korpus_yasash() -> list[dict]:
    """SEED_KORPUS ro'yxatidan MASTER_PROMPT sxemasiga mos JSON yozuvlar yasaydi."""
    yozuvlar = []
    for i, (matn, javob, variantlar, toifa, daraja, ikonka) in enumerate(SEED_KORPUS, start=1):
        yozuvlar.append(
            {
                "id": f"t{i:03d}",
                "matn": matn,
                "javob": javob,
                "javob_variantlar": variantlar,
                "toifa": toifa,
                "daraja": daraja,
                "ikonka": ikonka,
                "manba": MANBA,
            }
        )
    return yozuvlar


# ---------------------------------------------------------------------------
# 3) Validatsiya — F2 "Done when" shartlarini tekshiradi.
# ---------------------------------------------------------------------------

MAJBURIY_MAYDONLAR = {"id", "matn", "javob", "javob_variantlar", "toifa", "daraja", "ikonka", "manba"}


def validate(yozuvlar: list[dict]) -> list[str]:
    """Xatolar ro'yxatini qaytaradi; bo'sh ro'yxat — korpus to'g'ri."""
    xatolar: list[str] = []

    if len(yozuvlar) < 120:
        xatolar.append(f"Kamida 120 yozuv kerak, hozir {len(yozuvlar)} ta bor.")

    idlar = [y.get("id") for y in yozuvlar]
    if len(idlar) != len(set(idlar)):
        xatolar.append("Takrorlangan id topildi.")

    matnlar = [y.get("matn") for y in yozuvlar]
    if len(matnlar) != len(set(matnlar)):
        xatolar.append("Takrorlangan topishmoq matni (dublikat) topildi.")

    toifalar = set()
    for y in yozuvlar:
        yetishmagan = MAJBURIY_MAYDONLAR - set(y.keys())
        if yetishmagan:
            xatolar.append(f"{y.get('id', '?')}: maydon yetishmayapti — {yetishmagan}")
            continue
        if not y["manba"]:
            xatolar.append(f"{y['id']}: manba ko'rsatilmagan.")
        if y["daraja"] not in (1, 2, 3):
            xatolar.append(f"{y['id']}: daraja 1/2/3 dan biri bo'lishi kerak, {y['daraja']!r} berilgan.")
        if not y["javob_variantlar"] or y["javob"] not in y["javob_variantlar"]:
            xatolar.append(f"{y['id']}: javob_variantlar ichida asosiy javob bo'lishi shart.")
        toifalar.add(y["toifa"])

    if len(toifalar) < 3:
        xatolar.append(f"Kamida 3 toifa kerak, hozir {len(toifalar)} ta: {sorted(toifalar)}")

    return xatolar


def main() -> None:
    tekshir_ham = "--check" in sys.argv

    if tekshir_ham:
        yozuvlar = json.loads(CHIQISH_FAYLI.read_text(encoding="utf-8"))
    else:
        yozuvlar = korpus_yasash()
        CHIQISH_FAYLI.parent.mkdir(parents=True, exist_ok=True)
        CHIQISH_FAYLI.write_text(
            json.dumps(yozuvlar, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Yozildi: {CHIQISH_FAYLI} ({len(yozuvlar)} ta yozuv)")

    xatolar = validate(yozuvlar)
    toifa_soni: dict[str, int] = {}
    for y in yozuvlar:
        toifa_soni[y["toifa"]] = toifa_soni.get(y["toifa"], 0) + 1

    print("\nToifalar bo'yicha taqsimot:")
    for toifa, soni in sorted(toifa_soni.items(), key=lambda x: -x[1]):
        print(f"  {toifa}: {soni}")

    if xatolar:
        print(f"\n{len(xatolar)} ta XATO topildi:")
        for x in xatolar:
            print(f"  - {x}")
        sys.exit(1)

    print(f"\nJami {len(yozuvlar)} ta yozuv — barcha tekshiruvlardan o'tdi.")


if __name__ == "__main__":
    main()
