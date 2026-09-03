// Topgan-topaloq — PWA uchun minimal service worker.
// Ikkita vazifasi bor:
// 1) Chrome'ning "Bosh ekranga qo'shish" avtomatik taklifi mezonlaridan
//    biri — ro'yxatdan o'tgan, fetch hodisasini ushlaydigan service worker.
// 2) Asosiy sahifalarni keshlab, sekin yoki vaqtincha uzilgan internetda
//    ham ilova to'liq qulamay ochilishini ta'minlash.
//
// MUHIM: /api/ ostidagi so'rovlar hech qachon keshlanmaydi — Gemini javobi,
// javob tekshiruvi va natijalar har doim yangi bo'lishi shart.

const KESH_NOMI = "topgan-topaloq-v1";
const ASOSIY_SAHIFALAR = ["/", "/buvi", "/yarat", "/haqida", "/natijalar"];

self.addEventListener("install", (hodisa) => {
  hodisa.waitUntil(
    caches
      .open(KESH_NOMI)
      .then((kesh) => kesh.addAll(ASOSIY_SAHIFALAR))
      .catch(() => {
        // Birinchi keshlashda internet yo'q bo'lsa ham o'rnatish davom etadi.
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (hodisa) => {
  hodisa.waitUntil(
    caches
      .keys()
      .then((nomlar) =>
        Promise.all(nomlar.filter((nom) => nom !== KESH_NOMI).map((nom) => caches.delete(nom)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (hodisa) => {
  const sorov = hodisa.request;

  // API so'rovlari va GET bo'lmagan so'rovlar hech qachon keshlanmaydi.
  if (sorov.method !== "GET" || sorov.url.includes("/api/")) {
    return;
  }

  hodisa.respondWith(
    fetch(sorov)
      .then((javob) => {
        const nusxa = javob.clone();
        caches.open(KESH_NOMI).then((kesh) => kesh.put(sorov, nusxa));
        return javob;
      })
      .catch(() => caches.match(sorov).then((kesh) => kesh || caches.match("/")))
  );
});
