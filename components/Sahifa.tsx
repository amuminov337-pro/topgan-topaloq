// Ichki sahifalar uchun umumiy o'ram: bir xil kenglik, sarlavha va "Orqaga" havolasi.
// Har sahifada takrorlanadigan maketni bir joyda saqlash uchun.

import Link from "next/link";
import type { ReactNode } from "react";

export default function Sahifa({
  sarlavha,
  children,
}: {
  sarlavha: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:my-8 sm:min-h-0 sm:max-w-xl sm:gap-5 sm:rounded-3xl sm:border sm:border-brend/10 sm:bg-white sm:px-8 sm:pb-12 sm:pt-8 sm:shadow-xl lg:max-w-2xl lg:px-12 lg:pb-14 lg:pt-10">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="Bosh sahifaga qaytish"
          className="karta-tap flex h-9 w-9 items-center justify-center rounded-full border border-brend/10 bg-white text-brend shadow-sm"
        >
          ←
        </Link>
        <h1 className="text-xl font-extrabold text-brend">{sarlavha}</h1>
      </div>
      {children}
    </main>
  );
}
