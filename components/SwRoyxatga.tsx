// F11 — PWA uchun service worker'ni ro'yxatdan o'tkazadi. Bu shart bajarilsa,
// Chrome (Android) telefon brauzerida "Bosh ekranga qo'shish" taklifini
// avtomatik ko'rsatadi. Ro'yxatdan o'tmasa (eski brauzer, xato va h.k.) ham
// ilova oddiy veb-sahifa sifatida ishlashda davom etadi — hech narsa qulamaydi.
"use client";

import { useEffect } from "react";

export default function SwRoyxatga() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Muhim emas — ilova service worker'siz ham to'liq ishlayveradi.
      });
    }
  }, []);

  return null;
}
