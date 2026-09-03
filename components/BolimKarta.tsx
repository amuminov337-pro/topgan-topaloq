// Bosh sahifadagi bo'lim kartasi. Uch xil ko'rinishi bor:
// "buvi" (ko'k), "yarat" (oltin), "ikkilamchi" (oq, kichik), "nofaol" (kulrang, "Tez orada").
// F10: nofaol karta ham endi onClick orqali bosiladigan bo'lishi mumkin —
// href yoki onClick berilgan-berilmaganiga qarab hover/soya effekti qo'shiladi.

import Link from "next/link";
import type { ReactNode } from "react";

export type KartaOhang = "buvi" | "yarat" | "ikkilamchi" | "nofaol";

const ohangUslub: Record<KartaOhang, string> = {
  buvi: "bg-buvi-fon text-buvi-matn border-buvi-matn/10",
  yarat: "bg-yarat-fon text-yarat-matn border-yarat-matn/15",
  ikkilamchi: "bg-white text-brend border-brend/10",
  nofaol: "bg-nofaol-fon text-nofaol-matn border-nofaol-matn/15",
};

type Props = {
  sarlavha: string;
  ikonka: ReactNode;
  ohang: KartaOhang;
  href?: string;
  kichik?: boolean;
  tavsif?: string;
  onClick?: () => void;
};

export default function BolimKarta({
  sarlavha,
  ikonka,
  ohang,
  href,
  kichik = false,
  tavsif,
  onClick,
}: Props) {
  const interaktivmi = Boolean(href || onClick);
  const asosiy = [
    "karta-tap relative flex w-full flex-col items-start justify-between gap-2 rounded-2xl border text-left transition",
    kichik ? "min-h-[76px] p-3.5" : "min-h-[128px] p-4",
    ohangUslub[ohang],
    interaktivmi
      ? "shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
      : "cursor-default",
  ].join(" ");

  const ichki = (
    <>
      {ohang === "nofaol" && (
        <span className="absolute right-3 top-3 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          Tez orada
        </span>
      )}
      <span className={kichik ? "text-xl" : "text-3xl"} aria-hidden>
        {ikonka}
      </span>
      <span className="flex flex-col gap-0.5">
        <span
          className={
            kichik
              ? "text-sm font-bold leading-tight"
              : "text-base font-extrabold leading-tight"
          }
        >
          {sarlavha}
        </span>
        {tavsif && (
          <span className="text-xs font-medium opacity-70">{tavsif}</span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={asosiy}>
        {ichki}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={asosiy} disabled={!onClick}>
      {ichki}
    </button>
  );
}
